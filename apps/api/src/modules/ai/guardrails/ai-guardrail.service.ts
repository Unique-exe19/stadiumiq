// =============================================================================
// AI Guardrail Service – Prompt Injection Defense & Content Safety
// =============================================================================
import { Injectable, Logger } from '@nestjs/common';

import type { PromptGuardrailResult } from '@stadiumiq/shared-types';

// Patterns that indicate prompt injection or policy violations
const INJECTION_PATTERNS = [
  /ignore\s+(previous|all|prior|above)\s+(instructions?|prompts?|context)/i,
  /you\s+are\s+now\s+(a|an)\s+/i,
  /act\s+as\s+(if|a|an)\s+/i,
  /forget\s+(everything|all|your|previous)/i,
  /disregard\s+(your|all|previous|the)/i,
  /system\s*:\s*you\s+are/i,
  /\[SYSTEM\]/i,
  /\[INST\]/i,
  /<\|system\|>/i,
  /jailbreak/i,
  /DAN\s+(mode|prompt)/i,
  /roleplay\s+as/i,
  /pretend\s+(you\s+are|to\s+be)/i,
];

const PII_PATTERNS = [
  /\b\d{3}[-.\s]?\d{2}[-.\s]?\d{4}\b/, // SSN
  /\b(?:\d{4}[-\s]?){3}\d{4}\b/, // Credit card
  /\b[A-Z]{1,2}\d{6,9}\b/, // Passport
];

const OFF_TOPIC_KEYWORDS = [
  'cryptocurrency',
  'stock market',
  'adult content',
  'drugs',
  'weapons manufacturing',
  'hack',
  'exploit',
  'malware',
  'phishing',
];

@Injectable()
export class AiGuardrailService {
  private readonly logger = new Logger(AiGuardrailService.name);

  evaluate(prompt: string, userId?: string): PromptGuardrailResult {
    const lower = prompt.toLowerCase();

    // Check for prompt injection
    const hasMaliciousIntent = INJECTION_PATTERNS.some((pattern) => pattern.test(prompt));
    if (hasMaliciousIntent) {
      this.logger.warn(`Prompt injection attempt detected from user ${userId ?? 'anonymous'}`);
      return {
        isAllowed: false,
        hasMaliciousIntent: true,
        hasPersonalDataRequest: false,
        hasPromptInjection: true,
        hasOffTopicRequest: false,
        rejectionReason: 'Prompt injection detected. Your query has been blocked.',
      };
    }

    // Check for PII requests
    const hasPersonalDataRequest = PII_PATTERNS.some((pattern) => pattern.test(prompt));

    // Check off-topic
    const hasOffTopicRequest = OFF_TOPIC_KEYWORDS.some((kw) => lower.includes(kw));
    if (hasOffTopicRequest) {
      return {
        isAllowed: false,
        hasMaliciousIntent: false,
        hasPersonalDataRequest,
        hasPromptInjection: false,
        hasOffTopicRequest: true,
        rejectionReason: 'I can only help with FIFA World Cup 2026 stadium and event topics.',
      };
    }

    // Check relevance for very short queries (let them through unless injection)
    if (prompt.length < 10) {
      return {
        isAllowed: true,
        hasMaliciousIntent: false,
        hasPersonalDataRequest: false,
        hasPromptInjection: false,
        hasOffTopicRequest: false,
        sanitizedPrompt: this.sanitize(prompt),
      };
    }

    return {
      isAllowed: true,
      hasMaliciousIntent: false,
      hasPersonalDataRequest,
      hasPromptInjection: false,
      hasOffTopicRequest: false,
      sanitizedPrompt: this.sanitize(prompt),
    };
  }

  private sanitize(prompt: string): string {
    // Remove any HTML/script tags that could cause output injection
    return prompt
      .replace(/<[^>]*>/g, '')
      .replace(/[^\w\s.,!?;:'"()\-@#&%+=/\\[\]{}]/g, ' ')
      .trim()
      .slice(0, 2000); // Hard token budget cap
  }
}
