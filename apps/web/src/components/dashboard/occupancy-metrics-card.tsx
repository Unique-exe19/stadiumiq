'use client';

import { RadialBarChart, RadialBar, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';

const ZONE_DATA = [
  { name: 'North Stand', occupancy: 88, capacity: 20000 },
  { name: 'South Stand', occupancy: 72, capacity: 20000 },
  { name: 'East Wing', occupancy: 94, capacity: 18000 },
  { name: 'West Wing', occupancy: 65, capacity: 18000 },
  { name: 'VIP Level', occupancy: 45, capacity: 4000 },
];

const getBarColor = (pct: number) => {
  if (pct >= 90) return 'hsl(0 84% 60%)';
  if (pct >= 75) return 'hsl(30 90% 55%)';
  if (pct >= 50) return 'hsl(38 92% 50%)';
  return 'hsl(142 72% 45%)';
};

interface OccupancyMetricsCardProps {
  metrics: {
    totalOccupancy: number;
    capacity: number;
    occupancyPercent: number;
  };
}

export function OccupancyMetricsCard({ metrics }: OccupancyMetricsCardProps) {
  return (
    <section
      className="glass-card rounded-2xl p-5"
      aria-labelledby="occupancy-heading"
    >
      <h2 id="occupancy-heading" className="font-display font-semibold text-foreground mb-4">
        Zone Occupancy
      </h2>

      {/* Overall gauge */}
      <div className="flex items-center gap-4 mb-5 p-3 rounded-xl bg-white/3 border border-white/10">
        <div aria-hidden="true" className="w-16 h-16">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="90%"
              data={[{ value: metrics.occupancyPercent, fill: getBarColor(metrics.occupancyPercent) }]}
              startAngle={180}
              endAngle={0}
            >
              <RadialBar dataKey="value" cornerRadius={4} />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
        <div>
          <p className="text-2xl font-display font-bold text-foreground">
            {metrics.occupancyPercent.toFixed(1)}%
          </p>
          <p className="text-xs text-muted-foreground">
            {metrics.totalOccupancy.toLocaleString()} / {metrics.capacity.toLocaleString()}
          </p>
          <p
            className={`text-xs font-medium mt-1 ${
              metrics.occupancyPercent >= 90 ? 'text-red-400' :
              metrics.occupancyPercent >= 75 ? 'text-orange-400' : 'text-green-400'
            }`}
            role="status"
            aria-label={`Stadium status: ${metrics.occupancyPercent >= 90 ? 'Critical' : metrics.occupancyPercent >= 75 ? 'High' : 'Normal'}`}
          >
            {metrics.occupancyPercent >= 90 ? '⚠ Critical' :
             metrics.occupancyPercent >= 75 ? '● High' : '✓ Normal'}
          </p>
        </div>
      </div>

      {/* Zone breakdown */}
      <div
        aria-label="Zone occupancy breakdown"
        aria-hidden="true"
        style={{ height: 140 }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ZONE_DATA} layout="vertical" margin={{ left: 0, right: 16 }}>
            <XAxis type="number" domain={[0, 100]} tick={false} axisLine={false} />
            <YAxis
              type="category"
              dataKey="name"
              width={80}
              tick={{ fill: 'hsl(220 10% 60%)', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: 'hsl(220 25% 11%)',
                border: '1px solid hsl(220 20% 18%)',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value: number) => [`${value}%`, 'Occupancy']}
            />
            <Bar dataKey="occupancy" radius={[0, 4, 4, 0]}>
              {ZONE_DATA.map((entry) => (
                <Cell key={entry.name} fill={getBarColor(entry.occupancy)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Accessible table version */}
      <table className="sr-only" aria-label="Zone occupancy data">
        <thead>
          <tr>
            <th>Zone</th>
            <th>Occupancy %</th>
            <th>Capacity</th>
          </tr>
        </thead>
        <tbody>
          {ZONE_DATA.map((zone) => (
            <tr key={zone.name}>
              <td>{zone.name}</td>
              <td>{zone.occupancy}%</td>
              <td>{zone.capacity.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
