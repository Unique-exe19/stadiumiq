// =============================================================================
// Incident Management Types
// =============================================================================
import type { AuditableEntity, GeoPoint, ISODateString, UUID } from './common';

export type IncidentType =
  | 'medical'
  | 'security_threat'
  | 'crowd_surge'
  | 'fire'
  | 'structural'
  | 'lost_person'
  | 'suspicious_package'
  | 'vandalism'
  | 'technical_failure'
  | 'weather'
  | 'other';

export type IncidentStatus =
  'reported' | 'acknowledged' | 'responding' | 'contained' | 'resolved' | 'closed';
export type IncidentPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Incident extends AuditableEntity {
  readonly id: UUID;
  readonly stadiumId: UUID;
  readonly zoneId?: UUID;
  readonly type: IncidentType;
  readonly status: IncidentStatus;
  readonly priority: IncidentPriority;
  readonly title: string;
  readonly description: string;
  readonly location: GeoPoint;
  readonly floor?: number;
  readonly reportedBy: UUID;
  readonly assignedTo?: ReadonlyArray<UUID>;
  readonly aiSummary?: string;
  readonly aiRecommendations?: ReadonlyArray<string>;
  readonly updates: ReadonlyArray<IncidentUpdate>;
  readonly resolvedAt?: ISODateString;
  readonly closedAt?: ISODateString;
}

export interface IncidentUpdate {
  readonly id: UUID;
  readonly incidentId: UUID;
  readonly updatedBy: UUID;
  readonly status: IncidentStatus;
  readonly note: string;
  readonly timestamp: ISODateString;
}

export interface CreateIncidentRequest {
  readonly stadiumId: UUID;
  readonly zoneId?: UUID;
  readonly type: IncidentType;
  readonly priority: IncidentPriority;
  readonly title: string;
  readonly description: string;
  readonly location: GeoPoint;
  readonly floor?: number;
}
