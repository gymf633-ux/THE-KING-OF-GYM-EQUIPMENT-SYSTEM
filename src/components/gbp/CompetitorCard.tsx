import React from 'react';
import { TrendingUp, TrendingDown, RefreshCw, ExternalLink, Tag } from 'lucide-react';
import type { Competitor } from '../../types/competitor';

interface CompetitorCardProps {
  competitor: Competitor;
  onRefresh?: (id: number) => void;
}

export const CompetitorCard: React.FC<CompetitorCardProps> = ({ competitor, onRefresh }) => {
  const getRankColor = (rank: number) => {
    if (rank <= 3) return 'text-green-600 bg-green-100 border-green-200';
    if (rank <= 7) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    return 'text-red-600 bg-red-100 border-red-200';
  };

  const getRankIcon = (rank: number) => {
    if (rank <= 3) return TrendingUp;
    return TrendingDown;
  };

  const formatLastChecked = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const RankIcon = getRankIcon(competitor.rank_position);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-bold text-gray-900">{competitor.name}</h3>
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(competitor.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="View on Google"
            >
              <ExternalLink className="w-4 h-4 text-gray-500" />
            </a>
          </div>
          <p className="text-sm text-gray-500">
            Last checked: {formatLastChecked(competitor.last_checked_at)}
          </p>
        </div>

        {/* Rank Badge */}
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${getRankColor(competitor.rank_position)}`}>
          <RankIcon className="w-5 h-5" />
          <span className="font-bold text-lg">#{competitor.rank_position}</span>
        </div>
      </div>

      {/* Keywords */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Tag className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-semibold text-gray-700">Tracked Keywords</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {competitor.keywords.map((keyword, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-gray-200">
        <button
          onClick={() => onRefresh?.(competitor.id)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
        >
          <RefreshCw className="w-4 h-4" />
          Check Now
        </button>
        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
          View History
        </button>
      </div>

      {/* Performance Insights */}
      <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <p className="text-xs text-gray-700">
          <span className="font-semibold">Insight:</span>{' '}
          {competitor.rank_position <= 3
            ? `${competitor.name} is performing strongly with a top 3 ranking.`
            : competitor.rank_position <= 7
            ? `${competitor.name} has moderate visibility in search results.`
            : `${competitor.name} has lower visibility - opportunity to outrank them.`}
        </p>
      </div>
    </div>
  );
};
