/**
 * Review type definition for Google Reviews
 */
export interface Review {
  id: number;
  platform: 'google';
  reviewer_name: string;
  rating: number; // 1-5 stars
  text: string;
  review_date: string;
  ai_reply_text?: string | null;
  replied: boolean;
  created_at: string;
  updated_at: string;
}
