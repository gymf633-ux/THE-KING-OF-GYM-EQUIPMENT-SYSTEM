# OAuth Flow Testing Guide

This guide provides step-by-step instructions for testing the Google OAuth2 integration end-to-end.

## Prerequisites

Before testing, ensure you have:

1. **Google Cloud Console Setup** (see `SETUP_GOOGLE_OAUTH.md` for detailed instructions)
   - Project created in Google Cloud Console
   - Google My Business API enabled
   - OAuth 2.0 Client ID created (Web application type)
   - Redirect URI configured: `https://backend.youware.com/api/oauth2/google/callback`
   - Client ID and Client Secret obtained

2. **Backend Deployed**
   - Backend code deployed to Cloudflare Workers
   - Environment variables configured (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)

## Testing Steps

### Step 1: Configure Environment Variables

**For Production (Deployed Backend):**
```bash
cd backend
wrangler secret put GOOGLE_CLIENT_ID
# Paste your Client ID when prompted

wrangler secret put GOOGLE_CLIENT_SECRET
# Paste your Client Secret when prompted
```

**For Local Testing:**
```bash
cd backend
cp .env.example .dev.vars
# Edit .dev.vars and add your actual credentials
```

### Step 2: Deploy Backend

Deploy the backend to production:
```bash
cd backend
npm install
wrangler deploy
```

Expected output:
```
Total Upload: XX.XX KiB / gzip: XX.XX KiB
Uploaded gym-crm-backend (X.XX sec)
Published gym-crm-backend (X.XX sec)
  https://gym-crm-backend.your-subdomain.workers.dev
```

### Step 3: Test OAuth Initiation Endpoint

**Test the auth initiation endpoint:**

```bash
curl -X GET "https://backend.youware.com/api/oauth2/google/auth" \
  -H "X-Project-Id: 1a68d3e1-1781-454e-8bcc-aa7a2851934e"
```

**Expected Response:**
```json
{
  "success": true,
  "auth_url": "https://accounts.google.com/o/oauth2/v2/auth?client_id=...&redirect_uri=...&response_type=code&scope=...&state=...&access_type=offline&prompt=consent"
}
```

**If credentials not configured:**
```json
{
  "error": "OAuth credentials not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables."
}
```

### Step 4: Test Full OAuth Flow (Manual)

1. **Get Authorization URL:**
   - Call the `/api/oauth2/google/auth` endpoint (Step 3)
   - Copy the `auth_url` from the response

2. **Authorize Application:**
   - Open the `auth_url` in a browser
   - Sign in with your Google account
   - Grant permissions when prompted
   - You will be redirected to: `https://backend.youware.com/api/oauth2/google/callback?code=...&state=...`

3. **Verify Success:**
   - After redirect, you should see the application homepage with: `/?oauth=success`
   - If error occurs, you'll see: `/?oauth=error&message=...`

4. **Check Token Storage:**
   - Verify tokens are stored in the database by checking the GBP API config:

```bash
curl -X GET "https://backend.youware.com/api/gbp/config" \
  -H "X-Project-Id: 1a68d3e1-1781-454e-8bcc-aa7a2851934e"
```

**Expected Response:**
```json
{
  "success": true,
  "configured": true,
  "has_account": false,
  "has_location": false,
  "token_expiry": "2025-11-12T15:50:36.000Z"
}
```

### Step 5: Test Frontend Integration

The frontend component `GBPAnalyticsDashboard` has a "Sign in with Google" button that:

1. Calls `/api/oauth2/google/auth` to get the authorization URL
2. Opens the authorization URL in a new window
3. Handles the callback redirect with OAuth status

**Test in the application:**
1. Open the application homepage
2. Navigate to the GBP Optimizer page
3. Click "Sign in with Google"
4. Complete the authorization flow
5. Verify the success message appears

### Step 6: Test Token Refresh

Tokens expire after 1 hour. Test the refresh mechanism:

```bash
# This endpoint will automatically refresh expired tokens
curl -X GET "https://backend.youware.com/api/gbp/config" \
  -H "X-Project-Id: 1a68d3e1-1781-454e-8bcc-aa7a2851934e"
```

The backend will:
1. Check if the access token is expired
2. If expired, use the refresh token to get a new access token
3. Update the token in the database
4. Return the config with the new expiry time

## Testing OAuth State Security

The OAuth flow uses a `state` parameter for CSRF protection:

1. **State Generation:**
   - A random 64-character hex string is generated
   - Stored in `oauth_states` table with 10-minute expiry
   - Included in the authorization URL

2. **State Validation:**
   - On callback, the state parameter is validated
   - Must exist in the database and not be expired
   - State is deleted after use (one-time use)

**Test invalid state:**
```bash
# This should fail with "Invalid or expired state parameter"
curl -X GET "https://backend.youware.com/api/oauth2/google/callback?code=test&state=invalid"
```

## Common Issues and Troubleshooting

### Issue: "OAuth credentials not configured"

**Solution:**
- Ensure environment variables are set correctly
- For production: Use `wrangler secret put`
- For local: Check `.dev.vars` file

### Issue: "Redirect URI mismatch"

**Solution:**
- Verify the redirect URI in Google Cloud Console matches exactly:
  - `https://backend.youware.com/api/oauth2/google/callback`
- No trailing slashes or extra parameters

### Issue: "Invalid grant" error

**Solution:**
- The authorization code has expired (valid for 10 minutes)
- Start the flow again from Step 3

### Issue: "Access denied" error

**Solution:**
- User declined authorization
- Try again and click "Allow" when prompted

### Issue: Tokens not refreshing

**Solution:**
- Ensure `refresh_token` is stored in the database
- Check that `access_type=offline` is set in the auth URL
- Verify `prompt=consent` forces the consent screen

## Database Schema

The OAuth flow uses two tables:

**oauth_states** (temporary state storage):
```sql
CREATE TABLE IF NOT EXISTS oauth_states (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  state TEXT NOT NULL UNIQUE,
  user_id TEXT,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL
);
```

**settings** (token storage):
```sql
CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY,
  gbp_api TEXT NOT NULL DEFAULT '{}',
  -- other fields...
);
```

**GBP API Config Structure:**
```json
{
  "access_token": "ya29.a0...",
  "refresh_token": "1//0g...",
  "token_expiry": "2025-11-12T15:50:36.000Z",
  "scope": "https://www.googleapis.com/auth/business.manage ..."
}
```

## Success Criteria

✅ OAuth flow completes successfully
✅ Authorization URL generated with correct parameters
✅ State parameter validated correctly
✅ Access token and refresh token stored in database
✅ Token expiry time calculated and stored
✅ Frontend receives success callback
✅ Tokens automatically refresh when expired

## Next Steps After Successful OAuth

Once OAuth is working:

1. **Configure Business Profile:**
   - Set `account_id` and `location_id` in GBP config
   - Test analytics fetching: `/api/gbp/fetch-analytics`

2. **Test Google API Integration:**
   - Fetch real analytics data
   - Publish posts to Google Business Profile

3. **Monitor Token Refresh:**
   - Watch logs for automatic token refresh
   - Verify refresh happens before token expiry
