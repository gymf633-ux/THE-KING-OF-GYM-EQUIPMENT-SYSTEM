import React from 'react';
import { motion } from 'framer-motion';
import { Package, Weight, DollarSign, TrendingUp, Users } from 'lucide-react';
import { KPISummary } from '../../types/tradeData';
import { formatNumber, formatCurrency } from '../../utils/dataProcessor';

interface Props {
  kpi: KPISummary;
}

interface CardDef {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
}

export const KPISummaryCards: React.FC<Props> = ({ kpi }) => {
  const cards: CardDef[] = [
    {
      label: 'Total Records',
      value: kpi.totalRecords.toLocaleString(),
      sub: 'shipment entries',
      icon: <Package className="w-6 h-6" />,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Total Quantity',
      value: formatNumber(kpi.totalQuantityKg),
      sub: 'kg shipped',
      icon: <Weight className="w-6 h-6" />,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Total Value',
      value: formatCurrency(kpi.totalValue),
      sub: 'trade value',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      label: 'Avg Rate / kg',
      value: `$${kpi.avgRatePerKg.toFixed(2)}`,
      sub: 'per kilogram',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
    {
      label: 'Unique Exporters',
      value: kpi.uniqueExporters.toLocaleString(),
      sub: 'active exporters',
      icon: <Users className="w-6 h-6" />,
      color: 'text-teal-600',
      bg: 'bg-teal-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.07 }}
          className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className={`inline-flex p-2 rounded-lg ${card.bg} ${card.color} mb-3`}>
            {card.icon}
          </div>
          <p className="text-xs text-gray-500 font-medium">{card.label}</p>
          <p className={`text-2xl font-bold mt-0.5 ${card.color}`}>{card.value}</p>
          <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>
        </motion.div>
      ))}
    </div>
  );
};
