// =============================================================================
// Crowd Service – Real-time Crowd Intelligence
// =============================================================================
import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cron, CronExpression } from '@nestjs/schedule';

import type { CrowdAlert, HeatmapData } from '@stadiumiq/shared-types';

import { PrismaService } from '../../database/prisma.service';
import { RedisService } from '../../redis/redis.service';

const OCCUPANCY_THRESHOLDS = {
  low: 50,
  moderate: 75,
  high: 90,
  critical: 100,
};

@Injectable()
export class CrowdService {
  private readonly logger = new Logger(CrowdService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async getStadiumOccupancy(stadiumId: string) {
    const cacheKey = `occupancy:${stadiumId}`;
    return this.redis.getOrSet(
      cacheKey,
      async () => {
        const [stadium, zones, snapshot] = await Promise.all([
          this.prisma.stadium.findUniqueOrThrow({ where: { id: stadiumId } }),
          this.prisma.stadiumZone.findMany({ where: { stadiumId } }),
          this.prisma.occupancySnapshot.findFirst({
            where: { stadiumId },
            orderBy: { timestamp: 'desc' },
          }),
        ]);

        return {
          stadiumId,
          stadiumName: stadium.name,
          capacity: stadium.capacity,
          currentOccupancy: snapshot?.totalOccupancy ?? 0,
          occupancyPercent: snapshot?.occupancyPercent ?? 0,
          crowdFlowRate: snapshot?.crowdFlowRate ?? 0,
          zones: zones.map((z) => ({
            id: z.id,
            name: z.name,
            type: z.type,
            capacity: z.capacity,
            currentOccupancy: z.currentOccupancy,
            occupancyLevel: z.occupancyLevel,
            occupancyPercent: z.capacity > 0 ? (z.currentOccupancy / z.capacity) * 100 : 0,
          })),
          updatedAt: snapshot?.timestamp.toISOString() ?? new Date().toISOString(),
        };
      },
      15, // 15 second cache for live data
    );
  }

  async getHeatmapData(stadiumId: string): Promise<HeatmapData> {
    const cacheKey = `heatmap:${stadiumId}`;
    return this.redis.getOrSet(
      cacheKey,
      async () => {
        const zones = await this.prisma.stadiumZone.findMany({
          where: { stadiumId },
          select: { centroidLat: true, centroidLng: true, currentOccupancy: true, capacity: true },
        });

        return {
          stadiumId,
          timestamp: new Date().toISOString(),
          gridResolution: 10,
          points: zones.map((z) => ({
            lat: z.centroidLat,
            lng: z.centroidLng,
            intensity: z.capacity > 0 ? z.currentOccupancy / z.capacity : 0,
          })),
        };
      },
      30,
    );
  }

  async getActiveAlerts(stadiumId: string): Promise<CrowdAlert[]> {
    const cacheKey = `crowd-alerts:${stadiumId}`;
    return this.redis.getOrSet(
      cacheKey,
      async () => {
        const alerts = await this.prisma.crowdAlert.findMany({
          where: { stadiumId, isActive: true },
          orderBy: { createdAt: 'desc' },
        });
        return alerts.map((a) => ({
          id: a.id,
          stadiumId: a.stadiumId,
          zoneId: a.zoneId,
          type: a.type as CrowdAlert['type'],
          severity: a.severity as CrowdAlert['severity'],
          message: a.message,
          aiSummary: a.aiSummary,
          affectedArea: { lat: a.locationLat, lng: a.locationLng },
          estimatedAffectedPeople: a.estimatedAffectedPeople,
          recommendedAction: a.recommendedAction,
          isActive: a.isActive,
          createdAt: a.createdAt.toISOString(),
          resolvedAt: a.resolvedAt?.toISOString(),
        }));
      },
      10,
    );
  }

  async updateZoneOccupancy(zoneId: string, currentOccupancy: number): Promise<void> {
    const zone = await this.prisma.stadiumZone.findUniqueOrThrow({
      where: { id: zoneId },
      include: { stadium: true },
    });

    const occupancyPercent = zone.capacity > 0 ? (currentOccupancy / zone.capacity) * 100 : 0;
    const level =
      occupancyPercent >= OCCUPANCY_THRESHOLDS.critical
        ? 'critical'
        : occupancyPercent >= OCCUPANCY_THRESHOLDS.high
          ? 'high'
          : occupancyPercent >= OCCUPANCY_THRESHOLDS.moderate
            ? 'moderate'
            : 'low';

    await this.prisma.stadiumZone.update({
      where: { id: zoneId },
      data: { currentOccupancy, occupancyLevel: level },
    });

    // Emit event for real-time notifications
    this.eventEmitter.emit('crowd.zone.updated', { zoneId, level, occupancyPercent });

    // Invalidate caches
    await Promise.all([
      this.redis.del(`occupancy:${zone.stadiumId}`),
      this.redis.del(`heatmap:${zone.stadiumId}`),
      this.redis.del(`live-context:${zone.stadiumId}`),
    ]);

    // Auto-generate alert if critical
    if (level === 'critical') {
      await this.generateCrowdAlert(
        zone.id,
        zone.stadiumId,
        'overcrowding',
        'critical',
        currentOccupancy,
      );
    }
  }

  private async generateCrowdAlert(
    zoneId: string,
    stadiumId: string,
    type: string,
    severity: string,
    occupancy: number,
  ): Promise<void> {
    const zone = await this.prisma.stadiumZone.findUniqueOrThrow({ where: { id: zoneId } });

    await this.prisma.crowdAlert.create({
      data: {
        stadiumId,
        zoneId,
        type,
        severity,
        message: `Zone ${zone.name} has reached critical occupancy (${occupancy} people)`,
        aiSummary: `Immediate intervention required in ${zone.name}. Current occupancy exceeds safe capacity.`,
        locationLat: zone.centroidLat,
        locationLng: zone.centroidLng,
        estimatedAffectedPeople: occupancy,
        recommendedAction: `Deploy staff to ${zone.name}. Open additional capacity in adjacent zones. Redirect incoming crowd.`,
      },
    });

    await this.redis.del(`crowd-alerts:${stadiumId}`);
    this.eventEmitter.emit('crowd.alert.created', { stadiumId, zoneId, severity });
    this.logger.warn(`Critical crowd alert created for zone ${zoneId}`);
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async cleanupResolvedAlerts(): Promise<void> {
    const cutoff = new Date(Date.now() - 30 * 60 * 1000);
    await this.prisma.crowdAlert.updateMany({
      where: { isActive: true, createdAt: { lt: cutoff }, severity: { in: ['info', 'warning'] } },
      data: { isActive: false, resolvedAt: new Date() },
    });
  }
}
