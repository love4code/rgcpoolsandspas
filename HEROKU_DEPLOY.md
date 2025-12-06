# Heroku Deployment Guide

This guide will help you deploy the RGC Pool and Spa application to Heroku.

## Prerequisites

- Heroku account (sign up at https://www.heroku.com)
- Heroku CLI installed (download from https://devcenter.heroku.com/articles/heroku-cli)
- Git repository initialized
- MongoDB Atlas account (recommended) or other MongoDB hosting

## Step 1: Prepare Your Local Environment

1. **Copy environment file**:
   ```bash
   cp .env.example .env
   ```

2. **Update `.env` with your local settings** (for development)

3. **Test locally**:
   ```bash
   npm install
   npm run setup
   npm start
   ```

## Step 2: Set Up MongoDB (MongoDB Atlas Recommended)

1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/rgcpoolandspa`)
4. Whitelist all IPs (0.0.0.0/0) for Heroku

## Step 3: Deploy to Heroku

1. **Login to Heroku**:
   ```bash
   heroku login
   ```

2. **Create a new Heroku app**:
   ```bash
   heroku create rgc-pool-and-spa
   ```
   (Replace `rgc-pool-and-spa` with your desired app name)

3. **Set up MongoDB addon** (if using Heroku's MongoDB):
   ```bash
   heroku addons:create mongolab:sandbox
   ```
   Or use MongoDB Atlas connection string (recommended)

4. **Set environment variables**:
   ```bash
   heroku config:set SESSION_SECRET=your-very-secure-random-secret-key-here
   heroku config:set ADMIN_EMAIL=markagrover85@gmail.com
   heroku config:set ADMIN_USERNAME=admin
   heroku config:set ADMIN_PASSWORD=your-secure-password
   heroku config:set SMTP_HOST=smtp.gmail.com
   heroku config:set SMTP_PORT=587
   heroku config:set SMTP_USER=your-email@gmail.com
   heroku config:set SMTP_PASS=your-gmail-app-password
   ```

5. **Set MongoDB URI**:
   - If using MongoDB Atlas:
     ```bash
     heroku config:set MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rgcpoolandspa
     ```
   - If using Heroku addon:
     ```bash
     heroku config:get MONGODB_URI
     ```
     (This will automatically set the MONGODB_URI from the addon)

6. **Verify configuration**:
   ```bash
   heroku config
   ```

## Step 4: Deploy the Application

1. **Initialize git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Deploy to Heroku**:
   ```bash
   git push heroku main
   ```
   Or if you're on master branch:
   ```bash
   git push heroku master
   ```

3. **Run setup script on Heroku**:
   ```bash
   heroku run node scripts/setup.js
   ```

## Step 5: Verify Deployment

1. **Open your app**:
   ```bash
   heroku open
   ```

2. **Check logs**:
   ```bash
   heroku logs --tail
   ```

3. **Access admin panel**:
   - Visit: `https://your-app-name.herokuapp.com/admin/login`
   - Login with your ADMIN_USERNAME and ADMIN_PASSWORD

## Step 6: Post-Deployment Setup

1. **Log into admin panel** and:
   - Change the default admin password
   - Configure site settings
   - Upload media/images
   - Add products, services, portfolio items

2. **Set up custom domain** (optional):
   ```bash
   heroku domains:add www.yourdomain.com
   ```

## Environment Variables Reference

Required environment variables for Heroku:

```
MONGODB_URI          - MongoDB connection string
SESSION_SECRET       - Secret key for sessions (use a random string)
ADMIN_EMAIL          - Email for contact form notifications
ADMIN_USERNAME       - Admin login username
ADMIN_PASSWORD       - Admin login password
SMTP_HOST            - SMTP server hostname
SMTP_PORT            - SMTP server port
SMTP_USER            - SMTP username (usually your email)
SMTP_PASS            - SMTP password (app password for Gmail)
```

Note: PORT is automatically set by Heroku, so you don't need to configure it.

## Troubleshooting

### Application crashes on startup
- Check logs: `heroku logs --tail`
- Verify all environment variables are set: `heroku config`
- Ensure MongoDB connection string is correct
- Check if setup script was run: `heroku run node scripts/setup.js`

### Images not loading
- Verify MongoDB connection is working
- Check media upload functionality in admin panel
- Review Heroku logs for errors

### Email not sending
- Verify SMTP credentials are correct
- Check Gmail app password is set correctly
- Review email configuration in settings

### Database connection errors
- Verify MONGODB_URI is correct
- Check MongoDB Atlas IP whitelist includes all IPs (0.0.0.0/0)
- Ensure database user has proper permissions

## Updating Your Deployment

1. **Make changes locally**:
   ```bash
   # Make your code changes
   git add .
   git commit -m "Description of changes"
   ```

2. **Deploy updates**:
   ```bash
   git push heroku main
   ```

3. **Restart if needed**:
   ```bash
   heroku restart
   ```

## Useful Heroku Commands

```bash
# View logs
heroku logs --tail

# Open app in browser
heroku open

# Run commands in Heroku environment
heroku run node scripts/setup.js

# Check app status
heroku ps

# View environment variables
heroku config

# Set environment variable
heroku config:set KEY=value

# Remove environment variable
heroku config:unset KEY

# Restart app
heroku restart

# Scale dynos (if needed)
heroku ps:scale web=1
```

## Security Notes

- ✅ Never commit `.env` file to git (already in .gitignore)
- ✅ Use strong, random SESSION_SECRET in production
- ✅ Use strong admin password
- ✅ Use Gmail App Password (not regular password) for SMTP
- ✅ Keep MongoDB credentials secure
- ✅ Consider enabling Heroku SSL (automatic on paid plans)

## MongoDB Atlas Setup Details

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free M0 cluster
3. Go to Database Access → Add New Database User
4. Go to Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)
5. Click "Connect" on your cluster → Connect your application → Copy connection string
6. Replace `<password>` with your database user password
7. Use this connection string as MONGODB_URI in Heroku config

Example connection string:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/rgcpoolandspa?retryWrites=true&w=majority
```

---

**Note**: The Procfile is already included in the project root and will tell Heroku how to start your application.


