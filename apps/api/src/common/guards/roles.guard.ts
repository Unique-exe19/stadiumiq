// =============================================================================
// Roles Guard – RBAC enforcement
// =============================================================================

import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from '../decorators/roles.decorator';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import type { JwtPayload, Permission, UserRole } from '@stadiumiq/shared-types';

interface RequestWithUser {
  user: JwtPayload;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles && !requiredPermissions) return true;

    const { user } = context.switchToHttp().getRequest<RequestWithUser>();

    if (requiredRoles && !requiredRoles.includes(user.role)) {
      throw new ForbiddenException(
        `Access denied. Required roles: [${requiredRoles.join(', ')}]`,
      );
    }

    if (requiredPermissions) {
      const hasAllPermissions = requiredPermissions.every((perm) =>
        user.permissions.includes(perm),
      );
      if (!hasAllPermissions) {
        throw new ForbiddenException('Insufficient permissions for this action');
      }
    }

    return true;
  }
}
