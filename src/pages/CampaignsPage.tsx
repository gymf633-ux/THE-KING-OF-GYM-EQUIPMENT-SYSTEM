import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, Users, Calendar, DollarSign, MousePointerClick, CheckCircle, Clock } from 'lucide-react';
import { getMockCampaigns, calculateCampaignROI, calculateConversionRate, calculateCTR } from '../store/campaignsMock';

export const CampaignsPage: React.FC = () => {
  const campaigns = useMemo(() => getMockCampaigns(), []);

  const stats = useMemo(() => {
    const totalCampaigns = campaigns.length;
    const activeCampaigns = campaigns.filter(c => new Date(c.schedule_at || '') > new Date()).length;
    const totalSpend = campaigns.reduce((sum, c) => sum + c.spend, 0);
    const totalRevenue = campaigns.reduce((sum, c) => sum + c.revenue, 0);
    const totalROI = totalSpend > 0 ? ((totalRevenue - totalSpend) / totalSpend) * 100 : 0;

    return { totalCampaigns, activeCampaigns, totalSpend, totalRevenue, totalROI };
  }, [campaigns]);

  const getCampaignTypeColor = (type: string) => {
    switch (type) {
      case 'lead_conversion': return 'bg-blue-100 text-blue-700';
      case 'repeat_sale': return 'bg-purple-100 text-purple-700';
      case 'google_review': return 'bg-green-100 text-green-700';
      case 'custom': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCampaignStatus = (scheduleAt: string | undefined) => {
    if (!scheduleAt) return { label: 'Draft', color: 'bg-gray-100 text-gray-700', icon: Clock };
    const scheduleDate = new Date(scheduleAt);
    const now = new Date();
    
    if (scheduleDate > now) {
      return { label: 'Scheduled', color: 'bg-blue-100 text-blue-700', icon: Calendar };
    }
    return { label: 'Completed', color: 'bg-green-100 text-green-700', icon: CheckCircle };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl shadow-xl p-8 text-white"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Target className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Marketing Campaigns</h1>
              <p className="text-blue-100 mt-1">
                Manage campaigns across Facebook, Instagram, and Google My Business
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-indigo-600" />
              <h3 className="text-sm font-medium text-gray-700">Total Campaigns</h3>
            </div>
            <p className="text-3xl font-bold text-indigo-600">{stats.totalCampaigns}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-medium text-gray-700">Active</h3>
            </div>
            <p className="text-3xl font-bold text-blue-600">{stats.activeCampaigns}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <h3 className="text-sm font-medium text-gray-700">Total Spend</h3>
            </div>
            <p className="text-2xl font-bold text-green-600">${stats.totalSpend.toLocaleString()}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <h3 className="text-sm font-medium text-gray-700">Revenue</h3>
            </div>
            <p className="text-2xl font-bold text-purple-600">${stats.totalRevenue.toLocaleString()}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <h3 className="text-sm font-medium text-gray-700">Overall ROI</h3>
            </div>
            <p className="text-2xl font-bold text-orange-600">{stats.totalROI.toFixed(1)}%</p>
          </motion.div>
        </div>

        {/* Campaigns List */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">All Campaigns</h2>
          <div className="space-y-4">
            {campaigns.map((campaign, index) => {
              const roi = calculateCampaignROI(campaign);
              const conversionRate = calculateConversionRate(campaign);
              const ctr = calculateCTR(campaign);
              const status = getCampaignStatus(campaign.schedule_at);
              const StatusIcon = status.icon;

              return (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-gray-800">{campaign.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCampaignTypeColor(campaign.type)}`}>
                          {campaign.type.replace('_', ' ')}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${status.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </span>
                      </div>
                      {campaign.schedule_at && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          Scheduled: {new Date(campaign.schedule_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">ROI</p>
                      <p className={`text-2xl font-bold ${roi > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {roi.toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Spend</p>
                      <p className="text-lg font-bold text-gray-800">${campaign.spend.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Revenue</p>
                      <p className="text-lg font-bold text-gray-800">${campaign.revenue.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Sent</p>
                      <p className="text-lg font-bold text-gray-800">{campaign.sent_count}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Delivered</p>
                      <p className="text-lg font-bold text-gray-800">{campaign.delivered}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Clicks</p>
                      <div className="flex items-center gap-1">
                        <MousePointerClick className="w-4 h-4 text-indigo-600" />
                        <p className="text-lg font-bold text-indigo-600">{campaign.clicks}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Conversions</p>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <p className="text-lg font-bold text-green-600">{campaign.conversions}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">CTR</p>
                      <p className="text-lg font-bold text-purple-600">{ctr.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Conv. Rate</p>
                      <p className="text-lg font-bold text-orange-600">{conversionRate.toFixed(1)}%</p>
                    </div>
                  </div>

                  {campaign.audience_filter && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">Audience Filter</p>
                      <p className="text-sm text-gray-700">{campaign.audience_filter}</p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
