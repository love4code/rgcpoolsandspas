#!/bin/bash

# Quick script to fix Heroku login issues

if [ -z "$1" ]; then
    echo "Usage: ./scripts/fix-heroku-login.sh YOUR_APP_NAME"
    exit 1
fi

APP_NAME=$1

echo "=========================================="
echo "Fixing Heroku Login Issues for: $APP_NAME"
echo "=========================================="
echo ""

# Check if app exists
if ! heroku apps:info --app "$APP_NAME" &> /dev/null; then
    echo "❌ App '$APP_NAME' not found"
    exit 1
fi

echo "1. Checking environment variables..."
echo ""

# Check SESSION_SECRET
SESSION_SECRET=$(heroku config:get SESSION_SECRET --app "$APP_NAME" 2>/dev/null)
if [ -z "$SESSION_SECRET" ]; then
    echo "⚠️  SESSION_SECRET not set. Generating and setting..."
    NEW_SECRET=$(openssl rand -base64 32)
    heroku config:set SESSION_SECRET="$NEW_SECRET" --app "$APP_NAME"
    echo "✅ SESSION_SECRET set"
else
    echo "✅ SESSION_SECRET is set"
fi

# Check MONGODB_URI
MONGO_URI=$(heroku config:get MONGODB_URI --app "$APP_NAME" 2>/dev/null)
if [ -z "$MONGO_URI" ]; then
    echo "⚠️  MONGODB_URI not set!"
    echo "   Please set it: heroku config:set MONGODB_URI='your-connection-string' --app $APP_NAME"
else
    echo "✅ MONGODB_URI is set"
fi

# Check ADMIN credentials
ADMIN_USER=$(heroku config:get ADMIN_USERNAME --app "$APP_NAME" 2>/dev/null)
ADMIN_PASS=$(heroku config:get ADMIN_PASSWORD --app "$APP_NAME" 2>/dev/null)

if [ -z "$ADMIN_USER" ]; then
    echo "⚠️  ADMIN_USERNAME not set. Setting default..."
    heroku config:set ADMIN_USERNAME="admin" --app "$APP_NAME"
    echo "✅ ADMIN_USERNAME set to 'admin'"
else
    echo "✅ ADMIN_USERNAME is set"
fi

if [ -z "$ADMIN_PASS" ]; then
    echo "⚠️  ADMIN_PASSWORD not set!"
    echo "   Please set it: heroku config:set ADMIN_PASSWORD='your-password' --app $APP_NAME"
else
    echo "✅ ADMIN_PASSWORD is set"
fi

echo ""
echo "2. Creating/updating admin user..."
heroku run node scripts/setup.js --app "$APP_NAME"

echo ""
echo "3. Restarting app..."
heroku restart --app "$APP_NAME"

echo ""
echo "=========================================="
echo "✅ Fix complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Wait a few seconds for the app to restart"
echo "2. Clear your browser cookies for $APP_NAME.herokuapp.com"
echo "3. Try logging in at: https://$APP_NAME.herokuapp.com/admin/login"
echo ""
echo "If still not working, check logs:"
echo "   heroku logs --tail --app $APP_NAME"

