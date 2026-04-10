import React, { useState } from 'react';
import { Search, Tag, TrendingUp, X } from 'lucide-react';

interface KeywordSelectorProps {
  onKeywordsChange?: (keywords: string[]) => void;
}

const SUGGESTED_KEYWORDS = [
  'gym equipment',
  'fitness equipment',
  'home gym',
  'commercial gym',
  'power rack',
  'weight bench',
  'dumbbells',
  'cardio machines',
  'strength training',
  'gym setup',
  'fitness solutions',
  'workout equipment',
  'bodybuilding equipment',
  'CrossFit equipment',
  'gym accessories',
];

export const KeywordSelector: React.FC<KeywordSelectorProps> = ({ onKeywordsChange }) => {
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([
    'gym equipment',
    'fitness equipment',
    'home gym',
  ]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddKeyword = (keyword: string) => {
    if (!selectedKeywords.includes(keyword)) {
      const newKeywords = [...selectedKeywords, keyword];
      setSelectedKeywords(newKeywords);
      onKeywordsChange?.(newKeywords);
      setSearchTerm('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    const newKeywords = selectedKeywords.filter((k) => k !== keyword);
    setSelectedKeywords(newKeywords);
    onKeywordsChange?.(newKeywords);
  };

  const filteredSuggestions = SUGGESTED_KEYWORDS.filter(
    (keyword) =>
      !selectedKeywords.includes(keyword) &&
      keyword.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Tag className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">SEO Keywords</h2>
          <p className="text-sm text-gray-500">
            Optimize your Google Business Profile visibility
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search or add custom keywords..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && searchTerm.trim()) {
              handleAddKeyword(searchTerm.trim());
            }
          }}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
        />
      </div>

      {/* Selected Keywords */}
      {selectedKeywords.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-semibold text-gray-700">
              Active Keywords ({selectedKeywords.length})
            </span>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedKeywords.map((keyword) => (
              <span
                key={keyword}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium border border-indigo-200 hover:bg-indigo-200 transition-colors"
              >
                {keyword}
                <button
                  onClick={() => handleRemoveKeyword(keyword)}
                  className="hover:bg-indigo-300 rounded-full p-0.5 transition-colors"
                  aria-label={`Remove ${keyword}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Suggested Keywords */}
      {filteredSuggestions.length > 0 && (
        <div>
          <div className="text-sm font-semibold text-gray-700 mb-3">
            Suggested Keywords
          </div>
          <div className="flex flex-wrap gap-2">
            {filteredSuggestions.map((keyword) => (
              <button
                key={keyword}
                onClick={() => handleAddKeyword(keyword)}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium border border-gray-200 hover:bg-gray-200 hover:border-gray-300 transition-all"
              >
                + {keyword}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* SEO Tips */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex gap-2">
          <div className="text-blue-600 text-xl">💡</div>
          <div>
            <p className="text-sm font-semibold text-blue-900 mb-1">SEO Tips:</p>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Use specific, location-based keywords for better local visibility</li>
              <li>• Focus on 5-10 high-quality keywords rather than many generic ones</li>
              <li>• Include keywords naturally in your posts and updates</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
