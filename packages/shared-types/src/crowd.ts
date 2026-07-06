// =============================================================================
// Crowd Intelligence Types
// =============================================================================
import type { GeoPoint, ISODateString, UUID } from './common';
import type { OccupancyLevel } from './stadium';

export type CrowdAlertSeverity = 'info' | 'warning' | 'critical' | 'emergency';

export type CrowdAlertType =
  | 'overcrowding'
  | 'crowd_surge'
  | 'bottleneck'
  | 'emergency_evacuation'
  | 'slow_dispersal'
  | 'abnormal_density';

export interface CrowdDensityReading {
  readonly zoneId: UUID;
  readonly timestamp: ISODateString;
  readonly densityPerSqMeter: number;
  readonly occupancyLevel: OccupancyLevel;
  readonly movementVelocity: number;
  readonly flowDirection: number;
}

export interface CrowdAlert {
  readonly id: UUID;
  readonly stadiumId: UUID;
  readonly zoneId: UUID;
  readonly type: CrowdAlertType;
  readonly severity: CrowdAlertSeverity;
  readonly message: string;
  readonly aiSummary: string;
  readonly affectedArea: GeoPoint;
  readonly estimatedAffectedPeople: number;
  readonly recommendedAction: string;
  readonly isActive: boolean;
  readonly createdAt: ISODateString;
  readonly resolvedAt?: ISODateString;
}

export interface CrowdPrediction {
  readonly stadiumId: UUID;
  readonly zoneId: UUID;
  readonly predictedAt: ISODateString;
  readonly forecastHorizonMinutes: number;
  readonly predictedOccupancy: number;
  readonly predictedLevel: OccupancyLevel;
  readonly confidence: number;
  readonly riskFactors: ReadonlyArray<string>;
  readonly recommendedInterventions: ReadonlyArray<string>;
}

export interface HeatmapData {
  readonly stadiumId: UUID;
  readonly timestamp: ISODateString;
  readonly gridResolution: number;
  readonly points: ReadonlyArray<{ lat: number; lng: number; intensity: number }>;
}
