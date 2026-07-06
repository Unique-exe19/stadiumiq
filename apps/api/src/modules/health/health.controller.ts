// =============================================================================
// Health Controller
// =============================================================================
import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  PrismaHealthIndicator,
} from '@nestjs/terminus';

import { PrismaService } from '../../database/prisma.service';
import { RedisHealthIndicator } from './redis.health';

@ApiTags('health')
@Controller({ path: 'health', version: '1' })
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly prismaHealth: PrismaHealthIndicator,
    private readonly memoryHealth: MemoryHealthIndicator,
    private readonly diskHealth: DiskHealthIndicator,
    private readonly redisHealth: RedisHealthIndicator,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'System health check' })
  check() {
    return this.health.check([
      () => this.prismaHealth.pingCheck('database', this.prisma),
      () => this.redisHealth.isHealthy('redis'),
      () => this.memoryHealth.checkHeap('memory_heap', 512 * 1024 * 1024),
      () => this.diskHealth.checkStorage('storage', { path: '/', thresholdPercent: 0.9 }),
    ]);
  }

  @Get('live')
  @ApiOperation({ summary: 'Liveness probe (Kubernetes)' })
  liveness(): { status: string } {
    return { status: 'ok' };
  }

  @Get('ready')
  @HealthCheck()
  @ApiOperation({ summary: 'Readiness probe (Kubernetes)' })
  readiness() {
    return this.health.check([() => this.prismaHealth.pingCheck('database', this.prisma)]);
  }
}
