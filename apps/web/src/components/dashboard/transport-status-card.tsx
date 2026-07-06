'use client';

import { ArrowRight, Bus, Clock, Train } from 'lucide-react';

import { Badge } from '@/components/ui/badge';

const DEPARTURES = [
  {
    id: '1',
    line: 'Metro Line 7',
    mode: 'metro',
    destination: 'City Center',
    time: '21:45',
    status: 'on_time',
    crowd: 'low',
  },
  {
    id: '2',
    line: 'Shuttle A',
    mode: 'shuttle',
    destination: 'North Hotels',
    time: '21:48',
    status: 'on_time',
    crowd: 'moderate',
  },
  {
    id: '3',
    line: 'Bus 42X',
    mode: 'bus',
    destination: 'Airport',
    time: '21:55',
    status: 'delayed',
    crowd: 'high',
  },
];

const STATUS_CONFIG = {
  on_time: { label: 'On Time', class: 'bg-green-500/15 text-green-400 border-green-500/25' },
  delayed: { label: 'Delayed', class: 'bg-red-500/15 text-red-400 border-red-500/25' },
  cancelled: { label: 'Cancelled', class: 'bg-gray-500/15 text-gray-400 border-gray-500/25' },
};

export function TransportStatusCard() {
  return (
    <section className="glass-card rounded-2xl p-5" aria-labelledby="transport-heading">
      <h2
        id="transport-heading"
        className="font-display font-semibold text-foreground flex items-center gap-2 mb-4"
      >
        <Bus className="h-4 w-4 text-green-400" aria-hidden="true" />
        Transport Status
      </h2>

      <ul className="space-y-2" role="list" aria-label="Upcoming departures">
        {DEPARTURES.map((dep) => {
          const status = STATUS_CONFIG[dep.status as keyof typeof STATUS_CONFIG];
          return (
            <li
              key={dep.id}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-white/3 border border-white/8"
              aria-label={`${dep.line} to ${dep.destination} at ${dep.time} — ${status.label}`}
            >
              {dep.mode === 'metro' ? (
                <Train className="h-4 w-4 text-blue-400 flex-shrink-0" aria-hidden="true" />
              ) : (
                <Bus className="h-4 w-4 text-green-400 flex-shrink-0" aria-hidden="true" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{dep.line}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  {dep.destination}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs font-mono font-bold text-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                  {dep.time}
                </p>
                <Badge
                  className={`text-[10px] px-1.5 py-0 rounded-md border ${status.class} mt-0.5`}
                >
                  {status.label}
                </Badge>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
