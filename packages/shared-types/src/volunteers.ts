// =============================================================================
// Volunteer Management Types
// =============================================================================

import type { UUID, GeoPoint, ISODateString, TimestampedEntity } from './common';

export type VolunteerStatus = 'available' | 'assigned' | 'on_break' | 'off_duty';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface VolunteerProfile extends TimestampedEntity {
  readonly id: UUID;
  readonly userId: UUID;
  readonly stadiumId: UUID;
  readonly displayName: string;
  readonly badgeNumber: string;
  readonly currentStatus: VolunteerStatus;
  readonly currentLocation?: GeoPoint;
  readonly assignedZone?: string;
  readonly languages: ReadonlyArray<string>;
  readonly skills: ReadonlyArray<string>;
  readonly shiftStart: ISODateString;
  readonly shiftEnd: ISODateString;
  readonly tasksCompleted: number;
}

export interface VolunteerTask {
  readonly id: UUID;
  readonly volunteerId: UUID;
  readonly stadiumId: UUID;
  readonly title: string;
  readonly description: string;
  readonly priority: TaskPriority;
  readonly status: TaskStatus;
  readonly location: GeoPoint;
  readonly zoneId?: UUID;
  readonly estimatedDurationMinutes: number;
  readonly dueBy?: ISODateString;
  readonly aiInstructions?: string;
  readonly completedAt?: ISODateString;
  readonly createdAt: ISODateString;
}

export interface VolunteerBriefing {
  readonly volunteerId: UUID;
  readonly generatedAt: ISODateString;
  readonly shiftSummary: string;
  readonly keyTasks: ReadonlyArray<string>;
  readonly zoneConditions: string;
  readonly safetyReminders: ReadonlyArray<string>;
  readonly contactInfo: Record<string, string>;
  readonly language: string;
}
