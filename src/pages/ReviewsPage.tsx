import React, { useState } from 'react';
import { Star, ThumbsUp, MessageSquare, Send, Sparkles, Calendar } from 'lucide-react';
import { getMockReviews, getMockUnrepliedReviews, getMockAverageRating } from '../store/reviewsMock';
import type { Review } from '../types/review';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(getMockReviews());
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [aiReply, setAiReply] = useState<string>('');
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unreplied' | '5star' | '4star' | '3star'>('all');

  const averageRating = getMockAverageRating();
  const unrepliedCount = getMockUnrepliedReviews().length;

  const filteredReviews = reviews.filter(review => {
    if (filter === 'unreplied') return !review.replied;
    if (filter === '5star') return review.rating === 5;
    if (filter === '4star') return review.rating === 4;
    if (filter === '3star') return review.rating <= 3;
    return true;
  });

  const generateAIReply = (review: Review) => {
    setIsGeneratingReply(true);
    setSelectedReview(review);
    
    // Simulate AI reply generation
    setTimeout(() => {
      const replyTemplates = {
        5: `Thank you so much for your wonderful 5-star review, ${review.reviewer_name}! We're thrilled to hear you're happy with our gym equipment. Your satisfaction is our priority!`,
        4: `Thank you for your positive feedback, ${review.reviewer_name}! We appreciate your 4-star rating and are glad you're satisfied with our products and service.`,
        3: `Thank you for your review, ${review.reviewer_name}. We appreciate your honest feedback and will work on improving our service. Please let us know if there's anything we can do better!`,
        2: `We're sorry to hear about your experience, ${review.reviewer_name}. Your feedback is important to us. Please contact us directly so we can address your concerns.`,
        1: `We sincerely apologize for your disappointing experience, ${review.reviewer_name}. We take your feedback very seriously. Please reach out to us at support@kingofgym.com so we can make this right.`
      };
      
      const template = replyTemplates[review.rating as keyof typeof replyTemplates] || replyTemplates[5];
      setAiReply(template);
      setIsGeneratingReply(false);
    }, 1500);
  };

  const postReply = () => {
    if (!selectedReview || !aiReply.trim()) return;

    const updatedReviews = reviews.map(r => 
      r.id === selectedReview.id 
        ? { ...r, ai_reply_text: aiReply, replied: true, updated_at: new Date().toISOString() }
        : r
    );
    
    setReviews(updatedReviews);
    setSelectedReview(null);
    setAiReply('');
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Google Reviews
          </h1>
          <p className="text-gray-600">
            Manage customer reviews and build your online reputation
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-3xl font-bold text-gray-900">{averageRating}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Average Rating</h3>
            <p className="text-xs text-gray-500 mt-1">{reviews.length} total reviews</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <MessageSquare className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-3xl font-bold text-gray-900">{unrepliedCount}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Pending Replies</h3>
            <p className="text-xs text-gray-500 mt-1">Needs your response</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <ThumbsUp className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-3xl font-bold text-gray-900">
                {reviews.filter(r => r.rating === 5).length}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">5-Star Reviews</h3>
            <p className="text-xs text-gray-500 mt-1">Excellent ratings</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-200">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Reviews ({reviews.length})
            </button>
            <button
              onClick={() => setFilter('unreplied')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'unreplied'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Unreplied ({unrepliedCount})
            </button>
            <button
              onClick={() => setFilter('5star')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === '5star'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ⭐ 5 Stars
            </button>
            <button
              onClick={() => setFilter('4star')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === '4star'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ⭐ 4 Stars
            </button>
            <button
              onClick={() => setFilter('3star')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === '3star'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ⭐ 3 & Below
            </button>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No reviews found
              </h3>
              <p className="text-gray-600">
                {filter === 'unreplied'
                  ? 'All reviews have been replied to!'
                  : 'No reviews match the selected filter.'}
              </p>
            </div>
          ) : (
            filteredReviews.map(review => (
              <div
                key={review.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  {/* Review Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {review.reviewer_name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {review.reviewer_name}
                          </h3>
                          <div className="flex items-center gap-2">
                            {renderStars(review.rating)}
                            <span className="text-sm text-gray-500">
                              • {new Date(review.review_date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {!review.replied && (
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                        Pending Reply
                      </span>
                    )}
                    {review.replied && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        ✓ Replied
                      </span>
                    )}
                  </div>

                  {/* Review Text */}
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {review.text}
                  </p>

                  {/* AI Reply Section */}
                  {review.replied && review.ai_reply_text && (
                    <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-indigo-600" />
                        <span className="text-sm font-medium text-indigo-900">
                          Your Reply
                        </span>
                      </div>
                      <p className="text-sm text-indigo-800">{review.ai_reply_text}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {!review.replied && (
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => generateAIReply(review)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-sm"
                      >
                        <Sparkles className="w-4 h-4" />
                        Generate AI Reply
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* AI Reply Modal */}
        {selectedReview && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Reply to Review
                </h2>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="font-medium">{selectedReview.reviewer_name}</span>
                  <span>•</span>
                  {renderStars(selectedReview.rating)}
                </div>
              </div>

              <div className="p-6">
                {/* Original Review */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Customer Review:
                  </p>
                  <p className="text-gray-800">{selectedReview.text}</p>
                </div>

                {/* AI Generated Reply */}
                {isGeneratingReply ? (
                  <div className="mb-6 p-8 bg-indigo-50 rounded-lg text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
                    <p className="text-indigo-700 font-medium">
                      Generating AI reply...
                    </p>
                  </div>
                ) : (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Reply:
                    </label>
                    <textarea
                      value={aiReply}
                      onChange={(e) => setAiReply(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                      rows={6}
                      placeholder="Edit the AI-generated reply or write your own..."
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setSelectedReview(null);
                      setAiReply('');
                      setIsGeneratingReply(false);
                    }}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={postReply}
                    disabled={isGeneratingReply || !aiReply.trim()}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    <Send className="w-4 h-4" />
                    Post Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
