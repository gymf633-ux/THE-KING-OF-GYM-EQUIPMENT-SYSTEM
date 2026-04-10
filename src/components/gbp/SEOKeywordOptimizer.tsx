import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Target, Loader } from 'lucide-react';
import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';

interface SEOKeywordSuggestion {
  keyword: string;
  search_volume: number;
  competition: 'low' | 'medium' | 'high';
  relevance_score: number;
  current_rank: number | null;
  target_rank: number | null;
  category: 'gym' | 'playground' | 'both';
  rationale: string;
}

export const SEOKeywordOptimizer: React.FC = () => {
  const [keywords, setKeywords] = useState<SEOKeywordSuggestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [businessContext, setBusinessContext] = useState({
    businessName: 'The King of Gym Equipment',
    industry: 'Gym Equipment & Playground Equipment',
    location: 'Mumbai, India'
  });

  const keywordSchema = z.object({
    keywords: z.array(z.object({
      keyword: z.string(),
      search_volume: z.number(),
      competition: z.enum(['low', 'medium', 'high']),
      relevance_score: z.number().min(0).max(1),
      current_rank: z.number().nullable(),
      target_rank: z.number().nullable(),
      category: z.enum(['gym', 'playground', 'both']),
      rationale: z.string()
    }))
  });

  const generateKeywordSuggestions = async () => {
    const startTime = Date.now();
    setIsGenerating(true);

    console.log('🎯 Starting SEO keyword generation:', { businessContext });

    const config = globalThis.ywConfig?.ai_config?.seo_keyword_optimizer;
    if (!config) {
      console.error('❌ API Error - SEO config not found');
      alert('SEO keyword optimizer configuration not found. Please check yw_manifest.json');
      setIsGenerating(false);
      return;
    }

    const systemPrompt = config.system_prompt(businessContext);

    console.log('🤖 AI API Request (SEO Keywords):', {
      model: config.model,
      scene: 'seo_keyword_optimizer',
      context: businessContext,
      parameters: {
        temperature: config.temperature,
        maxTokens: config.maxTokens
      }
    });

    const openai = createOpenAI({
      baseURL: 'https://api.youware.com/public/v1/ai',
      apiKey: 'sk-YOUWARE'
    });

    try {
      const result = await generateObject({
        model: openai(config.model),
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: `Generate comprehensive SEO keyword suggestions for ${businessContext.businessName}, specializing in ${businessContext.industry}, located in ${businessContext.location}. Include 10-15 high-impact keywords covering: product terms, service terms, local SEO, competitor keywords, and long-tail keywords.` 
          }
        ],
        schema: keywordSchema,
        temperature: config.temperature || 0.6,
        maxTokens: config.maxTokens || 3000
      });

      console.log('✅ AI API Response (SEO Keywords):', {
        model: config.model,
        keywordsGenerated: result.object.keywords.length,
        processingTime: `${Date.now() - startTime}ms`
      });

      setKeywords(result.object.keywords);

      // Save keywords to backend
      await Promise.all(result.object.keywords.map(async (kw) => {
        try {
          await fetch('https://backend.youware.com/api/seo/keywords', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              keyword: kw.keyword,
              search_volume: kw.search_volume,
              competition: kw.competition,
              relevance_score: kw.relevance_score,
              target_rank: kw.target_rank
            })
          });
        } catch (error) {
          console.error('Failed to save keyword:', kw.keyword, error);
        }
      }));

    } catch (error: any) {
      console.error('❌ API Error - SEO keyword generation failed:', {
        model: config.model,
        error: error.message,
        processingTime: `${Date.now() - startTime}ms`
      });
      alert(`API Error - Failed to generate keywords: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const getCompetitionColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Target className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">SEO Keyword Optimizer</h2>
            <p className="text-sm text-gray-600">AI-powered keyword suggestions for better rankings</p>
          </div>
        </div>
        <button
          onClick={generateKeywordSuggestions}
          disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isGenerating ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Keywords
            </>
          )}
        </button>
      </div>

      {keywords.length === 0 && !isGenerating && (
        <div className="text-center py-12 text-gray-500">
          <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No keywords generated yet</p>
          <p className="text-sm mt-2">Click "Generate Keywords" to get AI-powered SEO suggestions</p>
        </div>
      )}

      {keywords.length > 0 && (
        <div className="space-y-3">
          {keywords.map((keyword, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-800 text-lg">{keyword.keyword}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      keyword.category === 'gym' ? 'bg-blue-100 text-blue-700' : 
                      keyword.category === 'playground' ? 'bg-green-100 text-green-700' : 
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {keyword.category === 'gym' ? 'Gym' : keyword.category === 'playground' ? 'Playground' : 'Both'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{keyword.rationale}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${getCompetitionColor(keyword.competition)}`}>
                  {keyword.competition}
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                <div>
                  <p className="text-xs text-gray-500">Monthly Searches</p>
                  <p className="text-sm font-bold text-gray-800">{keyword.search_volume.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Relevance Score</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-indigo-500" 
                        style={{ width: `${keyword.relevance_score * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-gray-800">
                      {Math.round(keyword.relevance_score * 100)}%
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Current Rank</p>
                  <p className="text-sm font-bold text-gray-800">
                    {keyword.current_rank ? `#${keyword.current_rank}` : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Target Rank</p>
                  <p className="text-sm font-bold text-indigo-600">
                    {keyword.target_rank ? `#${keyword.target_rank}` : 'N/A'}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
