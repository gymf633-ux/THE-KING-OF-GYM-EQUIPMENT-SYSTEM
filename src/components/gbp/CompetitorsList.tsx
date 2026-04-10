import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Search, Filter, TrendingUp } from 'lucide-react';
import { competitorsApi } from '../../services/gbpApi';
import { CompetitorCard } from './CompetitorCard';
import type { Competitor } from '../../types/competitor';

export const CompetitorsList: React.FC = () => {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'rank' | 'name' | 'recent'>('rank');
  const [loading, setLoading] = useState(true);

  // Load competitors from backend on mount
  useEffect(() => {
    loadCompetitors();
  }, []);

  const loadCompetitors = async () => {
    try {
      setLoading(true);
      const data = await competitorsApi.getAll();
      setCompetitors(data as Competitor[]);
    } catch (error) {
      console.error('Failed to load competitors:', error);
      setCompetitors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshCompetitor = async (id: number) => {
    try {
      // Call backend to refresh competitor
      await competitorsApi.refresh(id);
      
      // Reload competitors from backend
      await loadCompetitors();
    } catch (error) {
      console.error('Failed to refresh competitor:', error);
    }
  };

  const filteredCompetitors = competitors
    .filter((comp) =>
      comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.keywords.some((kw) => kw.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'rank':
          return a.rank_position - b.rank_position;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'recent':
          return new Date(b.last_checked_at).getTime() - new Date(a.last_checked_at).getTime();
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Competitor Tracking</h2>
            <p className="text-sm text-gray-500">
              Monitor your competitors' Google Business Profile rankings
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search competitors or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'rank' | 'name' | 'recent')}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-white"
            >
              <option value="rank">Sort by Rank</option>
              <option value="name">Sort by Name</option>
              <option value="recent">Recently Checked</option>
            </select>

            <button className="flex items-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
              <Plus className="w-5 h-5" />
              Add Competitor
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Tracked Competitors</p>
              <p className="text-3xl font-bold text-green-900 mt-1">{competitors.length}</p>
            </div>
            <div className="p-3 bg-green-200 rounded-lg">
              <Users className="w-6 h-6 text-green-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Avg Competitor Rank</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">
                #{(competitors.reduce((sum, c) => sum + c.rank_position, 0) / competitors.length).toFixed(1)}
              </p>
            </div>
            <div className="p-3 bg-blue-200 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Total Keywords</p>
              <p className="text-3xl font-bold text-purple-900 mt-1">
                {competitors.reduce((sum, c) => sum + c.keywords.length, 0)}
              </p>
            </div>
            <div className="p-3 bg-purple-200 rounded-lg">
              <Filter className="w-6 h-6 text-purple-700" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Competitors Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {filteredCompetitors.length > 0 ? (
          filteredCompetitors.map((competitor, index) => (
            <motion.div
              key={competitor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <CompetitorCard competitor={competitor} onRefresh={handleRefreshCompetitor} />
            </motion.div>
          ))
        ) : (
          <div className="col-span-2 text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No competitors found</h3>
            <p className="text-gray-500">Try adjusting your search or add a new competitor to track</p>
          </div>
        )}
      </motion.div>

      {/* Insights Panel */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-bold text-gray-900 mb-4">Competitive Insights</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-2xl">💡</div>
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-1">Ranking Opportunity</p>
              <p className="text-xs text-blue-700">
                {competitors.filter((c) => c.rank_position > 5).length} competitors are ranking below #5,
                presenting opportunities to outrank them with optimized content.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-2xl">🎯</div>
            <div>
              <p className="text-sm font-semibold text-green-900 mb-1">Keyword Coverage</p>
              <p className="text-xs text-green-700">
                Competitors are targeting {competitors.reduce((sum, c) => sum + c.keywords.length, 0)} total keywords.
                Consider expanding your keyword strategy to compete effectively.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
