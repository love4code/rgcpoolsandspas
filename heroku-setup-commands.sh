#!/bin/bash
# Copy this file and replace the variables, then run it
# Or run the commands one by one

# ==========================================
# REPLACE THESE VALUES WITH YOUR ACTUAL VALUES
# ==========================================
APP_NAME="your-heroku-app-name-here"
MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/rgcpoolandspa"
ADMIN_PASSWORD="your-secure-admin-password"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-gmail-app-password"

# ==========================================
# DO NOT EDIT BELOW THIS LINE
# ==========================================

echo "Setting up environment variables for Heroku app: $APP_NAME"
echo ""

# Generate secure session secret
SESSION_SECRET=$(openssl rand -base64 32)

# Set all environment variables
echo "Setting SESSION_SECRET..."
heroku config:set SESSION_SECRET="$SESSION_SECRET" --app "$APP_NAME"

echo "Setting MONGODB_URI..."
heroku config:set MONGODB_URI="$MONGODB_URI" --app "$APP_NAME"

echo "Setting ADMIN_EMAIL..."
heroku config:set ADMIN_EMAIL="markagrover85@gmail.com" --app "$APP_NAME"

echo "Setting ADMIN_USERNAME..."
heroku config:set ADMIN_USERNAME="admin" --app "$APP_NAME"

echo "Setting ADMIN_PASSWORD..."
heroku config:set ADMIN_PASSWORD="$ADMIN_PASSWORD" --app "$APP_NAME"

echo "Setting SMTP configuration..."
heroku config:set SMTP_HOST="smtp.gmail.com" --app "$APP_NAME"
heroku config:set SMTP_PORT="587" --app "$APP_NAME"
heroku config:set SMTP_USER="$SMTP_USER" --app "$APP_NAME"
heroku config:set SMTP_PASS="$SMTP_PASS" --app "$APP_NAME"

echo ""
echo "✅ All environment variables set!"
echo ""
echo "Verifying configuration..."
heroku config --app "$APP_NAME"
echo ""
echo "Next steps:"
echo "1. Run: heroku run node scripts/setup.js --app $APP_NAME"
echo "2. Deploy: git push heroku main"
echo "3. Visit: https://$APP_NAME.herokuapp.com"

