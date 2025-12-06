# Seed Database on Heroku

If your Heroku app is not showing seed data, you need to run the seed script on Heroku.

## Quick Method (Recommended)

Use the helper script:

```bash
./scripts/seed-heroku.sh YOUR_APP_NAME
```

Replace `YOUR_APP_NAME` with your actual Heroku app name.

Example:
```bash
./scripts/seed-heroku.sh rgc-pool-and-spa
```

## Manual Method

Run the seed script directly on Heroku (recommended):

```bash
heroku run node scripts/seed.js --app YOUR_APP_NAME
```

Or using npm:

```bash
heroku run bash -c "npm run seed" --app YOUR_APP_NAME
```

## Before Seeding

Make sure your Heroku app has:
1. ✅ **MONGODB_URI** configured (check with `heroku config --app YOUR_APP_NAME`)
2. ✅ MongoDB connection is working

## Verify Seed Data

After running the seed script, you should see:
- ✅ Services on the home page
- ✅ Products on the products page
- ✅ Portfolio items on the home page and portfolio page
- ✅ Events on the calendar page

## Troubleshooting

### "MONGODB_URI not set"
Set your MongoDB connection string:
```bash
heroku config:set MONGODB_URI="your-connection-string" --app YOUR_APP_NAME
```

### "Connection timeout"
- Check your MongoDB Atlas IP whitelist (should allow all IPs: 0.0.0.0/0)
- Verify your MongoDB connection string is correct
- Check if your MongoDB cluster is running

### "Seed script runs but no data appears"
- Check Heroku logs: `heroku logs --tail --app YOUR_APP_NAME`
- Verify the seed script completed successfully
- Check if data exists in MongoDB directly

## What Gets Seeded

The seed script creates:
- 5 Services (Pool installation, liner replacement, etc.)
- 4 Products (Various pool types)
- 8 Portfolio items (Sample projects)
- 8 Events (Calendar events)
- 5 Placeholder images
- Default settings

**Note:** The seed script will DELETE existing Products, Portfolio items, Services, Events, and Media before creating new ones. Admin users and Settings are preserved.

