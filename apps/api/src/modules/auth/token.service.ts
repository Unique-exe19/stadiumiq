// =============================================================================
// Token Service – JWT Access & Refresh Token Management
// =============================================================================
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';

import type { AuthTokens, JwtPayload, UserRole } from '@stadiumiq/shared-types';
import { ROLE_PERMISSIONS } from '@stadiumiq/shared-types';

import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async generateTokenPair(
    userId: string,
    email: string,
    role: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuthTokens> {
    const userRole = role as UserRole;
    const jti = crypto.randomUUID();

    const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
      sub: userId,
      email,
      role: userRole,
      permissions: ROLE_PERMISSIONS[userRole],
      jti,
    };

    const accessToken = this.jwtService.sign(payload);

    // Create refresh token
    const refreshToken = crypto.randomBytes(64).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
        userAgent,
        ipAddress,
      },
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 15 * 60,
      tokenType: 'Bearer',
    };
  }

  async refreshTokens(rawRefreshToken: string): Promise<AuthTokens> {
    const tokenHash = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');

    const stored = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!stored || stored.isRevoked || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    if (!stored.user.isActive) {
      throw new UnauthorizedException('Account deactivated');
    }

    // Rotate: revoke old, issue new
    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { isRevoked: true },
    });

    return this.generateTokenPair(stored.user.id, stored.user.email, stored.user.role);
  }

  async revokeRefreshToken(rawRefreshToken: string): Promise<void> {
    const tokenHash = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');

    await this.prisma.refreshToken
      .updateMany({ where: { tokenHash }, data: { isRevoked: true } })
      .catch(() => this.logger.warn('Refresh token not found during revocation'));
  }

  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { userId, isRevoked: false },
      data: { isRevoked: true },
    });
    this.logger.log(`All refresh tokens revoked for user: ${userId}`);
  }
}
