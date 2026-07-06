// =============================================================================
// Gemini Client – Google Generative AI with NVIDIA NIM adapter fallback
// =============================================================================
import {
  Content,
  GenerateContentStreamResult,
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from '@google/generative-ai';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

export interface GeminiStreamOptions {
  systemPrompt: string;
  history: Content[];
  userMessage: string;
  maxOutputTokens?: number;
  temperature?: number;
}

const SAFETY_SETTINGS = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

@Injectable()
export class GeminiClient {
  private readonly logger = new Logger(GeminiClient.name);
  private readonly genAI: GoogleGenerativeAI | null = null;
  private readonly modelName: string;

  constructor(private readonly config: ConfigService) {
    const geminiKey = this.config.get<string>('GEMINI_API_KEY', '');
    const useNvidia =
      !geminiKey || geminiKey.includes('placeholder') || geminiKey.includes('CHANGE_ME');

    if (!useNvidia) {
      this.genAI = new GoogleGenerativeAI(geminiKey);
    }
    this.modelName = config.get<string>('GEMINI_MODEL', 'gemini-1.5-pro');
  }

  async *streamChat(options: GeminiStreamOptions): AsyncGenerator<string> {
    const geminiKey = this.config.get<string>('GEMINI_API_KEY', '');
    const nvidiaKey = this.config.get<string>('NVIDIA_API_KEY', '');
    const useNvidia =
      !geminiKey || geminiKey.includes('placeholder') || geminiKey.includes('CHANGE_ME');

    if (useNvidia && nvidiaKey) {
      this.logger.log('Routing streamChat query to NVIDIA NIM API');
      let response;
      try {
        response = await axios.post(
          'https://integrate.api.nvidia.com/v1/chat/completions',
          {
            model: 'meta/llama-3.1-70b-instruct',
            messages: [
              { role: 'system', content: options.systemPrompt },
              ...options.history.map((h) => ({
                role: h.role === 'model' ? 'assistant' : 'user',
                content: typeof h.parts[0]?.text === 'string' ? h.parts[0].text : '',
              })),
              { role: 'user', content: options.userMessage },
            ],
            temperature: options.temperature ?? 0.3,
            max_tokens: options.maxOutputTokens ?? 2048,
            stream: true,
          },
          {
            headers: {
              Authorization: `Bearer ${nvidiaKey}`,
              Accept: 'text/event-stream',
            },
            responseType: 'stream',
          },
        );
      } catch (err) {
        this.logger.error('NVIDIA NIM request failed', err);
        throw err;
      }

      const stream = response.data;
      let buffer = '';

      for await (const chunk of stream) {
        buffer += chunk.toString();
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          const cleanLine = line.trim();
          if (!cleanLine || cleanLine === 'data: [DONE]') continue;
          if (cleanLine.startsWith('data: ')) {
            try {
              const data = JSON.parse(cleanLine.slice(6));
              const text = data.choices[0]?.delta?.content;
              if (text) yield text;
            } catch {
              // Ignore partial JSON parsing errors
            }
          }
        }
      }
      return;
    }

    if (!this.genAI) throw new Error('Gemini API client not configured');

    const model = this.genAI.getGenerativeModel({
      model: this.modelName,
      systemInstruction: options.systemPrompt,
      safetySettings: SAFETY_SETTINGS,
      generationConfig: {
        maxOutputTokens: options.maxOutputTokens ?? 2048,
        temperature: options.temperature ?? 0.3,
        topP: 0.95,
        topK: 40,
      },
    });

    const chat = model.startChat({ history: options.history });

    let result: GenerateContentStreamResult;
    try {
      result = await chat.sendMessageStream(options.userMessage);
    } catch (err) {
      this.logger.error('Gemini stream request failed', err);
      throw err;
    }

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) yield text;
    }
  }

  async generateText(prompt: string, temperature = 0.2): Promise<string> {
    const geminiKey = this.config.get<string>('GEMINI_API_KEY', '');
    const nvidiaKey = this.config.get<string>('NVIDIA_API_KEY', '');
    const useNvidia =
      !geminiKey || geminiKey.includes('placeholder') || geminiKey.includes('CHANGE_ME');

    if (useNvidia && nvidiaKey) {
      this.logger.log('Routing generateText query to NVIDIA NIM API');
      try {
        const response = await axios.post(
          'https://integrate.api.nvidia.com/v1/chat/completions',
          {
            model: 'meta/llama-3.1-70b-instruct',
            messages: [{ role: 'user', content: prompt }],
            temperature,
            max_tokens: 1024,
          },
          {
            headers: { Authorization: `Bearer ${nvidiaKey}` },
          },
        );
        return response.data.choices[0]?.message?.content ?? '';
      } catch (err) {
        this.logger.error('NVIDIA NIM generateText failed', err);
        throw err;
      }
    }

    if (!this.genAI) throw new Error('Gemini API client not configured');

    const model = this.genAI.getGenerativeModel({
      model: this.modelName,
      safetySettings: SAFETY_SETTINGS,
      generationConfig: { maxOutputTokens: 1024, temperature },
    });

    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      this.logger.error('Gemini text generation failed', err);
      throw err;
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    const geminiKey = this.config.get<string>('GEMINI_API_KEY', '');
    const nvidiaKey = this.config.get<string>('NVIDIA_API_KEY', '');
    const useNvidia =
      !geminiKey || geminiKey.includes('placeholder') || geminiKey.includes('CHANGE_ME');

    if (useNvidia && nvidiaKey) {
      try {
        const response = await axios.post(
          'https://integrate.api.nvidia.com/v1/embeddings',
          {
            input: [text],
            model: 'nvidia/embeddings-nv-embed-qa-4',
            encoding_format: 'float',
          },
          {
            headers: { Authorization: `Bearer ${nvidiaKey}` },
          },
        );
        return response.data.data[0]?.embedding ?? Array(768).fill(0);
      } catch (err) {
        this.logger.warn('NVIDIA embeddings failed, using fallback vector', err);
        return Array(768).fill(0);
      }
    }

    if (!this.genAI) throw new Error('Gemini API client not configured');

    const embeddingModel = this.genAI.getGenerativeModel({
      model: this.config.get<string>('GEMINI_EMBEDDING_MODEL', 'text-embedding-004'),
    });

    const result = await embeddingModel.embedContent(text);
    return result.embedding.values;
  }
}
