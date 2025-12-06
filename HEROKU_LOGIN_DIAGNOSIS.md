# Heroku Login Diagnosis - Step by Step

Since login still isn't working, let's diagnose the exact issue:

## Step 1: Check Session Configuration

After deploying latest code, check your Heroku logs:
```bash
heroku logs --tail --app YOUR_APP_NAME
```

Look for these lines when the app starts:
- `🌐 Running on Heroku`
- `📋 Session config - secure: false sameSite: lax`
- `✅ Session store configured with MongoDB`

If you don't see these, the code hasn't deployed yet.

## Step 2: Test Session Endpoint

Visit this URL (after deploying):
```
https://YOUR_APP_NAME.herokuapp.com/admin/test-session
```

This will show:
- If sessions are working at all
- If cookies are being set
- Current session state

**What to look for:**
- `sessionExists: true` - Sessions are working
- `cookieHeader: "rgcpool.sid=..."` - Cookie is being sent
- If cookieHeader is empty, cookies aren't being set

## Step 3: Try Logging In

1. Clear ALL cookies for your Heroku domain (DevTools → Application → Cookies)
2. Go to login page
3. Enter credentials
4. Watch the logs

Look for:
- `=== LOGIN SUCCESS ===`
- `✅ Session saved successfully`
- `Redirecting to dashboard...`

## Step 4: Check What Happens After Login

After you click login, immediately check:
1. **Browser DevTools → Network tab**
   - Look at the POST to `/admin/login`
   - Check Response Headers - is there a `Set-Cookie` header?
   - If no `Set-Cookie`, the cookie isn't being set

2. **Browser DevTools → Application → Cookies**
   - After login attempt, is there a `rgcpool.sid` cookie?
   - If no cookie appears, it's not being set

## Common Issues & Fixes

### Issue 1: No Set-Cookie Header in Response

**Problem**: Cookie isn't being sent from server

**Check**: Look at Heroku logs for session errors

**Fix**: Make sure SESSION_SECRET is set:
```bash
heroku config:set SESSION_SECRET="$(openssl rand -base64 32)" --app YOUR_APP_NAME
heroku restart --app YOUR_APP_NAME
```

### Issue 2: Cookie Set But Not Persisting

**Problem**: Cookie is set but lost on next request

**Check**: Browser DevTools → Application → Cookies - does cookie disappear?

**Possible causes:**
- Cookie domain mismatch
- Cookie path issue
- Browser blocking cookies

**Fix**: Clear cookies and try incognito mode

### Issue 3: Session Exists But adminId is Missing

**Problem**: Session works but login data isn't saved

**Check**: Visit `/admin/test-session` after login - is `adminId: null`?

**Fix**: Check Heroku logs for session save errors

### Issue 4: Login Works But Redirects Back

**Problem**: Session is set but lost immediately

**Check**: Is the cookie being sent with the next request?

**Fix**: This is usually a cookie configuration issue. Try:
```bash
heroku config:set SESSION_SECURE=false --app YOUR_APP_NAME
heroku restart --app YOUR_APP_NAME
```

## Quick Test Checklist

After deploying latest code:

- [ ] App starts without errors
- [ ] MongoDB connects successfully
- [ ] Session store configured message appears
- [ ] `/admin/test-session` shows `sessionExists: true`
- [ ] Admin user exists (run setup script)
- [ ] Clear browser cookies
- [ ] Try login
- [ ] Check logs for "=== LOGIN SUCCESS ==="
- [ ] Check browser cookies - is `rgcpool.sid` there?
- [ ] Check Network tab - is cookie being sent?

## Get Detailed Logs

Run this and try to login:
```bash
heroku logs --tail --app YOUR_APP_NAME | grep -E "(LOGIN|Session|Cookie|Error)"
```

This will show only login-related logs.

## Still Not Working?

Share these details:

1. **From `/admin/test-session`**: What does it show?
2. **From browser DevTools → Network**: Do you see `Set-Cookie` header?
3. **From browser DevTools → Cookies**: Is `rgcpool.sid` cookie present?
4. **From Heroku logs**: What messages appear during login?

---

**The key is to determine WHERE the session is failing:**
- Cookie not being set?
- Cookie being set but not sent?
- Session exists but adminId missing?
- Something else?

Use the test endpoint and browser DevTools to figure out which step is failing.


