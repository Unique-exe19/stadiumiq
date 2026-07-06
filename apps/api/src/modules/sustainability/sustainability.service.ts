// =============================================================================
// Sustainability Service
// =============================================================================
import { Injectable } from '@nestjs/common';

import type { SustainabilityMetrics } from '@stadiumiq/shared-types';

import { RedisService } from '../../redis/redis.service';

@Injectable()
export class SustainabilityService {
  constructor(private readonly redis: RedisService) {}

  async getMetrics(stadiumId: string): Promise<SustainabilityMetrics> {
    const cacheKey = `sustainability:${stadiumId}:metrics`;
    return this.redis.getOrSet(
      cacheKey,
      async () => {
        // Query some metrics or return standard mock values mapped to target
        const start = new Date(Date.now() - 4 * 60 * 60 * 1000);
        return {
          stadiumId,
          periodStart: start.toISOString(),
          periodEnd: new Date().toISOString(),
          totalEnergyKwh: 12450.5,
          renewableEnergyPercent: 32.4,
          totalCarbonKg: 4210.8,
          waterUsageLiters: 85200,
          totalWasteKg: 1240,
          recyclingRate: 58.2,
          sustainabilityScore: 84,
          aiInsights: [
            'Renewable solar power production has peaked at 4.2 kW.',
            'Waste separation is functioning efficiently, with recycling rates up 4%.',
          ],
          recommendations: [
            'Dim concourse lights by 15% between match halves to save energy.',
            'Deploy additional recycling stewards to East Food Court.',
          ],
        };
      },
      300, // 5 min cache
    );
  }
}
