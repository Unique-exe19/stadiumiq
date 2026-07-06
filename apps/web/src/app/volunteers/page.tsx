import type { Metadata } from 'next';

import {
  CheckCircle2,
  Circle,
  Clock,
  Languages,
  MapPin,
  MessageSquare,
  Star,
  Users,
  Zap,
} from 'lucide-react';

import { NavigationBar } from '@/components/navigation/navigation-bar';

export const metadata: Metadata = {
  title: 'Volunteers Portal – StadiumIQ',
  description: 'Volunteer management and coordination center for FIFA World Cup 2026.',
};

const TASKS = [
  {
    id: 1,
    task: 'Guide fans from Gate A to Section 10–20',
    zone: 'Gate A',
    priority: 'high',
    done: false,
  },
  {
    id: 2,
    task: 'Assist wheelchair users to accessible seating',
    zone: 'Concourse B',
    priority: 'high',
    done: false,
  },
  {
    id: 3,
    task: 'Hand out stadium maps at Gate C',
    zone: 'Gate C',
    priority: 'normal',
    done: true,
  },
  {
    id: 4,
    task: 'Report any blocked emergency exits',
    zone: 'All areas',
    priority: 'high',
    done: true,
  },
  {
    id: 5,
    task: 'Multilingual help at main info desk',
    zone: 'Main Lobby',
    priority: 'normal',
    done: false,
  },
];

const MESSAGES = [
  {
    from: 'HQ',
    time: '10 min ago',
    text: 'Please move to Concourse B — fan surge expected at 19:00.',
  },
  {
    from: 'Team Lead Maria',
    time: '25 min ago',
    text: 'Great job everyone! Crowd flow much better than last match.',
  },
  {
    from: 'HQ',
    time: '1h ago',
    text: 'Reminder: Arabic translation support needed at info desk until 20:00.',
  },
];

const LANGUAGES = ['English', 'Spanish', 'Arabic', 'French', 'Portuguese', 'German'];

export default function VolunteersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <NavigationBar />

      <main className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto" id="main-content">
        {/* Header */}
        <div className="pt-8 pb-6">
          <span className="section-tag">
            <Users className="h-3.5 w-3.5" />
            Volunteers Hub
          </span>
          <h1 className="text-3xl font-display font-bold text-slate-900 mt-3 mb-1">
            Volunteer Coordination
          </h1>
          <p className="text-slate-500 text-sm">
            FIFA World Cup 2026 · SoFi Stadium ·
            <span className="ml-1.5 inline-flex items-center gap-1 text-green-600 font-medium">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              Active Shift
            </span>
          </p>
        </div>

        {/* Volunteer profile card */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-5 mb-6 text-white flex items-center justify-between shadow-card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-xl font-bold">
              JS
            </div>
            <div>
              <div className="font-display font-bold text-lg">Jordan S.</div>
              <div className="text-primary-200 text-sm">Zone Lead · Gate A &amp; B</div>
              <div className="flex items-center gap-1 mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-accent-300 text-accent-300" />
                ))}
                <span className="text-xs text-primary-200 ml-1">5.0 rating</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-display font-bold">6h 20m</div>
            <div className="text-primary-200 text-xs">Shift Duration</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Task List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-500" />
                  Today's Assignments
                </h2>
                <span className="text-xs text-slate-400">
                  {TASKS.filter((t) => t.done).length}/{TASKS.length} done
                </span>
              </div>
              <ul className="space-y-2.5" role="list" aria-label="Today's volunteer assignments">
                {TASKS.map((t) => (
                  <li
                    key={t.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${
                      t.done
                        ? 'bg-slate-50 border-slate-100'
                        : t.priority === 'high'
                          ? 'bg-orange-50 border-orange-100'
                          : 'bg-white border-slate-100'
                    }`}
                  >
                    {t.done ? (
                      <CheckCircle2
                        className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                    ) : (
                      <Circle
                        className="h-5 w-5 text-slate-300 flex-shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium ${t.done ? 'line-through text-slate-400' : 'text-slate-800'}`}
                      >
                        {t.task}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {t.zone}
                        </span>
                        {t.priority === 'high' && !t.done && (
                          <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded-full">
                            Priority
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Message Board */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-5">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2 mb-4">
                <MessageSquare className="h-4 w-4 text-primary-500" />
                Team Messages
              </h2>
              <ul className="space-y-3" role="list">
                {MESSAGES.map((msg, i) => (
                  <li
                    key={i}
                    className="flex gap-3 pb-3 border-b border-slate-50 last:border-0 last:pb-0"
                  >
                    <div className="w-8 h-8 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {msg.from === 'HQ' ? 'HQ' : (msg.from.split(' ')[1]?.[0] ?? msg.from[0])}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-semibold text-slate-800">{msg.from}</span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {msg.time}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">{msg.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Translation Widget */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-5">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2 mb-4">
                <Languages className="h-4 w-4 text-violet-500" />
                Translation Help
              </h2>
              <p className="text-xs text-slate-500 mb-3">Your active languages:</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {LANGUAGES.map((lang) => (
                  <span
                    key={lang}
                    className="px-2.5 py-1 rounded-full text-xs font-medium bg-violet-50 text-violet-700 border border-violet-100"
                  >
                    {lang}
                  </span>
                ))}
              </div>
              <button className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-colors">
                Open Translator
              </button>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-5">
              <h2 className="text-base font-semibold text-slate-900 mb-4">Your Stats Today</h2>
              <ul className="space-y-3">
                {[
                  { label: 'Fans Assisted', value: '84' },
                  { label: 'Queries Resolved', value: '31' },
                  { label: 'Zones Covered', value: '3' },
                ].map(({ label, value }) => (
                  <li key={label} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">{label}</span>
                    <span className="text-sm font-bold text-slate-900">{value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
