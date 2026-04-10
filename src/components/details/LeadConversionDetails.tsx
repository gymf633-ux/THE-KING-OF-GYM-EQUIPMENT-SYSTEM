import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Calendar, User, Phone, Tag } from 'lucide-react';
import { getMockLeads } from '../../store/leadsMock';
import type { Lead } from '../../types/lead';

interface LeadConversionDetailsProps {
  onClose?: () => void;
}

interface LeadConversionMetrics {
  date: string;
  newLeads: number;
  convertedLeads: number;
  conversionRate: number;
  leads: Lead[];
}

export const LeadConversionDetails: React.FC<LeadConversionDetailsProps> = ({ onClose }) => {
  const leads = useMemo(() => getMockLeads(), []);

  // Group leads by date and calculate metrics
  const dateWiseMetrics = useMemo(() => {
    const groupedByDate: Record<string, Lead[]> = {};
    
    leads.forEach(lead => {
      const date = new Date(lead.created_at).toISOString().split('T')[0];
      if (!groupedByDate[date]) {
        groupedByDate[date] = [];
      }
      groupedByDate[date].push(lead);
    });

    const metrics: LeadConversionMetrics[] = Object.entries(groupedByDate)
      .map(([date, dateLeads]) => {
        const newLeads = dateLeads.length;
        const convertedLeads = dateLeads.filter(l => l.status === 'won').length;
        const conversionRate = newLeads > 0 ? (convertedLeads / newLeads) * 100 : 0;

        return {
          date,
          newLeads,
          convertedLeads,
          conversionRate,
          leads: dateLeads
        };
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return metrics;
  }, [leads]);

  const totalConversion = useMemo(() => {
    const total = leads.length;
    const converted = leads.filter(l => l.status === 'won').length;
    return total > 0 ? (converted / total) * 100 : 0;
  }, [leads]);

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-700';
      case 'warm': return 'bg-yellow-100 text-yellow-700';
      case 'hot': return 'bg-orange-100 text-orange-700';
      case 'won': return 'bg-green-100 text-green-700';
      case 'lost': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">Overall Conversion Rate</h3>
          <div className="flex items-center gap-2 text-green-600">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-medium">+12.5%</span>
          </div>
        </div>
        <div className="text-4xl font-bold text-indigo-600 mb-2">
          {totalConversion.toFixed(1)}%
        </div>
        <p className="text-sm text-gray-600">
          {leads.filter(l => l.status === 'won').length} converted out of {leads.length} total leads
        </p>
      </div>

      {/* Date-wise Metrics */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-600" />
          Date-wise Conversion Metrics
        </h3>
        
        <div className="space-y-4">
          {dateWiseMetrics.map((metric, index) => (
            <motion.div
              key={metric.date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Date Header */}
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">
                      {new Date(metric.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-gray-500">New Leads</p>
                      <p className="text-lg font-bold text-gray-800">{metric.newLeads}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Converted</p>
                      <p className="text-lg font-bold text-green-600">{metric.convertedLeads}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Rate</p>
                      <p className="text-lg font-bold text-indigo-600">
                        {metric.conversionRate.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Leads List */}
              <div className="divide-y divide-gray-100">
                {metric.leads.map((lead) => (
                  <div
                    key={lead.id}
                    className="px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-indigo-100 rounded-lg">
                            <User className="w-4 h-4 text-indigo-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800">{lead.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Phone className="w-3 h-3 text-gray-400" />
                              <p className="text-sm text-gray-600">{lead.phone}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2 ml-12">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                            {lead.status.toUpperCase()}
                          </span>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                            {lead.source}
                          </span>
                          {lead.interest_category && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 flex items-center gap-1">
                              <Tag className="w-3 h-3" />
                              {lead.interest_category}
                            </span>
                          )}
                        </div>

                        {lead.notes && (
                          <p className="text-sm text-gray-600 mt-2 ml-12">{lead.notes}</p>
                        )}
                      </div>

                      <div className="text-right ml-4">
                        <p className="text-xs text-gray-500">Assigned to</p>
                        <p className="text-sm font-medium text-gray-800">{lead.assigned_to}</p>
                        {lead.next_followup_at && (
                          <p className="text-xs text-indigo-600 mt-1">
                            Next: {new Date(lead.next_followup_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Status Distribution */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Lead Status Distribution</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {(['new', 'warm', 'hot', 'won', 'lost'] as const).map((status) => {
            const count = leads.filter(l => l.status === status).length;
            const percentage = leads.length > 0 ? (count / leads.length) * 100 : 0;
            
            return (
              <div key={status} className="text-center">
                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-2 ${getStatusColor(status)}`}>
                  <span className="text-2xl font-bold">{count}</span>
                </div>
                <p className="text-sm font-medium text-gray-800 capitalize">{status}</p>
                <p className="text-xs text-gray-500">{percentage.toFixed(1)}%</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
