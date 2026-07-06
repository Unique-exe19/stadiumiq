// =============================================================================
// Common / Utility Types
// =============================================================================

export type UUID = string;
export type ISODateString = string;
export type Latitude = number;
export type Longitude = number;

export interface GeoPoint {
  readonly lat: Latitude;
  readonly lng: Longitude;
}

export interface Pagination {
  readonly page: number;
  readonly limit: number;
  readonly total: number;
  readonly totalPages: number;
}

export interface PaginatedResponse<T> {
  readonly data: ReadonlyArray<T>;
  readonly pagination: Pagination;
}

export interface ApiResponse<T = unknown> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: ApiError;
  readonly requestId: string;
  readonly timestamp: ISODateString;
}

export interface ApiError {
  readonly code: string;
  readonly message: string;
  readonly details?: Record<string, unknown>;
}

export type SupportedLanguage =
  | 'en' | 'ar' | 'fr' | 'es' | 'pt' | 'de'
  | 'zh' | 'ja' | 'ko' | 'hi' | 'ur' | 'fa'
  | 'ru' | 'it' | 'nl' | 'pl' | 'tr' | 'sv';

export type Theme = 'light' | 'dark' | 'high-contrast';

export type AccessibilityMode = 'standard' | 'mobility-impaired' | 'visual-impaired' | 'hearing-impaired';

export interface TimestampedEntity {
  readonly createdAt: ISODateString;
  readonly updatedAt: ISODateString;
}

export interface AuditableEntity extends TimestampedEntity {
  readonly createdBy: UUID;
  readonly updatedBy?: UUID;
}
