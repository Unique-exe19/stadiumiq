// =============================================================================
// RBAC Decorators
// =============================================================================

import { SetMetadata } from '@nestjs/common';
import type { UserRole, Permission } from '@stadiumiq/shared-types';

export const ROLES_KEY = 'roles';
export const PERMISSIONS_KEY = 'permissions';

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
export const RequirePermissions = (...permissions: Permission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
