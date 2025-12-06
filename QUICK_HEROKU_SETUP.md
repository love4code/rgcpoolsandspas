# Quick Heroku Environment Setup

This guide will help you quickly set up MongoDB and session secret for your Heroku app.

## Option 1: Interactive Script (Recommended)

Run the interactive setup script:

```bash
chmod +x scripts/setup-heroku-env.sh
./scripts/setup-heroku-env.sh
```

Or use the Node.js version:

```bash
node scripts/setup-heroku-env.js
```

The script will:
- ✅ Auto-generate a secure session secret
- ✅ Prompt you for all required values
- ✅ Set all environment variables at once

## Option 2: Manual Setup

### Step 1: Generate Session Secret

Generate a secure random session secret:

```bash
# On Mac/Linux:
openssl rand -base64 32

# Or use Node.js:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Step 2: Get MongoDB Connection String

#### If using MongoDB Atlas (Recommended):
1. Go to https://www.mongodb.com/cloud/atlas
2. Create/select your cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your actual password

Format: `mongodb+srv://username:password@cluster.mongodb.net/rgcpoolandspa`

#### If using Heroku MongoDB Addon:
```bash
heroku addons:create mongolab:sandbox
heroku config:get MONGODB_URI
```

### Step 3: Set Environment Variables

Replace `YOUR_APP_NAME` with your actual Heroku app name:

```bash
# Set Session Secret (use the generated value from Step 1)
heroku config:set SESSION_SECRET="your-generated-secret-here" --app YOUR_APP_NAME

# Set MongoDB URI (use your connection string)
heroku config:set MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/rgcpoolandspa" --app YOUR_APP_NAME

# Set Admin Email
heroku config:set ADMIN_EMAIL="markagrover85@gmail.com" --app YOUR_APP_NAME

# Set Admin Username
heroku config:set ADMIN_USERNAME="admin" --app YOUR_APP_NAME

# Set Admin Password (use a secure password)
heroku config:set ADMIN_PASSWORD="your-secure-password" --app YOUR_APP_NAME

# Set Email Configuration (for contact forms)
heroku config:set SMTP_HOST="smtp.gmail.com" --app YOUR_APP_NAME
heroku config:set SMTP_PORT="587" --app YOUR_APP_NAME
heroku config:set SMTP_USER="your-email@gmail.com" --app YOUR_APP_NAME
heroku config:set SMTP_PASS="your-gmail-app-password" --app YOUR_APP_NAME
```

### Step 4: Verify Configuration

Check all environment variables:

```bash
heroku config --app YOUR_APP_NAME
```

### Step 5: Initialize Database

Run the setup script on Heroku:

```bash
heroku run node scripts/setup.js --app YOUR_APP_NAME
```

## Example: Complete Setup in One Command Block

```bash
# Replace these values with your actual values
APP_NAME="your-heroku-app-name"
MONGO_URI="mongodb+srv://user:pass@cluster.mongodb.net/rgcpoolandspa"
SESSION_SECRET=$(openssl rand -base64 32)
ADMIN_PASS="your-secure-password"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-gmail-app-password"

# Set all variables
heroku config:set SESSION_SECRET="$SESSION_SECRET" --app $APP_NAME
heroku config:set MONGODB_URI="$MONGO_URI" --app $APP_NAME
heroku config:set ADMIN_EMAIL="markagrover85@gmail.com" --app $APP_NAME
heroku config:set ADMIN_USERNAME="admin" --app $APP_NAME
heroku config:set ADMIN_PASSWORD="$ADMIN_PASS" --app $APP_NAME
heroku config:set SMTP_HOST="smtp.gmail.com" --app $APP_NAME
heroku config:set SMTP_PORT="587" --app $APP_NAME
heroku config:set SMTP_USER="$SMTP_USER" --app $APP_NAME
heroku config:set SMTP_PASS="$SMTP_PASS" --app $APP_NAME

# Verify
heroku config --app $APP_NAME

# Initialize database
heroku run node scripts/setup.js --app $APP_NAME
```

## Important Notes

1. **Session Secret**: Must be a long, random string. Don't share it publicly.
2. **MongoDB URI**: Keep it secure. It contains your database credentials.
3. **Admin Password**: Use a strong password for production.
4. **Gmail App Password**: For SMTP, you need a Gmail App Password, not your regular password.
   - Generate at: https://myaccount.google.com/apppasswords

## Troubleshooting

### "App not found" error
- Make sure you're logged in: `heroku login`
- Verify the app name: `heroku apps`

### MongoDB connection issues
- Verify the connection string is correct
- Check MongoDB Atlas IP whitelist (should allow all: 0.0.0.0/0)
- Ensure database user has proper permissions

### Environment variables not saving
- Check you're using the correct app name
- Verify you have permissions on the app
- Check for typos in variable names

## Need Help?

See the full deployment guide: `HEROKU_DEPLOY.md`

