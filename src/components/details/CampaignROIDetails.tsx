import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Target, MousePointerClick, Users, Calendar, Tag } from 'lucide-react';
import { getMockCampaigns, calculateCampaignROI, calculateConversionRate, calculateCTR } from '../../store/campaignsMock';
import type { Campaign } from '../../types/campaign';

interface CampaignROIDetailsProps {
  onClose?: () => void;
}

interface PlatformMetrics {
  platform: string;
  campaigns: Campaign[];
  totalSpend: number;
  totalRevenue: number;
  totalROI: number;
  avgConversionRate: number;
  avgCTR: number;
}

export const CampaignROIDetails: React.FC<CampaignROIDetailsProps> = ({ onClose }) => {
  const campaigns = useMemo(() => getMockCampaigns(), []);

  // Calculate platform-wise metrics (simulated - in real app would come from campaign data)
  const platformMetrics = useMemo(() => {
    // Group campaigns by simulated platform
    const platforms: Record<string, Campaign[]> = {
      'Facebook': campaigns.filter(c => c.id === 2 || c.id === 4),
      'Instagram': campaigns.filter(c => c.id === 3 || c.id === 5),
      'Google My Business': campaigns.filter(c => c.id === 1),
    };

    return Object.entries(platforms).map(([platform, platformCampaigns]): PlatformMetrics => {
      const totalSpend = platformCampaigns.reduce((sum, c) => sum + c.spend, 0);
      const totalRevenue = platformCampaigns.reduce((sum, c) => sum + c.revenue, 0);
      const totalROI = totalSpend > 0 ? ((totalRevenue - totalSpend) / totalSpend) * 100 : 0;
      
      const avgConversionRate = platformCampaigns.length > 0
        ? platformCampaigns.reduce((sum, c) => sum + calculateConversionRate(c), 0) / platformCampaigns.length
        : 0;

      const avgCTR = platformCampaigns.length > 0
        ? platformCampaigns.reduce((sum, c) => sum + calculateCTR(c), 0) / platformCampaigns.length
        : 0;

      return {
        platform,
        campaigns: platformCampaigns,
        totalSpend,
        totalRevenue,
        totalROI,
        avgConversionRate,
        avgCTR
      };
    }).filter(p => p.campaigns.length > 0);
  }, [campaigns]);

  const totalMetrics = useMemo(() => {
    const totalSpend = campaigns.reduce((sum, c) => sum + c.spend, 0);
    const totalRevenue = campaigns.reduce((sum, c) => sum + c.revenue, 0);
    const totalROI = totalSpend > 0 ? ((totalRevenue - totalSpend) / totalSpend) * 100 : 0;
    const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0);

    return { totalSpend, totalRevenue, totalROI, totalConversions };
  }, [campaigns]);

  const getCampaignTypeColor = (type: Campaign['type']) => {
    switch (type) {
      case 'lead_conversion': return 'bg-blue-100 text-blue-700';
      case 'repeat_sale': return 'bg-purple-100 text-purple-700';
      case 'google_review': return 'bg-green-100 text-green-700';
      case 'custom': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall ROI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h4 className="text-sm font-medium text-gray-700">Total ROI</h4>
          </div>
          <p className="text-3xl font-bold text-green-600">
            {totalMetrics.totalROI.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-600 mt-1">Return on Investment</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-blue-600" />
            <h4 className="text-sm font-medium text-gray-700">Total Spend</h4>
          </div>
          <p className="text-3xl font-bold text-blue-600">
            ${totalMetrics.totalSpend.toLocaleString()}
          </p>
          <p className="text-xs text-gray-600 mt-1">Campaign Investment</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-purple-600" />
            <h4 className="text-sm font-medium text-gray-700">Revenue Generated</h4>
          </div>
          <p className="text-3xl font-bold text-purple-600">
            ${totalMetrics.totalRevenue.toLocaleString()}
          </p>
          <p className="text-xs text-gray-600 mt-1">Total Returns</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-orange-600" />
            <h4 className="text-sm font-medium text-gray-700">Conversions</h4>
          </div>
          <p className="text-3xl font-bold text-orange-600">
            {totalMetrics.totalConversions}
          </p>
          <p className="text-xs text-gray-600 mt-1">Total Converted</p>
        </div>
      </div>

      {/* Platform-wise Breakdown */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Tag className="w-5 h-5 text-indigo-600" />
          Platform Performance
        </h3>

        <div className="space-y-4">
          {platformMetrics.map((platform, index) => (
            <motion.div
              key={platform.platform}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Platform Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xl font-bold text-white">{platform.platform}</h4>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-blue-100">ROI</p>
                      <p className="text-lg font-bold text-white">
                        {platform.totalROI.toFixed(1)}%
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-blue-100">Spend</p>
                      <p className="text-lg font-bold text-white">
                        ${platform.totalSpend.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-blue-100">Revenue</p>
                      <p className="text-lg font-bold text-white">
                        ${platform.totalRevenue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                    <p className="text-xs text-blue-100 mb-1">Avg. Conversion Rate</p>
                    <p className="text-lg font-bold text-white">
                      {platform.avgConversionRate.toFixed(1)}%
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                    <p className="text-xs text-blue-100 mb-1">Avg. Click-Through Rate</p>
                    <p className="text-lg font-bold text-white">
                      {platform.avgCTR.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Campaign List */}
              <div className="divide-y divide-gray-100">
                {platform.campaigns.map((campaign) => {
                  const roi = calculateCampaignROI(campaign);
                  const conversionRate = calculateConversionRate(campaign);
                  const ctr = calculateCTR(campaign);

                  return (
                    <div
                      key={campaign.id}
                      className="px-6 py-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="font-semibold text-gray-800">{campaign.title}</h5>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCampaignTypeColor(campaign.type)}`}>
                              {campaign.type.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            {campaign.schedule_at 
                              ? `Scheduled: ${new Date(campaign.schedule_at).toLocaleDateString()}`
                              : 'Draft'
                            }
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">ROI</p>
                          <p className={`text-xl font-bold ${roi > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {roi.toFixed(1)}%
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-6 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Spend</p>
                          <p className="text-sm font-bold text-gray-800">
                            ${campaign.spend.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Revenue</p>
                          <p className="text-sm font-bold text-gray-800">
                            ${campaign.revenue.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Sent</p>
                          <p className="text-sm font-bold text-gray-800">
                            {campaign.sent_count}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Clicks</p>
                          <p className="text-sm font-bold text-indigo-600">
                            {campaign.clicks}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Conversions</p>
                          <p className="text-sm font-bold text-green-600">
                            {campaign.conversions}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Conv. Rate</p>
                          <p className="text-sm font-bold text-purple-600">
                            {conversionRate.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
