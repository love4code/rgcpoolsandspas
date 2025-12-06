# Check Admin User - Quick Guide

## The Issue

Your logs show login POST → 302 → redirects back to login. This means either:
1. **Wrong credentials** (most likely)
2. **Admin user doesn't exist**
3. **Session not persisting** (less likely if credentials are wrong)

## Quick Check

### Step 1: Verify Admin User Exists

Run this on Heroku:
```bash
heroku run node scripts/setup.js --app YOUR_APP_NAME
```

This will:
- Create admin user if it doesn't exist
- Use credentials from your Heroku config vars:
  - `ADMIN_USERNAME` (default: "admin")
  - `ADMIN_PASSWORD` (check your config)
  - `ADMIN_EMAIL` (optional)

### Step 2: Check Your Config Vars

```bash
heroku config --app YOUR_APP_NAME
```

Look for:
- `ADMIN_USERNAME` - What username to use
- `ADMIN_PASSWORD` - What password to use

### Step 3: Use Correct Credentials

Make sure you're logging in with:
- Username: Value from `ADMIN_USERNAME` (probably "admin")
- Password: Value from `ADMIN_PASSWORD`

## After Deploying Latest Code

The latest code has better logging. After deploying, try logging in and check logs:

```bash
heroku logs --tail --app YOUR_APP_NAME
```

You should see:
- `=== LOGIN REQUEST ===`
- `Looking for admin with username: ...`
- Either `✅ Admin found` or `❌ Admin not found`
- Either `✅ Password matches` or `❌ Password does not match`

## Common Mistakes

1. **Using wrong username** - Check `ADMIN_USERNAME` config var
2. **Using wrong password** - Check `ADMIN_PASSWORD` config var
3. **Admin user doesn't exist** - Run setup script to create it

## Quick Fix

If you're not sure what credentials to use:

1. **Check config vars:**
   ```bash
   heroku config:get ADMIN_USERNAME --app YOUR_APP_NAME
   heroku config:get ADMIN_PASSWORD --app YOUR_APP_NAME
   ```

2. **If password is wrong, set it:**
   ```bash
   heroku config:set ADMIN_PASSWORD="your-new-password" --app YOUR_APP_NAME
   ```

3. **Recreate admin user:**
   ```bash
   heroku run node scripts/setup.js --app YOUR_APP_NAME
   ```

4. **Try logging in with:**
   - Username: from `ADMIN_USERNAME`
   - Password: from `ADMIN_PASSWORD`

---

**After deploying the latest code with better logging, the logs will tell you exactly what's wrong!**


