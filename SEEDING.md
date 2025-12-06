# Database Seeding Guide

The seed script populates your database with sample data to help you get started quickly.

## What Gets Seeded

The seed script creates:

- **5 Services** - Pool installation, liner replacement, maintenance, repair, and opening/closing
- **4 Products** - Various pool types with sizes and descriptions
- **5 Portfolio Items** - Sample completed projects
- **4 Events** - Sample calendar events
- **5 Placeholder Images** - Simple placeholder images (you'll want to upload real images)
- **Settings** - Default company information and configuration

## How to Run

### Local Development

1. **Make sure MongoDB is running**:
   ```bash
   # On Mac with Homebrew:
   brew services start mongodb-community
   
   # Or start manually:
   mongod
   ```

2. **Make sure your `.env` file is configured**:
   ```env
   MONGODB_URI=mongodb://localhost:27017/rgcpoolandspa
   ```

3. **Run the seed script**:
   ```bash
   npm run seed
   ```
   
   Or directly:
   ```bash
   node scripts/seed.js
   ```

### On Heroku

```bash
heroku run npm run seed --app YOUR_APP_NAME
```

Or:
```bash
heroku run node scripts/seed.js --app YOUR_APP_NAME
```

## What the Seed Script Does

1. **Connects to MongoDB** using your configured connection string
2. **Clears existing data** (Products, Portfolio, Services, Events, Media)
   - Note: Admin users and Settings are preserved
3. **Creates placeholder images** (1x1 pixel PNGs - replace with real images)
4. **Creates sample services** with Bootstrap icons
5. **Creates sample products** with sizes and descriptions
6. **Creates portfolio items** with images
7. **Creates calendar events** with dates
8. **Updates settings** with default company information

## Sample Data Created

### Services
- Pool Installation (featured)
- Liner Replacement (featured)
- Pool Maintenance (featured)
- Pool Repair
- Pool Opening & Closing

### Products
- Round Above Ground Pool - 24ft
- Oval Above Ground Pool - 15x30ft
- Premium Pool Liner Replacement
- Pool Equipment Package

### Portfolio Items
- Modern Family Pool Installation (featured)
- Luxury Oval Pool with Deck (featured)
- Complete Pool Renovation (featured)
- Compact Pool for Small Yard (featured)
- Commercial Pool Installation

### Events
- Spring Pool Opening Special
- Free Pool Consultation Day
- Pool Installation Workshop
- End of Season Pool Closing

## Important Notes

⚠️ **The seed script will DELETE existing data** for:
- Products
- Portfolio items
- Services
- Events
- Media files

It will **NOT delete**:
- Admin users
- Settings (but will update them)
- Inquiries

⚠️ **Placeholder Images**: The seed script creates simple 1x1 pixel placeholder images. You should:
1. Log into the admin panel
2. Go to Media Library
3. Upload real images
4. Update products and portfolio items to use real images

## Customizing Seed Data

To customize the seed data:

1. Open `scripts/seed.js`
2. Modify the data arrays (services, products, portfolioItems, events)
3. Run the seed script again

## Resetting the Database

To completely reset and reseed:

```bash
# Clear all collections (be careful!)
# Then run:
npm run seed
```

Or manually clear collections in MongoDB:
```bash
mongo rgcpoolandspa
> db.products.deleteMany({})
> db.portfolios.deleteMany({})
> db.services.deleteMany({})
> db.events.deleteMany({})
> db.media.deleteMany({})
```

Then run: `npm run seed`

## Troubleshooting

### "MongoDB connection error"
- Make sure MongoDB is running locally
- Check your `MONGODB_URI` in `.env`
- For Heroku, verify environment variables are set

### "Cannot find module"
- Run `npm install` to ensure all dependencies are installed

### "E11000 duplicate key error"
- The seed script clears data first, but if you get this error:
  - Some data might already exist
  - Try running the seed script again
  - Or manually clear the collections

## After Seeding

1. **Log into admin panel**: `http://localhost:3000/admin/login`
2. **Upload real images**: Go to Media Library and upload actual product/portfolio images
3. **Update content**: Edit products, services, and portfolio items with your real content
4. **Configure settings**: Update company information, contact details, and social media links
5. **Test the site**: Visit the public pages to see your seeded content

## Example Workflow

```bash
# 1. Start MongoDB
brew services start mongodb-community

# 2. Run setup (creates admin user)
npm run setup

# 3. Seed the database
npm run seed

# 4. Start the server
npm start

# 5. Visit the site
# Public: http://localhost:3000
# Admin: http://localhost:3000/admin/login
```

---

**Note**: The seed script is safe to run multiple times. It will clear and recreate the sample data each time.

