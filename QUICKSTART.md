# Quick Start Guide

## First Time Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/rgcpoolandspa
   SESSION_SECRET=change-this-to-a-random-string
   ADMIN_EMAIL=markagrover85@gmail.com
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=changeme123
   
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```

3. **Setup Database & Admin User**
   ```bash
   npm run setup
   ```
   This creates:
   - Default admin user (username/password from .env or defaults)
   - Initial settings document

4. **Start the Server**
   ```bash
   npm start
   ```
   Or for development:
   ```bash
   npm run dev
   ```

5. **Access the Application**
   - Public Site: http://localhost:3000
   - Admin Login: http://localhost:3000/admin/login
     - Default credentials: admin / (password from .env or 'admin123')

## Getting Started with Content

1. **Log into Admin Panel**
   - Go to http://localhost:3000/admin/login
   - Use your admin credentials

2. **Configure Settings**
   - Navigate to Settings in the admin sidebar
   - Update company information
   - Set up social media links
   - Select a theme
   - Choose a hero image (upload first if needed)

3. **Upload Media**
   - Go to Media Library
   - Upload images (will be automatically compressed and resized)
   - Images are stored in MongoDB as binary data

4. **Add Services**
   - Go to Services
   - Create services for your home page
   - Select Bootstrap icons for visual appeal
   - Mark as "Featured" to show on homepage

5. **Add Products**
   - Go to Products
   - Create products with:
     - Name and description
     - Pool sizes (optional)
     - Images from media library
     - SEO settings
   - Enable/disable contact form per product

6. **Add Portfolio Items**
   - Go to Portfolio
   - Create projects showcasing completed work
   - Upload multiple images
   - Mark as "Featured" to show on homepage

7. **Add Events**
   - Go to Events
   - Create calendar events
   - These appear on the public Events/Calendar page

8. **View Inquiries**
   - Go to Recent Inquiries
   - View contact form submissions
   - Mark as read/unread
   - Delete if needed

## Tips

- Images are automatically optimized on upload (large/medium/thumbnail sizes)
- Contact forms automatically email submissions to your configured email
- All data is stored in MongoDB
- Themes can be changed in Settings
- Hero image can be changed in Settings

## Troubleshooting

**Can't connect to MongoDB?**
- Ensure MongoDB is running: `mongod` or check service status
- Verify MONGODB_URI in .env

**Email not sending?**
- Check SMTP credentials in .env
- For Gmail: Use App Password, not regular password
- Verify SMTP settings are correct

**Images not displaying?**
- Check that media was uploaded successfully
- Verify MongoDB connection
- Check browser console for errors

## Next Steps

- Customize the About page content
- Add your company branding/colors
- Set up production environment variables
- Configure proper domain and SSL
- Change default admin password!

