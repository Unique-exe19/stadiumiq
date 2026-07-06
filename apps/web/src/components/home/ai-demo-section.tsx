'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

const DEMO_PROMPTS = [
  'How do I get to Section 204 from Gate B?',
  'Where are the nearest accessible restrooms?',
  'What time does the next shuttle leave?',
  'Is it crowded near the east concourse right now?',
];

const DEMO_RESPONSES: Record<string, string> = {
  'How do I get to Section 204 from Gate B?':
    '🗺️ **Route to Section 204 from Gate B:**\n\n1. Enter Gate B and proceed straight for 40m\n2. Turn left at the main concourse\n3. Take Elevator 3 to Level 2 (accessible route available)\n4. Follow signs for Sections 200-210\n5. Section 204 will be on your right\n\n⏱️ Estimated: **4 minutes** walking\n🚶 Current crowd level: **Low** — no congestion detected',
  'Where are the nearest accessible restrooms?':
    '♿ **Nearest Accessible Facilities:**\n\n- **Level 1**: Near Gate D (50m) — currently available\n- **Level 2**: Concourse East (80m) — shortest queue\n- **Companion Care Room**: Level 1, Section A corridor\n\nAll locations have automatic doors and grab rails. Need me to navigate you there?',
  'What time does the next shuttle leave?':
    '🚌 **Next Shuttle Departures:**\n\n| Route | Departure | Wait |\n|-------|-----------|------|\n| City Center | 21:45 | 8 min |\n| North Station | 21:50 | 13 min |\n| West Hotel District | 21:55 | 18 min |\n\n💡 Tip: The 21:45 City Center shuttle is less crowded than usual. Recommend departing now!',
  'Is it crowded near the east concourse right now?':
    '👥 **East Concourse Status:**\n\n🟠 **Moderate Density** (68% capacity)\n\nThe food court area has shorter queues than usual. Main walkways are moving freely.\n\n**AI Recommendation**: If headed east, use the upper level walkway — currently at only 35% capacity and 2 minutes faster.',
};

export function AiDemoSection() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      role: 'assistant',
      content: "Hi! I'm your StadiumIQ AI assistant. Ask me about navigation, transport, crowds, accessibility — anything about the World Cup experience! 🏟️",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    const assistantMsgId = crypto.randomUUID();
    const assistantMsg: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput('');
    setIsLoading(true);

    // Simulate streaming with demo responses
    const response = DEMO_RESPONSES[content] ?? 
      "I can help with navigation, transport schedules, crowd levels, accessibility features, and much more. Try one of the example questions below! 🌟";

    let charIndex = 0;
    const streamInterval = setInterval(() => {
      charIndex += 3;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId
            ? { ...m, content: response.slice(0, charIndex), isStreaming: charIndex < response.length }
            : m,
        ),
      );
      if (charIndex >= response.length) {
        clearInterval(streamInterval);
        setIsLoading(false);
        setTimeout(scrollToBottom, 50);
      }
    }, 20);

    scrollToBottom();
  }, [isLoading, scrollToBottom]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      void sendMessage(input);
    },
    [input, sendMessage],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        void sendMessage(input);
      }
    },
    [input, sendMessage],
  );

  return (
    <section
      className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-primary-950/20"
      aria-labelledby="ai-demo-heading"
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-primary-500/15 text-primary-300 border border-primary-500/30">
              <Bot className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
              Live AI Demo
            </Badge>
            <h2
              id="ai-demo-heading"
              className="font-display text-fluid-xl font-bold text-foreground mb-4"
            >
              Experience the AI Assistant
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Ask anything about the stadium. Our AI speaks 50+ languages and knows every corner of the venue.
            </p>
          </motion.div>
        </div>

        <motion.div
          className="glass-card rounded-3xl overflow-hidden shadow-elevated"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Chat header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/2">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl bg-primary-500/20 border border-primary-500/30 flex items-center justify-center"
                aria-hidden="true"
              >
                <Bot className="h-5 w-5 text-primary-400" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">StadiumIQ Assistant</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" aria-hidden="true" />
                  Online · Gemini 1.5 Pro
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="text-xs bg-primary-500/10 text-primary-300 border-primary-500/20">
                <Languages className="h-3 w-3 mr-1" aria-hidden="true" />
                50+ langs
              </Badge>
            </div>
          </div>

          {/* Messages */}
          <div
            className="h-96 overflow-y-auto p-4 space-y-4 scrollbar-thin"
            role="log"
            aria-label="Chat messages"
            aria-live="polite"
            aria-atomic="false"
          >
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div
                      className="w-8 h-8 rounded-lg bg-primary-500/20 border border-primary-500/30 flex items-center justify-center flex-shrink-0 mt-1"
                      aria-hidden="true"
                    >
                      <Bot className="h-4 w-4 text-primary-400" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${
                      msg.role === 'user'
                        ? 'chat-bubble-user text-foreground'
                        : 'chat-bubble-ai text-foreground/90'
                    }`}
                    aria-label={`${msg.role === 'user' ? 'You' : 'AI'}: ${msg.content}`}
                  >
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {msg.content}
                      {msg.isStreaming && (
                        <span className="inline-block w-1 h-4 ml-0.5 bg-primary-400 animate-pulse rounded-sm" aria-label="typing" />
                      )}
                    </div>
                  </div>
                  {msg.role === 'user' && (
                    <div
                      className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 mt-1"
                      aria-hidden="true"
                    >
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Quick prompts */}
          <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-thin" role="list" aria-label="Quick question suggestions">
            {DEMO_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                role="listitem"
                onClick={() => void sendMessage(prompt)}
                disabled={isLoading}
                className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-primary-400"
                aria-label={`Quick question: ${prompt}`}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="p-4 border-t border-white/10"
            aria-label="Send message"
          >
            <div className="flex gap-3 items-end">
              <label htmlFor="chat-input" className="sr-only">
                Type your message
              </label>
              <textarea
                id="chat-input"
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about navigation, transport, accessibility..."
                disabled={isLoading}
                rows={1}
                className="flex-1 resize-none bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 transition-colors"
                aria-describedby="chat-hint"
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
              <span id="chat-hint" className="sr-only">
                Press Enter to send, Shift+Enter for new line
              </span>
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !input.trim()}
                className="w-12 h-12 rounded-xl bg-primary-500 hover:bg-primary-400 text-white flex-shrink-0 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary-400"
                aria-label={isLoading ? 'Sending message...' : 'Send message'}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Send className="h-4 w-4" aria-hidden="true" />
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
