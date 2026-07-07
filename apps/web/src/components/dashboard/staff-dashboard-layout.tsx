'use client';

import { useState } from 'react';

import { motion } from 'framer-motion';
import { Activity, AlertTriangle, Bell, RefreshCw, Shield, TrendingUp, Users } from 'lucide-react';

import { ActiveAlertsCard } from '@/components/dashboard/active-alerts-card';
import { AiInsightsPanel } from '@/components/dashboard/ai-insights-panel';
import { CrowdHeatmapCard } from '@/components/dashboard/crowd-heatmap-card';
import { IncidentsFeed } from '@/components/dashboard/incidents-feed';
import { OccupancyMetricsCard } from '@/components/dashboard/occupancy-metrics-card';
import { TransportStatusCard } from '@/components/dashboard/transport-status-card';
import { NavigationBar } from '@/components/navigation/navigation-bar';
import { Button } from '@/components/ui/button';

const DEMO_METRICS = {
  totalOccupancy: 62840,
  capacity: 80000,
  occupancyPercent: 78.5,
  activeAlerts: 2,
  activeIncidents: 1,
  volunteersOnDuty: 1240,
  gatesOpen: 18,
  gateClosed: 2,
};

export function StaffDashboardLayout() {
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((r) => setTimeout(r, 800));
    setLastRefresh(new Date());
    setIsRefreshing(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavigationBar />

      <div className="flex-1 pt-24 px-4 sm:px-6 lg:px-8 pb-8 max-w-[1600px] mx-auto w-full">
        {/* Dashboard header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Venue Operations Center
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              FIFA WC 2026 · MetLife Stadium · Match Day 12
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => { void handleRefresh(); }}
              disabled={isRefreshing}
              className="border-white/15 text-muted-foreground hover:text-foreground rounded-xl"
              aria-label="Refresh dashboard data"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 mr-1.5 ${isRefreshing ? 'animate-spin' : ''}`}
                aria-hidden="true"
              />
              Refresh
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-9 h-9 rounded-xl relative"
              aria-label={`Notifications – ${DEMO_METRICS.activeAlerts} active alerts`}
            >
              <Bell className="h-4 w-4" aria-hidden="true" />
              {DEMO_METRICS.activeAlerts > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold"
                  aria-hidden="true"
                >
                  {DEMO_METRICS.activeAlerts}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* KPI metrics row */}
        <section aria-labelledby="kpi-heading">
          <h2 id="kpi-heading" className="sr-only">
            Key Performance Indicators
          </h2>
          <dl className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
            {[
              {
                label: 'Occupancy',
                value: `${DEMO_METRICS.occupancyPercent}%`,
                sub: `${DEMO_METRICS.totalOccupancy.toLocaleString()} / ${DEMO_METRICS.capacity.toLocaleString()}`,
                icon: Users,
                color: 'text-blue-400',
                status: 'moderate',
              },
              {
                label: 'Active Alerts',
                value: DEMO_METRICS.activeAlerts,
                sub: '1 critical, 1 warning',
                icon: AlertTriangle,
                color: 'text-orange-400',
                status: 'warning',
              },
              {
                label: 'Active Incidents',
                value: DEMO_METRICS.activeIncidents,
                sub: 'Medical – Section 204',
                icon: Activity,
                color: 'text-red-400',
                status: 'high',
              },
              {
                label: 'Volunteers On Duty',
                value: DEMO_METRICS.volunteersOnDuty.toLocaleString(),
                sub: 'Fully staffed',
                icon: Users,
                color: 'text-green-400',
                status: 'low',
              },
              {
                label: 'Gates Open',
                value: `${DEMO_METRICS.gatesOpen}/${DEMO_METRICS.gatesOpen + DEMO_METRICS.gateClosed}`,
                sub: '2 limited capacity',
                icon: Shield,
                color: 'text-cyan-400',
                status: 'low',
              },
              {
                label: 'Crowd Flow',
                value: '12.4/min',
                sub: 'Normal ingress rate',
                icon: TrendingUp,
                color: 'text-purple-400',
                status: 'low',
              },
            ].map(({ label, value, sub, icon: Icon, color }) => (
              <motion.div
                key={label}
                className="metric-card"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`h-4 w-4 ${color}`} aria-hidden="true" />
                </div>
                <dt className="text-xs text-muted-foreground">{label}</dt>
                <dd>
                  <p className={`text-xl font-display font-bold ${color} mt-0.5`}>{value}</p>
                  <p className="text-xs text-muted-foreground/70 mt-0.5">{sub}</p>
                </dd>
              </motion.div>
            ))}
          </dl>
        </section>

        {/* Main dashboard grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left: Heatmap */}
          <div className="lg:col-span-5">
            <CrowdHeatmapCard />
          </div>

          {/* Center: Metrics + Alerts */}
          <div className="lg:col-span-4 space-y-4">
            <OccupancyMetricsCard metrics={DEMO_METRICS} />
            <ActiveAlertsCard />
          </div>

          {/* Right: AI Insights */}
          <div className="lg:col-span-3 space-y-4">
            <AiInsightsPanel />
            <TransportStatusCard />
          </div>

          {/* Bottom: Incidents feed */}
          <div className="lg:col-span-12">
            <IncidentsFeed />
          </div>
        </div>
      </div>
    </div>
  );
}
