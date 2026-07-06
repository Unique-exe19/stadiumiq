'use client';

import { motion } from 'framer-motion';
import { Users, Zap, Globe, TrendingUp } from 'lucide-react';

const STATS = [
  { icon: Users, value: '3.5M+', label: 'Expected fans', color: 'text-blue-400' },
  { icon: Zap, value: '<100ms', label: 'AI response time', color: 'text-yellow-400' },
  { icon: Globe, value: '50+', label: 'Languages supported', color: 'text-green-400' },
  { icon: TrendingUp, value: '99.9%', label: 'Uptime SLA', color: 'text-purple-400' },
];

export function StatsBar() {
  return (
    <section
      className="py-8 px-4 sm:px-6 lg:px-8 border-y border-white/5 bg-white/2"
      aria-label="Platform statistics"
    >
      <div className="max-w-5xl mx-auto">
        <dl className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map(({ icon: Icon, value, label, color }, index) => (
            <motion.div
              key={label}
              className="text-center"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Icon className={`h-5 w-5 ${color} mx-auto mb-2`} aria-hidden="true" />
              <dt className="sr-only">{label}</dt>
              <dd>
                <p className={`text-2xl font-display font-bold ${color}`} aria-label={value}>{value}</p>
                <p className="text-xs text-muted-foreground mt-1">{label}</p>
              </dd>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
}
