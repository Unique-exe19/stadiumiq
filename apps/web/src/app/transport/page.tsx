'use client';

import { useState } from 'react';

import { Bus, Check, Clock, Info, MapPin, Shield, Train } from 'lucide-react';

import { NavigationBar } from '@/components/navigation/navigation-bar';

const SCHEDULES = [
  {
    id: 'm1',
    route: 'Line 1 (Metro Link)',
    destination: 'Downtown LA',
    time: '5 min',
    status: 'On Time',
    mode: 'metro',
  },
  {
    id: 'm2',
    route: 'Line 2 (Metro Link)',
    destination: 'Santa Monica',
    time: '12 min',
    status: 'Delayed (3 min)',
    mode: 'metro',
  },
  {
    id: 'b1',
    route: 'Shuttle A (Express)',
    destination: 'Stadium Park & Ride',
    time: '2 min',
    status: 'On Time',
    mode: 'bus',
  },
  {
    id: 'b2',
    route: 'Shuttle B (Accessibility)',
    destination: 'West ADA Parking',
    time: '8 min',
    status: 'On Time',
    mode: 'bus',
  },
  {
    id: 'b3',
    route: 'Bus 104 (Local)',
    destination: 'Union Station',
    time: '15 min',
    status: 'On Time',
    mode: 'bus',
  },
];

export default function TransportAdvisorPage() {
  const [selectedMode, setSelectedMode] = useState<'all' | 'metro' | 'bus'>('all');

  const filteredSchedules = SCHEDULES.filter(
    (s) => selectedMode === 'all' || s.mode === selectedMode,
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <NavigationBar />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto" id="main-content">
        <div className="pt-6 pb-6">
          <span className="section-tag bg-purple-100 text-purple-700">Transport Hub</span>
          <h1 className="text-3xl font-display font-bold text-slate-900 mt-3 mb-1">
            Stadium Transit & Schedules
          </h1>
          <p className="text-slate-500 text-sm">
            Live updates and AI departure recommendations for MetLife / SoFi Stadium.
          </p>
        </div>

        {/* AI Recommendation Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl p-5 mb-6 text-white shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-purple-200" />
              <span className="text-xs font-semibold text-purple-200 uppercase tracking-wider">
                AI Recommendation
              </span>
            </div>
            <h2 className="text-lg font-bold">Post-Match Transit Plan</h2>
            <p className="text-xs text-purple-100 mt-1 max-w-xl">
              Post-match congestion will peak 15 mins after full-time. We recommend taking Shuttle A
              in 5 mins or waiting for the 20:30 metro departure.
            </p>
          </div>
          <button className="px-4 py-2 bg-white text-purple-700 hover:bg-purple-50 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap">
            Personalize Plan
          </button>
        </div>

        {/* Filter Tab bar */}
        <div className="flex gap-2 mb-4">
          {(['all', 'metro', 'bus'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setSelectedMode(mode)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
                selectedMode === mode
                  ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>

        {/* Schedules Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-soft overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase">Upcoming Departures</span>
            <span className="flex items-center gap-1.5 text-xs text-green-600 font-semibold">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Live
            </span>
          </div>

          <ul className="divide-y divide-slate-100" role="list">
            {filteredSchedules.map((s) => (
              <li
                key={s.id}
                className="p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-2.5 rounded-xl ${s.mode === 'metro' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}
                  >
                    {s.mode === 'metro' ? (
                      <Train className="h-5 w-5" />
                    ) : (
                      <Bus className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">{s.route}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">To {s.destination}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-800">{s.time}</div>
                  <div className="flex items-center gap-1 mt-1 justify-end">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${s.status.includes('Delayed') ? 'bg-amber-500' : 'bg-green-500'}`}
                    />
                    <span
                      className={`text-[10px] font-semibold ${s.status.includes('Delayed') ? 'text-amber-600' : 'text-green-600'}`}
                    >
                      {s.status}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Transport Advisory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-5">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
              <MapPin className="h-4 w-4 text-primary-500" />
              Transit Zone Map
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              All Metrolink trains depart from Metrolink North Station. Accessible shuttle buses
              depart from Gate B bus parking.
            </p>
            <div className="aspect-video bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200/50">
              <span className="text-xs text-slate-400 font-semibold">Map Loading...</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-5">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
              <Shield className="h-4 w-4 text-green-500" />
              Accessibility Services
            </h3>
            <ul className="space-y-3" role="list">
              <li className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-xs text-slate-600">
                  All Shuttle B vehicles are equipped with wheelchair boarding ramps.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-xs text-slate-600">
                  Assistance officers are deployed at all main transit zones.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <span className="text-xs text-slate-600 font-medium">
                  Have special requests? Ask the AI Assistant on the Fan Portal.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
