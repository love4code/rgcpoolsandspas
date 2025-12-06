# Simple Heroku Login Fix

## The Problem
Login redirects back to login page - session isn't persisting.

## The Solution (3 Steps)

### Step 1: Deploy Latest Code
The code now has secure cookies disabled by default, which should fix the issue.

### Step 2: Restart Your App
```bash
heroku restart --app YOUR_APP_NAME
```

### Step 3: Clear Browser Cookies
1. Open your browser DevTools (F12)
2. Go to Application/Storage tab
3. Click Cookies → your Heroku domain
4. Delete all cookies
5. Try logging in again

## That's It!

The code has been updated to:
- ✅ Disable secure cookies (they were causing the issue)
- ✅ Use simpler cookie configuration
- ✅ Better session handling

## Still Not Working?

Run these commands:

```bash
# Check if admin user exists
heroku run node scripts/setup.js --app YOUR_APP_NAME

# Check logs
heroku logs --tail --app YOUR_APP_NAME
```

Look for:
- "=== LOGIN SUCCESS ==="
- "✅ Session saved - redirecting to dashboard"

If you don't see these, the login is failing before the session is set.

## Quick Test

After deploying, visit:
```
https://YOUR_APP_NAME.herokuapp.com/admin/test-session
```

This shows if sessions are working at all.

---

**The fix is in the code - just deploy and restart!**


