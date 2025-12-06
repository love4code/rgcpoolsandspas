#!/bin/bash

# Script to seed database on Heroku
# Usage: ./scripts/seed-heroku.sh YOUR_APP_NAME

if [ -z "$1" ]; then
    echo "❌ Error: Heroku app name required"
    echo ""
    echo "Usage: ./scripts/seed-heroku.sh YOUR_APP_NAME"
    echo ""
    echo "Example: ./scripts/seed-heroku.sh rgc-pool-and-spa"
    exit 1
fi

APP_NAME=$1

echo "=========================================="
echo "Seeding Database on Heroku: $APP_NAME"
echo "=========================================="
echo ""

# Check if app exists
if ! heroku apps:info --app "$APP_NAME" &> /dev/null; then
    echo "❌ App '$APP_NAME' not found"
    echo "   Please check your app name and try again"
    exit 1
fi

echo "✅ App found: $APP_NAME"
echo ""

# Check if MONGODB_URI is set
MONGO_URI=$(heroku config:get MONGODB_URI --app "$APP_NAME" 2>/dev/null)
if [ -z "$MONGO_URI" ]; then
    echo "❌ MONGODB_URI not set!"
    echo "   Please set it first:"
    echo "   heroku config:set MONGODB_URI='your-connection-string' --app $APP_NAME"
    exit 1
fi

echo "✅ MONGODB_URI is configured"
echo ""
echo "🌱 Running seed script on Heroku..."
echo "   This may take a minute..."
echo ""

# Run the seed script
heroku run node scripts/seed.js --app "$APP_NAME"

echo ""
echo "=========================================="
if [ $? -eq 0 ]; then
    echo "✅ Seed script completed!"
    echo ""
    echo "Your Heroku app should now have seed data."
    echo "Visit: https://$APP_NAME.herokuapp.com"
else
    echo "❌ Seed script failed. Check the output above for errors."
    exit 1
fi
echo "=========================================="

