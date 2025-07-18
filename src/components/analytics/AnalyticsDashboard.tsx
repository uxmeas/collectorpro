import React from 'react';
import { PortfolioValueChart } from './PortfolioValueChart';
import { GainsLossesAreaChart } from './GainsLossesAreaChart';
import { MonthlyPerformanceBarChart } from './MonthlyPerformanceBarChart';
import { DonutChart } from './DonutChart';

const platformData = [
  { name: 'TopShot', value: 60, color: '#3B82F6' },
  { name: 'AllDay', value: 25, color: '#10B981' },
  { name: 'Panini', value: 15, color: '#F59E0B' },
];
const rarityData = [
  { name: 'Common', value: 50, color: '#64748B' },
  { name: 'Rare', value: 30, color: '#3B82F6' },
  { name: 'Legendary', value: 20, color: '#F59E0B' },
];
const performanceData = [
  { name: 'Winners', value: 65, color: '#22C55E' },
  { name: 'Losers', value: 35, color: '#EF4444' },
];
const playerData = [
  { name: 'LeBron', value: 25, color: '#FDB927' },
  { name: 'Curry', value: 18, color: '#1D428A' },
  { name: 'Giannis', value: 12, color: '#145A32' },
  { name: 'Durant', value: 10, color: '#552583' },
  { name: 'Other', value: 35, color: '#64748B' },
];

export function AnalyticsDashboard() {
  return (
    <div className="w-full max-w-7xl mx-auto px-2 md:px-6 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PortfolioValueChart />
        <GainsLossesAreaChart />
        <MonthlyPerformanceBarChart />
        <DonutChart title="Portfolio by Platform" data={platformData} />
        <DonutChart title="Rarity Distribution" data={rarityData} />
        <DonutChart title="Performance Categories" data={performanceData} />
        <DonutChart title="Value by Player" data={playerData} />
      </div>
      {/* Mobile horizontal scroll for charts */}
      <div className="md:hidden flex gap-4 overflow-x-auto py-4 mt-4">
        <div className="min-w-[320px] w-80"><PortfolioValueChart /></div>
        <div className="min-w-[320px] w-80"><GainsLossesAreaChart /></div>
        <div className="min-w-[320px] w-80"><MonthlyPerformanceBarChart /></div>
        <div className="min-w-[320px] w-80"><DonutChart title="Platform" data={platformData} /></div>
      </div>
    </div>
  );
} 