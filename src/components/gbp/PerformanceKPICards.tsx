import React from 'react';
import { Eye, Phone, Navigation, TrendingUp } from 'lucide-react';
import { KPICard } from '../KPICard';

interface PerformanceKPICardsProps {
  views?: number;
  calls?: number;
  directions?: number;
  viewsTrend?: number;
  callsTrend?: number;
  directionsTrend?: number;
}

export const PerformanceKPICards: React.FC<PerformanceKPICardsProps> = ({
  views = 3450,
  calls = 125,
  directions = 89,
  viewsTrend = 12.5,
  callsTrend = 8.3,
  directionsTrend = 15.7,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-green-100 rounded-lg">
          <TrendingUp className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">Performance Metrics</h2>
          <p className="text-sm text-gray-500">Last 30 days from Google Business Profile</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard
          title="Profile Views"
          value={views}
          icon={Eye}
          trend={viewsTrend}
          format="number"
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
        />
        <KPICard
          title="Phone Calls"
          value={calls}
          icon={Phone}
          trend={callsTrend}
          format="number"
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
        />
        <KPICard
          title="Direction Requests"
          value={directions}
          icon={Navigation}
          trend={directionsTrend}
          format="number"
          iconColor="text-purple-600"
          iconBgColor="bg-purple-100"
        />
      </div>

      {/* Performance Insights */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <div className="text-3xl">🎯</div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Performance Insights</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                • Your profile views are <span className="font-semibold text-green-700">up {viewsTrend}%</span> compared to last period
              </p>
              <p>
                • Phone calls have increased by <span className="font-semibold text-green-700">{callsTrend}%</span> - great engagement!
              </p>
              <p>
                • Direction requests show <span className="font-semibold text-green-700">strong local interest</span> (+{directionsTrend}%)
              </p>
            </div>
            <div className="mt-4 p-3 bg-white rounded-lg border border-green-200">
              <p className="text-xs text-gray-600">
                💡 <span className="font-semibold">Pro Tip:</span> Keep posting regular updates and offers to maintain high engagement levels
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
