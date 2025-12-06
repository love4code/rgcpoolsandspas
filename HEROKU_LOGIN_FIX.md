# Heroku Login Fix - Step by Step

Based on your logs, the login POST succeeds but the session isn't persisting. Here's how to fix it:

## Quick Fix (Try This First)

```bash
# 1. Disable secure cookies temporarily to test
heroku config:set SESSION_SECURE=false --app YOUR_APP_NAME

# 2. Restart the app
heroku restart --app YOUR_APP_NAME

# 3. Clear browser cookies for your Heroku domain
# (Open DevTools → Application → Cookies → Delete all for your domain)

# 4. Try logging in again
```

## Complete Diagnostic & Fix

### Step 1: Check Environment Variables

```bash
heroku config --app YOUR_APP_NAME
```

Make sure you see:
- `SESSION_SECRET` - Must be set!
- `MONGODB_URI` - MongoDB connection string
- `ADMIN_USERNAME` - Your admin username
- `ADMIN_PASSWORD` - Your admin password

### Step 2: Set Session Secret (if missing)

```bash
heroku config:set SESSION_SECRET="$(openssl rand -base64 32)" --app YOUR_APP_NAME
```

### Step 3: Create Admin User

```bash
heroku run node scripts/setup.js --app YOUR_APP_NAME
```

### Step 4: Try Without Secure Cookies

```bash
heroku config:set SESSION_SECURE=false --app YOUR_APP_NAME
heroku restart --app YOUR_APP_NAME
```

Then:
1. Clear all cookies for your Heroku domain
2. Try logging in
3. Check browser DevTools → Application → Cookies to see if cookie is set

### Step 5: Check Logs During Login

```bash
heroku logs --tail --app YOUR_APP_NAME
```

Then try to login and watch for:
- "=== LOGIN ATTEMPT ==="
- "✅ Session saved successfully"
- Any error messages

## What the Logs Show

Your logs show:
```
POST /admin/login → 302 (redirect) ✅
GET /admin/login → 200 (back to login) ❌
```

This means:
1. Login attempt happens
2. Redirect is sent
3. But session is lost/not persisted
4. Next request doesn't have session
5. Redirects back to login

## Common Causes

1. **Secure cookies blocking** - Browsers are strict about secure cookies
2. **Session not saving to MongoDB** - Connection issue
3. **Cookie domain mismatch** - Cookie not being set for correct domain
4. **Session secret mismatch** - Different secrets between requests

## Solution Options

### Option A: Disable Secure Cookies (Quick Test)

```bash
heroku config:set SESSION_SECURE=false --app YOUR_APP_NAME
heroku restart --app YOUR_APP_NAME
```

### Option B: Check Cookie Settings in Browser

1. Open DevTools (F12)
2. Go to Application/Storage
3. Check Cookies
4. Look for `rgcpool.sid`
   - If missing → cookie not being set
   - If present but wrong domain → domain issue
   - If Secure flag wrong → cookie setting issue

### Option C: Verify Session Store

Check if sessions are being saved to MongoDB:
- Look for "Session store configured" in logs ✅ (you have this)
- Check MongoDB connection is working ✅ (you have this)

## Debug Endpoint

After deploying latest code, visit:
```
https://YOUR_APP_NAME.herokuapp.com/admin/test-session
```

This shows session status without requiring login.

## Still Not Working?

1. **Check browser console** for cookie errors
2. **Check Heroku logs** for session save errors
3. **Try incognito mode** to rule out browser issues
4. **Verify admin user exists**: `heroku run node scripts/test-login.js --app YOUR_APP_NAME`

---

**The code has been updated with better error handling and logging. Deploy and check the logs during login to see exactly what's happening.**

