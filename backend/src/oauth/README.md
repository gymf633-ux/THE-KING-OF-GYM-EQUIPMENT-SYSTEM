# OAuth2 Module for Google Business Profile

This module handles OAuth2 authentication flow for Google Business Profile API integration.

## Configuration Required

Before using OAuth2 authentication, you need to configure Google OAuth credentials as environment variables:

### Local Development

1. Copy the example environment file:
```bash
cp .env.example .dev.vars
```

2. Edit `.dev.vars` and add your credentials:
```
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

### Production Deployment

Set environment variables through your deployment platform:
- `GOOGLE_CLIENT_ID`: Your Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET`: Your Google OAuth Client Secret

**Security Note**: Never commit `.dev.vars` or `.env` files to version control!

## How to Get Google OAuth Credentials

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create or Select Project**: Choose an existing project or create a new one
3. **Enable APIs**: 
   - Go to "APIs & Services" > "Enable APIs and Services"
   - Search and enable "Google My Business API"
4. **Create OAuth Credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URI: `https://backend.youware.com/api/oauth2/google/callback`
   - Save and copy the Client ID and Client Secret
5. **Update Configuration**: Replace `${YOUR_CLIENT_ID}` and `${YOUR_CLIENT_SECRET}` in `googleOAuth.ts`

## OAuth2 Flow

### 1. Initiation
- Frontend calls: `GET /api/oauth2/google/auth`
- Backend generates authorization URL with state parameter
- User is redirected to Google OAuth consent screen

### 2. Authorization
- User authorizes the application on Google's consent screen
- Google redirects back with authorization code and state

### 3. Callback Handler
- Backend receives: `GET /api/oauth2/google/callback?code=xxx&state=xxx`
- Validates state parameter for security
- Exchanges authorization code for access token and refresh token
- Stores tokens securely in database
- Redirects to frontend with success/error status

### 4. Token Management
- Access tokens are stored in database with expiry time
- Refresh tokens are used to automatically renew expired access tokens
- `getValidAccessToken()` function handles automatic token refresh

## API Endpoints

### Initiate OAuth Flow
```
GET /api/oauth2/google/auth
Response: { success: true, auth_url: "https://accounts.google.com/..." }
```

### OAuth Callback (handled by Google)
```
GET /api/oauth2/google/callback?code=xxx&state=xxx
Redirects to: /?oauth=success or /?oauth=error&message=xxx
```

## Security Features

- **State Parameter Validation**: Prevents CSRF attacks
- **Time-Limited States**: OAuth states expire after 10 minutes
- **Secure Token Storage**: Tokens stored in database, never exposed to frontend
- **Automatic Token Refresh**: Access tokens automatically renewed using refresh tokens

## Database Schema

### oauth_states Table
Stores temporary OAuth state parameters for validation:
- `id`: Primary key
- `state`: Random state parameter
- `user_id`: Optional user identifier
- `created_at`: Creation timestamp
- `expires_at`: Expiration timestamp (10 minutes)

## Frontend Integration

The frontend `GBPAnalyticsDashboard` component provides:
- "Sign in with Google" button
- Automatic OAuth callback handling
- Success/error notifications
- Configuration management

## Usage Example

```typescript
// In frontend component
const handleOAuthLogin = async () => {
  const response = await fetch('https://backend.youware.com/api/oauth2/google/auth');
  const data = await response.json();
  window.location.href = data.auth_url;  // Redirect to Google
};

// OAuth callback is automatically handled on page load
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('oauth') === 'success') {
    // OAuth successful, load data
  }
}, []);
```

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI"**
   - Ensure redirect URI in Google Console matches exactly: `https://backend.youware.com/api/oauth2/google/callback`
   - No trailing slashes or query parameters

2. **"Invalid client"**
   - Check that Client ID and Client Secret are correctly set in `googleOAuth.ts`
   - Ensure credentials match the Google Cloud project

3. **"Invalid state parameter"**
   - State may have expired (>10 minutes old)
   - Clear old states from database or retry OAuth flow

4. **Token refresh fails**
   - User may need to re-authorize with `prompt=consent`
   - Check that refresh token was properly stored

## Important Notes

- OAuth2 requires HTTPS in production
- Refresh tokens are only provided on first authorization with `prompt=consent`
- Access tokens typically expire after 1 hour
- Store Client Secret securely, never expose in frontend code
