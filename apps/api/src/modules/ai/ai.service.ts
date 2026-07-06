// =============================================================================
// AI Service – Orchestrates AI agents with RAG and streaming
// =============================================================================

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { Content } from '@google/generative-ai';
import axios from 'axios';

import { GeminiClient } from './clients/gemini.client';
import { AiGuardrailService } from './guardrails/ai-guardrail.service';
import { ConversationService } from './conversation.service';
import { SYSTEM_PROMPTS } from './prompts/system-prompts';
import { PrismaService } from '../../database/prisma.service';
import { RedisService } from '../../redis/redis.service';
import type { AiChatRequest, AiAgentType } from '@stadiumiq/shared-types';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    private readonly gemini: GeminiClient,
    private readonly guardrail: AiGuardrailService,
    private readonly conversationService: ConversationService,
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly config: ConfigService,
  ) {}

  async streamChat(
    request: AiChatRequest,
    userId: string,
    res: Response,
    userLanguage = 'en',
    accessibilityMode = 'standard',
  ): Promise<void> {
    // 1. Guardrail check
    const guardrailResult = this.guardrail.evaluate(request.message, userId);
    if (!guardrailResult.isAllowed) {
      this.logPrompt(userId, request.agentType, request.message, false, guardrailResult.rejectionReason);
      res.write(
        `data: ${JSON.stringify({ error: guardrailResult.rejectionReason, isComplete: true })}\n\n`,
      );
      res.end();
      return;
    }

    // 2. Get or create conversation
    const conversationId = request.conversationId
      ?? await this.conversationService.createConversation(userId, request.agentType, request.stadiumId, userLanguage);

    const conversation = await this.conversationService.getConversation(conversationId);
    if (!conversation) throw new NotFoundException('Conversation not found');

    // 3. Build context via RAG
    const ragContext = await this.fetchRagContext(
      guardrailResult.sanitizedPrompt ?? request.message,
      request.stadiumId,
    );

    // 4. Get stadium live data for context injection
    const liveContext = request.stadiumId
      ? await this.getLiveStadiumContext(request.stadiumId)
      : '';

    // 5. Build system prompt
    const systemPrompt = this.buildSystemPrompt(
      request.agentType,
      userLanguage,
      accessibilityMode,
      liveContext,
      ragContext,
    );

    // 6. Convert conversation history to Gemini format
    const history: Content[] = conversation.messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

    // 7. Save user message
    await this.conversationService.addMessage(conversationId, 'user', request.message);

    // 8. Stream response via SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    let fullResponse = '';
    const messageId = crypto.randomUUID();

    try {
      const startTime = Date.now();

      for await (const chunk of this.gemini.streamChat({
        systemPrompt,
        history,
        userMessage: guardrailResult.sanitizedPrompt ?? request.message,
        maxOutputTokens: 2048,
        temperature: this.getTemperatureForAgent(request.agentType),
      })) {
        fullResponse += chunk;
        res.write(
          `data: ${JSON.stringify({
            conversationId,
            messageId,
            delta: chunk,
            isComplete: false,
          })}\n\n`,
        );
      }

      // 9. Save assistant response
      await this.conversationService.addMessage(conversationId, 'assistant', fullResponse);

      // 10. Log prompt for audit
      this.logPrompt(userId, request.agentType, request.message, true, undefined, Date.now() - startTime);

      res.write(
        `data: ${JSON.stringify({ conversationId, messageId, delta: '', isComplete: true })}\n\n`,
      );
    } catch (err) {
      this.logger.error('AI stream error', err);
      res.write(`data: ${JSON.stringify({ error: 'AI service temporarily unavailable', isComplete: true })}\n\n`);
    } finally {
      res.end();
    }
  }

  private buildSystemPrompt(
    agentType: AiAgentType,
    language: string,
    accessibilityMode: string,
    liveContext: string,
    ragContext: string,
  ): string {
    const basePrompt = this.getBaseSystemPrompt(agentType, language, accessibilityMode);
    const contextSection = [
      liveContext ? `\n\n=== LIVE STADIUM DATA ===\n${liveContext}` : '',
      ragContext ? `\n\n=== KNOWLEDGE BASE ===\n${ragContext}` : '',
    ].join('');
    return `${basePrompt}${contextSection}`;
  }

  private getBaseSystemPrompt(agentType: AiAgentType, language: string, accessibilityMode: string): string {
    switch (agentType) {
      case 'stadium_assistant': return SYSTEM_PROMPTS.stadium_assistant(language, 'FIFA World Cup 2026 Venue');
      case 'crowd_predictor': return SYSTEM_PROMPTS.crowd_predictor();
      case 'emergency_guide': return SYSTEM_PROMPTS.emergency_guide(language);
      case 'volunteer_briefer': return SYSTEM_PROMPTS.volunteer_briefer('Volunteer', language);
      case 'security_analyst': return SYSTEM_PROMPTS.security_analyst();
      case 'accessibility_concierge': return SYSTEM_PROMPTS.accessibility_concierge(language, accessibilityMode);
      case 'transport_advisor': return SYSTEM_PROMPTS.transport_advisor(language);
      case 'sustainability_advisor': return SYSTEM_PROMPTS.sustainability_advisor();
      default: return SYSTEM_PROMPTS.stadium_assistant(language, 'FIFA World Cup 2026 Venue');
    }
  }

  private getTemperatureForAgent(agentType: AiAgentType): number {
    const temperatureMap: Record<AiAgentType, number> = {
      stadium_assistant: 0.4,
      crowd_predictor: 0.1,
      emergency_guide: 0.1,
      volunteer_briefer: 0.3,
      security_analyst: 0.1,
      accessibility_concierge: 0.3,
      transport_advisor: 0.2,
      sustainability_advisor: 0.2,
    };
    return temperatureMap[agentType] ?? 0.3;
  }

  private async fetchRagContext(query: string, stadiumId?: string): Promise<string> {
    try {
      const aiServiceUrl = this.config.get<string>('AI_SERVICE_URL', 'http://localhost:8000');
      const response = await axios.post<{ documents: Array<{ content: string; score: number }> }>(
        `${aiServiceUrl}/api/rag/retrieve`,
        { query, stadiumId, topK: 3 },
        {
          headers: { 'X-API-Key': this.config.getOrThrow<string>('AI_SERVICE_API_KEY') },
          timeout: 3000,
        },
      );
      return response.data.documents
        .filter((d) => d.score > 0.7)
        .map((d) => d.content)
        .join('\n---\n');
    } catch {
      this.logger.warn('RAG retrieval failed, proceeding without context');
      return '';
    }
  }

  private async getLiveStadiumContext(stadiumId: string): Promise<string> {
    const cacheKey = `live-context:${stadiumId}`;
    return this.redis.getOrSet(
      cacheKey,
      async () => {
        const [stadium, alerts, gates] = await Promise.all([
          this.prisma.stadium.findUnique({
            where: { id: stadiumId },
            select: { name: true, capacity: true },
          }),
          this.prisma.crowdAlert.findMany({
            where: { stadiumId, isActive: true },
            select: { type: true, severity: true, message: true, recommendedAction: true },
            take: 3,
          }),
          this.prisma.stadiumGate.findMany({
            where: { stadiumId },
            select: { name: true, status: true, estimatedWaitMinutes: true },
          }),
        ]);

        if (!stadium) return '';

        const alertText = alerts.length > 0
          ? `Active Alerts: ${alerts.map((a: { severity: string; message: string }) => `${a.severity.toUpperCase()} - ${a.message}`).join('; ')}`
          : 'No active crowd alerts.';

        const gateText = gates
          .map((g: { name: string; status: any; estimatedWaitMinutes: number }) => `${g.name}: ${g.status} (${g.estimatedWaitMinutes}min wait)`)
          .join(', ');

        return `Stadium: ${stadium.name}\n${alertText}\nGates: ${gateText}`;
      },
      30, // Cache for 30 seconds for freshness
    );
  }

  private logPrompt(
    userId: string,
    agentType: AiAgentType,
    rawPrompt: string,
    wasAllowed: boolean,
    rejectionReason?: string,
    latencyMs?: number,
  ): void {
    this.prisma.promptLog
      .create({
        data: {
          userId,
          agentType,
          rawPrompt: rawPrompt.slice(0, 1000),
          wasAllowed,
          rejectionReason,
          hadInjection: !wasAllowed && !!rejectionReason,
          latencyMs,
        },
      })
      .catch((err: Error) => this.logger.error('Prompt log failed', err.message));
  }
}
