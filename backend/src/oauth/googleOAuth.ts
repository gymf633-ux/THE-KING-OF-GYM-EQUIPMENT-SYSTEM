/**
 * Google OAuth2 Authentication Handler
 * Manages OAuth2 flow for Google Business Profile API
 */

interface Env {
  DB: D1Database;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
}

interface OAuthState {
  state: string;
  created_at: string;
  user_id?: string;
}

interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

// Google OAuth2 Configuration
function getOAuthConfig(env: Env) {
  return {
    clientId: env.GOOGLE_CLIENT_ID || '',
    clientSecret: env.GOOGLE_CLIENT_SECRET || '',
    redirectUri: 'https://backend.youware.com/api/oauth2/google/callback',
    authEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
    scopes: [
      'https://www.googleapis.com/auth/business.manage',
      'https://www.googleapis.com/auth/plus.business.manage'
    ]
  };
}

/**
 * Validate OAuth configuration
 */
function validateOAuthConfig(env: Env): boolean {
  return !!(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET);
}

/**
 * Generate a random state parameter for OAuth2 security
 */
function generateState(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Store OAuth state in database for validation
 */
async function storeOAuthState(env: Env, state: string, userId?: string): Promise<void> {
  const stmt = env.DB.prepare(
    `INSERT INTO oauth_states (state, user_id, created_at, expires_at)
     VALUES (?, ?, datetime('now'), datetime('now', '+10 minutes'))`
  );
  await stmt.bind(state, userId || null).run();
}

/**
 * Validate OAuth state parameter
 */
async function validateOAuthState(env: Env, state: string): Promise<boolean> {
  const stmt = env.DB.prepare(
    `SELECT * FROM oauth_states 
     WHERE state = ? 
     AND expires_at > datetime('now')`
  );
  const result = await stmt.bind(state).first();
  
  if (result) {
    // Delete used state
    const deleteStmt = env.DB.prepare('DELETE FROM oauth_states WHERE state = ?');
    await deleteStmt.bind(state).run();
    return true;
  }
  
  return false;
}

/**
 * Exchange authorization code for access token
 */
async function exchangeCodeForToken(env: Env, code: string): Promise<TokenResponse> {
  const config = getOAuthConfig(env);
  
  const response = await fetch(config.tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      redirect_uri: config.redirectUri,
      grant_type: 'authorization_code',
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token exchange failed: ${error}`);
  }

  return await response.json();
}

/**
 * Store OAuth tokens in database
 */
async function storeTokens(env: Env, tokens: TokenResponse): Promise<void> {
  const expiryDate = new Date(Date.now() + tokens.expires_in * 1000).toISOString();
  
  const stmt = env.DB.prepare(
    `INSERT INTO settings (id, business_profile, whatsapp_api, gbp_api, pricing, notification_prefs)
     VALUES (1, '{}', '{}', ?, '{}', '{}')
     ON CONFLICT(id) DO UPDATE SET gbp_api = ?, updated_at = datetime('now')`
  );
  
  const config = {
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    token_expiry: expiryDate,
    scope: tokens.scope,
  };
  
  const configJson = JSON.stringify(config);
  await stmt.bind(configJson, configJson).run();
}

/**
 * Refresh access token using refresh token
 */
async function refreshAccessToken(env: Env, refreshToken: string): Promise<TokenResponse> {
  const config = getOAuthConfig(env);
  
  const response = await fetch(config.tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token refresh failed: ${error}`);
  }

  return await response.json();
}

/**
 * Initialize OAuth2 flow - Generate authorization URL
 */
export async function initiateOAuth(env: Env, userId?: string): Promise<string | null> {
  // Validate OAuth configuration
  if (!validateOAuthConfig(env)) {
    console.error('OAuth credentials not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.');
    return null;
  }
  
  const config = getOAuthConfig(env);
  const state = generateState();
  await storeOAuthState(env, state, userId);
  
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    scope: config.scopes.join(' '),
    state,
    access_type: 'offline', // Request refresh token
    prompt: 'consent', // Force consent screen to get refresh token
  });
  
  return `${config.authEndpoint}?${params.toString()}`;
}

/**
 * Handle OAuth2 callback - Exchange code for tokens
 */
export async function handleOAuthCallback(
  env: Env,
  code: string,
  state: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate state parameter
    const isValidState = await validateOAuthState(env, state);
    if (!isValidState) {
      return { success: false, error: 'Invalid or expired state parameter' };
    }
    
    // Validate OAuth configuration
    if (!validateOAuthConfig(env)) {
      return { success: false, error: 'OAuth credentials not configured' };
    }
    
    // Exchange code for tokens
    const tokens = await exchangeCodeForToken(env, code);
    
    // Store tokens in database
    await storeTokens(env, tokens);
    
    return { success: true };
  } catch (error: any) {
    console.error('OAuth callback error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get current access token (refresh if expired)
 */
export async function getValidAccessToken(env: Env): Promise<string | null> {
  try {
    const stmt = env.DB.prepare('SELECT gbp_api FROM settings WHERE id = 1');
    const result = await stmt.first<{ gbp_api: string }>();
    
    if (!result) {
      return null;
    }
    
    const config = JSON.parse(result.gbp_api);
    
    // Check if token is expired
    if (config.token_expiry && new Date(config.token_expiry) > new Date()) {
      return config.access_token;
    }
    
    // Token expired, refresh it
    if (config.refresh_token && validateOAuthConfig(env)) {
      const newTokens = await refreshAccessToken(env, config.refresh_token);
      await storeTokens(env, newTokens);
      return newTokens.access_token;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting valid access token:', error);
    return null;
  }
}
