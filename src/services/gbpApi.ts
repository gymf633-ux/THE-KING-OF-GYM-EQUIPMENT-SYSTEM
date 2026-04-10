/**
 * GBP API Service
 * Handles API calls to backend for GBP posts, competitors, and Google Business API
 */

const API_BASE_URL = 'https://backend.youware.com';

export interface GBPConfig {
  configured: boolean;
  has_account: boolean;
  has_location: boolean;
  token_expiry: string | null;
}

export interface GBPAnalytics {
  id: number;
  date: string;
  profile_views: number;
  profile_calls: number;
  direction_requests: number;
  website_clicks: number;
  photo_views: number;
  search_queries: number;
  created_at: string;
  updated_at: string;
}

export interface GBPPostAPI {
  id: number;
  post_type: 'offer' | 'update' | 'article';
  title: string;
  body: string;
  media_url?: string | null;
  scheduled_at?: string | null;
  posted_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CompetitorAPI {
  id: number;
  name: string;
  keywords: string[];
  rank_position: number;
  last_checked_at: string;
  created_at: string;
  updated_at: string;
}

export interface CreateGBPPostInput {
  post_type: 'offer' | 'update' | 'article';
  title: string;
  body: string;
  media_url?: string | null;
  scheduled_at?: string | null;
  posted_at?: string | null;
}

export interface CreateCompetitorInput {
  name: string;
  keywords: string[];
  rank_position: number;
}

// GBP Posts API
export const gbpPostsApi = {
  async getAll(): Promise<GBPPostAPI[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/gbp/posts`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch posts');
      }
      
      return data.posts || [];
    } catch (error) {
      console.error('Error fetching GBP posts:', error);
      throw error;
    }
  },

  async create(post: CreateGBPPostInput): Promise<number> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/gbp/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create post');
      }
      
      return data.post_id;
    } catch (error) {
      console.error('Error creating GBP post:', error);
      throw error;
    }
  },

  async update(id: number, updates: Partial<GBPPostAPI>): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/gbp/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update post');
      }
    } catch (error) {
      console.error('Error updating GBP post:', error);
      throw error;
    }
  },

  async delete(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/gbp/posts/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting GBP post:', error);
      throw error;
    }
  },
};

// Competitors API
export const competitorsApi = {
  async getAll(): Promise<CompetitorAPI[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/competitors`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch competitors');
      }
      
      return data.competitors || [];
    } catch (error) {
      console.error('Error fetching competitors:', error);
      throw error;
    }
  },

  async create(competitor: CreateCompetitorInput): Promise<number> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/competitors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(competitor),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create competitor');
      }
      
      return data.competitor_id;
    } catch (error) {
      console.error('Error creating competitor:', error);
      throw error;
    }
  },

  async update(id: number, updates: Partial<CompetitorAPI>): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/competitors/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update competitor');
      }
    } catch (error) {
      console.error('Error updating competitor:', error);
      throw error;
    }
  },

  async delete(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/competitors/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete competitor');
      }
    } catch (error) {
      console.error('Error deleting competitor:', error);
      throw error;
    }
  },

  async refresh(id: number): Promise<void> {
    try {
      // Update last_checked_at to current time
      await this.update(id, {
        last_checked_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error refreshing competitor:', error);
      throw error;
    }
  },
};

// GBP Credentials Management
export const gbpCredentialsApi = {
  async save(credentials: {
    api_key: string;
    merchant_id?: string;
    account_id?: string;
    location_id?: string;
  }): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/gbp/credentials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save GBP credentials');
      }
    } catch (error) {
      console.error('Error saving GBP credentials:', error);
      throw error;
    }
  },

  async get(): Promise<{
    configured: boolean;
    has_credentials: boolean;
    api_key: string | null;
    merchant_id: string | null;
    account_id: string | null;
    location_id: string | null;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/gbp/credentials`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch GBP credentials');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching GBP credentials:', error);
      throw error;
    }
  },

  async delete(): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/gbp/credentials`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete GBP credentials');
      }
    } catch (error) {
      console.error('Error deleting GBP credentials:', error);
      throw error;
    }
  },
};

// Google Business API
export const googleBusinessApi = {
  async getConfig(): Promise<GBPConfig> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/gbp/config`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch GBP config');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching GBP config:', error);
      throw error;
    }
  },

  async updateConfig(config: { 
    api_key?: string;
    access_token?: string;
    account_id?: string;
    location_id?: string;
  }): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/gbp/config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update GBP config');
      }
    } catch (error) {
      console.error('Error updating GBP config:', error);
      throw error;
    }
  },

  async fetchAnalytics(startDate?: string, endDate?: string): Promise<{ records_updated: number; date_range: { start: string; end: string } }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/gbp/fetch-analytics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          start_date: startDate,
          end_date: endDate,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch analytics from Google');
      }
      
      return {
        records_updated: data.records_updated,
        date_range: data.date_range,
      };
    } catch (error) {
      console.error('Error fetching analytics from Google:', error);
      throw error;
    }
  },

  async getAnalytics(days: number = 30): Promise<GBPAnalytics[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/gbp/analytics?days=${days}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch analytics');
      }
      
      return data.analytics || [];
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  },

  async publishPost(postId: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/gbp/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ post_id: postId }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to publish post');
      }
    } catch (error) {
      console.error('Error publishing post:', error);
      throw error;
    }
  },
};
