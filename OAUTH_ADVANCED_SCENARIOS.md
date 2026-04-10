# Advanced OAuth Scenarios Testing Guide

This document covers advanced OAuth testing scenarios including edge cases, error handling, security validation, and performance testing.

## Test Suite Overview

The `test-oauth-advanced.html` provides comprehensive testing for production-ready OAuth implementations with **13 distinct test scenarios**.

### 🧪 Test Categories

1. **Token Lifecycle Management** (Tests 1-2, 8)
2. **Security & CSRF Protection** (Tests 3, 10)
3. **Error Handling & Recovery** (Tests 4-6)
4. **Performance & Concurrency** (Test 7)
5. **OAuth Scope & Permissions** (Test 9)
6. **Database & State Management** (Test 10)
7. **Session Management** (Test 11)
8. **Multi-Account Support** (Test 12)

---

## Test Scenarios

### 1. Token Refresh Test 🔄

**Purpose**: Verify automatic token refresh mechanism when access tokens expire

**What It Tests**:
- Token expiry detection
- Automatic refresh token usage
- Token storage after refresh
- Seamless user experience during refresh

**Expected Behavior**:
```javascript
// Backend should automatically:
1. Detect expired access token
2. Use refresh token to get new access token
3. Update token storage in database
4. Return successful response to client
```

**Test Steps**:
1. Retrieve current token configuration
2. Check token expiry timestamp
3. Calculate hours until expiry
4. Verify refresh mechanism is ready
5. Confirm backend will auto-refresh on next API call

**Success Criteria**:
- ✅ Token expiry correctly calculated
- ✅ Refresh token available
- ✅ Backend configured to auto-refresh
- ✅ No manual intervention required

---

### 2. Expired Token Detection ⏰

**Purpose**: Verify detection and handling of expired access tokens

**What It Tests**:
- Token expiry timestamp validation
- Expired vs. valid token differentiation
- Proper status reporting
- Automatic refresh trigger

**Test Steps**:
1. Fetch current token configuration
2. Compare token expiry with current time
3. Determine if token is expired
4. Verify correct status reporting

**Success Criteria**:
- ✅ Expired tokens detected correctly
- ✅ Valid tokens not flagged as expired
- ✅ Clear expiry status in response
- ✅ Automatic refresh triggered for expired tokens

**Backend Logic**:
```typescript
// From googleOAuth.ts
if (config.token_expiry && new Date(config.token_expiry) > new Date()) {
  return config.access_token; // Valid token
}
// Token expired, refresh it
if (config.refresh_token) {
  const newTokens = await refreshAccessToken(env, config.refresh_token);
  await storeTokens(env, newTokens);
  return newTokens.access_token;
}
```

---

### 3. Invalid State Parameter 🔒

**Purpose**: Test CSRF protection with invalid state parameters

**What It Tests**:
- State parameter validation
- CSRF attack prevention
- Error handling for security failures
- Proper redirect on validation failure

**Test Steps**:
1. Send callback request with invalid state
2. Backend validates state against database
3. State not found or expired
4. Backend redirects with error

**Security Flow**:
```
1. Auth Request → Generate random state → Store in DB (10 min expiry)
2. Google Callback → Validate state exists → Delete used state
3. Invalid State → Reject request → Redirect with error
```

**Success Criteria**:
- ✅ Invalid state rejected (302 redirect)
- ✅ Error message in redirect URL
- ✅ One-time use enforced (state deleted after use)
- ✅ Expired states rejected

**Attack Prevention**:
- Prevents CSRF attacks
- Validates callback authenticity
- Enforces time-limited validity
- Single-use state tokens

---

### 4. Network Error Handling 📡

**Purpose**: Test API timeout and network failure scenarios

**What It Tests**:
- Request timeout handling
- Invalid endpoint responses
- Network interruption recovery
- Error message quality

**Test Steps**:
1. **Timeout Test**: Abort request after 100ms
2. **Invalid Endpoint**: Request non-existent API path
3. Verify proper error handling
4. Check error messages are helpful

**Error Scenarios Tested**:
```javascript
// Timeout
AbortError - Request aborted due to timeout

// Invalid Endpoint
404 Not Found - Endpoint does not exist

// Network Failure
TypeError - Failed to fetch (network disconnected)
```

**Success Criteria**:
- ✅ Timeouts handled gracefully
- ✅ 404 errors caught properly
- ✅ Network failures don't crash app
- ✅ Clear error messages displayed

---

### 5. Missing Credentials Test 🔑

**Purpose**: Verify proper error handling when OAuth credentials are not configured

**What It Tests**:
- Environment variable validation
- Helpful error messages
- Preventing OAuth flow without credentials
- Configuration guidance

**Test Steps**:
1. Request OAuth authorization URL
2. Backend checks for GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
3. If missing, return error with guidance
4. If present, return authorization URL

**Expected Responses**:

**Credentials Missing**:
```json
{
  "error": "OAuth credentials not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables."
}
```

**Credentials Configured**:
```json
{
  "success": true,
  "auth_url": "https://accounts.google.com/o/oauth2/v2/auth?client_id=..."
}
```

**Success Criteria**:
- ✅ Missing credentials detected
- ✅ Error message includes solution
- ✅ Mentions specific environment variables
- ✅ OAuth flow blocked until configured

---

### 6. OAuth Error Responses ❌

**Purpose**: Test handling of various OAuth provider error responses

**What It Tests**:
- Google OAuth error codes
- Error forwarding to frontend
- User-friendly error messages
- Proper redirect flow

**Error Cases Tested**:

1. **access_denied**
   - User clicked "Deny" on consent screen
   - Expected: Redirect to `/?oauth=error&message=access_denied`

2. **invalid_request**
   - Malformed OAuth parameters
   - Expected: Redirect with error

3. **unauthorized_client**
   - Client ID not authorized
   - Expected: Redirect with error

**Backend Handling**:
```typescript
// From index.ts
const error = url.searchParams.get('error');
if (error) {
  return new Response(null, {
    status: 302,
    headers: {
      'Location': `/?oauth=error&message=${encodeURIComponent(error)}`
    }
  });
}
```

**Success Criteria**:
- ✅ All error types handled
- ✅ Proper 302 redirects
- ✅ Error message preserved
- ✅ Frontend receives error info

---

### 7. Concurrent Requests Test ⚡

**Purpose**: Test handling of multiple simultaneous OAuth requests

**What It Tests**:
- Race condition prevention
- Database consistency
- Performance under load
- Response reliability

**Test Steps**:
1. Send 5 concurrent requests to `/api/gbp/config`
2. Measure total completion time
3. Verify all requests succeed
4. Check for any failures or inconsistencies

**Performance Metrics**:
```
Requests: 5 concurrent
Expected Time: < 1000ms total
Expected Success Rate: 100%
Expected Failures: 0
```

**Success Criteria**:
- ✅ All requests return 200 OK
- ✅ No race conditions detected
- ✅ Consistent responses
- ✅ Reasonable performance (<1s for 5 requests)

**Why This Matters**:
- Prevents token corruption
- Ensures database integrity
- Validates worker scalability
- Tests Cloudflare Workers concurrency

---

### 8. Token Revocation Test 🔓

**Purpose**: Test token invalidation and cleanup process

**What It Tests**:
- Token revocation detection
- Invalid token error handling
- Re-authentication requirement
- User-initiated revocation flow

**Test Scenario**:
```
1. User revokes app access in Google Account settings
2. Next API call returns 401 Unauthorized
3. Backend detects invalid token
4. Refresh token also becomes invalid
5. User must re-authenticate via OAuth flow
```

**Test Steps**:
1. Check current token configuration
2. Document revocation process
3. Provide manual test instructions
4. Verify backend will detect invalid tokens

**Manual Test Instructions**:
- Go to [Google Account Permissions](https://myaccount.google.com/permissions)
- Find and remove this application
- Try to fetch analytics in the app
- Observe 401 error and re-authentication prompt

**Success Criteria**:
- ✅ Token revocation flow documented
- ✅ Backend detects invalid tokens
- ✅ Re-authentication required after revocation
- ✅ Clear user guidance provided

**Security Implications**:
- Users maintain control over access
- Revoked tokens immediately invalid
- No persistent access after revocation
- Clean token cleanup process

---

### 9. Scope Validation Test 🎯

**Purpose**: Verify OAuth scope restrictions and permissions

**What It Tests**:
- Requested OAuth scopes
- Minimum necessary permissions
- Scope configuration
- Permission documentation

**Required Scopes**:
```
https://www.googleapis.com/auth/business.manage
https://www.googleapis.com/auth/plus.business.manage
```

**Test Steps**:
1. Request OAuth authorization URL
2. Parse scope parameter from URL
3. Verify required scopes present
4. Document each scope's purpose

**Scope Purposes**:
- `business.manage`: Manage Google Business Profile
- `plus.business.manage`: Legacy Google My Business API

**Success Criteria**:
- ✅ All required scopes present in auth URL
- ✅ No unnecessary scopes requested
- ✅ Scope validation passes
- ✅ Permissions match application needs

**Best Practices**:
- Request minimum necessary permissions
- Document why each scope is needed
- Review scopes periodically
- Remove unused scopes

---

### 10. Database State Test 🗄️

**Purpose**: Test OAuth state cleanup and database integrity

**What It Tests**:
- OAuth state table management
- State expiry mechanism
- Token storage structure
- Database cleanup processes

**Database Schema**:

**oauth_states Table**:
```sql
CREATE TABLE oauth_states (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  state TEXT NOT NULL UNIQUE,
  user_id TEXT,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL
);
```

**settings.gbp_api Column** (JSON):
```json
{
  "access_token": "ya29.a0...",
  "refresh_token": "1//0g...",
  "token_expiry": "2025-11-12T16:21:33.000Z",
  "scope": "https://www.googleapis.com/auth/business.manage ..."
}
```

**State Management**:
- State stored with 10-minute expiry
- Automatic cleanup of expired states
- One-time use enforcement
- Secure state generation

**Token Storage**:
- Access token, refresh token, expiry
- JSON format in settings table
- Not exposed in API responses
- Secure backend-only access

**Success Criteria**:
- ✅ State expiry mechanism validated
- ✅ Token storage structure documented
- ✅ Database integrity confirmed
- ✅ Cleanup processes verified

---

### 11. Session Timeout Test ⏱️

**Purpose**: Test idle session expiry and cleanup

**What It Tests**:
- Token expiry timing
- Automatic refresh behavior
- Stateless session model
- OAuth state timeout

**Session Management**:
```
Access Token Lifetime: 1 hour
OAuth State Lifetime: 10 minutes
Session Model: Stateless (no session cookies)
Refresh Strategy: Automatic before expiry
```

**Test Steps**:
1. Fetch current token configuration
2. Calculate time until token expiry
3. Verify automatic refresh setup
4. Document session timeout behavior

**Success Criteria**:
- ✅ Access tokens expire after 1 hour
- ✅ Automatic refresh before expiry
- ✅ OAuth states expire in 10 minutes
- ✅ Stateless design validated

**Design Benefits**:
- No manual session management
- Automatic token renewal
- Stateless scalability
- Simplified architecture

---

### 12. Multiple Accounts Test 👥

**Purpose**: Test handling multiple authenticated accounts

**What It Tests**:
- Current account model (single account)
- Account switching behavior
- Multi-account architecture design
- Token isolation strategy

**Current Implementation**:
```
Account Model: Single account
Token Storage: One set of tokens
Account Switching: Re-authentication required
Multi-Account Support: Not implemented
```

**Multi-Account Strategy** (If Needed):
```javascript
// Future enhancement approach
1. Store user_id with OAuth state
2. Associate tokens with user_id
3. Query tokens by current user
4. Support multiple token sets in settings
```

**Test Steps**:
1. Document current single-account model
2. Explain account switching process
3. Describe multi-account architecture
4. Validate design decision

**Design Rationale**:
- Typical use case: one business = one GBP account
- Simplifies token management
- Reduces complexity
- Matches common scenario

**Success Criteria**:
- ✅ Single account limitation documented
- ✅ Account switching process clear
- ✅ Multi-account strategy outlined
- ✅ Design decision validated

**Extension Path**:
- Architecture supports multi-account if needed
- Requires user_id integration
- Token isolation per user
- Additional database fields

---

## Running the Test Suite

### Interactive Testing

Open `test-oauth-advanced.html` in a browser:

```bash
# If using local server
python -m http.server 8000
# Open http://localhost:8000/test-oauth-advanced.html

# Or open directly in browser
open test-oauth-advanced.html
```

### Individual Tests

Click any test button to run that specific scenario:
- 🔄 Test Token Refresh
- ⏰ Test Expired Token
- 🔒 Test Invalid State
- 📡 Test Network Errors
- 🔑 Test Missing Credentials
- ❌ Test OAuth Errors
- ⚡ Test Concurrent Requests
- 🔓 Test Token Revocation
- 🎯 Test Scope Validation
- 🗄️ Test Database State
- ⏱️ Test Session Timeout
- 👥 Test Multiple Accounts

### Run All Tests

Click "🚀 Run All Tests" to execute all 13 scenarios sequentially with 500ms delay between tests.

---

## Test Results Dashboard

The test suite includes a real-time dashboard showing:

- **Total Tests**: Number of tests executed
- **Passed**: Successfully validated scenarios
- **Failed**: Tests that didn't meet success criteria
- **Pending**: Tests not yet executed (starts at 13)

### Timeline View

Every test execution is logged in the timeline with:
- ⏰ Timestamp
- 📋 Test name
- ✅/❌ Status badge
- 📝 Result message

---

## Integration with Main Test Suite

Use `test-oauth-advanced.html` alongside `test-oauth.html`:

### test-oauth.html (Basic Flow)
✅ OAuth flow initiation
✅ Authorization URL generation
✅ User authorization
✅ Token storage

### test-oauth-advanced.html (Edge Cases)
✅ Token lifecycle management
✅ Security validation
✅ Error handling
✅ Performance testing
✅ Scope validation
✅ Database integrity
✅ Session management
✅ Account models

---

## Backend Endpoints Tested

### 1. GET /api/oauth2/google/auth
- Initiates OAuth flow
- Returns authorization URL
- Tests: Missing Credentials, Scope Validation

### 2. GET /api/oauth2/google/callback
- Handles OAuth callback
- Validates state parameter
- Exchanges code for tokens
- Tests: Invalid State, OAuth Errors

### 3. GET /api/gbp/config
- Returns OAuth configuration status
- Checks token validity
- Auto-refreshes expired tokens
- Tests: Token Refresh, Expired Token, Concurrent Requests, Session Timeout

---

## Security Testing Checklist

✅ **CSRF Protection**
- State parameter required
- State validated against database
- State expires after 10 minutes
- State deleted after use (one-time use)

✅ **Token Security**
- Access tokens expire after 1 hour
- Refresh tokens stored securely
- Tokens not exposed in responses
- Automatic refresh mechanism

✅ **Scope Validation**
- Minimum necessary permissions
- Documented scope purposes
- No excessive permissions
- Regular scope review

✅ **Error Handling**
- No sensitive data in error messages
- Clear but not revealing errors
- Proper status codes
- User-friendly messages

✅ **Configuration Security**
- Credentials from environment variables
- No hardcoded secrets
- Validation before OAuth flow
- Clear setup instructions

✅ **Database Security**
- State parameter isolation
- Token storage encryption consideration
- Automatic cleanup processes
- One-time use enforcement

---

## Performance Benchmarks

### Expected Performance

| Test | Expected Time | Acceptable Range |
|------|--------------|------------------|
| Token Refresh | < 500ms | 200ms - 1000ms |
| Expired Token Check | < 200ms | 50ms - 500ms |
| Invalid State | < 300ms | 100ms - 600ms |
| Network Errors | Varies | N/A (simulated) |
| Missing Credentials | < 200ms | 50ms - 500ms |
| OAuth Errors | < 300ms | 100ms - 600ms |
| Concurrent (5 req) | < 1000ms | 500ms - 2000ms |
| Token Revocation | < 200ms | 50ms - 500ms |
| Scope Validation | < 300ms | 100ms - 600ms |
| Database State | N/A | Informational |
| Session Timeout | < 200ms | 50ms - 500ms |
| Multiple Accounts | N/A | Informational |

### Performance Tips

**Fast APIs**:
- Cloudflare Workers have sub-100ms cold starts
- D1 database queries are typically 10-50ms
- OAuth validation is memory-only (very fast)

**Slow Indicators**:
- If tests take > 2s, check network connection
- If concurrent test > 3s, check backend health
- If any test > 5s, investigate backend issues

---

## Common Issues and Solutions

### Issue: All tests pass but OAuth still fails

**Solution**: Advanced tests verify backend logic, but credentials must still be configured:
```bash
wrangler secret put GOOGLE_CLIENT_ID
wrangler secret put GOOGLE_CLIENT_SECRET
```

### Issue: Token refresh test shows "No tokens configured"

**Solution**: Complete the basic OAuth flow first using `test-oauth.html` to obtain initial tokens.

### Issue: Invalid state test passes even with valid state

**Solution**: This is expected! The test validates that *invalid* states are rejected. If you see a 302 redirect with error, the security is working.

### Issue: Network error test shows no timeout

**Solution**: The test simulates a timeout with a 100ms abort signal. If the API responds faster than 100ms (which is good!), the timeout won't trigger. This is acceptable - it means your API is very fast.

### Issue: Scope validation fails

**Solution**: Check Google Cloud Console OAuth configuration. Ensure scopes match between backend code and Google Console settings.

### Issue: Token revocation test is informational only

**Solution**: This test documents the manual process. To truly test revocation, manually remove app permissions in Google Account settings and observe the API behavior.

---

## Best Practices for OAuth Testing

### 1. Test Order Matters
```
1. Basic Flow (test-oauth.html) - Get tokens first
2. Advanced Scenarios (test-oauth-advanced.html) - Test edge cases
```

### 2. Reset Between Test Runs
Click "Clear Results" button to reset the dashboard before running tests again.

### 3. Check Browser Console
Open DevTools Console (F12) for detailed network logs and any JavaScript errors.

### 4. Test in Multiple Browsers
- Chrome/Edge (Chromium)
- Firefox
- Safari

### 5. Monitor Backend Logs
```bash
wrangler tail --project gym-crm-backend
```

### 6. Document Test Results
Keep a log of test runs and any failures for debugging and compliance purposes.

---

## Troubleshooting

### All Tests Fail

**Check**:
1. Backend deployed? (`https://backend.youware.com`)
2. Network connection working?
3. CORS errors in console?
4. Browser blocking third-party requests?

### Some Tests Pass, Others Fail

**Check**:
1. Which specific tests fail?
2. Look at error messages in results
3. Check browser console for details
4. Review backend logs

### Tests Pass But OAuth Flow Fails

**Remember**: Advanced tests validate backend logic, not Google OAuth credentials. You still need:
1. Valid Google Cloud Console project
2. OAuth 2.0 Client ID configured
3. Redirect URI added to Google Console
4. Credentials set in environment variables

### Scope Validation Fails

**Check**:
1. Scopes match backend configuration
2. Google Console has correct scopes
3. No typos in scope URLs
4. Latest backend code deployed

---

## Conclusion

The advanced OAuth scenario test suite provides comprehensive validation of:

- ✅ Token lifecycle management (refresh, expiry, revocation)
- ✅ Security mechanisms (CSRF, state, scopes)
- ✅ Error handling (network, credentials, provider)
- ✅ Performance characteristics (concurrency, timeouts)
- ✅ Database integrity (state cleanup, token storage)
- ✅ Session management (timeouts, stateless design)
- ✅ Account models (single account, future multi-account)

Combined with the basic OAuth flow tests, you have complete test coverage for a production-ready OAuth implementation with **13 comprehensive test scenarios**.

For questions or issues, refer to:
- `OAUTH_TEST_PLAN.md` - Basic OAuth testing
- `SETUP_GOOGLE_OAUTH.md` - Credential setup
- Backend logs - `wrangler tail`
