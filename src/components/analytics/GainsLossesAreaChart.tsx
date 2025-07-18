import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const mockData = [
  { date: 'Jun 1', gain: 200, loss: 0 },
  { date: 'Jun 8', gain: 300, loss: 0 },
  { date: 'Jun 15', gain: 0, loss: 100 },
  { date: 'Jun 22', gain: 400, loss: 0 },
  { date: 'Jun 29', gain: 0, loss: 150 },
];

export function GainsLossesAreaChart() {
  // Add loading/error state as needed
  return (
    <div className="bg-[#181A20] rounded-xl p-4 shadow-lg border border-gray-800">
      <h3 className="text-lg font-bold text-white mb-2">Gains vs Losses</h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={mockData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="gainColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22C55E" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#181A20" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="lossColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#181A20" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#23272F" strokeDasharray="3 3" />
          <XAxis dataKey="date" stroke="#A1A1AA" />
          <YAxis stroke="#A1A1AA" />
          <Tooltip contentStyle={{ background: '#23272F', border: 'none', color: '#fff' }}/>
          <Area type="monotone" dataKey="gain" stroke="#22C55E" fill="url(#gainColor)" strokeWidth={2} />
          <Area type="monotone" dataKey="loss" stroke="#EF4444" fill="url(#lossColor)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
} 