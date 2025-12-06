# Heroku Login Troubleshooting Guide

Based on your logs, the login POST returns 302 (redirect) but then redirects back to login (200). This means the session isn't persisting.

## The Problem

From your logs:
```
POST /admin/login → 302 (redirect)
GET /admin/login → 200 (back to login page)
```

This indicates:
1. Login attempt happens
2. Session is set but not persisting
3. Next request doesn't have the session
4. Redirects back to login

## Quick Fixes

### Fix 1: Disable Secure Cookies Temporarily

On Heroku, try disabling secure cookies to test:

```bash
heroku config:set SESSION_SECURE=false --app YOUR_APP_NAME
heroku restart --app YOUR_APP_NAME
```

### Fix 2: Ensure Session Secret is Set

```bash
# Check if set
heroku config:get SESSION_SECRET --app YOUR_APP_NAME

# If not set, generate and set it
heroku config:set SESSION_SECRET="$(openssl rand -base64 32)" --app YOUR_APP_NAME
```

### Fix 3: Verify Admin User Exists

```bash
heroku run node scripts/setup.js --app YOUR_APP_NAME
```

### Fix 4: Check MongoDB Connection

The session store uses MongoDB. Make sure:
- MONGODB_URI is set correctly
- MongoDB Atlas allows connections from Heroku (IP whitelist: 0.0.0.0/0)

## Debugging Steps

### Step 1: Check Current Configuration

```bash
heroku config --app YOUR_APP_NAME
```

Verify:
- ✅ SESSION_SECRET is set
- ✅ MONGODB_URI is set
- ✅ ADMIN_USERNAME is set
- ✅ ADMIN_PASSWORD is set

### Step 2: Test Admin User

```bash
heroku run node scripts/test-login.js --app YOUR_APP_NAME
```

### Step 3: Check Logs During Login

Watch logs while logging in:
```bash
heroku logs --tail --app YOUR_APP_NAME
```

Look for:
- "=== LOGIN ATTEMPT ==="
- "✅ Session saved successfully"
- Any error messages

### Step 4: Test Session Endpoint

Visit (after deploying the latest code):
```
https://YOUR_APP_NAME.herokuapp.com/admin/test-session
```

This will show session status.

## Most Likely Issues

### Issue 1: Cookies Not Being Set

**Symptom**: Login redirects but session doesn't persist

**Solution**: 
```bash
# Try disabling secure cookies
heroku config:set SESSION_SECURE=false --app YOUR_APP_NAME
heroku restart --app YOUR_APP_NAME
```

Then clear browser cookies and try again.

### Issue 2: Session Store Connection Failing

**Symptom**: Session store not connecting to MongoDB

**Check**: Look for "Session store configured" in logs. If missing, MongoDB connection might be failing.

**Solution**: Verify MONGODB_URI is correct and MongoDB allows connections.

### Issue 3: Admin User Doesn't Exist

**Symptom**: "Invalid credentials" error

**Solution**:
```bash
heroku run node scripts/setup.js --app YOUR_APP_NAME
```

### Issue 4: Session Secret Mismatch

**Symptom**: Sessions not persisting between requests

**Solution**: Ensure SESSION_SECRET is set and consistent:
```bash
heroku config:set SESSION_SECRET="your-secret-here" --app YOUR_APP_NAME
heroku restart --app YOUR_APP_NAME
```

## Complete Fix Procedure

Run these commands in order:

```bash
# 1. Set/verify session secret
heroku config:set SESSION_SECRET="$(openssl rand -base64 32)" --app YOUR_APP_NAME

# 2. Temporarily disable secure cookies (for testing)
heroku config:set SESSION_SECURE=false --app YOUR_APP_NAME

# 3. Ensure admin user exists
heroku run node scripts/setup.js --app YOUR_APP_NAME

# 4. Restart app
heroku restart --app YOUR_APP_NAME

# 5. Clear browser cookies for your Heroku domain
# (Do this manually in browser)

# 6. Try logging in again
```

## After Testing

Once login works with `SESSION_SECURE=false`, you can try enabling secure cookies:

```bash
heroku config:unset SESSION_SECURE --app YOUR_APP_NAME
heroku restart --app YOUR_APP_NAME
```

## Browser-Side Checks

1. **Open browser DevTools** (F12)
2. **Go to Application/Storage tab**
3. **Check Cookies** for your Heroku domain
4. Look for `rgcpool.sid` cookie
   - Is it there?
   - What are its properties?
   - Is it being sent with requests?

## If Still Not Working

Check the browser console for:
- Cookie warnings
- CORS errors
- Network errors

Check Heroku logs for:
- Session save errors
- MongoDB connection errors
- Any error messages

---

**The code has been updated with better logging. After deploying, check the logs during login to see exactly what's happening.**


