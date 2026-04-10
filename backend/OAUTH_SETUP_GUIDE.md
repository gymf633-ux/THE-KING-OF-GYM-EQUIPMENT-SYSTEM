# Google OAuth2 Setup Guide

This guide will walk you through setting up Google OAuth2 credentials for the Google Business Profile integration.

## Step 1: Access Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Create a new project or select an existing one

## Step 2: Enable Required APIs

1. Navigate to **APIs & Services** > **Library**
2. Search for and enable these APIs:
   - **Google My Business API**
   - **Google Business Profile API**

## Step 3: Configure OAuth Consent Screen

1. Go to **APIs & Services** > **OAuth consent screen**
2. Choose **External** user type (unless you have a Google Workspace)
3. Fill in the required information:
   - **App name**: Your application name (e.g., "CRM Dashboard")
   - **User support email**: Your email
   - **Developer contact information**: Your email
4. Click **Save and Continue**
5. On the **Scopes** page, click **Add or Remove Scopes**
6. Add these scopes:
   - `https://www.googleapis.com/auth/business.manage`
   - `https://www.googleapis.com/auth/plus.business.manage`
7. Click **Update** and then **Save and Continue**
8. Add test users (your Google account email)
9. Click **Save and Continue**

## Step 4: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **+ CREATE CREDENTIALS** > **OAuth client ID**
3. Select **Web application** as the application type
4. Configure the OAuth client:
   - **Name**: Choose a descriptive name (e.g., "CRM Backend OAuth")
   - **Authorized JavaScript origins**: (leave empty for backend-only OAuth)
   - **Authorized redirect URIs**: Add this exact URL:
     ```
     https://backend.youware.com/api/oauth2/google/callback
     ```
5. Click **Create**
6. A dialog will appear with your **Client ID** and **Client Secret**
   - **IMPORTANT**: Copy both values immediately - you won't be able to see the Client Secret again!

## Step 5: Configure Your Backend

### For Local Development:

1. Navigate to the `backend` directory
2. Copy the example environment file:
   ```bash
   cp .env.example .dev.vars
   ```
3. Edit `.dev.vars` and paste your credentials:
   ```
   GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-actual-client-secret
   ```
4. Save the file

### For Production Deployment:

Set the environment variables in your deployment platform. The exact method depends on your hosting:

**Cloudflare Workers (Wrangler CLI):**
```bash
wrangler secret put GOOGLE_CLIENT_ID
# Paste your Client ID when prompted

wrangler secret put GOOGLE_CLIENT_SECRET
# Paste your Client Secret when prompted
```

**Youware Platform:**
Contact platform support to set environment variables securely.

## Step 6: Verify Configuration

1. Start your backend server
2. Check the logs for any OAuth configuration errors
3. Test the OAuth flow:
   - Visit your frontend application
   - Click "Sign in with Google" in the GBP Analytics Dashboard
   - You should be redirected to Google's authorization page
   - After authorizing, you should be redirected back to your app

## Troubleshooting

### "Error: OAuth credentials not configured"

**Cause**: Environment variables are not set correctly.

**Solution**:
- Check that `.dev.vars` exists and contains both variables
- Verify there are no typos in the variable names
- Restart your development server after changing environment variables

### "Error: redirect_uri_mismatch"

**Cause**: The redirect URI in your code doesn't match what's configured in Google Cloud Console.

**Solution**:
1. Go to Google Cloud Console > Credentials
2. Edit your OAuth 2.0 Client ID
3. Ensure the redirect URI is exactly: `https://backend.youware.com/api/oauth2/google/callback`
4. No trailing slashes, no query parameters
5. Save the changes

### "Error: invalid_client"

**Cause**: Client ID or Client Secret is incorrect.

**Solution**:
1. Go to Google Cloud Console > Credentials
2. Verify the Client ID matches your environment variable
3. If needed, regenerate a new Client Secret
4. Update your `.dev.vars` file with the new secret

### "Error: access_denied"

**Cause**: User didn't grant permissions or your app isn't published.

**Solution**:
- Ensure your app includes test users on the OAuth consent screen
- Make sure you're signing in with a test user account
- Check that required scopes are added to the OAuth consent screen

### Testing OAuth Without Publishing

During development, your OAuth app is in "Testing" mode. Only users listed as test users can authorize the app.

To add test users:
1. Go to **OAuth consent screen**
2. Scroll to **Test users**
3. Click **+ ADD USERS**
4. Enter email addresses of accounts that should be able to test

## Security Best Practices

1. **Never commit secrets**: Ensure `.dev.vars` and `.env` are in `.gitignore`
2. **Rotate credentials**: If credentials are exposed, immediately regenerate them in Google Cloud Console
3. **Use production secrets**: In production, use environment variables, not hardcoded values
4. **Limit scopes**: Only request the minimum required OAuth scopes
5. **Monitor usage**: Regularly check OAuth usage in Google Cloud Console

## Getting Help

- **Google OAuth2 Documentation**: https://developers.google.com/identity/protocols/oauth2
- **Google My Business API**: https://developers.google.com/my-business
- **OAuth Troubleshooting**: https://developers.google.com/identity/protocols/oauth2/web-server#handlingresponse

## Quick Reference

| Setting | Value |
|---------|-------|
| Redirect URI | `https://backend.youware.com/api/oauth2/google/callback` |
| Environment Variables | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` |
| Required Scopes | `business.manage`, `plus.business.manage` |
| OAuth Type | Web application |
