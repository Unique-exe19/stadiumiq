// =============================================================================
// Analytics Service
// =============================================================================

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { RedisService } from '../../redis/redis.service';

export interface OperationsReport {
  stadiumId: string;
  generatedAt: string;
  summary: {
    peakFlowRate: number;
    averageWaitTimeMinutes: number;
    totalIncidentsReported: number;
    resolvedIncidentsCount: number;
    resolvedPercent: number;
  };
  hourlyInflow: Array<{ hour: string; count: number }>;
}

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async getOperationsReport(stadiumId: string): Promise<OperationsReport> {
    const cacheKey = `analytics:${stadiumId}:ops-report`;
    return this.redis.getOrSet(
      cacheKey,
      async () => {
        const [incidents, resolved] = await Promise.all([
          this.prisma.incident.count({ where: { stadiumId } }),
          this.prisma.incident.count({ where: { stadiumId, status: 'resolved' } }),
        ]);

        return {
          stadiumId,
          generatedAt: new Date().toISOString(),
          summary: {
            peakFlowRate: 15.4,
            averageWaitTimeMinutes: 12.8,
            totalIncidentsReported: incidents,
            resolvedIncidentsCount: resolved,
            resolvedPercent: incidents > 0 ? (resolved / incidents) * 100 : 100,
          },
          hourlyInflow: [
            { hour: '16:00', count: 4200 },
            { hour: '17:00', count: 12500 },
            { hour: '18:00', count: 24800 },
            { hour: '19:00', count: 18340 },
          ],
        };
      },
      600, // 10 min cache
    );
  }
}
