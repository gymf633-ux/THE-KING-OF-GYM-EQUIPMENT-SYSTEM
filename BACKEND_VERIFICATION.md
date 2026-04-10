# Backend Verification API Documentation

This document describes the backend verification endpoints added to validate OAuth token integrity, state management, and backend handling.

## Overview

The backend verification API provides automated testing endpoints to validate:
- OAuth token format and validity
- OAuth state parameter management
- Database cleanup status and operations
- Token refresh capabilities

These endpoints enable comprehensive backend testing without requiring manual verification.

---

## Endpoints

### 1. Token Validation

**Endpoint**: `POST /api/verify/token`

**Purpose**: Verify OAuth access token format and validity

**Request Body**:
```json
{
  "test_token": "ya29.a0AfH6SMAbc123..."
}
```

**Response**:
```json
{
  "success": true,
  "valid": true,
  "is_stored": true,
  "is_expired": false,
  "format_valid": true,
  "token_expiry": "2025-11-12T17:26:32.000Z",
  "message": "Token valid"
}
```

**Test Cases**:
1. **Valid Format**: Token starting with `ya29.` followed by valid characters
2. **Invalid Format**: Token not matching expected pattern
3. **Stored Token**: Token matches currently stored access token
4. **Expired Token**: Token expiry timestamp in the past
5. **Unknown Token**: Valid format but not currently stored

**Example Usage**:
```javascript
const response = await fetch('https://backend.youware.com/api/verify/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Project-Id': PROJECT_ID
  },
  body: JSON.stringify({
    test_token: 'ya29.test_token_here'
  })
});
const result = await response.json();
console.log('Token valid:', result.valid);
```

---

### 2. OAuth State Verification

**Endpoint**: `POST /api/verify/oauth-state`

**Purpose**: Verify OAuth state parameter existence and validity in database

**Request Body**:
```json
{
  "state": "a1b2c3d4e5f6..."
}
```

**Response**:
```json
{
  "success": true,
  "exists": true,
  "valid": true,
  "is_expired": false,
  "created_at": "2025-11-12T15:20:00.000Z",
  "expires_at": "2025-11-12T15:30:00.000Z",
  "message": "State valid"
}
```

**Test Cases**:
1. **Valid State**: State exists and not expired
2. **Expired State**: State exists but past expiry time
3. **Invalid State**: State not found in database
4. **CSRF Protection**: Validates 10-minute expiry window

**Example Usage**:
```javascript
const response = await fetch('https://backend.youware.com/api/verify/oauth-state', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Project-Id': PROJECT_ID
  },
  body: JSON.stringify({
    state: 'test_state_parameter'
  })
});
const result = await response.json();
console.log('State exists:', result.exists);
console.log('State valid:', result.valid);
```

---

### 3. Cleanup Status Check

**Endpoint**: `GET /api/verify/cleanup-status`

**Purpose**: Check database cleanup status and count expired OAuth states

**Request**: No body required

**Response**:
```json
{
  "success": true,
  "oauth_states": {
    "total": 5,
    "valid": 2,
    "expired": 3
  },
  "cleanup_needed": true,
  "message": "Expired states found - cleanup recommended"
}
```

**Metrics Returned**:
- **total**: Total OAuth states in database
- **valid**: States not yet expired
- **expired**: States past expiry time
- **cleanup_needed**: Boolean indicating if cleanup recommended

**Example Usage**:
```javascript
const response = await fetch('https://backend.youware.com/api/verify/cleanup-status', {
  headers: {
    'X-Project-Id': PROJECT_ID
  }
});
const result = await response.json();
console.log('Total states:', result.oauth_states.total);
console.log('Cleanup needed:', result.cleanup_needed);
```

---

### 4. Database Cleanup

**Endpoint**: `POST /api/verify/cleanup`

**Purpose**: Delete expired OAuth states from database

**Request**: No body required

**Response**:
```json
{
  "success": true,
  "deleted": 3,
  "message": "Cleaned up 3 expired OAuth states"
}
```

**Example Usage**:
```javascript
const response = await fetch('https://backend.youware.com/api/verify/cleanup', {
  method: 'POST',
  headers: {
    'X-Project-Id': PROJECT_ID
  }
});
const result = await response.json();
console.log('Deleted states:', result.deleted);
```

**When to Use**:
- After detecting expired states via cleanup-status
- Periodic maintenance (recommended: daily)
- Before OAuth flow to ensure clean state table
- After testing OAuth flows

---

### 5. Token Refresh Capability

**Endpoint**: `GET /api/verify/token-refresh`

**Purpose**: Verify token refresh capability and current token status

**Request**: No body required

**Response**:
```json
{
  "success": true,
  "has_access_token": true,
  "has_refresh_token": true,
  "has_token_expiry": true,
  "can_refresh": false,
  "needs_refresh": false,
  "minutes_until_expiry": 45,
  "token_expiry": "2025-11-12T17:26:32.000Z",
  "message": "Token valid or no expiry set"
}
```

**Status Indicators**:
- **has_access_token**: Current access token exists
- **has_refresh_token**: Refresh token available for renewal
- **has_token_expiry**: Expiry timestamp configured
- **can_refresh**: Token expired AND refresh token available
- **needs_refresh**: Token past expiry time
- **minutes_until_expiry**: Time remaining until expiry (null if no expiry)

**Example Usage**:
```javascript
const response = await fetch('https://backend.youware.com/api/verify/token-refresh', {
  headers: {
    'X-Project-Id': PROJECT_ID
  }
});
const result = await response.json();
console.log('Minutes until expiry:', result.minutes_until_expiry);
console.log('Can refresh:', result.can_refresh);
```

---

## Integration with Test Suite

The backend verification endpoints are integrated into `test-oauth-advanced.html` as **Test #13: Backend Verification**.

### Test Execution

The backend verification test runs 4 sub-tests:

1. **Token Format Validation**
   - Tests valid token format (`ya29.xxx`)
   - Tests invalid token format
   - Verifies format checking logic

2. **OAuth State Verification**
   - Tests state lookup in database
   - Verifies invalid state rejection
   - Confirms database query functionality

3. **Database Cleanup Status**
   - Counts total, valid, and expired states
   - Determines if cleanup needed
   - Reports database health

4. **Token Refresh Capability**
   - Checks for access and refresh tokens
   - Calculates time until expiry
   - Determines if refresh possible

### Test Results

The test displays:
- ✅ **Pass** for each successful sub-test
- ❌ **Fail** for any failed verification
- ⚠️ **Warning** if some tests pass but others fail
- Detailed metrics for each verification type

---

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error message here",
  "status": 400
}
```

**Common Error Codes**:
- `400`: Bad Request (missing parameters)
- `500`: Internal Server Error (database or processing error)

**Error Scenarios**:
1. **Missing Parameters**: Return 400 with helpful message
2. **Database Errors**: Log error and return 500
3. **Invalid Input**: Validate and return 400
4. **Processing Failures**: Catch exceptions and return 500

---

## Security Considerations

### Token Validation

- **Never expose full tokens** in responses
- **Validate token format** before database lookup
- **Log verification attempts** for security monitoring
- **Rate limit** verification endpoints to prevent abuse

### State Management

- **One-time use**: States deleted after OAuth callback
- **10-minute expiry**: Automatic timeout protection
- **Random generation**: Cryptographically secure state values
- **Database isolation**: States scoped per project

### Best Practices

1. **Don't test with production tokens** - Use test tokens only
2. **Clean up regularly** - Run cleanup endpoint periodically
3. **Monitor verification logs** - Track validation failures
4. **Limit test frequency** - Avoid excessive verification calls

---

## Performance Characteristics

### Response Times

| Endpoint | Expected Time | Complexity |
|----------|--------------|------------|
| Token Validation | < 100ms | Low (memory + DB lookup) |
| State Verification | < 150ms | Low (single DB query) |
| Cleanup Status | < 200ms | Medium (3 COUNT queries) |
| Cleanup | < 300ms | Medium (DELETE query) |
| Refresh Check | < 100ms | Low (DB lookup + calculation) |

### Database Impact

- **Token Validation**: 1 SELECT query (settings table)
- **State Verification**: 1 SELECT query (oauth_states table)
- **Cleanup Status**: 3 SELECT COUNT queries (oauth_states table)
- **Cleanup**: 1 DELETE query (oauth_states table)
- **Refresh Check**: 1 SELECT query (settings table)

---

## Usage Examples

### Complete Verification Flow

```javascript
// 1. Check token validity
const tokenCheck = await fetch('/api/verify/token', {
  method: 'POST',
  body: JSON.stringify({ test_token: currentToken })
});
const tokenResult = await tokenCheck.json();

if (!tokenResult.valid) {
  // 2. Check if refresh possible
  const refreshCheck = await fetch('/api/verify/token-refresh');
  const refreshResult = await refreshCheck.json();
  
  if (refreshResult.can_refresh) {
    console.log('Token expired but can be refreshed');
    // Trigger token refresh flow
  } else {
    console.log('Re-authentication required');
    // Redirect to OAuth flow
  }
}

// 3. Check database cleanup status
const cleanupCheck = await fetch('/api/verify/cleanup-status');
const cleanupResult = await cleanupCheck.json();

if (cleanupResult.cleanup_needed) {
  // 4. Run cleanup
  await fetch('/api/verify/cleanup', { method: 'POST' });
  console.log('Database cleaned up');
}
```

### Continuous Monitoring

```javascript
// Run every hour
setInterval(async () => {
  const status = await fetch('/api/verify/cleanup-status');
  const result = await status.json();
  
  if (result.oauth_states.expired > 10) {
    console.warn('High number of expired states:', result.oauth_states.expired);
    // Trigger cleanup
  }
}, 3600000);
```

---

## Deployment

### Backend Deployment

The verification endpoints are deployed to:
```
https://backend.youware.com/api/verify/*
```

### Deployment Steps

1. **Code Changes**: Update `backend/src/index.ts`
2. **Deploy**: Run `wrangler deploy` or use `yw_backend__deploy_worker`
3. **Verify**: Test endpoints via test suite
4. **Monitor**: Check logs with `wrangler tail`

### Environment Requirements

- **Cloudflare Workers**: Runtime environment
- **D1 Database**: OAuth state and token storage
- **Project ID**: Required in X-Project-Id header

---

## Testing

### Manual Testing

```bash
# Test token validation
curl -X POST https://backend.youware.com/api/verify/token \
  -H "Content-Type: application/json" \
  -H "X-Project-Id: YOUR_PROJECT_ID" \
  -d '{"test_token": "ya29.test_token"}'

# Test state verification
curl -X POST https://backend.youware.com/api/verify/oauth-state \
  -H "Content-Type: application/json" \
  -H "X-Project-Id: YOUR_PROJECT_ID" \
  -d '{"state": "test_state"}'

# Check cleanup status
curl https://backend.youware.com/api/verify/cleanup-status \
  -H "X-Project-Id: YOUR_PROJECT_ID"

# Run cleanup
curl -X POST https://backend.youware.com/api/verify/cleanup \
  -H "X-Project-Id": YOUR_PROJECT_ID"

# Check refresh capability
curl https://backend.youware.com/api/verify/token-refresh \
  -H "X-Project-Id: YOUR_PROJECT_ID"
```

### Automated Testing

Use `test-oauth-advanced.html` and click "Test Backend Verification" button to run all verification tests automatically.

---

## Troubleshooting

### Issue: "Token verification failed"

**Solution**: Ensure token format starts with `ya29.` and contains only valid characters (alphanumeric, hyphens, underscores).

### Issue: "State not found in database"

**Solution**: State may have expired or was never created. Check OAuth flow initialization.

### Issue: "Cleanup returns 0 deleted"

**Solution**: No expired states exist. This is normal if database is clean or OAuth flows are recent.

### Issue: "Cannot refresh token"

**Solution**: Verify refresh token exists in settings table. If missing, user must re-authenticate.

---

## Conclusion

The backend verification API provides comprehensive testing and monitoring capabilities for OAuth implementation. Use these endpoints to:

- Validate token integrity
- Monitor OAuth state cleanup
- Verify refresh capabilities
- Ensure database health
- Automate testing workflows

For integration examples, see `test-oauth-advanced.html` Test #13.
