// =============================================================================
// App Root Module
// =============================================================================
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { TerminusModule } from '@nestjs/terminus';
import { ThrottlerModule } from '@nestjs/throttler';

import { appConfig } from './config/app.config';
import { DatabaseModule } from './database/database.module';
import { AiModule } from './modules/ai/ai.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AuthModule } from './modules/auth/auth.module';
import { CrowdModule } from './modules/crowd/crowd.module';
import { HealthModule } from './modules/health/health.module';
import { IncidentsModule } from './modules/incidents/incidents.module';
import { NavigationModule } from './modules/navigation/navigation.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SecurityModule } from './modules/security/security.module';
import { StadiumModule } from './modules/stadium/stadium.module';
import { SustainabilityModule } from './modules/sustainability/sustainability.module';
import { TransportModule } from './modules/transport/transport.module';
import { VolunteersModule } from './modules/volunteers/volunteers.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    // Configuration – loaded from .env, validated against schema
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      validationOptions: { abortEarly: false },
      cache: true,
    }),

    // Rate limiting – per-role throttling applied via guards
    ThrottlerModule.forRoot([
      { name: 'fan', ttl: 60000, limit: 60 },
      { name: 'staff', ttl: 60000, limit: 300 },
      { name: 'ai', ttl: 60000, limit: 20 },
    ]),

    // Event system for decoupled module communication
    EventEmitterModule.forRoot({ wildcard: true, maxListeners: 20 }),

    // Cron job scheduling
    ScheduleModule.forRoot(),

    // Health checks
    TerminusModule,

    // Infrastructure
    DatabaseModule,
    RedisModule,

    // Feature modules
    AuthModule,
    StadiumModule,
    CrowdModule,
    NavigationModule,
    IncidentsModule,
    TransportModule,
    VolunteersModule,
    SecurityModule,
    SustainabilityModule,
    AiModule,
    NotificationsModule,
    AnalyticsModule,
    HealthModule,
  ],
})
export class AppModule {}
