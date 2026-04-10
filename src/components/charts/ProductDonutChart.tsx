import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { ProductPoint } from '../../types/tradeData';

const COLORS = [
  '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444',
  '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#6366f1',
];

interface Props {
  data: ProductPoint[];
}

export const ProductDonutChart: React.FC<Props> = ({ data }) => {
  if (data.length === 0) return <EmptyChart />;

  // Limit to top 8 products, group rest as "Others"
  const top = data.slice(0, 8);
  const rest = data.slice(8);
  const chartData = rest.length > 0
    ? [...top, { product: 'Others', qty: rest.reduce((s, r) => s + r.qty, 0), value: rest.reduce((s, r) => s + r.value, 0) }]
    : top;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Product Breakdown</h3>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="product"
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={3}
          >
            {chartData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(v) => <span className="text-xs text-gray-600">{v}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

const EmptyChart: React.FC = () => (
  <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-center justify-center h-64">
    <p className="text-sm text-gray-400">No data to display</p>
  </div>
);
