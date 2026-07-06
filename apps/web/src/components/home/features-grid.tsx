'use client';

import { motion } from 'framer-motion';
import {
  Accessibility,
  Brain,
  Building2,
  Bus,
  Globe,
  Leaf,
  Map,
  ShieldCheck,
  Star,
  UserCheck,
  Users,
  Wifi,
} from 'lucide-react';

const FEATURES = [
  {
    icon: Map,
    title: 'AI Stadium Navigator',
    description:
      'Real-time indoor navigation with voice guidance, accessibility routes, and crowd-aware pathfinding.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    challenge: 'Stadium Navigation',
  },
  {
    icon: Users,
    title: 'Crowd Intelligence',
    description:
      'Live density heatmaps, predictive crowd modeling, and proactive congestion alerts.',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    challenge: 'Crowd Management',
  },
  {
    icon: Accessibility,
    title: 'Accessibility Concierge',
    description:
      'WCAG 2.2 AA compliant. Wheelchair routes, audio descriptions, sign language resources, and more.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    challenge: 'Accessibility',
  },
  {
    icon: Bus,
    title: 'Transport Orchestrator',
    description:
      'Live departures, AI-recommended routes, shuttle scheduling, and post-match surge management.',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    challenge: 'Public Transport',
  },
  {
    icon: Building2,
    title: 'Venue Ops Dashboard',
    description:
      'Unified command center for managers: occupancy, incidents, gate status, and AI decision support.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    challenge: 'Venue Operations',
  },
  {
    icon: UserCheck,
    title: 'Volunteer AI Hub',
    description:
      'AI-generated briefings, task assignments, shift management, and multilingual support for volunteers.',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
    challenge: 'Volunteers',
  },
  {
    icon: ShieldCheck,
    title: 'Security Intelligence',
    description:
      'Anomaly detection, threat level assessment, incident reporting, and AI-generated security briefings.',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    challenge: 'Security Teams',
  },
  {
    icon: Leaf,
    title: 'Sustainability Tracker',
    description:
      'Real-time energy, water, and waste monitoring with AI recommendations to reduce carbon footprint.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    challenge: 'Sustainability',
  },
  {
    icon: Globe,
    title: 'Multilingual AI',
    description:
      '50+ languages, RTL support, dialect awareness, and real-time translation powered by Gemini.',
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
    challenge: 'Multilingual',
  },
  {
    icon: Brain,
    title: 'AI Decision Support',
    description:
      'ReAct reasoning agents, RAG knowledge base, and natural language querying for operations staff.',
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/20',
    challenge: 'AI Decisions',
  },
  {
    icon: Star,
    title: 'Fan Experience',
    description:
      'Personalized recommendations, live match stats, seat navigation, food & beverage queues.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    challenge: 'Fan Experience',
  },
  {
    icon: Wifi,
    title: 'Offline PWA',
    description:
      'Works offline in poor connectivity. Service worker caches navigation maps and key information.',
    color: 'text-teal-400',
    bg: 'bg-teal-500/10',
    border: 'border-teal-500/20',
    challenge: 'Connectivity',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function FeaturesGrid() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8" aria-labelledby="features-heading">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.p
            className="text-primary-400 font-semibold text-sm uppercase tracking-widest mb-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Platform Capabilities
          </motion.p>
          <motion.h2
            id="features-heading"
            className="font-display text-fluid-xl font-bold text-foreground mb-4"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Every challenge. One platform.
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            StadiumIQ addresses all FIFA Smart Stadium challenge areas with production-grade AI
            solutions.
          </motion.p>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          role="list"
          aria-label="Platform features"
        >
          {FEATURES.map(({ icon: Icon, title, description, color, bg, border, challenge }) => (
            <motion.div
              key={title}
              variants={cardVariants}
              role="listitem"
              className={`glass-card rounded-2xl p-5 group hover:border-${color.split('-')[1]}-500/40 transition-all duration-300 focus-within:ring-2 focus-within:ring-primary-400`}
              tabIndex={0}
              aria-label={`${title}: ${challenge} challenge area`}
            >
              <div className={`inline-flex p-2.5 rounded-xl ${bg} ${border} border mb-4`}>
                <Icon className={`h-5 w-5 ${color}`} aria-hidden="true" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2 text-sm">{title}</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">{description}</p>
              <div className="mt-3 pt-3 border-t border-white/5">
                <span className={`text-xs font-medium ${color} opacity-70`}>✓ {challenge}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
