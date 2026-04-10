import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Star, User, Calendar, MessageSquare, CheckCircle } from 'lucide-react';
import { getMockReviews } from '../../store/reviewsMock';
import type { Review } from '../../types/review';

interface ReviewsDetailsProps {
  onClose?: () => void;
}

export const ReviewsDetails: React.FC<ReviewsDetailsProps> = ({ onClose }) => {
  const reviews = useMemo(() => getMockReviews(), []);

  const reviewStats = useMemo(() => {
    const totalReviews = reviews.length;
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
    const ratingDistribution = {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length,
    };
    const repliedCount = reviews.filter(r => r.replied).length;

    return {
      totalReviews,
      avgRating,
      ratingDistribution,
      repliedCount,
      replyRate: totalReviews > 0 ? (repliedCount / totalReviews) * 100 : 0
    };
  }, [reviews]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
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
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6 border border-yellow-200">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5 text-yellow-600" />
            <h4 className="text-sm font-medium text-gray-700">Average Rating</h4>
          </div>
          <div className="flex items-end gap-2">
            <p className="text-4xl font-bold text-yellow-600">
              {reviewStats.avgRating.toFixed(1)}
            </p>
            <div className="mb-1">{renderStars(Math.round(reviewStats.avgRating))}</div>
          </div>
          <p className="text-xs text-gray-600 mt-1">{reviewStats.totalReviews} reviews</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <h4 className="text-sm font-medium text-gray-700">Total Reviews</h4>
          </div>
          <p className="text-4xl font-bold text-blue-600">
            {reviewStats.totalReviews}
          </p>
          <p className="text-xs text-gray-600 mt-1">Customer feedback</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h4 className="text-sm font-medium text-gray-700">Response Rate</h4>
          </div>
          <p className="text-4xl font-bold text-green-600">
            {reviewStats.replyRate.toFixed(0)}%
          </p>
          <p className="text-xs text-gray-600 mt-1">
            {reviewStats.repliedCount} of {reviewStats.totalReviews} replied
          </p>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Rating Distribution</h3>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = reviewStats.ratingDistribution[rating as keyof typeof reviewStats.ratingDistribution];
            const percentage = reviewStats.totalReviews > 0 ? (count / reviewStats.totalReviews) * 100 : 0;

            return (
              <div key={rating} className="flex items-center gap-4">
                <div className="flex items-center gap-1 w-20">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium text-gray-700">{rating}</span>
                </div>
                <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-700 w-16 text-right">
                  {count} ({percentage.toFixed(0)}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews List */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-600" />
          All Reviews
        </h3>

        <div className="space-y-4">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              {/* Review Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-full">
                    <User className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{review.reviewer_name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      {renderStars(review.rating)}
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(review.review_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                {review.replied && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Replied
                  </span>
                )}
              </div>

              {/* Review Text */}
              <div className="mb-3">
                <p className="text-gray-700 leading-relaxed">{review.text}</p>
              </div>

              {/* AI Reply */}
              {review.ai_reply_text && (
                <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 mt-3">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-blue-900 mb-1">Your Response</p>
                      <p className="text-sm text-blue-800">{review.ai_reply_text}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Platform Badge */}
              <div className="mt-3 flex items-center gap-2">
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                  {review.platform === 'google' ? 'Google Reviews' : review.platform}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
