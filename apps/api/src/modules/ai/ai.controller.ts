// =============================================================================
// AI Controller – SSE Streaming Chat Endpoint
// =============================================================================

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { AiService } from './ai.service';
import { ConversationService, StoredConversation } from './conversation.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { AiChatDto } from './dto/ai-chat.dto';
import type { JwtPayload } from '@stadiumiq/shared-types';

interface RequestWithUser {
  user: JwtPayload;
}

@ApiTags('ai')
@Controller({ path: 'ai', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly conversationService: ConversationService,
  ) {}

  @Post('chat/stream')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions('ai:query')
  @Throttle({ ai: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Stream AI chat response via Server-Sent Events' })
  async streamChat(
    @Body() dto: AiChatDto,
    @Request() req: RequestWithUser,
    @Res() res: Response,
  ): Promise<void> {
    await this.aiService.streamChat(
      dto,
      req.user.sub,
      res,
      req.user.role === 'fan' ? 'en' : 'en',
    );
  }

  @Get('conversations')
  @RequirePermissions('ai:query')
  @ApiOperation({ summary: 'List user AI conversations' })
  async listConversations(@Request() req: RequestWithUser): Promise<StoredConversation | null> {
    return this.conversationService.getConversation(req.user.sub);
  }

  @Get('conversations/:id')
  @RequirePermissions('ai:query')
  @ApiOperation({ summary: 'Get conversation history' })
  async getConversation(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
  ): Promise<StoredConversation | null> {
    await this.conversationService.verifyOwnership(id, req.user.sub);
    return this.conversationService.getConversation(id);
  }
}
