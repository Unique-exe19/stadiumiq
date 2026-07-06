// =============================================================================
// Fan Experience Types
// =============================================================================

import type { UUID, ISODateString, GeoPoint, SupportedLanguage, AccessibilityMode } from './common';

export interface FanPreferences {
  readonly userId: UUID;
  readonly preferredLanguage: SupportedLanguage;
  readonly accessibilityMode: AccessibilityMode;
  readonly enablePushNotifications: boolean;
  readonly enableLocationTracking: boolean;
  readonly preferredRouteType: string;
  readonly dietaryPreferences: ReadonlyArray<string>;
  readonly savedLocations: ReadonlyArray<SavedLocation>;
}

export interface SavedLocation {
  readonly id: UUID;
  readonly label: string;
  readonly location: GeoPoint;
  readonly type: string;
}

export interface MatchInfo {
  readonly id: UUID;
  readonly stadiumId: UUID;
  readonly homeTeam: string;
  readonly awayTeam: string;
  readonly kickoffTime: ISODateString;
  readonly gatesOpenTime: ISODateString;
  readonly stage: string;
  readonly group?: string;
  readonly attendance?: number;
}

export interface FanNotification {
  readonly id: UUID;
  readonly userId: UUID;
  readonly title: string;
  readonly body: string;
  readonly type: 'info' | 'warning' | 'alert' | 'transport' | 'navigation';
  readonly data?: Record<string, unknown>;
  readonly isRead: boolean;
  readonly createdAt: ISODateString;
}
