'use client';

import { useState } from 'react';
import { Brain, Loader2, RefreshCw, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

const AI_INSIGHTS = [
  {
    id: '1',
    category: 'Crowd',
    insight: 'East Concourse will reach critical density in ~12 minutes based on current ingress rate. Open Gate E2 immediately.',
    confidence: 91,
    severity: 'critical',
    action: 'Open Gate E2',
  },
  {
    id: '2',
    category: 'Transport',
    insight: 'Post-match shuttle demand will peak at 22:15. Recommend 3 additional buses on Route 7.',
    confidence: 87,
    severity: 'warning',
    action: 'Add Route 7 buses',
  },
  {
    id: '3',
    category: 'Sustainability',
    insight: 'Energy consumption is 12% above target. North wing lights at full brightness — reduce to 70%.',
    confidence: 95,
    severity: 'info',
    action: 'Adjust lighting',
  },
];

export function AiInsightsPanel() {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsGenerating(false);
  };

  return (
    <section
      className="glass-card rounded-2xl p-5"
      aria-labelledby="ai-insights-heading"
      aria-live="polite"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 id="ai-insights-heading" className="font-display font-semibold text-foreground flex items-center gap-2">
          <Brain className="h-4 w-4 text-primary-400" aria-hidden="true" />
          AI Insights
        </h2>
        <Button
          variant="ghost"
          size="icon"
          className="w-7 h-7 rounded-lg"
          onClick={handleGenerate}
          disabled={isGenerating}
          aria-label="Regenerate AI insights"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 text-muted-foreground ${isGenerating ? 'animate-spin' : ''}`}
            aria-hidden="true"
          />
        </Button>
      </div>

      {isGenerating ? (
        <div className="flex items-center justify-center py-8 text-muted-foreground" aria-live="assertive">
          <Loader2 className="h-5 w-5 animate-spin mr-2" aria-hidden="true" />
          <span>Analyzing stadium data...</span>
        </div>
      ) : (
        <AnimatePresence>
          <ul className="space-y-2.5" role="list" aria-label="AI-generated operational insights">
            {AI_INSIGHTS.map((item, index) => (
              <motion.li
                key={item.id}
                className="rounded-xl bg-white/3 border border-white/8 p-3 hover:bg-white/5 transition-colors cursor-pointer group"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                tabIndex={0}
                role="button"
                aria-label={`AI insight: ${item.insight}. Confidence: ${item.confidence}%. Recommended action: ${item.action}`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <Badge
                    className={`text-[10px] px-1.5 py-0 rounded-md ${
                      item.severity === 'critical' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                      item.severity === 'warning' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                      'bg-blue-500/20 text-blue-400 border-blue-500/30'
                    } border`}
                  >
                    {item.category}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">{item.confidence}% confidence</span>
                </div>
                <p className="text-xs text-foreground/80 leading-relaxed mb-2">{item.insight}</p>
                <div className="flex items-center gap-1 text-primary-400">
                  <span className="text-[10px] font-medium">→ {item.action}</span>
                  <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                </div>
              </motion.li>
            ))}
          </ul>
        </AnimatePresence>
      )}
    </section>
  );
}
