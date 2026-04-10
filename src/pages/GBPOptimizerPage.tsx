import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Sparkles, Users } from 'lucide-react';
import { GBPPostList } from '../components/gbp/GBPPostList';
import { KeywordSelector } from '../components/gbp/KeywordSelector';
import { PerformanceKPICards } from '../components/gbp/PerformanceKPICards';
import { PostCreationModal } from '../components/gbp/PostCreationModal';
import { CompetitorsList } from '../components/gbp/CompetitorsList';
import { SEOKeywordOptimizer } from '../components/gbp/SEOKeywordOptimizer';
import { GBPAnalyticsDashboard } from '../components/gbp/GBPAnalyticsDashboard';
import { gbpPostsApi } from '../services/gbpApi';
import type { CreateGBPPostInput } from '../types/gbpPost';
import type { GBPPost } from '../types/gbpPost';

export const GBPOptimizerPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState<GBPPost[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'seo' | 'competitors'>('overview');
  const [loading, setLoading] = useState(true);

  // Load posts from backend on mount
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await gbpPostsApi.getAll();
      // Show only posted posts (not scheduled)
      const postedPosts = data.filter(p => p.posted_at !== null).slice(0, 3);
      setPosts(postedPosts as GBPPost[]);
    } catch (error) {
      console.error('Failed to load posts:', error);
      // Fallback to empty array on error
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeywordsChange = (keywords: string[]) => {
    console.log('Selected keywords:', keywords);
    // TODO: Save keywords to backend
  };

  const handleCreatePost = async (postData: CreateGBPPostInput) => {
    try {
      // Save to backend
      await gbpPostsApi.create(postData);
      
      // Reload posts from backend
      await loadPosts();
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('Failed to create post. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl shadow-xl p-8 text-white"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">GBP Optimizer</h1>
              <p className="text-blue-100 mt-1">
                Manage your Google Business Profile with powerful tools
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-6">
            {/* Tab Navigation */}
            <div className="flex gap-2 mr-auto overflow-x-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'bg-white text-indigo-600 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'
                }`}
              >
                <Sparkles className="w-5 h-5" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                  activeTab === 'analytics'
                    ? 'bg-white text-indigo-600 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'
                }`}
              >
                📊 Analytics
              </button>
              <button
                onClick={() => setActiveTab('seo')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                  activeTab === 'seo'
                    ? 'bg-white text-indigo-600 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'
                }`}
              >
                🔍 SEO Keywords
              </button>
              <button
                onClick={() => setActiveTab('competitors')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                  activeTab === 'competitors'
                    ? 'bg-white text-indigo-600 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'
                }`}
              >
                <Users className="w-5 h-5" />
                Competitors
              </button>
            </div>

            {activeTab === 'overview' && (
              <>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  Create New Post
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/30 transition-colors border border-white/30">
                  View All Posts
                </button>
              </>
            )}
          </div>
        </motion.div>

        {/* Content Based on Active Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Performance Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <PerformanceKPICards
                views={3450}
                calls={125}
                directions={89}
                viewsTrend={12.5}
                callsTrend={8.3}
                directionsTrend={15.7}
              />
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Posts */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-2"
              >
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Recent Posts</h2>
                  <p className="text-gray-600">Your latest updates and offers</p>
                </div>
                <GBPPostList posts={posts} />
                <div className="mt-4 text-center">
                  <button className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
                    View All Posts →
                  </button>
                </div>
              </motion.div>

              {/* Keyword Selector */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="lg:col-span-1"
              >
                <KeywordSelector onKeywordsChange={handleKeywordsChange} />
              </motion.div>
            </div>
          </>
        )}

        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <GBPAnalyticsDashboard />
          </motion.div>
        )}

        {activeTab === 'seo' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SEOKeywordOptimizer />
          </motion.div>
        )}

        {activeTab === 'competitors' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CompetitorsList />
          </motion.div>
        )}

        {/* Quick Actions Guide - Only show on overview tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">What you can do with GBP Optimizer</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                <div className="text-2xl mb-2">📝</div>
                <h4 className="font-semibold text-gray-900 mb-1">Create Posts</h4>
                <p className="text-xs text-gray-600">Share updates, offers, and articles directly</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                <div className="text-2xl mb-2">🔍</div>
                <h4 className="font-semibold text-gray-900 mb-1">SEO Keywords</h4>
                <p className="text-xs text-gray-600">Optimize visibility with targeted keywords</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                <div className="text-2xl mb-2">📊</div>
                <h4 className="font-semibold text-gray-900 mb-1">Track Metrics</h4>
                <p className="text-xs text-gray-600">Monitor views, calls, and directions</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                <div className="text-2xl mb-2">🎯</div>
                <h4 className="font-semibold text-gray-900 mb-1">Compare Competitors</h4>
                <p className="text-xs text-gray-600">Analyze performance against competitors</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Post Creation Modal */}
      <PostCreationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreatePost}
      />
    </div>
  );
};
