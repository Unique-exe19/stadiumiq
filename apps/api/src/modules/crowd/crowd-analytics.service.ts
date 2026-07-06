// =============================================================================
// Crowd Analytics Service – Real-time Trend Analysis & AI-backed Predictions
// =============================================================================

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { RedisService } from '../../redis/redis.service';
import type { CrowdPrediction } from '@stadiumiq/shared-types';

@Injectable()
export class CrowdAnalyticsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async predictOccupancy(stadiumId: string, zoneId: string, horizonMinutes = 30): Promise<CrowdPrediction> {
    const cacheKey = `prediction:${zoneId}:${horizonMinutes}`;
    return this.redis.getOrSet(
      cacheKey,
      async () => {
        // Get historical density readings for trend analysis
        const recentReadings = await this.prisma.crowdDensityReading.findMany({
          where: { zoneId },
          orderBy: { timestamp: 'desc' },
          take: 20,
        });

        const avgDensity =
          recentReadings.length > 0
            ? recentReadings.reduce((sum, r) => sum + r.densityPerSqMeter, 0) / recentReadings.length
            : 0;

        // Simple trend analysis (in production: time-series ML model)
        const trend = recentReadings.length >= 2
          ? recentReadings[0]!.densityPerSqMeter - recentReadings[recentReadings.length - 1]!.densityPerSqMeter
          : 0;

        const predictedDensity = Math.max(0, avgDensity + (trend * (horizonMinutes / 10)));
        const predictedOccupancy = Math.round(predictedDensity * 1000);

        const predictedLevel =
          predictedDensity > 4 ? 'critical' :
          predictedDensity > 3 ? 'high' :
          predictedDensity > 2 ? 'moderate' : 'low';

        return {
          stadiumId,
          zoneId,
          predictedAt: new Date().toISOString(),
          forecastHorizonMinutes: horizonMinutes,
          predictedOccupancy,
          predictedLevel: predictedLevel as CrowdPrediction['predictedLevel'],
          confidence: Math.min(0.95, recentReadings.length / 20),
          riskFactors: predictedLevel === 'critical' || predictedLevel === 'high'
            ? ['Increasing density trend', 'Post-halftime crowd surge expected']
            : [],
          recommendedInterventions: predictedLevel === 'critical'
            ? ['Open Gate C overflow', 'Deploy 3 additional stewards', 'Activate PA system guidance']
            : [],
        };
      },
      60,
    );
  }
}
