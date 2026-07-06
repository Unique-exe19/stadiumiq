// =============================================================================
// AI Chat DTO
// =============================================================================

import { IsEnum, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { AiAgentType, SupportedLanguage } from '@stadiumiq/shared-types';

export class AiChatDto {
  @ApiPropertyOptional({ description: 'Existing conversation ID for continued chat' })
  @IsOptional()
  @IsUUID()
  conversationId?: string;

  @ApiProperty({ description: 'User message', maxLength: 2000 })
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  message!: string;

  @ApiProperty({ enum: ['stadium_assistant', 'crowd_predictor', 'emergency_guide', 'volunteer_briefer', 'security_analyst', 'accessibility_concierge', 'transport_advisor', 'sustainability_advisor'] })
  @IsEnum(['stadium_assistant', 'crowd_predictor', 'emergency_guide', 'volunteer_briefer', 'security_analyst', 'accessibility_concierge', 'transport_advisor', 'sustainability_advisor'])
  agentType!: AiAgentType;

  @ApiPropertyOptional({ description: 'Stadium UUID for context' })
  @IsOptional()
  @IsUUID()
  stadiumId?: string;

  @ApiPropertyOptional({ example: 'en' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  language?: SupportedLanguage;
}
