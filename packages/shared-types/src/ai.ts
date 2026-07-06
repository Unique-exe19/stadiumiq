// =============================================================================
// AI / GenAI Types
// =============================================================================
import type { ISODateString, SupportedLanguage, UUID } from './common';

export type AiRole = 'user' | 'assistant' | 'system';
export type AiAgentType =
  | 'stadium_assistant'
  | 'crowd_predictor'
  | 'emergency_guide'
  | 'volunteer_briefer'
  | 'security_analyst'
  | 'accessibility_concierge'
  | 'transport_advisor'
  | 'sustainability_advisor';

export type SafetyRating =
  | 'HARM_CATEGORY_HARASSMENT'
  | 'HARM_CATEGORY_HATE_SPEECH'
  | 'HARM_CATEGORY_SEXUALLY_EXPLICIT'
  | 'HARM_CATEGORY_DANGEROUS_CONTENT';

export interface AiMessage {
  readonly id: UUID;
  readonly conversationId: UUID;
  readonly role: AiRole;
  readonly content: string;
  readonly timestamp: ISODateString;
  readonly tokensUsed?: number;
  readonly languageDetected?: SupportedLanguage;
  readonly isStreaming?: boolean;
}

export interface AiConversation {
  readonly id: UUID;
  readonly userId: UUID;
  readonly stadiumId?: UUID;
  readonly agentType: AiAgentType;
  readonly language: SupportedLanguage;
  readonly messages: ReadonlyArray<AiMessage>;
  readonly createdAt: ISODateString;
  readonly updatedAt: ISODateString;
}

export interface AiChatRequest {
  readonly conversationId?: UUID;
  readonly message: string;
  readonly agentType: AiAgentType;
  readonly stadiumId?: UUID;
  readonly language?: SupportedLanguage;
  readonly contextData?: Record<string, unknown>;
}

export interface AiChatStreamChunk {
  readonly conversationId: UUID;
  readonly messageId: UUID;
  readonly delta: string;
  readonly isComplete: boolean;
  readonly usage?: {
    readonly promptTokens: number;
    readonly completionTokens: number;
    readonly totalTokens: number;
  };
  readonly error?: string;
}

export interface RagDocument {
  readonly id: UUID;
  readonly title: string;
  readonly content: string;
  readonly source: string;
  readonly category: string;
  readonly language: SupportedLanguage;
  readonly embedding?: ReadonlyArray<number>;
  readonly relevanceScore?: number;
  readonly createdAt: ISODateString;
}

export interface PromptGuardrailResult {
  readonly isAllowed: boolean;
  readonly hasMaliciousIntent: boolean;
  readonly hasPersonalDataRequest: boolean;
  readonly hasPromptInjection: boolean;
  readonly hasOffTopicRequest: boolean;
  readonly sanitizedPrompt?: string;
  readonly rejectionReason?: string;
}
