'use client';

import { Activity, Clock, MapPin, User } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const INCIDENTS = [
  {
    id: '1',
    type: 'medical',
    priority: 'high',
    title: 'Medical Assistance Required',
    location: 'Section 204, Row G',
    reportedBy: 'Volunteer #V-0892',
    time: '21:37',
    status: 'responding',
    aiSummary: 'Fan reported chest pain. Medical team dispatched. ETA 2 minutes.',
  },
  {
    id: '2',
    type: 'lost_person',
    priority: 'medium',
    title: 'Lost Child – 8 years old',
    location: 'Food Court Level 2',
    reportedBy: 'Staff #S-0124',
    time: '21:41',
    status: 'acknowledged',
    aiSummary: 'Child description logged. Announcement broadcast. Parents located at Gate A.',
  },
];

const PRIORITY_CONFIG = {
  critical: { class: 'bg-red-500/15 text-red-400 border-red-500/25' },
  high: { class: 'bg-orange-500/15 text-orange-400 border-orange-500/25' },
  medium: { class: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/25' },
  low: { class: 'bg-green-500/15 text-green-400 border-green-500/25' },
};

const STATUS_LABELS: Record<string, string> = {
  reported: 'Reported',
  acknowledged: 'Acknowledged',
  responding: 'Responding',
  resolved: 'Resolved',
};

export function IncidentsFeed() {
  return (
    <section
      className="glass-card rounded-2xl p-5"
      aria-labelledby="incidents-heading"
      aria-live="polite"
    >
      <div className="flex items-center justify-between mb-4">
        <h2
          id="incidents-heading"
          className="font-display font-semibold text-foreground flex items-center gap-2"
        >
          <Activity className="h-4 w-4 text-red-400" aria-hidden="true" />
          Active Incidents
        </h2>
        <Button
          size="sm"
          className="h-7 text-xs bg-primary-500/15 text-primary-300 border border-primary-500/25 hover:bg-primary-500/25 rounded-xl"
          aria-label="Report a new incident"
        >
          + Report Incident
        </Button>
      </div>

      <ul className="space-y-3" role="list" aria-label="Active incidents list">
        {INCIDENTS.map((incident) => (
          <li
            key={incident.id}
            className="rounded-xl border border-white/10 bg-white/3 p-4"
            aria-label={`${incident.priority} priority: ${incident.title}`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-3">
              <div className="flex-1">
                <div className="flex items-center flex-wrap gap-2 mb-2">
                  <h3 className="font-medium text-sm text-foreground">{incident.title}</h3>
                  <Badge
                    className={`text-[10px] px-2 py-0 rounded-full border capitalize ${
                      PRIORITY_CONFIG[incident.priority as keyof typeof PRIORITY_CONFIG].class
                    }`}
                  >
                    {incident.priority}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                    {STATUS_LABELS[incident.status] ?? incident.status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" aria-hidden="true" />
                    {incident.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" aria-hidden="true" />
                    {incident.reportedBy}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" aria-hidden="true" />
                    <time>{incident.time}</time>
                  </span>
                </div>

                <div className="bg-primary-500/8 border border-primary-500/15 rounded-lg p-2.5">
                  <p className="text-xs text-primary-200">
                    <span className="font-semibold">AI:</span> {incident.aiSummary}
                  </p>
                </div>
              </div>

              <div className="flex sm:flex-col gap-2 flex-shrink-0">
                <Button
                  size="sm"
                  className="h-7 text-xs rounded-xl bg-primary-500/20 text-primary-300 border border-primary-500/30 hover:bg-primary-500/30"
                  aria-label={`View details for incident: ${incident.title}`}
                >
                  View
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs rounded-xl text-green-400 hover:bg-green-500/10"
                  aria-label={`Resolve incident: ${incident.title}`}
                >
                  Resolve
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
