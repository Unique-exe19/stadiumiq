import type { Metadata } from 'next';
import { HeroSection } from '@/components/home/hero-section';
import { StatsBar } from '@/components/home/stats-bar';
import { FeaturesGrid } from '@/components/home/features-grid';
import { AiDemoSection } from '@/components/home/ai-demo-section';
import { TestimonialsSection } from '@/components/home/testimonials-section';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'StadiumIQ – FIFA World Cup 2026 Smart Stadium Platform',
  description:
    'Experience FIFA World Cup 2026 like never before. Real-time AI navigation, crowd management, multilingual assistance, and accessibility-first design.',
};

export default async function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-hero overflow-hidden">
      <HeroSection />
      <StatsBar />
      <FeaturesGrid />
      <AiDemoSection />
      <TestimonialsSection />
    </main>
  );
}
