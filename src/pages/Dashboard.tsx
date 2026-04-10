import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Target,
  Star,
  TrendingUp,
  Percent,
  DollarSign
} from 'lucide-react';
import { KPICard } from '../components/KPICard';
import { kpiService } from '../services/kpiService';
import { DetailsDrawer } from '../components/DetailsDrawer';
import { LeadConversionDetails } from '../components/details/LeadConversionDetails';
import { CampaignROIDetails } from '../components/details/CampaignROIDetails';
import { TotalSalesDetails } from '../components/details/TotalSalesDetails';
import { ReviewsDetails } from '../components/details/ReviewsDetails';

export const Dashboard: React.FC = () => {
  const [kpiData, setKpiData] = useState(kpiService.getAllKPIs());
  const [activeDrawer, setActiveDrawer] = useState<'leads' | 'campaigns' | 'sales' | 'reviews' | null>(null);

  useEffect(() => {
    // Recalculate KPIs on mount
    setKpiData(kpiService.getAllKPIs());
  }, []);

  const kpis = [
    {
      title: 'Lead Conversion %',
      value: kpiData.leadConversionPercent,
      icon: Percent,
      format: 'percentage' as const,
      iconColor: 'text-blue-600',
      iconBgColor: 'bg-blue-100',
      subtitle: `${kpiData.leadConversionDetails.wonLeads} won / ${kpiData.leadConversionDetails.totalLeads} total (this month)`,
      onClick: () => setActiveDrawer('leads'),
    },
    {
      title: 'Campaign ROI',
      value: kpiData.campaignROI,
      icon: Target,
      format: 'percentage' as const,
      iconColor: 'text-indigo-600',
      iconBgColor: 'bg-indigo-100',
      subtitle: `₹${kpiData.campaignROIDetails.totalRevenue.toLocaleString()} revenue / ₹${kpiData.campaignROIDetails.totalSpend.toLocaleString()} spend`,
      onClick: () => setActiveDrawer('campaigns'),
    },
    {
      title: 'Avg Rating',
      value: kpiData.avgRating,
      icon: Star,
      format: 'rating' as const,
      iconColor: 'text-yellow-600',
      iconBgColor: 'bg-yellow-100',
      subtitle: `${kpiData.avgRatingDetails.reviewCount} reviews (last 90 days)`,
      onClick: () => setActiveDrawer('reviews'),
    },
    {
      title: 'MTD Sales',
      value: kpiData.mtdSales,
      icon: TrendingUp,
      format: 'currency' as const,
      iconColor: 'text-green-600',
      iconBgColor: 'bg-green-100',
      subtitle: `${kpiData.mtdSalesDetails.salesCount} transactions`,
      onClick: () => setActiveDrawer('sales'),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Key Performance Indicators for November 2025
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Reference Date: Nov 12, 2025
            </div>
          </div>
        </div>
      </div>

      {/* Primary KPIs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Primary Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpis.map((kpi, index) => (
              <div key={index} className="cursor-pointer" onClick={kpi.onClick}>
                <KPICard
                  title={kpi.title}
                  value={kpi.value}
                  icon={kpi.icon}
                  format={kpi.format}
                  iconColor={kpi.iconColor}
                  iconBgColor={kpi.iconBgColor}
                />
                {kpi.subtitle && (
                  <p className="mt-2 text-xs text-gray-500 text-center">
                    {kpi.subtitle}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lead Conversion Breakdown */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Percent className="w-5 h-5 text-blue-600" />
              Lead Conversion Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Won Leads</span>
                <span className="text-sm font-semibold text-gray-900">
                  {kpiData.leadConversionDetails.wonLeads}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Total Leads (Nov 2025)</span>
                <span className="text-sm font-semibold text-gray-900">
                  {kpiData.leadConversionDetails.totalLeads}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 bg-blue-50 px-3 rounded">
                <span className="text-sm font-medium text-blue-900">Conversion Rate</span>
                <span className="text-lg font-bold text-blue-900">
                  {kpiData.leadConversionPercent.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Campaign ROI Breakdown */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-600" />
              Campaign ROI Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Total Revenue</span>
                <span className="text-sm font-semibold text-green-600">
                  ₹{kpiData.campaignROIDetails.totalRevenue.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Total Spend</span>
                <span className="text-sm font-semibold text-red-600">
                  ₹{kpiData.campaignROIDetails.totalSpend.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 bg-indigo-50 px-3 rounded">
                <span className="text-sm font-medium text-indigo-900">Return on Investment</span>
                <span className="text-lg font-bold text-indigo-900">
                  {kpiData.campaignROI.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>

          {/* Rating Breakdown */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-600" />
              Rating Details (Last 90 Days)
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Total Reviews</span>
                <span className="text-sm font-semibold text-gray-900">
                  {kpiData.avgRatingDetails.reviewCount}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Total Rating Points</span>
                <span className="text-sm font-semibold text-gray-900">
                  {kpiData.avgRatingDetails.totalRatings}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 bg-yellow-50 px-3 rounded">
                <span className="text-sm font-medium text-yellow-900">Average Rating</span>
                <span className="text-lg font-bold text-yellow-900 flex items-center gap-1">
                  {kpiData.avgRating.toFixed(1)} <Star className="w-4 h-4 fill-current" />
                </span>
              </div>
            </div>
          </div>

          {/* MTD Sales Breakdown */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              MTD Sales Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Number of Transactions</span>
                <span className="text-sm font-semibold text-gray-900">
                  {kpiData.mtdSalesDetails.salesCount}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Average Sale Value</span>
                <span className="text-sm font-semibold text-gray-900">
                  ₹{kpiData.mtdSalesDetails.salesCount > 0 
                    ? (kpiData.mtdSales / kpiData.mtdSalesDetails.salesCount).toLocaleString(undefined, { maximumFractionDigits: 0 })
                    : 0}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 bg-green-50 px-3 rounded">
                <span className="text-sm font-medium text-green-900">Total MTD Sales</span>
                <span className="text-lg font-bold text-green-900">
                  ₹{kpiData.mtdSales.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Note */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> All metrics are calculated based on mock data for November 2025. 
            Lead Conversion uses leads created this month, Campaign ROI includes all campaign revenue and spend, 
            Average Rating shows reviews from the last 90 days, and MTD Sales totals all sales in the current month.
            Click any KPI card above to view detailed information.
          </p>
        </div>
      </div>

      {/* Details Drawers */}
      <DetailsDrawer
        isOpen={activeDrawer === 'leads'}
        onClose={() => setActiveDrawer(null)}
        title="Lead Conversion Details"
      >
        <LeadConversionDetails onClose={() => setActiveDrawer(null)} />
      </DetailsDrawer>

      <DetailsDrawer
        isOpen={activeDrawer === 'campaigns'}
        onClose={() => setActiveDrawer(null)}
        title="Campaign ROI Breakdown"
      >
        <CampaignROIDetails onClose={() => setActiveDrawer(null)} />
      </DetailsDrawer>

      <DetailsDrawer
        isOpen={activeDrawer === 'sales'}
        onClose={() => setActiveDrawer(null)}
        title="Total Sales Report"
      >
        <TotalSalesDetails onClose={() => setActiveDrawer(null)} />
      </DetailsDrawer>

      <DetailsDrawer
        isOpen={activeDrawer === 'reviews'}
        onClose={() => setActiveDrawer(null)}
        title="Customer Reviews & Ratings"
      >
        <ReviewsDetails onClose={() => setActiveDrawer(null)} />
      </DetailsDrawer>
    </div>
  );
};
