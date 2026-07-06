// =============================================================================
// StadiumIQ API – Application Entry Point
// =============================================================================

import './tracing'; // Must be imported first for OpenTelemetry instrumentation

import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WinstonModule } from 'nest-winston';
import compression from 'compression';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { createLoggerConfig } from './config/logger.config';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { RequestIdInterceptor } from './common/interceptors/request-id.interceptor';
import { AuditInterceptor } from './common/interceptors/audit.interceptor';
import { PrismaService } from './database/prisma.service';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(createLoggerConfig()),
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);
  const port = configService.getOrThrow<number>('APP_PORT');
  const frontendUrl = configService.getOrThrow<string>('FRONTEND_URL');

  // Security middleware
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'"],
          frameSrc: ["'none'"],
          objectSrc: ["'none'"],
        },
      },
      hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
      noSniff: true,
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    }),
  );

  // Compression
  app.use(compression());

  // CORS – strict origin allowlist
  app.enableCors({
    origin: [frontendUrl],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID', 'Accept-Language'],
    credentials: true,
    maxAge: 600,
  });

  // Global API prefix and versioning
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  // Global validation pipe – strict input sanitization
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: false },
      stopAtFirstError: false,
    }),
  );

  const prisma = app.get(PrismaService);
  // Global interceptors
  app.useGlobalInterceptors(
    new RequestIdInterceptor(),
    new TransformInterceptor(),
    new AuditInterceptor(prisma),
  );

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // OpenAPI / Swagger documentation
  if (configService.get<string>('NODE_ENV') !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('StadiumIQ API')
      .setDescription('FIFA World Cup 2026 Smart Stadium Operations Platform API')
      .setVersion('1.0')
      .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
      .addTag('auth', 'Authentication & Authorization')
      .addTag('crowd', 'Crowd Intelligence')
      .addTag('navigation', 'Stadium Navigation')
      .addTag('incidents', 'Incident Management')
      .addTag('transport', 'Transport Orchestration')
      .addTag('volunteers', 'Volunteer Management')
      .addTag('security', 'Security Intelligence')
      .addTag('sustainability', 'Sustainability Tracking')
      .addTag('ai', 'AI Assistant')
      .addTag('health', 'System Health')
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });
  }

  await app.listen(port);
}

void bootstrap();
