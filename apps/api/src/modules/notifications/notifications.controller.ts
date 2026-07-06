// =============================================================================
// Notifications Controller
// =============================================================================
import { Controller, MessageEvent, Request, Sse, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';

import type { JwtPayload } from '@stadiumiq/shared-types';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

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
