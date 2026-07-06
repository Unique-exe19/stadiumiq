// =============================================================================
// Navigation & Routing Types
// =============================================================================

import type { UUID, GeoPoint, ISODateString } from './common';
import type { AccessibilityMode } from './common';

export type WaypointType = 'gate' | 'elevator' | 'escalator' | 'ramp' | 'restroom' | 'food' | 'medical' | 'info' | 'seat';

export type RouteType = 'standard' | 'accessible' | 'fastest' | 'least_crowded' | 'scenic';

export interface Waypoint {
  readonly id: UUID;
  readonly stadiumId: UUID;
  readonly name: string;
  readonly type: WaypointType;
  readonly location: GeoPoint;
  readonly floor: number;
  readonly isAccessible: boolean;
  readonly amenities: ReadonlyArray<string>;
}

export interface Route {
  readonly id: UUID;
  readonly type: RouteType;
  readonly fromWaypointId: UUID;
  readonly toWaypointId: UUID;
  readonly waypoints: ReadonlyArray<Waypoint>;
  readonly distanceMeters: number;
  readonly estimatedMinutes: number;
  readonly accessibilityScore: number;
  readonly crowdScore: number;
  readonly polyline: ReadonlyArray<GeoPoint>;
  readonly instructions: ReadonlyArray<NavigationInstruction>;
  readonly generatedAt: ISODateString;
}

export interface NavigationInstruction {
  readonly stepNumber: number;
  readonly instruction: string;
  readonly distanceMeters: number;
  readonly landmark?: string;
  readonly floor?: number;
  readonly accessibilityNote?: string;
  readonly audioDescription?: string;
}

export interface NavigationRequest {
  readonly stadiumId: UUID;
  readonly fromLocation?: GeoPoint;
  readonly fromWaypointId?: UUID;
  readonly destinationSeatId?: string;
  readonly destinationZone?: string;
  readonly destinationType?: WaypointType;
  readonly preferredRouteType: RouteType;
  readonly accessibilityMode: AccessibilityMode;
  readonly language: string;
}
