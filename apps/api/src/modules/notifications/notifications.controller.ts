// =============================================================================
// Notifications Controller
// =============================================================================

import { Controller, Sse, MessageEvent, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { JwtPayload } from '@stadiumiq/shared-types';

interface RequestWithUser {
  user: JwtPayload;
}

@ApiTags('notifications')
@Controller({ path: 'notifications', version: '1' })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Sse('stream')
  @ApiOperation({ summary: 'Establish a Server-Sent Events (SSE) notification channel' })
  stream(@Request() req: RequestWithUser): Observable<MessageEvent> {
    return this.notificationsService.subscribeToUser(req.user.sub);
  }
}
