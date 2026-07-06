// =============================================================================
// Auth DTOs – Input Validation
// =============================================================================

import { IsEmail, IsEnum, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'fan@example.com' })
  @IsEmail({}, { message: 'Must be a valid email address' })
  @MaxLength(255)
  email!: string;

  @ApiProperty({ description: 'Min 8 chars, 1 uppercase, 1 number, 1 special char' })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  @Matches(
    /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/,
    { message: 'Password must contain uppercase, number, and special character' },
  )
  password!: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  displayName!: string;

  @ApiPropertyOptional({ enum: ['fan', 'volunteer'], default: 'fan' })
  @IsOptional()
  @IsEnum(['fan', 'volunteer'])
  role?: 'fan' | 'volunteer';

  @ApiPropertyOptional({ example: 'en' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  preferredLanguage?: string;
}
