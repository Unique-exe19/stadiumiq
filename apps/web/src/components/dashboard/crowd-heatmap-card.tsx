'use client';

import { MapPin } from 'lucide-react';

// In production: Mapbox GL JS heatmap layer
// For demo: SVG-based crowd density visualization
const ZONES = [
  { id: 'north', label: 'North Stand', x: 50, y: 10, density: 0.88, radius: 22 },
  { id: 'south', label: 'South Stand', x: 50, y: 90, density: 0.72, radius: 22 },
  { id: 'east', label: 'East Wing', x: 90, y: 50, density: 0.94, radius: 20 },
  { id: 'west', label: 'West Wing', x: 10, y: 50, density: 0.65, radius: 20 },
  { id: 'center', label: 'Pitch', x: 50, y: 50, density: 0, radius: 18 },
];

const getDensityColor = (density: number) => {
  if (density >= 0.9) return 'hsl(0 84% 60% / 0.7)';
  if (density >= 0.75) return 'hsl(30 90% 55% / 0.6)';
  if (density >= 0.5) return 'hsl(38 92% 50% / 0.5)';
  return 'hsl(142 72% 45% / 0.4)';
};

export function CrowdHeatmapCard() {
  return (
    <section
      className="glass-card rounded-2xl p-5 h-full"
      aria-labelledby="heatmap-heading"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 id="heatmap-heading" className="font-display font-semibold text-foreground flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary-400" aria-hidden="true" />
          Crowd Heatmap
        </h2>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500" aria-hidden="true" /> Low
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-yellow-500" aria-hidden="true" /> Moderate
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500" aria-hidden="true" /> Critical
          </span>
        </div>
      </div>

      {/* SVG Stadium Map */}
      <div className="relative" aria-label="Stadium crowd density heatmap" role="img">
        <svg
          viewBox="0 0 100 100"
          className="w-full aspect-square"
          aria-hidden="true"
        >
          {/* Stadium outline */}
          <ellipse cx="50" cy="50" rx="45" ry="45" fill="none" stroke="hsl(220 20% 25%)" strokeWidth="0.5" />
          <ellipse cx="50" cy="50" rx="20" ry="20" fill="hsl(142 20% 15%)" stroke="hsl(142 40% 25%)" strokeWidth="0.5" />

          {/* Zone density circles */}
          {ZONES.filter(z => z.density > 0).map((zone) => (
            <g key={zone.id}>
              <circle
                cx={zone.x}
                cy={zone.y}
                r={zone.radius}
                fill={getDensityColor(zone.density)}
                style={{ filter: 'blur(4px)' }}
              />
              <circle
                cx={zone.x}
                cy={zone.y}
                r={3}
                fill="white"
                opacity={0.8}
              />
            </g>
          ))}

          {/* Labels */}
          <text x="50" y="7" textAnchor="middle" fill="hsl(220 10% 70%)" fontSize="3" fontFamily="sans-serif">North</text>
          <text x="50" y="97" textAnchor="middle" fill="hsl(220 10% 70%)" fontSize="3" fontFamily="sans-serif">South</text>
          <text x="95" y="51" textAnchor="middle" fill="hsl(0 84% 70%)" fontSize="3" fontFamily="sans-serif">East ⚠</text>
          <text x="5" y="51" textAnchor="middle" fill="hsl(220 10% 70%)" fontSize="3" fontFamily="sans-serif">West</text>
        </svg>
      </div>

      {/* Accessible table */}
      <table className="sr-only">
        <caption>Stadium zone crowd density</caption>
        <thead><tr><th>Zone</th><th>Density</th></tr></thead>
        <tbody>
          {ZONES.filter(z => z.density > 0).map((z) => (
            <tr key={z.id}>
              <td>{z.label}</td>
              <td>{Math.round(z.density * 100)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
