import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const mockData: Record<string, { date: string; value: number; }[]> = {
  '30D': [
    { date: 'Jun 1', value: 12000 },
    { date: 'Jun 8', value: 12500 },
    { date: 'Jun 15', value: 12800 },
    { date: 'Jun 22', value: 13200 },
    { date: 'Jun 29', value: 13300 },
  ],
  '90D': [
    { date: 'Apr', value: 11000 },
    { date: 'May', value: 12000 },
    { date: 'Jun', value: 13300 },
  ],
  '365D': [
    { date: '2023', value: 18000 },
    { date: '2024', value: 13300 },
  ],
  'ALL': [
    { date: '2022', value: 25000 },
    { date: '2023', value: 18000 },
    { date: '2024', value: 13300 },
  ]
};

const ranges = ['30D', '90D', '365D', 'ALL'] as const;
type RangeType = typeof ranges[number];

export function PortfolioValueChart() {
  const [range, setRange] = useState<RangeType>('30D');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Simulate loading
  // useEffect(() => { setLoading(true); setTimeout(() => setLoading(false), 500); }, [range]);

  if (error) return <div className="text-red-500">Chart failed to load.</div>;
  if (loading) return <div className="h-64 bg-gray-800 animate-pulse rounded-xl" />;

  return (
    <div className="bg-[#181A20] rounded-xl p-4 shadow-lg border border-gray-800">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-white">Portfolio Value Over Time</h3>
        <div className="flex gap-2">
          {ranges.map(r => (
            <button
              key={r}
              className={`px-2 py-1 rounded text-xs font-semibold transition-colors ${range === r ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-blue-800'}`}
              onClick={() => setRange(r)}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={mockData[range]} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#181A20" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#23272F" strokeDasharray="3 3" />
          <XAxis dataKey="date" stroke="#A1A1AA" />
          <YAxis stroke="#A1A1AA" tickFormatter={v => `$${v.toLocaleString()}`}/>
          <Tooltip contentStyle={{ background: '#23272F', border: 'none', color: '#fff' }} formatter={v => `$${v.toLocaleString()}`}/>
          <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={3} dot={false} activeDot={{ r: 6 }} fill="url(#colorValue)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
} 