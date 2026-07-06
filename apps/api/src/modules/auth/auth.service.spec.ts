// =============================================================================
// Auth Service – Unit Tests
// =============================================================================

import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../database/prisma.service';
import { TokenService } from './token.service';
import { RedisService } from '../../redis/redis.service';
import { UnauthorizedException, ConflictException, ForbiddenException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------
const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    findUniqueOrThrow: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  auditLog: {
    create: jest.fn().mockResolvedValue({}),  // always succeed silently
  },
};

const mockTokenService = {
  generateTokenPair: jest.fn(),
  verifyRefreshToken: jest.fn(),
  revokeRefreshToken: jest.fn(),
  refreshTokens: jest.fn(),
};

const mockRedisService = {
  get: jest.fn(),
  set: jest.fn().mockResolvedValue(undefined),
  del: jest.fn(),
  getOrSet: jest.fn(),
};

// ---------------------------------------------------------------------------
// Test Suite
// ---------------------------------------------------------------------------
describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: TokenService, useValue: mockTokenService },
        { provide: RedisService, useValue: mockRedisService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
    // Re-apply the always-succeed mock after clearAllMocks
    mockPrismaService.auditLog.create.mockResolvedValue({});
    mockRedisService.set.mockResolvedValue(undefined);
  });

  // ── register ─────────────────────────────────────────────────────────────
  describe('register()', () => {
    it('throws ConflictException when email already exists', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: 'existing-id' });
      await expect(
        authService.register({ email: 'taken@test.com', password: 'pass123', displayName: 'Test', role: 'fan' }),
      ).rejects.toThrow(ConflictException);
    });

    it('creates user and returns tokens on successful registration', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({
        id: 'new-uuid',
        email: 'new@test.com',
        role: 'fan',
        displayName: 'New User',
        isEmailVerified: false,
        isActive: true,
      });
      mockTokenService.generateTokenPair.mockResolvedValue({
        accessToken: 'access.jwt',
        refreshToken: 'refresh.jwt',
        expiresIn: 900,
      });

      const result = await authService.register({
        email: 'new@test.com',
        password: 'secure_pass_123',
        displayName: 'New User',
        role: 'fan',
      });

      expect(result).toHaveProperty('accessToken');
      expect(mockPrismaService.user.create).toHaveBeenCalledTimes(1);

      // Verify password is NOT stored as plain text
      const createCall = mockPrismaService.user.create.mock.calls[0][0] as {
        data: { passwordHash: string };
      };
      expect(createCall.data.passwordHash).not.toBe('secure_pass_123');
    });

    it('normalises email to lowercase on register', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({
        id: 'uuid-3',
        email: 'upper@test.com',
        role: 'fan',
        displayName: 'Upper',
        isActive: true,
      });
      mockTokenService.generateTokenPair.mockResolvedValue({ accessToken: 'a', refreshToken: 'r', expiresIn: 900 });

      await authService.register({ email: 'UPPER@TEST.COM', password: 'pass123', displayName: 'Upper', role: 'fan' });

      const createCall = mockPrismaService.user.create.mock.calls[0][0] as {
        data: { email: string };
      };
      expect(createCall.data.email).toBe('upper@test.com');
    });
  });

  // ── login ────────────────────────────────────────────────────────────────
  describe('login()', () => {
    it('throws UnauthorizedException when user does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      await expect(
        authService.login({ email: 'nobody@test.com', password: 'pass' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when password is incorrect', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'uuid-1',
        email: 'fan@test.com',
        passwordHash: await bcrypt.hash('correct_pass', 10),
        role: 'fan',
        isActive: true,
      });
      await expect(
        authService.login({ email: 'fan@test.com', password: 'wrong_pass' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws ForbiddenException for inactive account', async () => {
      const hash = await bcrypt.hash('pass', 10);
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'uuid-2',
        email: 'inactive@test.com',
        passwordHash: hash,
        role: 'fan',
        isActive: false,
      });
      await expect(
        authService.login({ email: 'inactive@test.com', password: 'pass' }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('returns tokens on successful login', async () => {
      const hash = await bcrypt.hash('secret123', 10);
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'uuid-1',
        email: 'fan@test.com',
        passwordHash: hash,
        role: 'fan',
        isActive: true,
        displayName: 'Test Fan',
        isEmailVerified: true,
      });
      mockPrismaService.user.update.mockResolvedValue({});
      mockTokenService.generateTokenPair.mockResolvedValue({
        accessToken: 'access.jwt',
        refreshToken: 'refresh.jwt',
        expiresIn: 900,
      });

      const result = await authService.login({ email: 'fan@test.com', password: 'secret123' });
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(mockTokenService.generateTokenPair).toHaveBeenCalledTimes(1);
    });
  });
});
