// =============================================================================
// Auth Service – Unit Tests
// =============================================================================

import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { AuthService } from '../../src/modules/auth/auth.service';
import { TokenService } from '../../src/modules/auth/token.service';
import { PrismaService } from '../../src/database/prisma.service';
import { RedisService } from '../../src/redis/redis.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';

const MOCK_USER = {
  id: 'user-uuid-1',
  email: 'fan@test.com',
  passwordHash: bcrypt.hashSync('ValidPass123!', 12),
  displayName: 'Test Fan',
  role: 'fan' as const,
  isActive: true,
  isEmailVerified: true,
  preferredLanguage: 'en',
  accessibilityMode: 'standard',
  avatarUrl: null,
  lastLoginAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const MOCK_TOKENS = {
  accessToken: 'mock.access.token',
  refreshToken: 'mock-refresh-token',
  expiresIn: 900,
  tokenType: 'Bearer' as const,
};

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: jest.Mocked<PrismaService>;
  let tokenService: jest.Mocked<TokenService>;
  let redisService: jest.Mocked<RedisService>;

  beforeEach(async () => {
    const mockPrisma = {
      user: {
        findUnique: jest.fn(),
        findUniqueOrThrow: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      auditLog: { create: jest.fn().mockResolvedValue({}) },
    };

    const mockToken = {
      generateTokenPair: jest.fn().mockResolvedValue(MOCK_TOKENS),
      revokeRefreshToken: jest.fn().mockResolvedValue(undefined),
    };

    const mockRedis = {
      set: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: TokenService, useValue: mockToken },
        { provide: RedisService, useValue: mockRedis },
        { provide: ConfigService, useValue: { get: jest.fn(), getOrThrow: jest.fn() } },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get(PrismaService) as jest.Mocked<PrismaService>;
    tokenService = module.get(TokenService) as jest.Mocked<TokenService>;
    redisService = module.get(RedisService) as jest.Mocked<RedisService>;
  });

  describe('register()', () => {
    it('should successfully register a new user', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prismaService.user.create as jest.Mock).mockResolvedValue(MOCK_USER);

      const result = await authService.register({
        email: 'fan@test.com',
        password: 'ValidPass123!',
        displayName: 'Test Fan',
      });

      expect(result).toEqual(MOCK_TOKENS);
      expect(tokenService.generateTokenPair).toHaveBeenCalledWith(
        MOCK_USER.id,
        MOCK_USER.email,
        MOCK_USER.role,
      );
    });

    it('should throw ConflictException if email already exists', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(MOCK_USER);

      await expect(
        authService.register({
          email: 'fan@test.com',
          password: 'ValidPass123!',
          displayName: 'Test Fan',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login()', () => {
    it('should successfully login with correct credentials', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(MOCK_USER);
      (prismaService.user.update as jest.Mock).mockResolvedValue(MOCK_USER);

      const result = await authService.login(
        { email: 'fan@test.com', password: 'ValidPass123!' },
        '127.0.0.1',
        'test-agent',
      );

      expect(result).toEqual(MOCK_TOKENS);
    });

    it('should throw UnauthorizedException with wrong password', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(MOCK_USER);

      await expect(
        authService.login({ email: 'fan@test.com', password: 'WrongPassword!' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when user does not exist', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        authService.login({ email: 'nonexistent@test.com', password: 'Pass123!' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw ForbiddenException for deactivated accounts', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue({
        ...MOCK_USER,
        isActive: false,
      });

      await expect(
        authService.login({ email: 'fan@test.com', password: 'ValidPass123!' }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('logout()', () => {
    it('should revoke refresh token and blacklist access token', async () => {
      await authService.logout('user-uuid-1', 'refresh-token');

      expect(tokenService.revokeRefreshToken).toHaveBeenCalledWith('refresh-token');
      expect(redisService.set).toHaveBeenCalledWith(
        'revoked:user-uuid-1',
        true,
        900,
      );
    });
  });
});
