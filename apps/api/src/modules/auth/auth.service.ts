// =============================================================================
// Auth Service
// =============================================================================
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import type { AuthTokens, User } from '@stadiumiq/shared-types';
import { ROLE_PERMISSIONS } from '@stadiumiq/shared-types';

import { PrismaService } from '../../database/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { TokenService } from './token.service';

const BCRYPT_ROUNDS = 12;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
    private readonly redis: RedisService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthTokens> {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        passwordHash,
        displayName: dto.displayName,
        role: dto.role ?? 'fan',
        preferredLanguage: dto.preferredLanguage ?? 'en',
      },
    });

    this.logger.log(`New user registered: ${user.id} role=${user.role}`);

    await this.prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'USER_REGISTERED',
        resource: 'users',
        resourceId: user.id,
        success: true,
      },
    });

    return this.tokenService.generateTokenPair(user.id, user.email, user.role);
  }

  async login(dto: LoginDto, ipAddress?: string, userAgent?: string): Promise<AuthTokens> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user?.passwordHash || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      await this.prisma.auditLog.create({
        data: {
          action: 'LOGIN_FAILED',
          resource: 'auth',
          ipAddress,
          success: false,
          details: { email: dto.email },
        },
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new ForbiddenException('Account deactivated. Contact support.');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    await this.prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'LOGIN_SUCCESS',
        resource: 'auth',
        ipAddress,
        userAgent,
        success: true,
      },
    });

    this.logger.log(`User logged in: ${user.id}`);
    return this.tokenService.generateTokenPair(
      user.id,
      user.email,
      user.role,
      ipAddress,
      userAgent,
    );
  }

  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    return this.tokenService.refreshTokens(refreshToken);
  }

  async logout(userId: string, refreshToken: string): Promise<void> {
    await this.tokenService.revokeRefreshToken(refreshToken);
    // Blacklist the access token by adding userId to revoked set
    await this.redis.set(`revoked:${userId}`, true, 60 * 15);
    this.logger.log(`User logged out: ${userId}`);
  }

  async getProfile(userId: string): Promise<User> {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl ?? undefined,
      role: user.role as User['role'],
      permissions: ROLE_PERMISSIONS[user.role as User['role']],
      preferredLanguage: user.preferredLanguage,
      accessibilityMode: user.accessibilityMode as User['accessibilityMode'],
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt?.toISOString(),
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}
