import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { MonthlyPoint } from '../../types/tradeData';

interface Props {
  data: MonthlyPoint[];
}

export const MonthlyTrendChart: React.FC<Props> = ({ data }) => {
  if (data.length === 0) return <EmptyChart />;
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Monthly Trend</h3>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" height={48} />
          <YAxis yAxisId="left" tick={{ fontSize: 10 }} width={55}
            tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v} />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} width={60}
            tickFormatter={(v) => v >= 1000 ? `$${(v / 1000).toFixed(0)}K` : `$${v}`} />
          <Tooltip
            formatter={(value: number, name: string) =>
              name === 'value' ? [`$${value.toLocaleString()}`, 'Value'] : [value.toLocaleString(), 'Qty (kg)']
            }
          />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="qty" stroke="#3b82f6" strokeWidth={2} dot={false} name="Qty (kg)" />
          <Line yAxisId="right" type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Value ($)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const EmptyChart: React.FC = () => (
  <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-center justify-center h-64">
    <p className="text-sm text-gray-400">No data to display</p>
  </div>
);
