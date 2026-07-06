// =============================================================================
// Google OAuth Strategy
// =============================================================================

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly prisma: PrismaService,
    config: ConfigService,
  ) {
    super({
      clientID: config.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      clientSecret: config.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: config.getOrThrow<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    const email = profile.emails?.[0]?.value;
    if (!email) {
      done(new Error('No email from Google OAuth'), undefined);
      return;
    }

    // Upsert user on OAuth login
    const user = await this.prisma.user.upsert({
      where: { email },
      create: {
        email,
        displayName: profile.displayName,
        avatarUrl: profile.photos?.[0]?.value,
        role: 'fan',
        isEmailVerified: true,
      },
      update: {
        displayName: profile.displayName,
        avatarUrl: profile.photos?.[0]?.value,
        lastLoginAt: new Date(),
      },
    });

    done(null, user);
  }
}
