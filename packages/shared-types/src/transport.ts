// =============================================================================
// Transport & Transit Types
// =============================================================================

import type { UUID, GeoPoint, ISODateString } from './common';

export type TransportMode = 'metro' | 'bus' | 'shuttle' | 'taxi' | 'bike' | 'walk';
export type TransportStatus = 'on_time' | 'delayed' | 'cancelled' | 'extra_service' | 'last_trip';

export interface TransportStop {
  readonly id: UUID;
  readonly name: string;
  readonly mode: TransportMode;
  readonly location: GeoPoint;
  readonly isAccessible: boolean;
  readonly stadiumGateId?: UUID;
  readonly distanceFromGateMeters?: number;
}

export interface TransportLine {
  readonly id: UUID;
  readonly name: string;
  readonly mode: TransportMode;
  readonly stops: ReadonlyArray<TransportStop>;
  readonly frequency: number;
  readonly operatingHours: { start: string; end: string };
  readonly isMatchDayService: boolean;
}

export interface TransportDeparture {
  readonly id: UUID;
  readonly lineId: UUID;
  readonly lineName: string;
  readonly mode: TransportMode;
  readonly destination: string;
  readonly scheduledDeparture: ISODateString;
  readonly estimatedDeparture: ISODateString;
  readonly status: TransportStatus;
  readonly platform?: string;
  readonly crowdLevel: 'low' | 'moderate' | 'high';
  readonly accessibleVehicle: boolean;
}

export interface TransportRecommendation {
  readonly routeOptions: ReadonlyArray<{
    readonly mode: TransportMode;
    readonly line: string;
    readonly departureTime: ISODateString;
    readonly arrivalTime: ISODateString;
    readonly durationMinutes: number;
    readonly walkingMinutes: number;
    readonly crowdScore: number;
    readonly isRecommended: boolean;
    readonly reason: string;
  }>;
  readonly aiRationale: string;
  readonly bestOption: number;
  readonly alternativeOptions: ReadonlyArray<number>;
}
