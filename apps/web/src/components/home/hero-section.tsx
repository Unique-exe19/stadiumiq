'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Mic, Globe, Shield, Zap } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { NavigationBar } from '@/components/navigation/navigation-bar';

const FLOATING_STATS = [
  { label: '48 Stadiums', value: '2026' },
  { label: 'AI Languages', value: '50+' },
  { label: 'Fan Capacity', value: '3.5M' },
];

export function HeroSection() {

  return (
    <section
      className="relative min-h-screen flex flex-col"
      aria-labelledby="hero-heading"
    >
      <NavigationBar />

      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary-500/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent-500/8 blur-3xl" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(hsl(220 75% 60% / 1) 1px, transparent 1px), linear-gradient(90deg, hsl(220 75% 60% / 1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20">
        <div className="max-w-6xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
        
          </motion.div>

          {/* Heading */}
          <motion.h1
            id="hero-heading"
            className="font-display text-fluid-2xl font-extrabold leading-[1.05] tracking-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="text-foreground">The AI Brain of</span>
            <br />
            <span className="bg-gradient-to-r from-primary-400 via-primary-300 to-accent-400 bg-clip-text text-transparent">
              Every Stadium
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            className="text-fluid-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Real-time crowd intelligence, multilingual AI assistance, accessible navigation, and
            intelligent transport orchestration — all in one platform for 3.5 million World Cup fans.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button
              asChild
              size="lg"
              className="bg-primary-500 hover:bg-primary-400 text-white font-semibold px-8 py-3 rounded-xl shadow-glow transition-all duration-300 hover:shadow-glow hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-primary-400"
              aria-label="Enter StadiumIQ fan portal"
            >
              <Link href="/fan">
                Enter Fan Portal
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/20 text-foreground hover:bg-white/5 font-semibold px-8 py-3 rounded-xl transition-all duration-300"
              aria-label="View staff operations dashboard"
            >
              <Link href="/staff">Staff Dashboard</Link>
            </Button>
          </motion.div>

          {/* Feature pills */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            role="list"
            aria-label="Key platform features"
          >
            {[
              { icon: Globe, label: '50+ Languages' },
              { icon: Shield, label: 'WCAG 2.2 AA' },
              { icon: Mic, label: 'Voice Assistant' },
              { icon: Zap, label: 'Real-time AI' },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                role="listitem"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-muted-foreground"
              >
                <Icon className="h-3.5 w-3.5 text-primary-400" aria-hidden="true" />
                <span>{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Floating stats */}
      <motion.div
        className="grid grid-cols-3 gap-4 max-w-3xl mx-auto w-full px-4 pb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        role="complementary"
        aria-label="Platform scale statistics"
      >
        {FLOATING_STATS.map(({ label, value }) => (
          <div
            key={label}
            className="glass-card rounded-2xl p-4 text-center"
          >
            <p className="text-2xl font-display font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{label}</p>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
