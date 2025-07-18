import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface DonutChartProps {
  title: string;
  data: { name: string; value: number; color: string }[];
}

export function DonutChart({ title, data }: DonutChartProps) {
  // Add loading/error state as needed
  return (
    <div className="bg-[#181A20] rounded-xl p-4 shadow-lg border border-gray-800">
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ background: '#23272F', border: 'none', color: '#fff' }}/>
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-2 mt-2">
        {data.map((entry, idx) => (
          <span key={idx} className="flex items-center gap-1 text-xs text-gray-300">
            <span className="inline-block w-3 h-3 rounded-full" style={{ background: entry.color }} />
            {entry.name} ({entry.value}%)
          </span>
        ))}
      </div>
    </div>
  );
} 