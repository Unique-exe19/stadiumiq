'use client';

import { Award, BarChart, Leaf, ShieldCheck, Trash2, Zap } from 'lucide-react';

import { NavigationBar } from '@/components/navigation/navigation-bar';

const METRICS = [
  {
    label: 'Energy Savings',
    value: '18%',
    desc: 'Relative to baseline match day',
    icon: Zap,
    color: 'text-amber-500',
    bg: 'bg-amber-50',
  },
  {
    label: 'Waste Diverted',
    value: '82%',
    desc: 'Recycled/composted today',
    icon: Trash2,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
  },
  {
    label: 'Carbon Offset',
    value: '1.2t',
    desc: 'Equivalent metric tons CO2',
    icon: Leaf,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
  },
];

export default function SustainabilityPortalPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <NavigationBar />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto" id="main-content">
        <div className="pt-6 pb-6">
          <span className="section-tag bg-emerald-100 text-emerald-700">Sustainability Hub</span>
          <h1 className="text-3xl font-display font-bold text-slate-900 mt-3 mb-1">
            Stadium Sustainability Hub
          </h1>
          <p className="text-slate-500 text-sm">
            Real-time green energy, resource efficiency metrics, and carbon tracking.
          </p>
        </div>

        {/* Highlight Card */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 text-white shadow-card mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Award className="h-5 w-5 text-emerald-200" />
            <span className="text-xs font-semibold text-emerald-200 uppercase tracking-wider">
              Milestone Achieved
            </span>
          </div>
          <h2 className="text-xl font-bold">Gold Certified Smart Venue</h2>
          <p className="text-xs text-emerald-100 mt-1 max-w-xl">
            MetLife / SoFi Stadium is currently operating on 94% renewable energy today. Thanks to
            our AI-optimized HVAC controls, we saved 12MWh of power.
          </p>
        </div>

        {/* 3 Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {METRICS.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.label}
                className="bg-white rounded-2xl border border-slate-100 shadow-soft p-5 flex items-start gap-4"
              >
                <div className={`p-3 rounded-xl ${m.color} ${m.bg}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-slate-400">{m.label}</h3>
                  <div className="text-2xl font-bold text-slate-800 mt-1">{m.value}</div>
                  <p className="text-[10px] text-slate-500 mt-1">{m.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Details Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-5">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
              <BarChart className="h-4 w-4 text-emerald-500" />
              Green Energy Metrics
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                  <span>Solar Array Output</span>
                  <span>420 kW</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '85%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                  <span>HVAC Optimization Savings</span>
                  <span>1.2 MW</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '92%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                  <span>Smart Lighting Reduction</span>
                  <span>180 kW</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '65%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-5">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
              <ShieldCheck className="h-4 w-4 text-green-500" />
              Waste Audit Logs
            </h3>
            <ul className="space-y-3" role="list">
              <li className="flex items-start justify-between py-2 border-b border-slate-50 last:border-0">
                <div>
                  <h4 className="text-xs font-semibold text-slate-700">East Concourse Bin Audit</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Correct sorting level: 94%</p>
                </div>
                <span className="text-[10px] bg-green-50 text-green-600 font-semibold px-2 py-0.5 rounded-full">
                  Pass
                </span>
              </li>
              <li className="flex items-start justify-between py-2 border-b border-slate-50 last:border-0">
                <div>
                  <h4 className="text-xs font-semibold text-slate-700">South Stand Recycle Load</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Correct sorting level: 88%</p>
                </div>
                <span className="text-[10px] bg-green-50 text-green-600 font-semibold px-2 py-0.5 rounded-full">
                  Pass
                </span>
              </li>
              <li className="flex items-start justify-between py-2 border-b border-slate-50 last:border-0">
                <div>
                  <h4 className="text-xs font-semibold text-slate-700">West Wing Concourse</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Correct sorting level: 75%</p>
                </div>
                <span className="text-[10px] bg-amber-50 text-amber-600 font-semibold px-2 py-0.5 rounded-full">
                  Needs Audit
                </span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
