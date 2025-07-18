import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const mockData = [
  { value: 100 },
  { value: 120 },
  { value: 110 },
  { value: 130 },
  { value: 125 },
  { value: 140 },
];

export function AssetSparkline({ data = mockData, color = '#3B82F6' }) {
  return (
    <div className="w-full h-8">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
} 