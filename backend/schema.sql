-- System Updates Table
CREATE TABLE IF NOT EXISTS system_updates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  version TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  update_type TEXT NOT NULL CHECK(update_type IN ('feature', 'bugfix', 'design', 'performance')),
  is_active INTEGER NOT NULL DEFAULT 1,
  requires_reload INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
) STRICT;

-- Indexes for system_updates
CREATE INDEX IF NOT EXISTS idx_system_updates_version ON system_updates(version);
CREATE INDEX IF NOT EXISTS idx_system_updates_is_active ON system_updates(is_active);
CREATE INDEX IF NOT EXISTS idx_system_updates_created_at ON system_updates(created_at);

-- GBP Analytics Table
CREATE TABLE IF NOT EXISTS gbp_analytics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL UNIQUE,
  profile_views INTEGER NOT NULL DEFAULT 0,
  profile_calls INTEGER NOT NULL DEFAULT 0,
  direction_requests INTEGER NOT NULL DEFAULT 0,
  website_clicks INTEGER NOT NULL DEFAULT 0,
  photo_views INTEGER NOT NULL DEFAULT 0,
  search_queries INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
) STRICT;

-- Indexes for gbp_analytics
CREATE INDEX IF NOT EXISTS idx_gbp_analytics_date ON gbp_analytics(date);

-- SEO Keywords Table
CREATE TABLE IF NOT EXISTS seo_keywords (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  keyword TEXT NOT NULL,
  search_volume INTEGER NOT NULL DEFAULT 0,
  competition TEXT NOT NULL CHECK(competition IN ('low', 'medium', 'high')),
  relevance_score REAL NOT NULL DEFAULT 0.0,
  current_rank INTEGER,
  target_rank INTEGER,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
) STRICT;

-- Indexes for seo_keywords
CREATE INDEX IF NOT EXISTS idx_seo_keywords_keyword ON seo_keywords(keyword);
CREATE INDEX IF NOT EXISTS idx_seo_keywords_is_active ON seo_keywords(is_active);
CREATE INDEX IF NOT EXISTS idx_seo_keywords_relevance ON seo_keywords(relevance_score DESC);

-- OAuth States Table (for state parameter validation)
CREATE TABLE IF NOT EXISTS oauth_states (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  state TEXT NOT NULL UNIQUE,
  user_id TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at TEXT NOT NULL
) STRICT;

-- Indexes for oauth_states
CREATE INDEX IF NOT EXISTS idx_oauth_states_state ON oauth_states(state);
CREATE INDEX IF NOT EXISTS idx_oauth_states_expires_at ON oauth_states(expires_at);

-- GBP Configuration Table (stores user-specific Google Business Profile credentials)
CREATE TABLE IF NOT EXISTS gbp_config (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  encrypted_yw_id TEXT NOT NULL UNIQUE,
  api_key TEXT NOT NULL,
  merchant_id TEXT,
  account_id TEXT,
  location_id TEXT,
  is_configured INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
) STRICT;

-- Indexes for gbp_config
CREATE INDEX IF NOT EXISTS idx_gbp_config_user ON gbp_config(encrypted_yw_id);
