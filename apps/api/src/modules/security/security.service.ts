// =============================================================================
// Security Service
// =============================================================================

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { RedisService } from '../../redis/redis.service';
import type { SecurityAlert, ThreatIntelligence } from '@stadiumiq/shared-types';

@Injectable()
export class SecurityService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async getAlerts(stadiumId: string): Promise<SecurityAlert[]> {
    const cacheKey = `security:${stadiumId}:alerts`;
    return this.redis.getOrSet(
      cacheKey,
      async () => {
        const list = await this.prisma.securityAlert.findMany({
          where: { stadiumId, isActive: true },
          orderBy: { detectedAt: 'desc' },
        });

        return list.map((a) => ({
          id: a.id,
          stadiumId: a.stadiumId,
          zoneId: a.zoneId ?? undefined,
          type: a.type as SecurityAlert['type'],
          level: a.level as SecurityAlert['level'],
          description: a.description,
          aiAnalysis: a.aiAnalysis,
          location: { lat: a.locationLat, lng: a.locationLng },
          detectedAt: a.detectedAt.toISOString(),
          acknowledgedAt: a.acknowledgedAt?.toISOString(),
          acknowledgedBy: a.acknowledgedBy ?? undefined,
          resolvedAt: a.resolvedAt?.toISOString(),
          isActive: a.isActive,
        }));
      },
      15, // 15s cache
    );
  }

  async getThreatIntelligence(stadiumId: string): Promise<ThreatIntelligence> {
    const cacheKey = `security:${stadiumId}:threats`;
    return this.redis.getOrSet(
      cacheKey,
      async () => {
        const activeAlerts = await this.getAlerts(stadiumId);
        const overallThreatLevel = activeAlerts.some((a) => a.level === 'red' || a.level === 'black') ? 'red' : 'green';

        return {
          stadiumId,
          generatedAt: new Date().toISOString(),
          overallThreatLevel: overallThreatLevel as ThreatIntelligence['overallThreatLevel'],
          activeThreats: activeAlerts,
          crowdAnomalies: [
            'East Concourse density increasing 12% faster than expected.',
          ],
          aiRecommendations: [
            'Redeploy 3 officers from North Concourse to East Concourse.',
            'Activate Gate E2 auxiliary exit pathway.',
          ],
          deploymentSuggestions: {
            'North Stand': 15,
            'East Wing': 25,
            'South Stand': 12,
            'West Wing': 10,
          },
        };
      },
      30, // 30s cache
    );
  }

  async acknowledgeAlert(alertId: string, userId: string): Promise<void> {
    const alert = await this.prisma.securityAlert.findUnique({ where: { id: alertId } });
    if (!alert) throw new NotFoundException('Security alert not found');

    await this.prisma.securityAlert.update({
      where: { id: alertId },
      data: {
        acknowledgedAt: new Date(),
        acknowledgedBy: userId,
      },
    });

    await this.redis.del(`security:${alert.stadiumId}:alerts`);
    await this.redis.del(`security:${alert.stadiumId}:threats`);
  }
}
