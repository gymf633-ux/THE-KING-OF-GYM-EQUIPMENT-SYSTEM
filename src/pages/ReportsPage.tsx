import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, TrendingUp, TrendingDown, Users, MessageSquare,
  Star, Phone, DollarSign, Zap, Target, Calendar,
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { getMockIndicators, getMockLatestIndicator, calculateAverageKPI } from '../store/indicatorsMock';

export const ReportsPage: React.FC = () => {
  const indicators = useMemo(() => getMockIndicators(), []);
  const latest = useMemo(() => getMockLatestIndicator(), []);

  const avgSales = useMemo(() => calculateAverageKPI('sales_today'), []);
  const avgLeads = useMemo(() => calculateAverageKPI('leads_new'), []);
  const avgROI   = useMemo(() => calculateAverageKPI('campaign_roi'), []);
  const avgRating = useMemo(() => calculateAverageKPI('avg_rating'), []);

  // Chart data — reversed so oldest → newest
  const chartData = useMemo(() => [...indicators].reverse().map(ind => ({
    date: ind.date.slice(5),   // "MM-DD"
    sales: ind.sales_today,
    leads: ind.leads_new,
    calls: ind.calls_made,
    whatsapp: ind.whatsapp_sent,
    roi: ind.campaign_roi,
    rating: ind.avg_rating,
  })), [indicators]);

  const kpiCards = [
    {
      label: 'Sales Today',
      value: `₹${latest.sales_today.toLocaleString('en-IN')}`,
      sub: `MTD ₹${(latest.sales_mtd / 1000).toFixed(1)}K`,
      icon: <DollarSign className="w-5 h-5" />,
      color: 'text-green-600',
      bg: 'bg-green-50',
      trend: latest.sales_today >= avgSales ? 'up' : 'down',
    },
    {
      label: 'New Leads',
      value: String(latest.leads_new),
      sub: `${latest.leads_hot} hot leads`,
      icon: <Users className="w-5 h-5" />,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      trend: latest.leads_new >= avgLeads ? 'up' : 'down',
    },
    {
      label: 'Calls Made',
      value: String(latest.calls_made),
      sub: `${latest.whatsapp_sent} WhatsApp sent`,
      icon: <Phone className="w-5 h-5" />,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      trend: 'up' as const,
    },
    {
      label: 'Campaign ROI',
      value: `${latest.campaign_roi.toFixed(1)}%`,
      sub: `Avg ${avgROI.toFixed(1)}% this week`,
      icon: <Zap className="w-5 h-5" />,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      trend: latest.campaign_roi >= avgROI ? 'up' : 'down',
    },
    {
      label: 'Avg Rating',
      value: latest.avg_rating.toFixed(1),
      sub: `${latest.total_reviews} total reviews`,
      icon: <Star className="w-5 h-5" />,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
      trend: latest.avg_rating >= avgRating ? 'up' : 'down',
    },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" /> Reports
          </h1>
          <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            Last 5 days · Latest: {latest.date}
          </p>
        </div>
        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold rounded-full">
          <Target className="w-3.5 h-3.5" /> Live Data
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {kpiCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.06 }}
            className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
          >
            <div className={`inline-flex p-2 rounded-lg ${card.bg} ${card.color} mb-3`}>
              {card.icon}
            </div>
            <p className="text-xs text-gray-400 font-medium">{card.label}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
              {card.trend === 'up'
                ? <TrendingUp className="w-4 h-4 text-green-500" />
                : <TrendingDown className="w-4 h-4 text-red-400" />
              }
            </div>
            <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Row 1: Sales + Leads Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Daily Sales (₹)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} width={52} />
              <Tooltip formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, 'Sales']} />
              <Bar dataKey="sales" fill="#22c55e" radius={[4, 4, 0, 0]} name="Sales" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Leads & Hot Leads</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} width={30} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="leads" stroke="#3b82f6" strokeWidth={2} dot name="New Leads" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Activity + ROI Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Communication Activity</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} width={30} />
              <Tooltip />
              <Legend />
              <Bar dataKey="calls" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Calls" />
              <Bar dataKey="whatsapp" fill="#10b981" radius={[4, 4, 0, 0]} name="WhatsApp" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Campaign ROI (%)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `${v}%`} width={44} />
              <Tooltip formatter={(v: number) => [`${v.toFixed(1)}%`, 'ROI']} />
              <Line type="monotone" dataKey="roi" stroke="#f59e0b" strokeWidth={2} dot name="ROI %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Raw Data Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700">Daily KPI Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Date', 'New Leads', 'Hot Leads', 'Calls', 'WhatsApp', 'ROI %', 'Avg Rating', 'Sales Today', 'MTD Sales'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {indicators.map((ind, i) => (
                <motion.tr
                  key={ind.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className={i === 0 ? 'bg-blue-50/50' : 'hover:bg-gray-50'}
                >
                  <td className="px-4 py-2.5 font-semibold text-gray-700 whitespace-nowrap">
                    {ind.date}{i === 0 && <span className="ml-2 text-xs text-blue-600 font-medium">Latest</span>}
                  </td>
                  <Td>{ind.leads_new}</Td>
                  <Td>{ind.leads_hot}</Td>
                  <Td>{ind.calls_made}</Td>
                  <Td>{ind.whatsapp_sent}</Td>
                  <Td>{ind.campaign_roi.toFixed(1)}%</Td>
                  <Td>
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      {ind.avg_rating.toFixed(1)}
                    </span>
                  </Td>
                  <Td>₹{ind.sales_today.toLocaleString('en-IN')}</Td>
                  <Td>₹{(ind.sales_mtd / 1000).toFixed(1)}K</Td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MTD Sales Summary */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-5 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-80 font-medium">Month-to-Date Sales</p>
            <p className="text-4xl font-bold mt-1">₹{(latest.sales_mtd / 1000).toFixed(1)}K</p>
            <p className="text-sm opacity-70 mt-1">as of {latest.date}</p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-80">Avg Daily</p>
            <p className="text-2xl font-bold">₹{avgSales.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
            <p className="text-sm opacity-70 mt-1">last 5 days</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Td: React.FC<React.PropsWithChildren> = ({ children }) => (
  <td className="px-4 py-2.5 text-gray-600 whitespace-nowrap">{children}</td>
);

export default ReportsPage;
