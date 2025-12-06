#!/bin/bash

# Heroku Environment Variables Setup Script
# This script helps you set MongoDB and session secret for your Heroku app

echo "=========================================="
echo "Heroku Environment Variables Setup"
echo "=========================================="
echo ""

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo "❌ Heroku CLI is not installed."
    echo "Please install it from: https://devcenter.heroku.com/articles/heroku-cli"
    exit 1
fi

# Check if user is logged in to Heroku
echo "Checking Heroku login status..."
if ! heroku auth:whoami &> /dev/null; then
    echo "❌ Not logged in to Heroku. Logging in now..."
    heroku login
fi

# Get app name
echo ""
read -p "Enter your Heroku app name: " APP_NAME

if [ -z "$APP_NAME" ]; then
    echo "❌ App name is required"
    exit 1
fi

# Verify app exists
if ! heroku apps:info --app "$APP_NAME" &> /dev/null; then
    echo "❌ App '$APP_NAME' not found or you don't have access to it"
    exit 1
fi

echo ""
echo "✅ App found: $APP_NAME"
echo ""

# Generate a random session secret
SESSION_SECRET=$(openssl rand -base64 32)

echo "=========================================="
echo "Setting up environment variables..."
echo "=========================================="
echo ""

# Set Session Secret
echo "Setting SESSION_SECRET..."
heroku config:set SESSION_SECRET="$SESSION_SECRET" --app "$APP_NAME"
echo "✅ SESSION_SECRET set (auto-generated secure value)"
echo ""

# MongoDB URI
echo "MongoDB Configuration:"
echo "1. If using MongoDB Atlas (recommended), enter your connection string"
echo "2. If using Heroku MongoDB addon, leave blank to auto-detect"
echo ""
read -p "Enter MongoDB URI (or press Enter to skip): " MONGODB_URI

if [ -n "$MONGODB_URI" ]; then
    heroku config:set MONGODB_URI="$MONGODB_URI" --app "$APP_NAME"
    echo "✅ MONGODB_URI set"
else
    echo "⚠️  MONGODB_URI not set. You'll need to set it manually or use a Heroku addon."
fi
echo ""

# Other required variables
echo "Setting other required variables..."
echo ""

read -p "Enter ADMIN_EMAIL [markagrover85@gmail.com]: " ADMIN_EMAIL
ADMIN_EMAIL=${ADMIN_EMAIL:-markagrover85@gmail.com}
heroku config:set ADMIN_EMAIL="$ADMIN_EMAIL" --app "$APP_NAME"
echo "✅ ADMIN_EMAIL set to: $ADMIN_EMAIL"
echo ""

read -p "Enter ADMIN_USERNAME [admin]: " ADMIN_USERNAME
ADMIN_USERNAME=${ADMIN_USERNAME:-admin}
heroku config:set ADMIN_USERNAME="$ADMIN_USERNAME" --app "$APP_NAME"
echo "✅ ADMIN_USERNAME set to: $ADMIN_USERNAME"
echo ""

read -sp "Enter ADMIN_PASSWORD: " ADMIN_PASSWORD
echo ""
if [ -n "$ADMIN_PASSWORD" ]; then
    heroku config:set ADMIN_PASSWORD="$ADMIN_PASSWORD" --app "$APP_NAME"
    echo "✅ ADMIN_PASSWORD set"
else
    echo "⚠️  ADMIN_PASSWORD not set. Using default from setup script."
fi
echo ""

# Email configuration
echo "Email Configuration (for contact forms):"
echo ""
read -p "Enter SMTP_HOST [smtp.gmail.com]: " SMTP_HOST
SMTP_HOST=${SMTP_HOST:-smtp.gmail.com}
heroku config:set SMTP_HOST="$SMTP_HOST" --app "$APP_NAME"
echo "✅ SMTP_HOST set to: $SMTP_HOST"
echo ""

read -p "Enter SMTP_PORT [587]: " SMTP_PORT
SMTP_PORT=${SMTP_PORT:-587}
heroku config:set SMTP_PORT="$SMTP_PORT" --app "$APP_NAME"
echo "✅ SMTP_PORT set to: $SMTP_PORT"
echo ""

read -p "Enter SMTP_USER (your email): " SMTP_USER
if [ -n "$SMTP_USER" ]; then
    heroku config:set SMTP_USER="$SMTP_USER" --app "$APP_NAME"
    echo "✅ SMTP_USER set to: $SMTP_USER"
else
    echo "⚠️  SMTP_USER not set"
fi
echo ""

read -sp "Enter SMTP_PASS (app password): " SMTP_PASS
echo ""
if [ -n "$SMTP_PASS" ]; then
    heroku config:set SMTP_PASS="$SMTP_PASS" --app "$APP_NAME"
    echo "✅ SMTP_PASS set"
else
    echo "⚠️  SMTP_PASS not set"
fi
echo ""

echo "=========================================="
echo "✅ Environment variables setup complete!"
echo "=========================================="
echo ""
echo "Current configuration for $APP_NAME:"
echo ""
heroku config --app "$APP_NAME"
echo ""
echo "Next steps:"
echo "1. Run: heroku run node scripts/setup.js --app $APP_NAME"
echo "2. Deploy your code: git push heroku main"
echo "3. Visit: https://$APP_NAME.herokuapp.com"
echo ""


