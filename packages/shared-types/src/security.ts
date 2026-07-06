// =============================================================================
// Security Types
// =============================================================================

import type { UUID, GeoPoint, ISODateString } from './common';

export type SecurityAlertType = 'crowd_anomaly' | 'perimeter_breach' | 'suspicious_behaviour' | 'unauthorized_access' | 'weapon_detection' | 'stampede_risk';
export type SecurityAlertLevel = 'green' | 'amber' | 'red' | 'black';

export interface SecurityAlert {
  readonly id: UUID;
  readonly stadiumId: UUID;
  readonly zoneId?: UUID;
  readonly type: SecurityAlertType;
  readonly level: SecurityAlertLevel;
  readonly description: string;
  readonly aiAnalysis: string;
  readonly location: GeoPoint;
  readonly detectedAt: ISODateString;
  readonly acknowledgedAt?: ISODateString;
  readonly acknowledgedBy?: UUID;
  readonly resolvedAt?: ISODateString;
  readonly isActive: boolean;
}

export interface SecurityZoneStatus {
  readonly zoneId: UUID;
  readonly level: SecurityAlertLevel;
  readonly activeAlerts: number;
  readonly officersDeployed: number;
  readonly lastUpdated: ISODateString;
}

export interface ThreatIntelligence {
  readonly stadiumId: UUID;
  readonly generatedAt: ISODateString;
  readonly overallThreatLevel: SecurityAlertLevel;
  readonly activeThreats: ReadonlyArray<SecurityAlert>;
  readonly crowdAnomalies: ReadonlyArray<string>;
  readonly aiRecommendations: ReadonlyArray<string>;
  readonly deploymentSuggestions: Record<string, number>;
}
