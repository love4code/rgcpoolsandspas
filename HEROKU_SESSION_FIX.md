# Heroku Login/Session Fix

If login works on localhost but not on Heroku, follow these steps:

## Quick Fixes

### 1. Trust Proxy Setting

✅ **Fixed in server.js** - Added `app.set('trust proxy', 1)` which is required for Heroku

### 2. Cookie Settings

✅ **Fixed** - Cookies now use `secure: true` and `sameSite: 'none'` in production

### 3. Verify Environment Variables

Check your Heroku config vars:

```bash
heroku config --app YOUR_APP_NAME
```

Required variables:

- `SESSION_SECRET` - Must be set!
- `MONGODB_URI` - MongoDB connection string
- `ADMIN_USERNAME` - Admin username
- `ADMIN_PASSWORD` - Admin password

### 4. Set Session Secret (if not set)

```bash
# Generate a secure secret
openssl rand -base64 32

# Set it on Heroku (replace with your app name and generated secret)
heroku config:set SESSION_SECRET="your-generated-secret-here" --app YOUR_APP_NAME
```

### 5. Ensure Admin User Exists

Run setup on Heroku:

```bash
heroku run node scripts/setup.js --app YOUR_APP_NAME
```

### 6. Restart Heroku App

```bash
heroku restart --app YOUR_APP_NAME
```

## Common Issues

### Issue: "Invalid credentials" but credentials are correct

**Solution**: Admin user might not exist. Run:

```bash
heroku run node scripts/setup.js --app YOUR_APP_NAME
```

### Issue: Session not persisting

**Solutions**:

1. Check SESSION_SECRET is set: `heroku config:get SESSION_SECRET --app YOUR_APP_NAME`
2. Verify MongoDB connection: `heroku logs --tail --app YOUR_APP_NAME`
3. Check cookie settings in browser dev tools

### Issue: Redirects to login immediately after login

**Solutions**:

1. Clear browser cookies for your Heroku domain
2. Try incognito/private browsing mode
3. Check if `secure` cookie setting matches your environment

## Debug Steps

1. **Check Heroku logs:**

   ```bash
   heroku logs --tail --app YOUR_APP_NAME
   ```

2. **Look for session errors:**

   - "Session save error"
   - "MongoStore error"
   - "Session store configured"

3. **Test admin user:**

   ```bash
   heroku run npm run test-login --app YOUR_APP_NAME
   ```

4. **Check environment variables:**
   ```bash
   heroku config --app YOUR_APP_NAME
   ```

## Configuration Checklist

- [ ] `SESSION_SECRET` is set and is a long random string
- [ ] `MONGODB_URI` is set and correct
- [ ] `ADMIN_USERNAME` is set
- [ ] `ADMIN_PASSWORD` is set
- [ ] Admin user exists in database (run setup script)
- [ ] Trust proxy is enabled (already fixed in code)
- [ ] Secure cookies enabled for production (already fixed)
- [ ] App has been restarted after config changes

## After Fixing

1. Restart the app: `heroku restart --app YOUR_APP_NAME`
2. Clear browser cookies for the Heroku domain
3. Try logging in again
4. Check logs if still not working: `heroku logs --tail --app YOUR_APP_NAME`

## Still Not Working?

Check the browser's developer console (F12) for:

- Cookie errors
- Network errors
- Redirect loops

Check Heroku logs for:

- Session store connection errors
- MongoDB connection errors
- Authentication errors

---

**Note**: The code has been updated to automatically detect Heroku/production environment and configure sessions correctly.
