// =============================================================================
// Notifications Service
// =============================================================================

import { Injectable, Logger } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export interface NotificationMessage {
  userId?: string;
  stadiumId?: string;
  type: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  timestamp: string;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly notifications$ = new Subject<NotificationMessage>();

  sendNotification(msg: Omit<NotificationMessage, 'timestamp'>): void {
    const fullMsg: NotificationMessage = {
      ...msg,
      timestamp: new Date().toISOString(),
    };
    this.notifications$.next(fullMsg);
    this.logger.log(`Notification sent: ${msg.title}`);
  }

  subscribeToUser(userId: string): Observable<MessageEvent> {
    return this.notifications$.asObservable().pipe(
      filter((msg) => !msg.userId || msg.userId === userId),
      map((msg) => ({
        data: JSON.stringify(msg),
      } as MessageEvent)),
    );
  }
}
