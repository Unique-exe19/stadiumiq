// =============================================================================
// App / Health Unit Tests
// =============================================================================
import {
  DiskHealthIndicator,
  HealthCheckService,
  MemoryHealthIndicator,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from './database/prisma.service';
import { HealthController } from './modules/health/health.controller';
import { RedisHealthIndicator } from './modules/health/redis.health';

const mockHealthCheckService = {
  check: jest.fn().mockImplementation((indicators) => {
    // Execute all indicators to mock execution
    indicators.forEach((i: () => unknown) => i());
    return { status: 'ok', details: {} };
  }),
};

const mockPrismaHealthIndicator = {
  pingCheck: jest.fn().mockResolvedValue({ status: 'up' }),
};

const mockMemoryHealthIndicator = {
  checkHeap: jest.fn().mockResolvedValue({ status: 'up' }),
};

const mockDiskHealthIndicator = {
  checkStorage: jest.fn().mockResolvedValue({ status: 'up' }),
};

const mockRedisHealthIndicator = {
  isHealthy: jest.fn().mockResolvedValue({ status: 'up' }),
};

const mockPrismaService = {};

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        { provide: HealthCheckService, useValue: mockHealthCheckService },
        { provide: PrismaHealthIndicator, useValue: mockPrismaHealthIndicator },
        { provide: MemoryHealthIndicator, useValue: mockMemoryHealthIndicator },
        { provide: DiskHealthIndicator, useValue: mockDiskHealthIndicator },
        { provide: RedisHealthIndicator, useValue: mockRedisHealthIndicator },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  describe('liveness()', () => {
    it('should return status ok for kubernetes probe', () => {
      const result = controller.liveness();
      expect(result).toEqual({ status: 'ok' });
    });
  });

  describe('check()', () => {
    it('should execute database, redis, memory, and disk checks', async () => {
      const result = await controller.check();
      expect(result).toHaveProperty('status', 'ok');
      expect(mockHealthCheckService.check).toHaveBeenCalled();
      expect(mockPrismaHealthIndicator.pingCheck).toHaveBeenCalled();
      expect(mockRedisHealthIndicator.isHealthy).toHaveBeenCalled();
      expect(mockMemoryHealthIndicator.checkHeap).toHaveBeenCalled();
      expect(mockDiskHealthIndicator.checkStorage).toHaveBeenCalled();
    });
  });

  describe('readiness()', () => {
    it('should execute readiness probe with database health check only', async () => {
      const result = await controller.readiness();
      expect(result).toHaveProperty('status', 'ok');
    });
  });
});
