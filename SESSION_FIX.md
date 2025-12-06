# Session/Login Fix Guide

If you're experiencing login issues, here are the common causes and fixes:

## Common Issues

### 1. MongoDB Connection Problem

Sessions are stored in MongoDB. If MongoDB isn't connected, sessions won't work.

**Fix:**
- Make sure MongoDB is running: `brew services start mongodb-community`
- Check connection: `npm run check-db`
- Verify MONGODB_URI in your `.env` file

### 2. Admin User Doesn't Exist

If no admin user exists, login will fail.

**Fix:**
```bash
npm run setup
```

This creates a default admin user:
- Username: `admin` (or from ADMIN_USERNAME in .env)
- Password: `admin123` (or from ADMIN_PASSWORD in .env)

### 3. Session Secret Not Set

A weak or missing session secret can cause session issues.

**Fix:**
Generate a strong session secret and add to `.env`:
```bash
# Generate a secure secret
openssl rand -base64 32

# Add to .env file:
SESSION_SECRET=your-generated-secret-here
```

### 4. Session Store Issues

The session store might not be connecting to MongoDB properly.

**Fix:**
Check server logs for session store errors. The session configuration has been improved to handle errors gracefully.

## Testing Login

1. **Test if admin user exists:**
   ```bash
   npm run test-login
   ```

2. **Check MongoDB connection:**
   ```bash
   npm run check-db
   ```

3. **Verify environment variables:**
   ```bash
   cat .env | grep -E "(SESSION_SECRET|MONGODB_URI|ADMIN)"
   ```

## Debug Steps

1. **Check server logs** when attempting to login
2. **Clear browser cookies** for localhost
3. **Try incognito/private browsing mode**
4. **Check MongoDB connection** is active
5. **Verify admin user exists** in database

## Manual Admin Creation

If setup script doesn't work, create admin manually:

```bash
node
```

Then in Node REPL:
```javascript
require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rgcpoolandspa')
  .then(async () => {
    const admin = new Admin({
      username: process.env.ADMIN_USERNAME || 'admin',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      email: process.env.ADMIN_EMAIL || 'admin@example.com'
    });
    await admin.save();
    console.log('Admin created!');
    process.exit(0);
  });
```

## After Fixing

1. Restart your server
2. Clear browser cookies/cache
3. Try logging in again
4. Check server console for any errors

## Still Not Working?

Check:
- ✅ MongoDB is running and connected
- ✅ Admin user exists in database
- ✅ SESSION_SECRET is set in .env
- ✅ Browser cookies are enabled
- ✅ No console errors in browser
- ✅ Server logs show no errors

If issues persist, check the server console logs for specific error messages.


