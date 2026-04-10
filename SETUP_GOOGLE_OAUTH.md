# 🔐 Google OAuth2 Setup Instructions

Quick guide to configure Google OAuth2 for your CRM application.

## 📋 Prerequisites

- Google account
- Access to [Google Cloud Console](https://console.cloud.google.com/)

## 🚀 Quick Setup (5 minutes)

### 1. Create Google Cloud Project

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Click **Select a project** → **NEW PROJECT**
3. Name your project (e.g., "CRM OAuth")
4. Click **CREATE**

### 2. Enable APIs

1. Go to **APIs & Services** → **Library**
2. Search and enable:
   - ✅ **Google My Business API**
   - ✅ **Google Business Profile API**

### 3. Configure OAuth Consent

1. Navigate to **APIs & Services** → **OAuth consent screen**
2. Select **External** → **CREATE**
3. Fill required fields:
   - App name: `Your CRM App`
   - User support email: `your-email@example.com`
   - Developer email: `your-email@example.com`
4. Click **SAVE AND CONTINUE**
5. **Scopes**: Click **ADD OR REMOVE SCOPES**, add:
   ```
   https://www.googleapis.com/auth/business.manage
   https://www.googleapis.com/auth/plus.business.manage
   ```
6. **Test users**: Add your Google account email
7. Click **SAVE AND CONTINUE** until done

### 4. Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
3. Application type: **Web application**
4. Name: `CRM Backend OAuth`
5. **Authorized redirect URIs**: Add exactly:
   ```
   https://backend.youware.com/api/oauth2/google/callback
   ```
6. Click **CREATE**
7. **COPY** your credentials:
   - 📋 Client ID: `xxx.apps.googleusercontent.com`
   - 🔑 Client Secret: `xxx`

### 5. Configure Your Backend

**⚠️ IMPORTANT: Keep these credentials secure!**

#### Option A: Local Development

Create `backend/.dev.vars`:
```bash
cd backend
cp .env.example .dev.vars
```

Edit `.dev.vars`:
```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

#### Option B: Production (Wrangler CLI)

```bash
cd backend
wrangler secret put GOOGLE_CLIENT_ID
# Paste your Client ID

wrangler secret put GOOGLE_CLIENT_SECRET
# Paste your Client Secret
```

## ✅ Verify Setup

1. Start your application
2. Navigate to **GBP Analytics Dashboard**
3. Click **"Sign in with Google"**
4. You should see Google's authorization screen
5. After authorization, you'll be redirected back successfully

## 🔧 Troubleshooting

### "OAuth credentials not configured"
- ✓ Check environment variables are set
- ✓ Restart your backend server
- ✓ Verify no typos in variable names

### "redirect_uri_mismatch"
- ✓ Ensure redirect URI is exactly: `https://backend.youware.com/api/oauth2/google/callback`
- ✓ No trailing slash
- ✓ Check for copy-paste errors

### "access_denied" 
- ✓ Add your email to OAuth consent screen test users
- ✓ Sign in with the correct test user account

## 📚 Detailed Documentation

For complete documentation, see:
- [`backend/OAUTH_SETUP_GUIDE.md`](backend/OAUTH_SETUP_GUIDE.md) - Comprehensive guide
- [`backend/src/oauth/README.md`](backend/src/oauth/README.md) - Technical documentation

## 🔒 Security Reminders

- ✅ Never commit `.dev.vars` or `.env` files
- ✅ Keep Client Secret private
- ✅ Use environment variables in production
- ✅ Rotate credentials if exposed
- ✅ Monitor OAuth usage in Google Cloud Console

---

**Need help?** Check the detailed guide in `backend/OAUTH_SETUP_GUIDE.md`
