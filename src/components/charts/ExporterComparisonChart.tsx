import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { ExporterPoint } from '../../types/tradeData';

const COLORS = [
  '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444',
  '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#6366f1',
];

interface Props {
  data: ExporterPoint[];
}

export const ExporterComparisonChart: React.FC<Props> = ({ data }) => {
  if (data.length === 0) return <EmptyChart />;
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Top Exporters by Value</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 16, left: 90, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 10 }}
            tickFormatter={(v) => v >= 1000 ? `$${(v / 1000).toFixed(0)}K` : `$${v}`} />
          <YAxis type="category" dataKey="exporter" tick={{ fontSize: 10 }} width={88} />
          <Tooltip
            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const EmptyChart: React.FC = () => (
  <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-center justify-center h-64">
    <p className="text-sm text-gray-400">No data to display</p>
  </div>
);
