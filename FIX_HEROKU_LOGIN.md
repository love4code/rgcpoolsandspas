# Fix Heroku Login - Quick Guide

## The Problem
Your logs show:
```
POST /admin/login → 302 (redirect) ✅
GET /admin/login → 200 (back to login) ❌
```

The session is being set but not persisting between requests.

## Quick Fix (5 minutes)

Run these commands:

```bash
# 1. Disable secure cookies to test
heroku config:set SESSION_SECURE=false --app YOUR_APP_NAME

# 2. Ensure session secret is set
heroku config:set SESSION_SECRET="$(openssl rand -base64 32)" --app YOUR_APP_NAME

# 3. Restart app
heroku restart --app YOUR_APP_NAME

# 4. Clear browser cookies for your Heroku domain
#    (Do this manually in browser DevTools)
```

Then try logging in again.

## Why This Works

On Heroku, secure cookies (required for HTTPS) can sometimes cause issues with session persistence. Disabling secure cookies temporarily allows us to test if that's the issue.

## After It Works

Once login works with `SESSION_SECURE=false`, you can:

1. **Keep it disabled** (less secure but works)
2. **Try enabling secure cookies again**:
   ```bash
   heroku config:unset SESSION_SECURE --app YOUR_APP_NAME
   heroku restart --app YOUR_APP_NAME
   ```

## Still Not Working?

Check these:

1. **Admin user exists?**
   ```bash
   heroku run node scripts/setup.js --app YOUR_APP_NAME
   ```

2. **Check logs during login:**
   ```bash
   heroku logs --tail --app YOUR_APP_NAME
   ```
   Look for "=== LOGIN ATTEMPT ===" messages

3. **Browser cookies:**
   - Open DevTools (F12)
   - Application → Cookies
   - Look for `rgcpool.sid` cookie
   - If missing, cookies aren't being set

## Full Diagnostic

```bash
# Check all config vars
heroku config --app YOUR_APP_NAME

# Test admin user
heroku run node scripts/test-login.js --app YOUR_APP_NAME

# Watch logs
heroku logs --tail --app YOUR_APP_NAME
```

---

**Most likely fix**: Run the 4 commands at the top. This will resolve 90% of Heroku login issues.

