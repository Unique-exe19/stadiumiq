// =============================================================================
// Audit Interceptor – Logs all state-modifying requests
// =============================================================================

import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request } from 'express';

import { PrismaService } from '../../database/prisma.service';
import type { JwtPayload } from '@stadiumiq/shared-types';

const AUDITED_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

interface RequestWithUser extends Request {
  user?: JwtPayload;
}

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditInterceptor.name);

  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    if (!AUDITED_METHODS.has(request.method)) {
      return next.handle();
    }

    const userId = request.user?.sub;
    const action = `${request.method}_${request.route?.path ?? request.path}`;

    return next.handle().pipe(
      tap({
        next: () => {
          this.prisma.auditLog
            .create({
              data: {
                userId,
                action,
                resource: request.route?.path ?? request.path,
                ipAddress: request.ip,
                userAgent: request.headers['user-agent'],
                success: true,
              },
            })
            .catch((err: Error) => this.logger.error('Audit log failed', err.message));
        },
        error: () => {
          this.prisma.auditLog
            .create({
              data: {
                userId,
                action,
                resource: request.route?.path ?? request.path,
                ipAddress: request.ip,
                success: false,
              },
            })
            .catch((err: Error) => this.logger.error('Audit log failed', err.message));
        },
      }),
    );
  }
}
