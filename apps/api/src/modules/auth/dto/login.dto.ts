// =============================================================================
// Login DTO
// =============================================================================
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'fan@example.com' })
  @IsEmail()
  @MaxLength(255)
  email!: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password!: string;
}
