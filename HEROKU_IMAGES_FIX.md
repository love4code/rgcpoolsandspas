# Fix Missing Images on Heroku

## The Problem
Images uploaded to your local database are not in your Heroku database. Each database is separate.

## Solution Options

### Option 1: Upload Images via Admin Panel (Recommended)
1. **Log in to your Heroku admin panel:**
   ```
   https://rgcpoolandspa-9a631275bb36.herokuapp.com/admin/login
   ```

2. **Navigate to Media Library:**
   - Click "Media" in the admin sidebar
   - Or go to: `https://rgcpoolandspa-9a631275bb36.herokuapp.com/admin/media`

3. **Upload your images:**
   - Click "Upload Images" or drag and drop
   - Upload all the images you need
   - Wait for processing to complete

4. **Assign images to products/portfolio:**
   - Go to Products or Portfolio sections
   - Edit each item
   - Select the uploaded images

### Option 2: Run Seed Script (Creates Placeholder Images)
This creates 1x1 pixel placeholder images so the site works, but you'll need to replace them with real images later.

**Run the seed script on Heroku:**
```bash
heroku run node scripts/seed.js --app rgcpoolandspa-9a631275bb36
```

Or if you have a different app name:
```bash
heroku run node scripts/seed.js --app YOUR_APP_NAME
```

**What the seed script does:**
- Creates 5 placeholder images
- Creates sample products, portfolio items, services, and events
- **WARNING:** This will DELETE existing products, portfolio items, services, events, and media
- Admin users and settings are preserved

### Option 3: Migrate Images from Local to Heroku (Advanced)
If you have many images, you could write a migration script, but uploading through the admin panel is usually easier.

## Verify Images Are Working

After uploading images:
1. Visit your Heroku site
2. Check the home page - portfolio images should appear
3. Check products page - product images should appear
4. Check portfolio page - all portfolio images should appear

## Troubleshooting

### Images still not showing after upload
1. **Check browser console** for 404 errors on image URLs
2. **Check Heroku logs:**
   ```bash
   heroku logs --tail --app rgcpoolandspa-9a631275bb36
   ```
   Look for errors when accessing `/admin/media/image/[ID]/medium`

3. **Verify images exist in database:**
   - Go to admin panel → Media Library
   - You should see your uploaded images

### Image upload fails
- Check file size limits
- Check Heroku logs for errors
- Ensure you're logged in as admin

### Images show as broken
- Check the image route is accessible: `/admin/media/image/:id/:size`
- Verify the media document exists in the database
- Check Heroku logs for "Media found" or "Image not found" messages

## Quick Test

Test if the image route works:
```
https://rgcpoolandspa-9a631275bb36.herokuapp.com/admin/media/image/[MEDIA_ID]/medium
```

Replace `[MEDIA_ID]` with an actual media ID from your database.


