// =============================================================================
// Conversation Service – Manages AI chat histories
// =============================================================================

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { RedisService } from '../../redis/redis.service';
import type { AiAgentType, AiRole } from '@stadiumiq/shared-types';

export interface StoredConversation {
  id: string;
  messages: Array<{ role: AiRole; content: string; timestamp: string }>;
}

const CONVERSATION_CACHE_TTL = 3600; // 1 hour

@Injectable()
export class ConversationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async createConversation(
    userId: string,
    agentType: AiAgentType,
    stadiumId?: string,
    language = 'en',
  ): Promise<string> {
    const conversation = await this.prisma.aiConversation.create({
      data: { userId, agentType, stadiumId, language },
    });
    return conversation.id;
  }

  async getConversation(conversationId: string): Promise<StoredConversation | null> {
    // Try cache first
    const cached = await this.redis.get<StoredConversation>(`conv:${conversationId}`);
    if (cached) return cached;

    const conversation = await this.prisma.aiConversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' },
          take: 20, // Limit history for token budget
        },
      },
    });

    if (!conversation) return null;

    const result: StoredConversation = {
      id: conversation.id,
      messages: conversation.messages.map((m) => ({
        role: m.role as AiRole,
        content: m.content,
        timestamp: m.timestamp.toISOString(),
      })),
    };

    await this.redis.set(`conv:${conversationId}`, result, CONVERSATION_CACHE_TTL);
    return result;
  }

  async addMessage(
    conversationId: string,
    role: AiRole,
    content: string,
  ): Promise<void> {
    await this.prisma.aiMessage.create({
      data: { conversationId, role, content },
    });
    // Invalidate cache
    await this.redis.del(`conv:${conversationId}`);
  }

  async verifyOwnership(conversationId: string, userId: string): Promise<void> {
    const conv = await this.prisma.aiConversation.findUnique({
      where: { id: conversationId },
      select: { userId: true },
    });
    if (!conv || conv.userId !== userId) {
      throw new NotFoundException('Conversation not found');
    }
  }
}
