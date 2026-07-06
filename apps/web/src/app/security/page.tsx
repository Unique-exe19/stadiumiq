import type { Metadata } from 'next';

import {
  Activity,
  AlertTriangle,
  Camera,
  CheckCircle,
  Clock,
  MapPin,
  PhoneCall,
  Radio,
  Shield,
  Users,
} from 'lucide-react';

import { NavigationBar } from '@/components/navigation/navigation-bar';

export const metadata: Metadata = {
  title: 'Security Portal – StadiumIQ',
  description: 'Real-time security operations center for FIFA World Cup 2026.',
};

const ALERTS = [
  {
    id: 'A001',
    type: 'Crowd Surge',
    zone: 'Gate B – Concourse 3',
    level: 'high',
    time: '2 min ago',
    assigned: 'Team Alpha',
  },
  {
    id: 'A002',
    type: 'Lost Child',
    zone: 'Section 14 – Row F',
    level: 'moderate',
    time: '5 min ago',
    assigned: 'Team Beta',
  },
  {
    id: 'A003',
    type: 'Medical Assist',
    zone: 'VIP Box 4',
    level: 'high',
    time: '8 min ago',
    assigned: 'Medics',
  },
  {
    id: 'A004',
    type: 'Unauthorized Access',
    zone: 'Press Area – Door 7',
    level: 'critical',
    time: '12 min ago',
    assigned: 'Team Alpha',
  },
];

const CAMERAS = [
  { id: 'CAM-01', location: 'Gate A – Entry', status: 'live' },
  { id: 'CAM-02', location: 'Gate B – Concourse', status: 'alert' },
  { id: 'CAM-03', location: 'Pitch Perimeter N', status: 'live' },
  { id: 'CAM-04', location: 'VIP Entrance', status: 'live' },
  { id: 'CAM-05', location: 'Parking Lot A', status: 'offline' },
  { id: 'CAM-06', location: 'Press Area', status: 'alert' },
];

const levelColor = {
  low: 'bg-green-100 text-green-700 border-green-200',
  moderate: 'bg-amber-100 text-amber-700 border-amber-200',
  high: 'bg-orange-100 text-orange-700 border-orange-200',
  critical: 'bg-red-100 text-red-700 border-red-200',
} as const;

const cameraStatusColor = {
  live: { dot: 'bg-green-500', label: 'LIVE', text: 'text-green-700' },
  alert: { dot: 'bg-red-500 animate-pulse', label: 'ALERT', text: 'text-red-700' },
  offline: { dot: 'bg-slate-400', label: 'OFFLINE', text: 'text-slate-500' },
} as const;

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <NavigationBar />

      <main className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto" id="main-content">
        {/* Header */}
        <div className="pt-8 pb-6">
          <span className="section-tag">
            <Shield className="h-3.5 w-3.5" />
            Security Operations
          </span>
          <h1 className="text-3xl font-display font-bold text-slate-900 mt-3 mb-1">
            Security Control Center
          </h1>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              All systems operational
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> Live – 19:32 PT
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> SoFi Stadium
            </span>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: 'Active Alerts',
              value: '4',
              icon: AlertTriangle,
              color: 'text-orange-600',
              bg: 'bg-orange-50',
            },
            {
              label: 'Officers On-site',
              value: '128',
              icon: Users,
              color: 'text-blue-600',
              bg: 'bg-blue-50',
            },
            {
              label: 'Cameras Online',
              value: '42/48',
              icon: Camera,
              color: 'text-green-600',
              bg: 'bg-green-50',
            },
            {
              label: 'Incidents Resolved',
              value: '17',
              icon: CheckCircle,
              color: 'text-violet-600',
              bg: 'bg-violet-50',
            },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div
              key={label}
              className="bg-white rounded-2xl border border-slate-100 shadow-soft p-4 flex items-center gap-3"
            >
              <div
                className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}
              >
                <Icon className={`h-5 w-5 ${color}`} aria-hidden="true" />
              </div>
              <div>
                <div className="text-xl font-display font-bold text-slate-900">{value}</div>
                <div className="text-xs text-slate-500">{label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Alerts */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-soft p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Activity className="h-4 w-4 text-red-500" />
                Active Alerts
              </h2>
              <span className="text-xs bg-red-50 text-red-600 border border-red-100 px-2.5 py-1 rounded-full font-semibold">
                {ALERTS.length} Active
              </span>
            </div>
            <ul className="space-y-3" role="list" aria-label="Active security alerts">
              {ALERTS.map((alert) => (
                <li
                  key={alert.id}
                  className={`rounded-xl border p-4 ${levelColor[alert.level as keyof typeof levelColor]}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold opacity-70">{alert.id}</span>
                        <span className="text-sm font-semibold">{alert.type}</span>
                      </div>
                      <div className="text-xs opacity-80 flex items-center gap-1 mb-1">
                        <MapPin className="h-3 w-3" /> {alert.zone}
                      </div>
                      <div className="text-xs opacity-70 flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {alert.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <Radio className="h-3 w-3" />
                          {alert.assigned}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <button className="px-2.5 py-1 rounded-lg bg-white/60 hover:bg-white/90 border border-current/20 text-xs font-medium transition-colors flex items-center gap-1">
                        <PhoneCall className="h-3 w-3" /> Dispatch
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Camera Grid */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-5">
            <h2 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Camera className="h-4 w-4 text-slate-500" />
              Camera Feeds
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {CAMERAS.map((cam) => {
                const s = cameraStatusColor[cam.status as keyof typeof cameraStatusColor];
                return (
                  <div
                    key={cam.id}
                    className="rounded-xl overflow-hidden border border-slate-100 cursor-pointer hover:border-primary-200 hover:shadow-soft transition-all"
                  >
                    {/* Mock camera feed */}
                    <div className="relative bg-slate-800 h-16 flex items-center justify-center">
                      <Camera className="h-5 w-5 text-slate-500" aria-hidden="true" />
                      <div
                        className={`absolute top-1.5 right-1.5 flex items-center gap-1 bg-black/60 rounded px-1.5 py-0.5`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                        <span className={`text-[9px] font-bold ${s.text}`}>{s.label}</span>
                      </div>
                    </div>
                    <div className="p-2">
                      <div className="text-[10px] font-mono text-slate-400">{cam.id}</div>
                      <div className="text-[11px] text-slate-700 font-medium leading-tight">
                        {cam.location}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
