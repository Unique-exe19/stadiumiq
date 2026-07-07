// =============================================================================
// Stadium Service
// =============================================================================
import { Injectable, NotFoundException } from '@nestjs/common';
import type {
  Stadium as DBStadium,
  StadiumGate as DBStadiumGate,
  StadiumZone as DBStadiumZone,
} from '@prisma/client';

import type { Stadium, StadiumGate, StadiumZone } from '@stadiumiq/shared-types';

import { PrismaService } from '../../database/prisma.service';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class StadiumService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async findAll(): Promise<Stadium[]> {
    const cacheKey = 'stadiums:all';
    return this.redis.getOrSet(
      cacheKey,
      async () => {
        const stadiums = await this.prisma.stadium.findMany({
          where: { isActive: true },
        });
        return stadiums.map((s: DBStadium) => this.mapToStadium(s));
      },
      300, // Cache for 5 minutes
    );
  }

  async findOne(id: string): Promise<Stadium> {
    const cacheKey = `stadiums:${id}`;
    return this.redis.getOrSet(
      cacheKey,
      async () => {
        const s = await this.prisma.stadium.findUnique({ where: { id } });
        if (!s) throw new NotFoundException('Stadium not found');
        return this.mapToStadium(s);
      },
      300,
    );
  }

  async findZones(stadiumId: string): Promise<StadiumZone[]> {
    const cacheKey = `stadiums:${stadiumId}:zones`;
    return this.redis.getOrSet(
      cacheKey,
      async () => {
        const zones = await this.prisma.stadiumZone.findMany({ where: { stadiumId } });
        return zones.map((z: DBStadiumZone) => this.mapToZone(z));
      },
      60,
    );
  }

  async findGates(stadiumId: string): Promise<StadiumGate[]> {
    const cacheKey = `stadiums:${stadiumId}:gates`;
    return this.redis.getOrSet(
      cacheKey,
      async () => {
        const gates = await this.prisma.stadiumGate.findMany({ where: { stadiumId } });
        return gates.map((g: DBStadiumGate) => this.mapToGate(g));
      },
      30, // Frequent updates for gate wait times
    );
  }

  // ---------------------------------------------------------------------------
  // Private mapping helpers — eliminates duplicated inline object literals
  // ---------------------------------------------------------------------------

  private mapToStadium(s: DBStadium): Stadium {
    return {
      id: s.id,
      name: s.name,
      city: s.city,
      country: s.country,
      capacity: s.capacity,
      location: { lat: s.latitude, lng: s.longitude },
      timezone: s.timezone,
      floorCount: s.floorCount,
      mapImageUrl: s.mapImageUrl ?? '',
      isActive: s.isActive,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
    };
  }

  private mapToZone(z: DBStadiumZone): StadiumZone {
    return {
      id: z.id,
      stadiumId: z.stadiumId,
      name: z.name,
      type: z.type as StadiumZone['type'],
      floor: z.floor,
      capacity: z.capacity,
      currentOccupancy: z.currentOccupancy,
      occupancyLevel: z.occupancyLevel as StadiumZone['occupancyLevel'],
      isAccessible: z.isAccessible,
      boundaryPolygon: z.boundaryPolygon as unknown as StadiumZone['boundaryPolygon'],
      centroid: { lat: z.centroidLat, lng: z.centroidLng },
    };
  }

  private mapToGate(g: DBStadiumGate): StadiumGate {
    return {
      id: g.id,
      stadiumId: g.stadiumId,
      name: g.name,
      number: g.number,
      status: g.status as StadiumGate['status'],
      location: { lat: g.latitude, lng: g.longitude },
      isAccessible: g.isAccessible,
      queueLength: g.queueLength,
      estimatedWaitMinutes: g.estimatedWaitMinutes,
      assignedZones: g.assignedZones,
    };
  }
}
