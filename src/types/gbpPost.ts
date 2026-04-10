export type PostType = 'offer' | 'update' | 'article';

export interface GBPPost {
  id: number;
  post_type: PostType;
  title: string;
  body: string;
  media_url?: string | null;
  scheduled_at?: string | null;
  posted_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateGBPPostInput {
  post_type: PostType;
  title: string;
  body: string;
  media_url?: string | null;
  scheduled_at?: string | null;
  posted_at?: string | null;
}

export interface UpdateGBPPostInput {
  post_type?: PostType;
  title?: string;
  body?: string;
  media_url?: string | null;
  scheduled_at?: string | null;
  posted_at?: string | null;
}
