import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

const mockData = [
  { month: 'Jan', profit: 500 },
  { month: 'Feb', profit: -200 },
  { month: 'Mar', profit: 300 },
  { month: 'Apr', profit: -100 },
  { month: 'May', profit: 400 },
  { month: 'Jun', profit: 250 },
];

export function MonthlyPerformanceBarChart() {
  // Add loading/error state as needed
  return (
    <div className="bg-[#181A20] rounded-xl p-4 shadow-lg border border-gray-800">
      <h3 className="text-lg font-bold text-white mb-2">Monthly Performance</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={mockData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#23272F" strokeDasharray="3 3" />
          <XAxis dataKey="month" stroke="#A1A1AA" />
          <YAxis stroke="#A1A1AA" />
          <Tooltip contentStyle={{ background: '#23272F', border: 'none', color: '#fff' }}/>
          <Bar dataKey="profit">
            {mockData.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={entry.profit >= 0 ? '#22C55E' : '#EF4444'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
} 