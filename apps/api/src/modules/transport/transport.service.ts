// =============================================================================
// Transport Service
// =============================================================================
import { Injectable } from '@nestjs/common';

import type { TransportDeparture, TransportRecommendation } from '@stadiumiq/shared-types';

import { RedisService } from '../../redis/redis.service';

@Injectable()
export class TransportService {
  constructor(private readonly redis: RedisService) {}

  async getDepartures(stadiumId: string): Promise<TransportDeparture[]> {
    const cacheKey = `transport:${stadiumId}:departures`;
    return this.redis.getOrSet(
      cacheKey,
      async () => {
        const now = Date.now();
        return [
          {
            id: 'dep-1',
            lineId: 'line-7',
            lineName: 'Metro Line 7',
            mode: 'metro',
            destination: 'Times Square / City Center',
            scheduledDeparture: new Date(now + 15 * 60 * 1000).toISOString(),
            estimatedDeparture: new Date(now + 15 * 60 * 1000).toISOString(),
            status: 'on_time',
            platform: 'Platform B',
            crowdLevel: 'low',
            accessibleVehicle: true,
          },
          {
            id: 'dep-2',
            lineId: 'shuttle-a',
            lineName: 'Shuttle Express A',
            mode: 'shuttle',
            destination: 'North Hotel District',
            scheduledDeparture: new Date(now + 18 * 60 * 1000).toISOString(),
            estimatedDeparture: new Date(now + 18 * 60 * 1000).toISOString(),
            status: 'on_time',
            platform: 'Bay 4',
            crowdLevel: 'moderate',
            accessibleVehicle: true,
          },
          {
            id: 'dep-3',
            lineId: 'bus-42x',
            lineName: 'Bus 42X Express',
            mode: 'bus',
            destination: 'International Airport',
            scheduledDeparture: new Date(now + 25 * 60 * 1000).toISOString(),
            estimatedDeparture: new Date(now + 31 * 60 * 1000).toISOString(),
            status: 'delayed',
            platform: 'Bay 12',
            crowdLevel: 'high',
            accessibleVehicle: false,
          },
        ];
      },
      30, // 30 second cache for live transport
    );
  }

  async getRecommendations(
    stadiumId: string,
    destination: string,
    accessibilityRequired: boolean,
  ): Promise<TransportRecommendation> {
    const cacheKey = `transport:${stadiumId}:rec:${destination}:${accessibilityRequired}`;
    return this.redis.getOrSet(
      cacheKey,
      async () => {
        const now = new Date();
        const routeOptions = [
          {
            mode: 'metro' as const,
            line: 'Metro Line 7',
            departureTime: new Date(now.getTime() + 15 * 60 * 1000).toISOString(),
            arrivalTime: new Date(now.getTime() + 45 * 60 * 1000).toISOString(),
            durationMinutes: 30,
            walkingMinutes: 5,
            crowdScore: 90, // Low crowd score is good
            isRecommended: true,
            reason: 'Fastest route with lowest post-match pedestrian congestion.',
          },
          {
            mode: 'shuttle' as const,
            line: 'Shuttle Express A',
            departureTime: new Date(now.getTime() + 18 * 60 * 1000).toISOString(),
            arrivalTime: new Date(now.getTime() + 58 * 60 * 1000).toISOString(),
            durationMinutes: 40,
            walkingMinutes: 7,
            crowdScore: 70,
            isRecommended: false,
            reason: 'Slightly longer travel time but drops directly at hotel row.',
          },
        ];

        return {
          routeOptions,
          aiRationale:
            'Metro Line 7 is recommended because it bypasses major highway bottlenecks and has dedicated accessible boarding ramps available.',
          bestOption: 0,
          alternativeOptions: [1],
        };
      },
      60,
    );
  }
}
