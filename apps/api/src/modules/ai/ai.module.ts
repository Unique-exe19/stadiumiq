// =============================================================================
// AI Module
// =============================================================================

import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { GeminiClient } from './clients/gemini.client';
import { AiGuardrailService } from './guardrails/ai-guardrail.service';
import { ConversationService } from './conversation.service';

@Module({
  controllers: [AiController],
  providers: [AiService, GeminiClient, AiGuardrailService, ConversationService],
  exports: [AiService, AiGuardrailService],
})
export class AiModule {}
