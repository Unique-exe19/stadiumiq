'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { NavigationBar } from '@/components/navigation/navigation-bar';
import {
  MapPin, Clock, Users, Utensils, Accessibility, Mic,
  ChevronRight, Navigation, Bus, Wifi, Zap, TrendingUp
} from 'lucide-react';

const QUICK_ACTIONS = [
  { icon: Navigation, label: 'Navigate', color: 'text-blue-600', bg: 'bg-blue-50', href: '#' },
  { icon: Utensils, label: 'Food', color: 'text-orange-600', bg: 'bg-orange-50', href: '#' },
  { icon: Accessibility, label: 'Access', color: 'text-green-600', bg: 'bg-green-50', href: '#' },
  { icon: Bus, label: 'Transport', color: 'text-purple-600', bg: 'bg-purple-50', href: '#' },
  { icon: Wifi, label: 'WiFi', color: 'text-cyan-600', bg: 'bg-cyan-50', href: '#' },
  { icon: Mic, label: 'AI Help', color: 'text-rose-600', bg: 'bg-rose-50', href: '#' },
];

const GATE_STATUS = [
  { gate: 'Gate A', status: 'Open', wait: '2 min', crowd: 'low' as const },
  { gate: 'Gate B', status: 'Open', wait: '8 min', crowd: 'moderate' as const },
  { gate: 'Gate C', status: 'Open', wait: '15 min', crowd: 'high' as const },
  { gate: 'Gate D', status: 'Closed', wait: '—', crowd: 'critical' as const },
];

const crowdColor = {
  low: 'bg-green-100 text-green-700',
  moderate: 'bg-amber-100 text-amber-700',
  high: 'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-600',
};

// Heatmap zones: [x, y, radius, baseIntensity, label, crowd]
type Zone = { x: number; y: number; r: number; base: number; label: string; crowd: 'low' | 'moderate' | 'high' | 'critical' };

const ZONES: Zone[] = [
  { x: 195, y: 42,  r: 28, base: 0.35, label: 'Gate A', crowd: 'moderate' },
  { x: 48,  y: 108, r: 30, base: 0.75, label: 'Gate B', crowd: 'high' },
  { x: 340, y: 108, r: 22, base: 0.25, label: 'Gate C', crowd: 'low' },
  { x: 195, y: 175, r: 24, base: 0.95, label: 'Gate D', crowd: 'critical' },
  { x: 130, y: 75,  r: 18, base: 0.5,  label: 'Concourse NW', crowd: 'moderate' },
  { x: 260, y: 75,  r: 18, base: 0.3,  label: 'Concourse NE', crowd: 'low' },
  { x: 100, y: 140, r: 20, base: 0.65, label: 'Concourse SW', crowd: 'high' },
  { x: 290, y: 140, r: 16, base: 0.2,  label: 'Concourse SE', crowd: 'low' },
  { x: 195, y: 108, r: 12, base: 0.15, label: 'Pitch', crowd: 'low' },
];

const heatColor = (intensity: number) => {
  if (intensity < 0.3) return '#22c55e';
  if (intensity < 0.55) return '#f59e0b';
  if (intensity < 0.8) return '#f97316';
  return '#ef4444';
};

function CrowdHeatmap() {
  const [intensities, setIntensities] = useState(ZONES.map(z => z.base));
  const [hovered, setHovered] = useState<number | null>(null);

  // Animate heatmap every 1.5s to simulate live data
  useEffect(() => {
    const id = setInterval(() => {
      setIntensities(prev =>
        prev.map((v) => {
          const delta = (Math.random() - 0.5) * 0.08;
          return Math.min(1, Math.max(0.05, v + delta));
        }),
      );
    }, 1500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative">
      <svg
        viewBox="0 0 390 220"
        className="w-full"
        style={{ height: 200 }}
        role="img"
        aria-label="Live crowd density heatmap of SoFi Stadium"
      >
        {/* Stadium outline */}
        <ellipse cx="195" cy="108" rx="165" ry="95" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />

        {/* Heatmap blobs (radial gradients per zone) */}
        <defs>
          {ZONES.map((_z, i) => (
            <radialGradient key={i} id={`hg-${i}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={heatColor(intensities[i] ?? 0)} stopOpacity={(intensities[i] ?? 0) * 0.75} />
              <stop offset="100%" stopColor={heatColor(intensities[i] ?? 0)} stopOpacity={0} />
            </radialGradient>
          ))}
        </defs>

        {ZONES.map((z, i) => (
          <ellipse
            key={i}
            cx={z.x} cy={z.y}
            rx={z.r + (hovered === i ? 6 : 0)}
            ry={(z.r * 0.65) + (hovered === i ? 4 : 0)}
            fill={`url(#hg-${i})`}
            className="cursor-pointer transition-all duration-700"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          />
        ))}

        {/* Pitch (green center) */}
        <ellipse cx="195" cy="108" rx="62" ry="36" fill="#dcfce7" stroke="#86efac" strokeWidth="1" />
        <ellipse cx="195" cy="108" rx="50" ry="28" fill="none" stroke="#4ade80" strokeWidth="0.8" strokeDasharray="4" />
        <circle cx="195" cy="108" r="9" fill="none" stroke="#4ade80" strokeWidth="0.8" />
        <line x1="195" y1="72" x2="195" y2="144" stroke="#4ade80" strokeWidth="0.6" strokeDasharray="3" />

        {/* Gate labels */}
        <text x="195" y="14" textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="600">Gate A</text>
        <text x="18"  y="113" textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="600">Gate B</text>
        <text x="372" y="113" textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="600">Gate C</text>
        <text x="195" y="210" textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="600">Gate D</text>

        {/* Your seat marker */}
        <circle cx="255" cy="82" r="6" fill="#1d4ed8" stroke="white" strokeWidth="1.5" />
        <text x="255" y="86" textAnchor="middle" fontSize="5.5" fontWeight="bold" fill="white">C42</text>

        {/* Hover tooltip */}
        {hovered !== null && (() => {
          const zone = ZONES[hovered];
          const intensity = intensities[hovered] ?? 0;
          if (!zone) return null;
          const tx = Math.min(zone.x - 30, 300);
          return (
            <g>
              <rect
                x={tx}
                y={zone.y - 28}
                width="78" height="22"
                rx="5"
                fill="white"
                stroke="#e2e8f0"
                strokeWidth="0.8"
                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
              />
              <text x={tx + 39} y={zone.y - 13} textAnchor="middle" fontSize="7" fill="#1e293b" fontWeight="600">
                {zone.label}
              </text>
              <text x={tx + 39} y={zone.y - 5} textAnchor="middle" fontSize="6.5" fill={heatColor(intensity)}>
                {Math.round(intensity * 100)}% density
              </text>
            </g>
          );
        })()}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-3 mt-2 px-1" aria-label="Heatmap legend">
        {(['Low', 'Moderate', 'High', 'Critical'] as const).map((lvl, i) => {
          const colors = ['bg-green-400', 'bg-amber-400', 'bg-orange-400', 'bg-red-400'];
          return (
            <div key={lvl} className="flex items-center gap-1">
              <span className={`w-2.5 h-2.5 rounded-full ${colors[i]}`} aria-hidden="true" />
              <span className="text-[10px] text-slate-500">{lvl}</span>
            </div>
          );
        })}
        <div className="ml-auto flex items-center gap-1 text-[10px] text-slate-400">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" aria-hidden="true" />
          Live · updates every 1.5s
        </div>
      </div>
    </div>
  );
}

export default function FanPortalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <NavigationBar />

      <main className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto" id="main-content">
        {/* Header */}
        <div className="pt-8 pb-6">
          <span className="section-tag">Fan Portal</span>
          <h1 className="text-3xl font-display font-bold text-slate-900 mt-3 mb-1">
            Your Match Day Hub
          </h1>
          <p className="text-slate-500 text-sm">
            FIFA World Cup 2026 · SoFi Stadium, Los Angeles ·{' '}
            <span className="font-medium text-slate-700">Today 19:00 PT</span>
          </p>
        </div>

        {/* Match info banner */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-5 mb-6 text-white flex items-center justify-between shadow-card">
          <div>
            <div className="text-xs font-medium text-primary-200 mb-1 uppercase tracking-wide">Match Day · Group Stage A</div>
            <div className="flex items-center gap-3 text-xl font-display font-bold">
              <span>🇧🇷 Brazil</span>
              <span className="text-3xl font-black text-amber-300">vs</span>
              <span>🇩🇪 Germany</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-primary-200 text-sm">
              <Clock className="h-3.5 w-3.5" />
              <span>Kickoff in 2h 15m</span>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-xs text-primary-200 mb-1">Your Seat</div>
            <div className="text-2xl font-display font-bold">C · 42</div>
            <div className="text-xs text-primary-200">Section 12 · Row C</div>
          </div>
        </div>

        {/* Quick Actions */}
        <section aria-labelledby="quick-actions-heading" className="mb-8">
          <h2 id="quick-actions-heading" className="text-base font-semibold text-slate-700 mb-3">Quick Actions</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {QUICK_ACTIONS.map(({ icon: Icon, label, color, bg, href }) => (
              <Link
                key={label}
                href={href}
                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white border border-slate-100 shadow-soft hover:shadow-card hover:border-slate-200 transition-all group"
                aria-label={label}
              >
                <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform`}>
                  <Icon className={`h-5 w-5 ${color}`} aria-hidden="true" />
                </div>
                <span className="text-[11px] font-medium text-slate-600 text-center leading-tight">{label}</span>
              </Link>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Crowd Heatmap ─── */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-soft p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-orange-500" />
                Live Crowd Heatmap
              </h2>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" aria-hidden="true" />
                <span className="text-xs text-slate-400 font-medium">LIVE</span>
                <Link href="#" className="ml-2 text-xs text-primary-600 font-medium hover:underline flex items-center gap-1">
                  Full view <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
            <CrowdHeatmap />
          </div>

          {/* Gate Status */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-5">
            <h2 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Users className="h-4 w-4 text-slate-500" />
              Gate Status
            </h2>
            <ul className="space-y-2.5" role="list">
              {GATE_STATUS.map((g) => (
                <li key={g.gate} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div>
                    <div className="text-sm font-medium text-slate-800">{g.gate}</div>
                    <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <Clock className="h-3 w-3" /> {g.wait} wait
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${crowdColor[g.crowd]}`}>
                    {g.status === 'Closed' ? 'Closed' : g.crowd.charAt(0).toUpperCase() + g.crowd.slice(1)}
                  </span>
                </li>
              ))}
            </ul>

            {/* AI tip */}
            <div className="mt-4 p-3 rounded-xl bg-blue-50 border border-blue-100">
              <div className="flex items-center gap-1.5 mb-1">
                <Zap className="h-3.5 w-3.5 text-blue-600" />
                <span className="text-xs font-semibold text-blue-800">AI Tip</span>
              </div>
              <p className="text-xs text-blue-700">
                Gate C is least crowded. Save 13 minutes — head there now!
              </p>
            </div>
          </div>
        </div>

        {/* Your seat navigator */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-soft p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <MapPin className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Your Seat: Section 12 · Row C · Seat 42</p>
              <p className="text-xs text-slate-500 mt-0.5">Enter Gate C → Elevator 2 → Level 3 → Follow signs</p>
            </div>
            <Link href="#" className="ml-auto px-3 py-1.5 text-xs font-semibold text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors whitespace-nowrap">Navigate</Link>
          </div>

          {/* AI Assistant prompt */}
          <div className="flex-1 bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-100 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Mic className="h-4 w-4 text-primary-600" />
                <span className="text-sm font-semibold text-primary-800">AI Assistant</span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Online</span>
              </div>
              <p className="text-xs text-slate-600">Navigation, food, transport, accessibility…</p>
            </div>
            <Link
              href="/#ai-demo"
              className="px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-xl transition-colors ml-4 whitespace-nowrap"
            >
              Ask AI
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
