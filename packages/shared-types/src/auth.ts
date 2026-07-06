// =============================================================================
// Authentication & Authorization Types
// =============================================================================

import type { UUID, ISODateString, TimestampedEntity } from './common';

export type UserRole =
  | 'fan'
  | 'volunteer'
  | 'venue_staff'
  | 'security_officer'
  | 'venue_manager'
  | 'transport_coordinator'
  | 'sustainability_officer'
  | 'admin'
  | 'super_admin';

export type Permission =
  | 'crowd:read'
  | 'crowd:write'
  | 'incidents:read'
  | 'incidents:write'
  | 'incidents:resolve'
  | 'navigation:read'
  | 'transport:read'
  | 'transport:write'
  | 'volunteers:read'
  | 'volunteers:write'
  | 'volunteers:manage'
  | 'security:read'
  | 'security:write'
  | 'security:alert'
  | 'sustainability:read'
  | 'sustainability:write'
  | 'analytics:read'
  | 'users:read'
  | 'users:write'
  | 'users:manage'
  | 'ai:query'
  | 'ai:admin';

export const ROLE_PERMISSIONS: Record<UserRole, ReadonlyArray<Permission>> = {
  fan: ['navigation:read', 'transport:read', 'ai:query'],
  volunteer: ['navigation:read', 'transport:read', 'volunteers:read', 'ai:query'],
  venue_staff: ['crowd:read', 'navigation:read', 'transport:read', 'ai:query'],
  security_officer: ['crowd:read', 'crowd:write', 'incidents:read', 'incidents:write', 'security:read', 'security:write', 'security:alert', 'navigation:read', 'ai:query'],
  venue_manager: ['crowd:read', 'crowd:write', 'incidents:read', 'incidents:write', 'incidents:resolve', 'navigation:read', 'transport:read', 'transport:write', 'volunteers:read', 'volunteers:write', 'volunteers:manage', 'sustainability:read', 'analytics:read', 'ai:query', 'ai:admin'],
  transport_coordinator: ['crowd:read', 'transport:read', 'transport:write', 'navigation:read', 'ai:query'],
  sustainability_officer: ['sustainability:read', 'sustainability:write', 'analytics:read', 'ai:query'],
  admin: ['crowd:read', 'crowd:write', 'incidents:read', 'incidents:write', 'incidents:resolve', 'navigation:read', 'transport:read', 'transport:write', 'volunteers:read', 'volunteers:write', 'volunteers:manage', 'security:read', 'security:write', 'sustainability:read', 'sustainability:write', 'analytics:read', 'users:read', 'users:write', 'ai:query', 'ai:admin'],
  super_admin: ['crowd:read', 'crowd:write', 'incidents:read', 'incidents:write', 'incidents:resolve', 'navigation:read', 'transport:read', 'transport:write', 'volunteers:read', 'volunteers:write', 'volunteers:manage', 'security:read', 'security:write', 'security:alert', 'sustainability:read', 'sustainability:write', 'analytics:read', 'users:read', 'users:write', 'users:manage', 'ai:query', 'ai:admin'],
};

export interface User extends TimestampedEntity {
  readonly id: UUID;
  readonly email: string;
  readonly displayName: string;
  readonly avatarUrl?: string;
  readonly role: UserRole;
  readonly permissions: ReadonlyArray<Permission>;
  readonly preferredLanguage: string;
  readonly accessibilityMode: string;
  readonly isActive: boolean;
  readonly lastLoginAt?: ISODateString;
}

export interface AuthTokens {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly expiresIn: number;
  readonly tokenType: 'Bearer';
}

export interface LoginRequest {
  readonly email: string;
  readonly password: string;
}

export interface RegisterRequest {
  readonly email: string;
  readonly password: string;
  readonly displayName: string;
  readonly role?: Extract<UserRole, 'fan' | 'volunteer'>;
  readonly preferredLanguage?: string;
}

export interface JwtPayload {
  readonly sub: UUID;
  readonly email: string;
  readonly role: UserRole;
  readonly permissions: ReadonlyArray<Permission>;
  readonly iat: number;
  readonly exp: number;
  readonly jti: string;
}
