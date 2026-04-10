import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Upload, TrendingUp, MapPin, Star, Phone, Globe, Image as ImageIcon, Loader } from 'lucide-react';
import { getMockCompetitors } from '../../store/competitorsMock';
import type { Competitor } from '../../types/competitor';

interface CompetitorSearchResult extends Competitor {
  rankingComparison: {
    yourRank: number;
    competitorRank: number;
    difference: number;
    keywords: string[];
  };
}

export const CompetitorTracker: React.FC = () => {
  const competitors = useMemo(() => getMockCompetitors(), []);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CompetitorSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [logoUpload, setLogoUpload] = useState<string | null>(null);

  // Simulate ranking comparison
  const generateRankingComparison = (competitor: Competitor): CompetitorSearchResult['rankingComparison'] => {
    const yourRank = Math.floor(Math.random() * 10) + 1;
    const competitorRank = Math.floor(Math.random() * 10) + 1;
    
    return {
      yourRank,
      competitorRank,
      difference: yourRank - competitorRank,
      keywords: competitor.tracked_keywords || ['gym equipment', 'fitness center', 'playground equipment']
    };
  };

  const handleSearch = () => {
    setIsSearching(true);
    
    // Simulate API call delay
    setTimeout(() => {
      if (searchQuery.trim()) {
        const filtered = competitors.filter(comp => 
          comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          comp.location?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        const resultsWithRanking = filtered.map(comp => ({
          ...comp,
          rankingComparison: generateRankingComparison(comp)
        }));
        
        setSearchResults(resultsWithRanking);
      } else {
        setSearchResults([]);
      }
      setIsSearching(false);
    }, 800);
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUpload(reader.result as string);
        
        // Simulate logo-based search
        setIsSearching(true);
        setTimeout(() => {
          // For demo, return a random competitor
          const randomCompetitor = competitors[Math.floor(Math.random() * competitors.length)];
          setSearchResults([{
            ...randomCompetitor,
            rankingComparison: generateRankingComparison(randomCompetitor)
          }]);
          setIsSearching(false);
        }, 1000);
      };
      reader.readAsDataURL(file);
    }
  };

  const getRankDifferenceColor = (difference: number) => {
    if (difference < 0) return 'text-green-600'; // You rank higher
    if (difference > 0) return 'text-red-600'; // Competitor ranks higher
    return 'text-gray-600'; // Same rank
  };

  const getRankDifferenceText = (difference: number) => {
    if (difference < 0) return `You rank ${Math.abs(difference)} position${Math.abs(difference) > 1 ? 's' : ''} higher`;
    if (difference > 0) return `They rank ${difference} position${difference > 1 ? 's' : ''} higher`;
    return 'Same ranking';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-orange-100 rounded-lg">
          <TrendingUp className="w-6 h-6 text-orange-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Competitor Analysis</h2>
          <p className="text-sm text-gray-600">Search by name or upload competitor logo</p>
        </div>
      </div>

      {/* Search Section */}
      <div className="space-y-4 mb-6">
        {/* Name Search */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search competitor by name or location..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            {isSearching ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Search
              </>
            )}
          </button>
        </div>

        {/* Logo Upload */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
          <label htmlFor="logo-upload" className="cursor-pointer block">
            <div className="flex flex-col items-center gap-2">
              {logoUpload ? (
                <div className="relative">
                  <img src={logoUpload} alt="Uploaded logo" className="w-24 h-24 object-contain rounded-lg" />
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 rounded-lg transition-opacity" />
                </div>
              ) : (
                <div className="p-4 bg-gray-100 rounded-full">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-700">Upload Competitor Logo</p>
                <p className="text-xs text-gray-500 mt-1">Click to upload or drag and drop</p>
              </div>
            </div>
          </label>
          <input
            id="logo-upload"
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Search Results */}
      <AnimatePresence>
        {searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              Search Results ({searchResults.length})
            </h3>

            {searchResults.map((competitor, index) => (
              <motion.div
                key={competitor.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  {/* Competitor Logo/Icon */}
                  <div className="flex-shrink-0">
                    {competitor.logo_url ? (
                      <img 
                        src={competitor.logo_url} 
                        alt={competitor.name}
                        className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-indigo-600" />
                      </div>
                    )}
                  </div>

                  {/* Competitor Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-xl font-bold text-gray-800">{competitor.name}</h4>
                        {competitor.location && (
                          <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                            <MapPin className="w-4 h-4" />
                            {competitor.location}
                          </div>
                        )}
                      </div>
                      {competitor.avg_rating && (
                        <div className="flex items-center gap-1 px-3 py-1 bg-yellow-50 rounded-full">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold text-gray-800">{competitor.avg_rating.toFixed(1)}</span>
                          {competitor.review_count && (
                            <span className="text-xs text-gray-500">({competitor.review_count})</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Ranking Comparison */}
                    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 mb-3">
                      <h5 className="text-sm font-semibold text-gray-700 mb-3">Ranking Comparison</h5>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Your Ranking</p>
                          <p className="text-2xl font-bold text-indigo-600">#{competitor.rankingComparison.yourRank}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Their Ranking</p>
                          <p className="text-2xl font-bold text-gray-800">#{competitor.rankingComparison.competitorRank}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Difference</p>
                          <p className={`text-sm font-bold ${getRankDifferenceColor(competitor.rankingComparison.difference)}`}>
                            {getRankDifferenceText(competitor.rankingComparison.difference)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-xs text-gray-500 mb-2">Tracked Keywords:</p>
                        <div className="flex flex-wrap gap-2">
                          {competitor.rankingComparison.keywords.map((keyword, idx) => (
                            <span key={idx} className="px-2 py-1 bg-white rounded-full text-xs font-medium text-gray-700">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Competitor Details */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {competitor.monthly_views && (
                        <div>
                          <p className="text-xs text-gray-500">Monthly Views</p>
                          <p className="text-sm font-semibold text-gray-800">
                            {competitor.monthly_views.toLocaleString()}
                          </p>
                        </div>
                      )}
                      {competitor.phone && (
                        <div>
                          <p className="text-xs text-gray-500">Phone</p>
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-gray-400" />
                            <p className="text-sm font-semibold text-gray-800">{competitor.phone}</p>
                          </div>
                        </div>
                      )}
                      {competitor.website && (
                        <div>
                          <p className="text-xs text-gray-500">Website</p>
                          <div className="flex items-center gap-1">
                            <Globe className="w-3 h-3 text-gray-400" />
                            <a 
                              href={competitor.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm font-semibold text-indigo-600 hover:underline"
                            >
                              Visit
                            </a>
                          </div>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-gray-500">Status</p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          competitor.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {competitor.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {searchResults.length === 0 && !isSearching && (searchQuery || logoUpload) && (
        <div className="text-center py-12 text-gray-500">
          <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No competitors found</p>
          <p className="text-sm mt-2">Try searching with a different name or location</p>
        </div>
      )}

      {/* Initial State */}
      {searchResults.length === 0 && !searchQuery && !logoUpload && !isSearching && (
        <div className="text-center py-12 text-gray-500">
          <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">Search for competitors</p>
          <p className="text-sm mt-2">Enter a business name, location, or upload their logo to get started</p>
        </div>
      )}
    </div>
  );
};
