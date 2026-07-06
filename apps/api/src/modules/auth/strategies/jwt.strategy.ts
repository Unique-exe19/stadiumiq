// =============================================================================
// JWT Strategy – Passport
// =============================================================================

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

import { PrismaService } from '../../../database/prisma.service';
import { RedisService } from '../../../redis/redis.service';
import type { JwtPayload } from '@stadiumiq/shared-types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_ACCESS_SECRET'),
      issuer: 'stadiumiq',
      audience: 'stadiumiq-api',
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    // Check if user was force-logged out (token blacklisted)
    const isRevoked = await this.redis.exists(`revoked:${payload.sub}`);
    if (isRevoked) {
      throw new UnauthorizedException('Session invalidated. Please log in again.');
    }

    // Verify user still exists and is active
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { isActive: true },
    });

    if (!user?.isActive) {
      throw new UnauthorizedException('Account deactivated');
    }

    return payload;
  }
}
