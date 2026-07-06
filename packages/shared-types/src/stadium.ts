// =============================================================================
// Stadium & Venue Types
// =============================================================================
import type { GeoPoint, ISODateString, TimestampedEntity, UUID } from './common';

export type ZoneType =
  | 'entrance'
  | 'seating'
  | 'concourse'
  | 'food_beverage'
  | 'medical'
  | 'security'
  | 'accessible'
  | 'vip'
  | 'press'
  | 'staff';

export type GateStatus = 'open' | 'closed' | 'limited' | 'accessible_only';

export type OccupancyLevel = 'low' | 'moderate' | 'high' | 'critical';

export interface Stadium extends TimestampedEntity {
  readonly id: UUID;
  readonly name: string;
  readonly city: string;
  readonly country: string;
  readonly capacity: number;
  readonly location: GeoPoint;
  readonly timezone: string;
  readonly floorCount: number;
  readonly mapImageUrl: string;
  readonly isActive: boolean;
}

export interface StadiumZone {
  readonly id: UUID;
  readonly stadiumId: UUID;
  readonly name: string;
  readonly type: ZoneType;
  readonly floor: number;
  readonly capacity: number;
  readonly currentOccupancy: number;
  readonly occupancyLevel: OccupancyLevel;
  readonly isAccessible: boolean;
  readonly boundaryPolygon: ReadonlyArray<GeoPoint>;
  readonly centroid: GeoPoint;
}

export interface StadiumGate {
  readonly id: UUID;
  readonly stadiumId: UUID;
  readonly name: string;
  readonly number: string;
  readonly status: GateStatus;
  readonly location: GeoPoint;
  readonly isAccessible: boolean;
  readonly queueLength: number;
  readonly estimatedWaitMinutes: number;
  readonly assignedZones: ReadonlyArray<string>;
}

export interface OccupancySnapshot {
  readonly id: UUID;
  readonly stadiumId: UUID;
  readonly timestamp: ISODateString;
  readonly totalOccupancy: number;
  readonly occupancyPercent: number;
  readonly zoneBreakdown: Record<UUID, number>;
  readonly crowdFlowRate: number;
}
