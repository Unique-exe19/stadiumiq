'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, AlertCircle, Info, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const DEMO_ALERTS = [
  {
    id: '1',
    type: 'overcrowding',
    severity: 'critical',
    zone: 'East Concourse – Level 2',
    message: 'Occupancy at 94%. Immediate intervention required.',
    aiSummary: 'AI predicts 800 additional fans in 8 minutes. Open Gate E2 overflow.',
    time: '2 min ago',
    isActive: true,
  },
  {
    id: '2',
    type: 'bottleneck',
    severity: 'warning',
    zone: 'Gate B – Main Entrance',
    message: 'Queue length 340m. Wait time 18 minutes.',
    aiSummary: 'Open auxiliary gate B3. Redirect from B1/B2.',
    time: '7 min ago',
    isActive: true,
  },
];

const SEVERITY_CONFIG = {
  critical: { icon: AlertTriangle, class: 'status-critical', label: 'Critical' },
  warning: { icon: AlertCircle, class: 'status-high', label: 'Warning' },
  info: { icon: Info, class: 'status-moderate', label: 'Info' },
};

export function ActiveAlertsCard() {
  return (
    <section
      className="glass-card rounded-2xl p-5"
      aria-labelledby="alerts-heading"
      aria-live="polite"
      aria-atomic="false"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 id="alerts-heading" className="font-display font-semibold text-foreground flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-red-400" aria-hidden="true" />
          Active Alerts
        </h2>
        <Badge className="status-critical text-xs px-2 py-0.5 rounded-full">
          {DEMO_ALERTS.length} active
        </Badge>
      </div>

      <ul className="space-y-3" role="list" aria-label="Active crowd alerts">
        {DEMO_ALERTS.map((alert) => {
          const config = SEVERITY_CONFIG[alert.severity as keyof typeof SEVERITY_CONFIG];
          const SeverityIcon = config.icon;

          return (
            <motion.li
              key={alert.id}
              className="rounded-xl border border-white/10 bg-white/3 p-3 hover:bg-white/5 transition-colors"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              aria-label={`${config.label} alert: ${alert.message}`}
            >
              <div className="flex items-start gap-3">
                <div className={`inline-flex p-1.5 rounded-lg ${config.class} flex-shrink-0 mt-0.5`}>
                  <SeverityIcon className="h-3.5 w-3.5" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="font-medium text-xs text-foreground truncate">{alert.zone}</p>
                    <div className="flex items-center gap-1 flex-shrink-0 text-muted-foreground text-xs">
                      <Clock className="h-3 w-3" aria-hidden="true" />
                      <time>{alert.time}</time>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{alert.message}</p>
                  <div className="bg-primary-500/10 border border-primary-500/20 rounded-lg p-2">
                    <p className="text-xs text-primary-300 font-medium">
                      🤖 AI: {alert.aiSummary}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  className="h-7 text-xs rounded-lg bg-primary-500/20 text-primary-300 hover:bg-primary-500/30 border border-primary-500/30"
                  aria-label={`Acknowledge ${config.label} alert for ${alert.zone}`}
                >
                  Acknowledge
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs rounded-lg text-muted-foreground hover:text-foreground"
                  aria-label={`Resolve ${config.label} alert for ${alert.zone}`}
                >
                  Resolve
                </Button>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
