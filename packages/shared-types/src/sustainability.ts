// =============================================================================
// Sustainability Types
// =============================================================================

import type { UUID, ISODateString } from './common';

export type EnergySource = 'solar' | 'grid' | 'backup_generator' | 'wind';
export type WasteCategory = 'recycling' | 'compost' | 'landfill' | 'hazardous';

export interface EnergyReading {
  readonly id: UUID;
  readonly stadiumId: UUID;
  readonly timestamp: ISODateString;
  readonly source: EnergySource;
  readonly consumptionKwh: number;
  readonly productionKwh?: number;
  readonly carbonKg: number;
  readonly zone: string;
}

export interface WasteEvent {
  readonly id: UUID;
  readonly stadiumId: UUID;
  readonly timestamp: ISODateString;
  readonly category: WasteCategory;
  readonly weightKg: number;
  readonly zone: string;
  readonly recyclablePercent: number;
}

export interface SustainabilityMetrics {
  readonly stadiumId: UUID;
  readonly matchId?: UUID;
  readonly periodStart: ISODateString;
  readonly periodEnd: ISODateString;
  readonly totalEnergyKwh: number;
  readonly renewableEnergyPercent: number;
  readonly totalCarbonKg: number;
  readonly waterUsageLiters: number;
  readonly totalWasteKg: number;
  readonly recyclingRate: number;
  readonly sustainabilityScore: number;
  readonly aiInsights: ReadonlyArray<string>;
  readonly recommendations: ReadonlyArray<string>;
}
