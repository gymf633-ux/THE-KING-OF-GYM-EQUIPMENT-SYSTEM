import type { Review } from '../types/review';

/**
 * Mock Google Reviews data for development and testing
 */
export const mockReviews: Review[] = [
  {
    id: 1,
    platform: 'google',
    reviewer_name: 'Test Customer',
    rating: 5,
    text: 'Great service! The gym equipment quality is excellent and the team was very helpful in setting up our home gym.',
    review_date: '2025-11-12T10:11:50Z',
    ai_reply_text: null,
    replied: false,
    created_at: '2025-11-12T10:11:50Z',
    updated_at: '2025-11-12T10:11:50Z',
  },
  {
    id: 2,
    platform: 'google',
    reviewer_name: 'John Smith',
    rating: 5,
    text: 'Outstanding quality gym equipment! The King of Gym Equipment truly lives up to its name. Professional installation and excellent customer service.',
    review_date: '2025-11-10T14:30:00Z',
    ai_reply_text: 'Thank you so much for your kind words, John! We\'re thrilled to hear you\'re happy with your gym equipment. Your satisfaction is our priority!',
    replied: true,
    created_at: '2025-11-10T14:30:00Z',
    updated_at: '2025-11-10T16:00:00Z',
  },
  {
    id: 3,
    platform: 'google',
    reviewer_name: 'Emily Davis',
    rating: 4,
    text: 'Good quality equipment and reasonable prices. Delivery was on time. Would recommend!',
    review_date: '2025-11-09T11:00:00Z',
    ai_reply_text: 'Thank you for your review, Emily! We appreciate your feedback and are glad you\'re satisfied with our products and service.',
    replied: true,
    created_at: '2025-11-09T11:00:00Z',
    updated_at: '2025-11-09T12:30:00Z',
  },
  {
    id: 4,
    platform: 'google',
    reviewer_name: 'Rajesh Patel',
    rating: 5,
    text: 'Best gym equipment supplier in Ahmedabad! High quality products at competitive prices. The team is knowledgeable and helpful.',
    review_date: '2025-11-08T16:45:00Z',
    ai_reply_text: null,
    replied: false,
    created_at: '2025-11-08T16:45:00Z',
    updated_at: '2025-11-08T16:45:00Z',
  },
  {
    id: 5,
    platform: 'google',
    reviewer_name: 'Priya Shah',
    rating: 5,
    text: 'Excellent experience from start to finish. They helped me design my home gym and delivered quality equipment on time. Highly recommended!',
    review_date: '2025-11-07T10:20:00Z',
    ai_reply_text: 'We\'re so grateful for your wonderful review, Priya! It was our pleasure to help you create your dream home gym. Enjoy your workouts!',
    replied: true,
    created_at: '2025-11-07T10:20:00Z',
    updated_at: '2025-11-07T14:00:00Z',
  },
];

export const getMockReviews = (): Review[] => [...mockReviews];
export const getMockReviewById = (id: number) => mockReviews.find(r => r.id === id);
export const getMockReviewsByRating = (rating: number) => mockReviews.filter(r => r.rating === rating);
export const getMockUnrepliedReviews = () => mockReviews.filter(r => !r.replied);
export const getMockAverageRating = () => {
  const total = mockReviews.reduce((sum, r) => sum + r.rating, 0);
  return mockReviews.length > 0 ? (total / mockReviews.length).toFixed(1) : '0.0';
};
