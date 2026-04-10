/**
 * CRM Backend API with Google Business Profile Integration
 * Handles GBP posts, competitors, analytics, and real Google Business API OAuth2
 */

import { initiateOAuth, handleOAuthCallback, getValidAccessToken } from './oauth/googleOAuth';

interface Env {
  DB: D1Database;
}

interface SystemUpdate {
  id: number;
  version: string;
  title: string;
  description: string | null;
  update_type: 'feature' | 'bugfix' | 'design' | 'performance';
  is_active: number;
  requires_reload: number;
  created_at: string;
  updated_at: string;
}

interface GBPPost {
  id: number;
  post_type: 'offer' | 'update' | 'article';
  title: string;
  body: string;
  media_url: string | null;
  scheduled_at: string | null;
  posted_at: string | null;
  created_at: string;
  updated_at: string;
}

interface Competitor {
  id: number;
  name: string;
  keywords: string;
  rank_position: number;
  last_checked_at: string;
  created_at: string;
  updated_at: string;
}

interface GBPAnalytics {
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

interface SEOKeyword {
  id: number;
  keyword: string;
  search_volume: number;
  competition: 'low' | 'medium' | 'high';
  relevance_score: number;
  current_rank: number | null;
  target_rank: number | null;
  is_active: number;
  created_at: string;
  updated_at: string;
}

interface GBPAPIConfig {
  api_key?: string;
  access_token?: string;
  refresh_token?: string;
  account_id?: string;
  location_id?: string;
  token_expiry?: string;
}

interface GBPUserConfig {
  id: number;
  encrypted_yw_id: string;
  api_key: string;
  merchant_id: string | null;
  account_id: string | null;
  location_id: string | null;
  is_configured: number;
  created_at: string;
  updated_at: string;
}

// CORS headers for all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Project-Id, X-Encrypted-Yw-ID, X-Is-Login, X-Yw-Env',
};

function jsonResponse(data: any, status: number = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
}

function errorResponse(message: string, status: number = 400) {
  return jsonResponse({ error: message }, status);
}

async function getGBPConfig(env: Env): Promise<GBPAPIConfig> {
  const stmt = env.DB.prepare('SELECT gbp_api FROM settings WHERE id = 1');
  const result = await stmt.first<{ gbp_api: string }>();
  
  if (!result) {
    return {};
  }
  
  try {
    return JSON.parse(result.gbp_api);
  } catch {
    return {};
  }
}

async function updateGBPConfig(env: Env, config: Partial<GBPAPIConfig>) {
  const currentConfig = await getGBPConfig(env);
  const newConfig = { ...currentConfig, ...config };
  
  const stmt = env.DB.prepare(
    `INSERT INTO settings (id, business_profile, whatsapp_api, gbp_api, pricing, notification_prefs)
     VALUES (1, '{}', '{}', ?, '{}', '{}')
     ON CONFLICT(id) DO UPDATE SET gbp_api = ?, updated_at = datetime('now')`
  );
  
  const configJson = JSON.stringify(newConfig);
  await stmt.bind(configJson, configJson).run();
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // === OAuth2 Endpoints ===
      
      // Initiate OAuth2 flow
      if (path === '/api/oauth2/google/auth' && method === 'GET') {
        const userId = request.headers.get('X-Encrypted-Yw-ID');
        const authUrl = await initiateOAuth(env, userId || undefined);
        
        if (!authUrl) {
          return errorResponse('OAuth credentials not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables.', 500);
        }
        
        return jsonResponse({
          success: true,
          auth_url: authUrl,
        });
      }
      
      // OAuth2 callback handler
      if (path === '/api/oauth2/google/callback' && method === 'GET') {
        const code = url.searchParams.get('code');
        const state = url.searchParams.get('state');
        const error = url.searchParams.get('error');
        
        // Check for OAuth error
        if (error) {
          return new Response(null, {
            status: 302,
            headers: {
              'Location': `/?oauth=error&message=${encodeURIComponent(error)}`,
              ...corsHeaders,
            },
          });
        }
        
        // Validate required parameters
        if (!code || !state) {
          return new Response(null, {
            status: 302,
            headers: {
              'Location': '/?oauth=error&message=Missing+code+or+state',
              ...corsHeaders,
            },
          });
        }
        
        // Handle OAuth callback
        const result = await handleOAuthCallback(env, code, state);
        
        if (result.success) {
          return new Response(null, {
            status: 302,
            headers: {
              'Location': '/?oauth=success',
              ...corsHeaders,
            },
          });
        } else {
          return new Response(null, {
            status: 302,
            headers: {
              'Location': `/?oauth=error&message=${encodeURIComponent(result.error || 'Unknown error')}`,
              ...corsHeaders,
            },
          });
        }
      }
      
      // === Google Business Profile API Configuration ===
      
      // Get GBP API configuration
      if (path === '/api/gbp/config' && method === 'GET') {
        const config = await getGBPConfig(env);
        
        // Don't expose sensitive tokens
        return jsonResponse({
          success: true,
          configured: !!(config.api_key || config.access_token),
          has_account: !!config.account_id,
          has_location: !!config.location_id,
          token_expiry: config.token_expiry || null,
        });
      }
      
      // Update GBP API configuration
      if (path === '/api/gbp/config' && method === 'POST') {
        const body = await request.json() as Partial<GBPAPIConfig>;
        
        await updateGBPConfig(env, body);
        
        return jsonResponse({
          success: true,
          message: 'GBP API configuration updated',
        });
      }
      
      // Fetch real-time analytics from Google Business Profile API
      if (path === '/api/gbp/fetch-analytics' && method === 'POST') {
        const config = await getGBPConfig(env);
        
        if (!config.api_key && !config.access_token) {
          return errorResponse('Google Business Profile API not configured', 401);
        }
        
        const body = await request.json() as {
          start_date?: string;
          end_date?: string;
        };
        
        const startDate = body.start_date || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const endDate = body.end_date || new Date().toISOString().split('T')[0];
        
        // Call Google Business Profile API to fetch analytics
        // API Endpoint: https://mybusiness.googleapis.com/v4/accounts/{accountId}/locations/{locationId}/insights
        const apiUrl = `https://mybusiness.googleapis.com/v4/accounts/${config.account_id}/locations/${config.location_id}/insights`;
        
        const authHeader = config.access_token 
          ? `Bearer ${config.access_token}`
          : `Bearer ${config.api_key}`;
        
        try {
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Authorization': authHeader,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              locationNames: [`accounts/${config.account_id}/locations/${config.location_id}`],
              basicRequest: {
                metricRequests: [
                  { metric: 'QUERIES_DIRECT' },
                  { metric: 'QUERIES_INDIRECT' },
                  { metric: 'VIEWS_MAPS' },
                  { metric: 'VIEWS_SEARCH' },
                  { metric: 'ACTIONS_WEBSITE' },
                  { metric: 'ACTIONS_PHONE' },
                  { metric: 'ACTIONS_DRIVING_DIRECTIONS' },
                ],
                timeRange: {
                  startTime: `${startDate}T00:00:00Z`,
                  endTime: `${endDate}T23:59:59Z`,
                },
              },
            }),
          });
          
          if (!response.ok) {
            const errorData = await response.text();
            console.error('Google API Error:', errorData);
            return errorResponse(`Google API error: ${response.status}`, response.status);
          }
          
          const data = await response.json();
          
          // Process and store analytics data
          const metricsData = data.locationMetrics?.[0]?.metricValues || [];
          
          // Aggregate metrics by date
          const dailyMetrics: Record<string, any> = {};
          
          metricsData.forEach((metric: any) => {
            const metricName = metric.metric;
            metric.dimensionalValues?.forEach((value: any) => {
              const date = value.time?.split('T')[0];
              if (!date) return;
              
              if (!dailyMetrics[date]) {
                dailyMetrics[date] = {
                  date,
                  profile_views: 0,
                  profile_calls: 0,
                  direction_requests: 0,
                  website_clicks: 0,
                  photo_views: 0,
                  search_queries: 0,
                };
              }
              
              const count = parseInt(value.value || '0');
              
              switch (metricName) {
                case 'QUERIES_DIRECT':
                case 'QUERIES_INDIRECT':
                  dailyMetrics[date].search_queries += count;
                  break;
                case 'VIEWS_MAPS':
                case 'VIEWS_SEARCH':
                  dailyMetrics[date].profile_views += count;
                  break;
                case 'ACTIONS_WEBSITE':
                  dailyMetrics[date].website_clicks = count;
                  break;
                case 'ACTIONS_PHONE':
                  dailyMetrics[date].profile_calls = count;
                  break;
                case 'ACTIONS_DRIVING_DIRECTIONS':
                  dailyMetrics[date].direction_requests = count;
                  break;
              }
            });
          });
          
          // Batch insert/update analytics data
          const statements = Object.values(dailyMetrics).map((metrics: any) => {
            const stmt = env.DB.prepare(
              `INSERT INTO gbp_analytics (date, profile_views, profile_calls, direction_requests, website_clicks, photo_views, search_queries)
               VALUES (?, ?, ?, ?, ?, ?, ?)
               ON CONFLICT(date) DO UPDATE SET
                 profile_views = excluded.profile_views,
                 profile_calls = excluded.profile_calls,
                 direction_requests = excluded.direction_requests,
                 website_clicks = excluded.website_clicks,
                 photo_views = excluded.photo_views,
                 search_queries = excluded.search_queries,
                 updated_at = datetime('now')`
            );
            return stmt.bind(
              metrics.date,
              metrics.profile_views,
              metrics.profile_calls,
              metrics.direction_requests,
              metrics.website_clicks,
              metrics.photo_views,
              metrics.search_queries
            );
          });
          
          await env.DB.batch(statements);
          
          return jsonResponse({
            success: true,
            message: 'Analytics fetched and stored successfully',
            records_updated: Object.keys(dailyMetrics).length,
            date_range: { start: startDate, end: endDate },
          });
        } catch (apiError: any) {
          console.error('Google API fetch error:', apiError);
          return errorResponse(`Failed to fetch from Google API: ${apiError.message}`, 500);
        }
      }

      // Check for latest update (public endpoint)
      if (path === '/api/updates/latest' && method === 'GET') {
        const stmt = env.DB.prepare(
          'SELECT * FROM system_updates WHERE is_active = 1 ORDER BY created_at DESC LIMIT 1'
        );
        const result = await stmt.first<SystemUpdate>();
        
        return jsonResponse({
          success: true,
          update: result || null,
        });
      }

      // Get all active updates (public endpoint)
      if (path === '/api/updates' && method === 'GET') {
        const stmt = env.DB.prepare(
          'SELECT * FROM system_updates WHERE is_active = 1 ORDER BY created_at DESC'
        );
        const { results } = await stmt.all<SystemUpdate>();
        
        return jsonResponse({
          success: true,
          updates: results,
        });
      }

      // Admin: Create new update
      if (path === '/api/updates' && method === 'POST') {
        const adminYwId = request.headers.get('X-Admin-Encrypted-Yw-ID');
        const userYwId = request.headers.get('X-Encrypted-Yw-ID');
        
        // Admin check (in real implementation, compare with creator's encrypted_yw_id)
        // For now, we'll allow any authenticated user to create updates
        if (!userYwId) {
          return errorResponse('Authentication required', 401);
        }

        const body = await request.json() as {
          version: string;
          title: string;
          description?: string;
          update_type: 'feature' | 'bugfix' | 'design' | 'performance';
          requires_reload?: boolean;
        };

        if (!body.version || !body.title || !body.update_type) {
          return errorResponse('Missing required fields: version, title, update_type');
        }

        const stmt = env.DB.prepare(
          `INSERT INTO system_updates (version, title, description, update_type, requires_reload)
           VALUES (?, ?, ?, ?, ?)`
        );
        
        await stmt.bind(
          body.version,
          body.title,
          body.description || null,
          body.update_type,
          body.requires_reload ? 1 : 0
        ).run();

        return jsonResponse({
          success: true,
          message: 'Update created successfully',
        }, 201);
      }

      // Admin: Deactivate update
      if (path.startsWith('/api/updates/') && method === 'DELETE') {
        const userYwId = request.headers.get('X-Encrypted-Yw-ID');
        
        if (!userYwId) {
          return errorResponse('Authentication required', 401);
        }

        const updateId = path.split('/').pop();
        
        const stmt = env.DB.prepare(
          'UPDATE system_updates SET is_active = 0, updated_at = datetime(\'now\') WHERE id = ?'
        );
        
        await stmt.bind(updateId).run();

        return jsonResponse({
          success: true,
          message: 'Update deactivated successfully',
        });
      }

      // === GBP Posts Endpoints ===
      
      // Get all GBP posts
      if (path === '/api/gbp/posts' && method === 'GET') {
        const stmt = env.DB.prepare(
          'SELECT * FROM gbp_posts ORDER BY created_at DESC'
        );
        const { results } = await stmt.all<GBPPost>();
        
        return jsonResponse({
          success: true,
          posts: results,
        });
      }

      // Create GBP post
      if (path === '/api/gbp/posts' && method === 'POST') {
        const body = await request.json() as {
          post_type: 'offer' | 'update' | 'article';
          title: string;
          body: string;
          media_url?: string | null;
          scheduled_at?: string | null;
          posted_at?: string | null;
        };

        if (!body.post_type || !body.title || !body.body) {
          return errorResponse('Missing required fields: post_type, title, body');
        }

        const stmt = env.DB.prepare(
          `INSERT INTO gbp_posts (post_type, title, body, media_url, scheduled_at, posted_at)
           VALUES (?, ?, ?, ?, ?, ?)`
        );
        
        const result = await stmt.bind(
          body.post_type,
          body.title,
          body.body,
          body.media_url || null,
          body.scheduled_at || null,
          body.posted_at || null
        ).run();

        return jsonResponse({
          success: true,
          message: 'Post created successfully',
          post_id: result.meta.last_row_id,
        }, 201);
      }

      // Update GBP post
      if (path.startsWith('/api/gbp/posts/') && method === 'PUT') {
        const postId = path.split('/').pop();
        const body = await request.json() as Partial<{
          post_type: string;
          title: string;
          body: string;
          media_url: string | null;
          scheduled_at: string | null;
          posted_at: string | null;
        }>;

        const updates: string[] = [];
        const values: any[] = [];

        if (body.post_type) { updates.push('post_type = ?'); values.push(body.post_type); }
        if (body.title) { updates.push('title = ?'); values.push(body.title); }
        if (body.body) { updates.push('body = ?'); values.push(body.body); }
        if (body.media_url !== undefined) { updates.push('media_url = ?'); values.push(body.media_url); }
        if (body.scheduled_at !== undefined) { updates.push('scheduled_at = ?'); values.push(body.scheduled_at); }
        if (body.posted_at !== undefined) { updates.push('posted_at = ?'); values.push(body.posted_at); }

        if (updates.length === 0) {
          return errorResponse('No fields to update');
        }

        updates.push('updated_at = datetime(\'now\')');
        values.push(postId);

        const stmt = env.DB.prepare(
          `UPDATE gbp_posts SET ${updates.join(', ')} WHERE id = ?`
        );
        
        await stmt.bind(...values).run();

        return jsonResponse({
          success: true,
          message: 'Post updated successfully',
        });
      }

      // Delete GBP post
      if (path.startsWith('/api/gbp/posts/') && method === 'DELETE') {
        const postId = path.split('/').pop();
        
        const stmt = env.DB.prepare('DELETE FROM gbp_posts WHERE id = ?');
        await stmt.bind(postId).run();

        return jsonResponse({
          success: true,
          message: 'Post deleted successfully',
        });
      }

      // === Competitors Endpoints ===
      
      // Get all competitors
      if (path === '/api/competitors' && method === 'GET') {
        const stmt = env.DB.prepare(
          'SELECT * FROM competitors ORDER BY rank_position ASC'
        );
        const { results } = await stmt.all<Competitor>();
        
        // Parse keywords from JSON string to array
        const competitors = results.map(comp => ({
          ...comp,
          keywords: JSON.parse(comp.keywords),
        }));
        
        return jsonResponse({
          success: true,
          competitors,
        });
      }

      // Create competitor
      if (path === '/api/competitors' && method === 'POST') {
        const body = await request.json() as {
          name: string;
          keywords: string[];
          rank_position: number;
        };

        if (!body.name || !body.keywords || !body.rank_position) {
          return errorResponse('Missing required fields: name, keywords, rank_position');
        }

        const stmt = env.DB.prepare(
          `INSERT INTO competitors (name, keywords, rank_position, last_checked_at)
           VALUES (?, ?, ?, datetime('now'))`
        );
        
        const result = await stmt.bind(
          body.name,
          JSON.stringify(body.keywords),
          body.rank_position
        ).run();

        return jsonResponse({
          success: true,
          message: 'Competitor created successfully',
          competitor_id: result.meta.last_row_id,
        }, 201);
      }

      // Update competitor
      if (path.startsWith('/api/competitors/') && method === 'PUT') {
        const competitorId = path.split('/').pop();
        const body = await request.json() as Partial<{
          name: string;
          keywords: string[];
          rank_position: number;
          last_checked_at: string;
        }>;

        const updates: string[] = [];
        const values: any[] = [];

        if (body.name) { updates.push('name = ?'); values.push(body.name); }
        if (body.keywords) { updates.push('keywords = ?'); values.push(JSON.stringify(body.keywords)); }
        if (body.rank_position) { updates.push('rank_position = ?'); values.push(body.rank_position); }
        if (body.last_checked_at) { updates.push('last_checked_at = ?'); values.push(body.last_checked_at); }

        if (updates.length === 0) {
          return errorResponse('No fields to update');
        }

        updates.push('updated_at = datetime(\'now\')');
        values.push(competitorId);

        const stmt = env.DB.prepare(
          `UPDATE competitors SET ${updates.join(', ')} WHERE id = ?`
        );
        
        await stmt.bind(...values).run();

        return jsonResponse({
          success: true,
          message: 'Competitor updated successfully',
        });
      }

      // Delete competitor
      if (path.startsWith('/api/competitors/') && method === 'DELETE') {
        const competitorId = path.split('/').pop();
        
        const stmt = env.DB.prepare('DELETE FROM competitors WHERE id = ?');
        await stmt.bind(competitorId).run();

        return jsonResponse({
          success: true,
          message: 'Competitor deleted successfully',
        });
      }

      // === GBP Analytics Endpoints ===
      
      // Get analytics data
      if (path === '/api/gbp/analytics' && method === 'GET') {
        const days = url.searchParams.get('days') || '30';
        
        const stmt = env.DB.prepare(
          `SELECT * FROM gbp_analytics 
           WHERE date >= date('now', '-' || ? || ' days')
           ORDER BY date DESC`
        );
        const { results } = await stmt.bind(days).all<GBPAnalytics>();
        
        return jsonResponse({
          success: true,
          analytics: results,
        });
      }

      // Update analytics data (batch)
      if (path === '/api/gbp/analytics' && method === 'POST') {
        const body = await request.json() as {
          date: string;
          profile_views?: number;
          profile_calls?: number;
          direction_requests?: number;
          website_clicks?: number;
          photo_views?: number;
          search_queries?: number;
        };

        if (!body.date) {
          return errorResponse('Missing required field: date');
        }

        // Upsert analytics data
        const stmt = env.DB.prepare(
          `INSERT INTO gbp_analytics (date, profile_views, profile_calls, direction_requests, website_clicks, photo_views, search_queries)
           VALUES (?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(date) DO UPDATE SET
             profile_views = excluded.profile_views,
             profile_calls = excluded.profile_calls,
             direction_requests = excluded.direction_requests,
             website_clicks = excluded.website_clicks,
             photo_views = excluded.photo_views,
             search_queries = excluded.search_queries,
             updated_at = datetime('now')`
        );
        
        await stmt.bind(
          body.date,
          body.profile_views || 0,
          body.profile_calls || 0,
          body.direction_requests || 0,
          body.website_clicks || 0,
          body.photo_views || 0,
          body.search_queries || 0
        ).run();

        return jsonResponse({
          success: true,
          message: 'Analytics updated successfully',
        }, 201);
      }

      // === SEO Keywords Endpoints ===
      
      // Get all active keywords
      if (path === '/api/seo/keywords' && method === 'GET') {
        const activeOnly = url.searchParams.get('active') === 'true';
        
        let query = 'SELECT * FROM seo_keywords';
        if (activeOnly) {
          query += ' WHERE is_active = 1';
        }
        query += ' ORDER BY relevance_score DESC';
        
        const stmt = env.DB.prepare(query);
        const { results } = await stmt.all<SEOKeyword>();
        
        return jsonResponse({
          success: true,
          keywords: results,
        });
      }

      // Add new keyword
      if (path === '/api/seo/keywords' && method === 'POST') {
        const body = await request.json() as {
          keyword: string;
          search_volume?: number;
          competition: 'low' | 'medium' | 'high';
          relevance_score?: number;
          target_rank?: number;
        };

        if (!body.keyword || !body.competition) {
          return errorResponse('Missing required fields: keyword, competition');
        }

        const stmt = env.DB.prepare(
          `INSERT INTO seo_keywords (keyword, search_volume, competition, relevance_score, target_rank)
           VALUES (?, ?, ?, ?, ?)`
        );
        
        const result = await stmt.bind(
          body.keyword,
          body.search_volume || 0,
          body.competition,
          body.relevance_score || 0,
          body.target_rank || null
        ).run();

        return jsonResponse({
          success: true,
          message: 'Keyword added successfully',
          keyword_id: result.meta.last_row_id,
        }, 201);
      }

      // Update keyword
      if (path.startsWith('/api/seo/keywords/') && method === 'PUT') {
        const keywordId = path.split('/').pop();
        const body = await request.json() as Partial<{
          keyword: string;
          search_volume: number;
          competition: string;
          relevance_score: number;
          current_rank: number;
          target_rank: number;
          is_active: number;
        }>;

        const updates: string[] = [];
        const values: any[] = [];

        if (body.keyword) { updates.push('keyword = ?'); values.push(body.keyword); }
        if (body.search_volume !== undefined) { updates.push('search_volume = ?'); values.push(body.search_volume); }
        if (body.competition) { updates.push('competition = ?'); values.push(body.competition); }
        if (body.relevance_score !== undefined) { updates.push('relevance_score = ?'); values.push(body.relevance_score); }
        if (body.current_rank !== undefined) { updates.push('current_rank = ?'); values.push(body.current_rank); }
        if (body.target_rank !== undefined) { updates.push('target_rank = ?'); values.push(body.target_rank); }
        if (body.is_active !== undefined) { updates.push('is_active = ?'); values.push(body.is_active); }

        if (updates.length === 0) {
          return errorResponse('No fields to update');
        }

        updates.push('updated_at = datetime(\'now\')');
        values.push(keywordId);

        const stmt = env.DB.prepare(
          `UPDATE seo_keywords SET ${updates.join(', ')} WHERE id = ?`
        );
        
        await stmt.bind(...values).run();

        return jsonResponse({
          success: true,
          message: 'Keyword updated successfully',
        });
      }

      // Delete keyword
      if (path.startsWith('/api/seo/keywords/') && method === 'DELETE') {
        const keywordId = path.split('/').pop();
        
        const stmt = env.DB.prepare('DELETE FROM seo_keywords WHERE id = ?');
        await stmt.bind(keywordId).run();

        return jsonResponse({
          success: true,
          message: 'Keyword deleted successfully',
        });
      }

      // === Google Business API Integration ===
      
      // Publish post to Google Business Profile
      if (path === '/api/gbp/publish' && method === 'POST') {
        const body = await request.json() as {
          post_id: number;
        };

        if (!body.post_id) {
          return errorResponse('Missing required field: post_id');
        }

        // Get the post
        const postStmt = env.DB.prepare('SELECT * FROM gbp_posts WHERE id = ?');
        const post = await postStmt.bind(body.post_id).first<GBPPost>();

        if (!post) {
          return errorResponse('Post not found', 404);
        }

        const config = await getGBPConfig(env);
        
        if (!config.api_key && !config.access_token) {
          return errorResponse('Google Business Profile API not configured', 401);
        }

        // Call real Google Business Profile API to create local post
        // API Endpoint: https://mybusiness.googleapis.com/v4/accounts/{accountId}/locations/{locationId}/localPosts
        const apiUrl = `https://mybusiness.googleapis.com/v4/accounts/${config.account_id}/locations/${config.location_id}/localPosts`;
        
        const authHeader = config.access_token 
          ? `Bearer ${config.access_token}`
          : `Bearer ${config.api_key}`;
        
        // Map post types to Google's expected format
        const topicTypeMap: Record<string, string> = {
          'offer': 'OFFER',
          'update': 'STANDARD',
          'article': 'EVENT',
        };
        
        try {
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Authorization': authHeader,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              languageCode: 'en',
              summary: post.title,
              callToAction: {
                actionType: 'LEARN_MORE',
                url: post.body.match(/https?:\/\/[^\s]+/)?.[0] || '',
              },
              topicType: topicTypeMap[post.post_type] || 'STANDARD',
              ...(post.media_url && {
                media: [{
                  mediaFormat: 'PHOTO',
                  sourceUrl: post.media_url,
                }],
              }),
            }),
          });
          
          if (!response.ok) {
            const errorData = await response.text();
            console.error('Google API Error:', errorData);
            return errorResponse(`Failed to publish post: ${response.status}`, response.status);
          }
          
          const publishedPost = await response.json();
          
          // Update post in database
          const updateStmt = env.DB.prepare(
            `UPDATE gbp_posts SET posted_at = datetime('now'), updated_at = datetime('now') WHERE id = ?`
          );
          await updateStmt.bind(body.post_id).run();

          return jsonResponse({
            success: true,
            message: 'Post published to Google Business Profile',
            post_id: body.post_id,
            google_post_id: publishedPost.name,
            published_at: new Date().toISOString(),
          });
        } catch (apiError: any) {
          console.error('Google API publish error:', apiError);
          return errorResponse(`Failed to publish: ${apiError.message}`, 500);
        }
      }

      // === Backend Verification Endpoints ===
      
      // Verify OAuth token validity
      if (path === '/api/verify/token' && method === 'POST') {
        try {
          const body = await request.json() as { test_token?: string };
          const testToken = body.test_token;
          
          if (!testToken) {
            return errorResponse('Missing test_token parameter', 400);
          }
          
          // Verify token format and structure
          const isValidFormat = /^ya29\.[a-zA-Z0-9_-]+$/.test(testToken);
          
          if (!isValidFormat) {
            return jsonResponse({
              success: false,
              valid: false,
              error: 'Invalid token format',
              message: 'Token must start with ya29. and contain valid characters',
            });
          }
          
          // Check if token matches stored token
          const config = await getGBPConfig(env);
          const isStoredToken = config.access_token === testToken;
          
          // Check expiry if it's stored token
          let isExpired = false;
          if (isStoredToken && config.token_expiry) {
            isExpired = new Date(config.token_expiry) < new Date();
          }
          
          return jsonResponse({
            success: true,
            valid: isValidFormat && !isExpired,
            is_stored: isStoredToken,
            is_expired: isExpired,
            format_valid: isValidFormat,
            token_expiry: isStoredToken ? config.token_expiry : null,
            message: isStoredToken 
              ? (isExpired ? 'Token expired' : 'Token valid')
              : 'Token format valid but not stored',
          });
        } catch (error: any) {
          console.error('Token verification error:', error);
          return errorResponse(`Token verification failed: ${error.message}`, 500);
        }
      }
      
      // Verify OAuth state in database
      if (path === '/api/verify/oauth-state' && method === 'POST') {
        try {
          const body = await request.json() as { state?: string };
          const testState = body.state;
          
          if (!testState) {
            return errorResponse('Missing state parameter', 400);
          }
          
          // Check state in database
          const stmt = env.DB.prepare(
            `SELECT state, created_at, expires_at FROM oauth_states WHERE state = ?`
          );
          const result = await stmt.bind(testState).first<{
            state: string;
            created_at: string;
            expires_at: string;
          }>();
          
          if (!result) {
            return jsonResponse({
              success: true,
              exists: false,
              valid: false,
              message: 'State not found in database',
            });
          }
          
          const now = new Date();
          const expiresAt = new Date(result.expires_at);
          const isExpired = expiresAt < now;
          
          return jsonResponse({
            success: true,
            exists: true,
            valid: !isExpired,
            is_expired: isExpired,
            created_at: result.created_at,
            expires_at: result.expires_at,
            message: isExpired ? 'State expired' : 'State valid',
          });
        } catch (error: any) {
          console.error('OAuth state verification error:', error);
          return errorResponse(`State verification failed: ${error.message}`, 500);
        }
      }
      
      // Verify database cleanup
      if (path === '/api/verify/cleanup-status' && method === 'GET') {
        try {
          // Count expired OAuth states
          const expiredStatesStmt = env.DB.prepare(
            `SELECT COUNT(*) as count FROM oauth_states WHERE expires_at < datetime('now')`
          );
          const expiredStates = await expiredStatesStmt.first<{ count: number }>();
          
          // Count valid OAuth states
          const validStatesStmt = env.DB.prepare(
            `SELECT COUNT(*) as count FROM oauth_states WHERE expires_at >= datetime('now')`
          );
          const validStates = await validStatesStmt.first<{ count: number }>();
          
          // Get total states
          const totalStatesStmt = env.DB.prepare(
            `SELECT COUNT(*) as count FROM oauth_states`
          );
          const totalStates = await totalStatesStmt.first<{ count: number }>();
          
          return jsonResponse({
            success: true,
            oauth_states: {
              total: totalStates?.count || 0,
              valid: validStates?.count || 0,
              expired: expiredStates?.count || 0,
            },
            cleanup_needed: (expiredStates?.count || 0) > 0,
            message: (expiredStates?.count || 0) > 0
              ? 'Expired states found - cleanup recommended'
              : 'No cleanup needed',
          });
        } catch (error: any) {
          console.error('Cleanup status check error:', error);
          return errorResponse(`Cleanup check failed: ${error.message}`, 500);
        }
      }
      
      // Clean up expired OAuth states
      if (path === '/api/verify/cleanup' && method === 'POST') {
        try {
          const stmt = env.DB.prepare(
            `DELETE FROM oauth_states WHERE expires_at < datetime('now')`
          );
          const result = await stmt.run();
          
          return jsonResponse({
            success: true,
            deleted: result.meta.changes || 0,
            message: `Cleaned up ${result.meta.changes || 0} expired OAuth states`,
          });
        } catch (error: any) {
          console.error('Cleanup error:', error);
          return errorResponse(`Cleanup failed: ${error.message}`, 500);
        }
      }
      
      // === GBP Configuration Endpoints ===
      
      // Save GBP credentials
      if (path === '/api/gbp/credentials' && method === 'POST') {
        try {
          const userId = request.headers.get('X-Encrypted-Yw-ID');
          if (!userId) {
            return errorResponse('User ID required', 401);
          }

          const body = await request.json() as {
            api_key: string;
            merchant_id?: string;
            account_id?: string;
            location_id?: string;
          };

          if (!body.api_key || body.api_key.trim() === '') {
            return errorResponse('API key is required', 400);
          }

          // Check if config exists
          const checkStmt = env.DB.prepare(
            'SELECT id FROM gbp_config WHERE encrypted_yw_id = ?'
          );
          const existing = await checkStmt.bind(userId).first<{ id: number }>();

          if (existing) {
            // Update existing config
            const updateStmt = env.DB.prepare(
              `UPDATE gbp_config 
               SET api_key = ?, merchant_id = ?, account_id = ?, location_id = ?, 
                   is_configured = 1, updated_at = datetime('now')
               WHERE encrypted_yw_id = ?`
            );
            await updateStmt.bind(
              body.api_key,
              body.merchant_id || null,
              body.account_id || null,
              body.location_id || null,
              userId
            ).run();
          } else {
            // Insert new config
            const insertStmt = env.DB.prepare(
              `INSERT INTO gbp_config (encrypted_yw_id, api_key, merchant_id, account_id, location_id, is_configured)
               VALUES (?, ?, ?, ?, ?, 1)`
            );
            await insertStmt.bind(
              userId,
              body.api_key,
              body.merchant_id || null,
              body.account_id || null,
              body.location_id || null
            ).run();
          }

          return jsonResponse({
            success: true,
            message: 'GBP credentials saved successfully',
          });
        } catch (error: any) {
          console.error('Save GBP credentials error:', error);
          return errorResponse(`Failed to save credentials: ${error.message}`, 500);
        }
      }

      // Get GBP credentials
      if (path === '/api/gbp/credentials' && method === 'GET') {
        try {
          const userId = request.headers.get('X-Encrypted-Yw-ID');
          if (!userId) {
            return errorResponse('User ID required', 401);
          }

          const stmt = env.DB.prepare(
            'SELECT api_key, merchant_id, account_id, location_id, is_configured FROM gbp_config WHERE encrypted_yw_id = ?'
          );
          const config = await stmt.bind(userId).first<{
            api_key: string;
            merchant_id: string | null;
            account_id: string | null;
            location_id: string | null;
            is_configured: number;
          }>();

          if (!config) {
            return jsonResponse({
              configured: false,
              has_credentials: false,
              api_key: null,
              merchant_id: null,
              account_id: null,
              location_id: null,
            });
          }

          return jsonResponse({
            configured: config.is_configured === 1,
            has_credentials: true,
            // Return masked API key for security (show last 4 characters only)
            api_key: config.api_key ? `***${config.api_key.slice(-4)}` : null,
            merchant_id: config.merchant_id,
            account_id: config.account_id,
            location_id: config.location_id,
          });
        } catch (error: any) {
          console.error('Get GBP credentials error:', error);
          return errorResponse(`Failed to retrieve credentials: ${error.message}`, 500);
        }
      }

      // Delete GBP credentials
      if (path === '/api/gbp/credentials' && method === 'DELETE') {
        try {
          const userId = request.headers.get('X-Encrypted-Yw-ID');
          if (!userId) {
            return errorResponse('User ID required', 401);
          }

          const stmt = env.DB.prepare('DELETE FROM gbp_config WHERE encrypted_yw_id = ?');
          await stmt.bind(userId).run();

          return jsonResponse({
            success: true,
            message: 'GBP credentials deleted successfully',
          });
        } catch (error: any) {
          console.error('Delete GBP credentials error:', error);
          return errorResponse(`Failed to delete credentials: ${error.message}`, 500);
        }
      }

      // Verify token refresh capability
      if (path === '/api/verify/token-refresh' && method === 'GET') {
        try {
          const config = await getGBPConfig(env);
          
          const hasAccessToken = !!config.access_token;
          const hasRefreshToken = !!config.refresh_token;
          const hasExpiry = !!config.token_expiry;
          
          let canRefresh = false;
          let needsRefresh = false;
          let minutesUntilExpiry = null;
          
          if (hasExpiry && config.token_expiry) {
            const expiry = new Date(config.token_expiry);
            const now = new Date();
            minutesUntilExpiry = Math.round((expiry.getTime() - now.getTime()) / (1000 * 60));
            needsRefresh = minutesUntilExpiry <= 0;
            canRefresh = hasRefreshToken && needsRefresh;
          }
          
          return jsonResponse({
            success: true,
            has_access_token: hasAccessToken,
            has_refresh_token: hasRefreshToken,
            has_token_expiry: hasExpiry,
            can_refresh: canRefresh,
            needs_refresh: needsRefresh,
            minutes_until_expiry: minutesUntilExpiry,
            token_expiry: config.token_expiry || null,
            message: canRefresh 
              ? 'Token expired and can be refreshed'
              : needsRefresh 
                ? 'Token expired but no refresh token'
                : 'Token valid or no expiry set',
          });
        } catch (error: any) {
          console.error('Token refresh check error:', error);
          return errorResponse(`Refresh check failed: ${error.message}`, 500);
        }
      }

      return errorResponse('Endpoint not found', 404);
    } catch (error: any) {
      console.error('API Error:', error);
      return errorResponse(error.message || 'Internal server error', 500);
    }
  },
};
