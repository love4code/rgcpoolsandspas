# RGC Pool and Spa - Marketing & Sales Website

A comprehensive marketing and sales website for RGC Pool and Spa, built with Express, Mongoose, EJS, and Bootstrap 5. Features both a public-facing site and a full admin panel for content management.

## Features

### Public Site
- **Home Page**: Hero section, featured services, portfolio items, and contact form
- **About Page**: Company information
- **Contact Page**: Contact form with service selection
- **Products**: List and detail pages with contact forms
- **Portfolio**: Showcase of completed projects
- **Events Calendar**: Public-facing event calendar

### Admin Panel
- **Media Library**: Upload, compress, and resize images (stored as binary in MongoDB)
- **Products Management**: Create/edit products with sizes, images, and SEO settings
- **Portfolio Management**: Add/edit projects with image galleries
- **Services Management**: Manage services with Bootstrap icon selection
- **Events Management**: CRUD operations for calendar events
- **Inquiries**: View and manage contact form submissions
- **Settings**: Company info, theme customization, hero image, social media links

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Templating**: EJS
- **Styling**: Bootstrap 5
- **Image Processing**: Sharp (compression and resizing)
- **Email**: Nodemailer
- **Authentication**: Session-based with bcrypt

## Installation

1. **Clone the repository** (or navigate to the project directory)

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/rgcpoolandspa
   SESSION_SECRET=your-session-secret-key-change-in-production
   ADMIN_EMAIL=markagrover85@gmail.com
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your-secure-password
   
   # Email configuration (Gmail example)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```

4. **Set up the database and admin user**:
   ```bash
   node scripts/setup.js
   ```
   This will:
   - Connect to MongoDB
   - Create a default admin user (or use credentials from .env)
   - Initialize settings

5. **Start the server**:
   ```bash
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

6. **Access the application**:
   - Public site: http://localhost:3000
   - Admin panel: http://localhost:3000/admin/login

## Configuration

### MongoDB
Make sure MongoDB is running on your system. Update `MONGODB_URI` in `.env` if using a different connection string.

### Email Setup (Gmail)
1. Enable 2-Step Verification on your Google Account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the app password in `SMTP_PASS` in your `.env` file

### Admin Credentials
Default admin credentials are set in the setup script. Change them immediately after first login, or set custom credentials in `.env` before running setup.

## Project Structure

```
rgcpoolandspa/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── adminController.js   # Admin authentication & dashboard
│   ├── eventController.js   # Events CRUD
│   ├── inquiryController.js # Contact form submissions
│   ├── mediaController.js   # Media upload & management
│   ├── portfolioController.js # Portfolio CRUD
│   ├── productController.js # Products CRUD
│   ├── publicController.js  # Public pages
│   ├── serviceController.js # Services CRUD
│   └── settingsController.js # Site settings
├── middleware/
│   ├── auth.js              # Authentication middleware
│   └── upload.js            # Image upload & processing
├── models/
│   ├── Admin.js             # Admin user model
│   ├── Event.js             # Event model
│   ├── Inquiry.js           # Contact form model
│   ├── Media.js             # Media/image model
│   ├── Portfolio.js         # Portfolio project model
│   ├── Product.js           # Product model
│   ├── Service.js           # Service model
│   └── Settings.js          # Site settings model
├── routes/
│   ├── adminRoutes.js       # Admin routes
│   └── publicRoutes.js      # Public routes
├── scripts/
│   └── setup.js             # Initial setup script
├── utils/
│   ├── email.js             # Email sending utility
│   └── layout.js            # Layout helper (unused currently)
├── views/
│   ├── admin/               # Admin panel views
│   ├── public/              # Public site views
│   ├── partials/            # Reusable partials
│   └── error.ejs            # Error page
├── public/                  # Static files (create if needed)
├── server.js                # Main application file
├── package.json
└── README.md
```

## Features Details

### Image Upload & Processing
- Images are stored as binary data in MongoDB (GridFS alternative)
- Automatic compression and resizing:
  - **Large**: Max 1920px (85% quality)
  - **Medium**: Max 800px (80% quality)
  - **Thumbnail**: 300x300px cropped (75% quality)
- Upload progress tracking

### Contact Forms
Contact forms appear on:
- Home page
- Contact page
- Each product detail page

Form fields:
- Name (required)
- Town
- Phone Number
- Email Address (required)
- Service dropdown (required)
- Pool sizes (on product pages, multiple select)
- Message

Submissions are:
- Emailed to `markagrover85@gmail.com` (or configured email)
- Stored in database for admin review

### Themes
Four pre-set blue/water themes available:
- Blue Ocean
- Aqua Blue
- Deep Blue
- Tropical Blue

Select in Admin > Settings

## Development

### Adding New Features

1. **Create/Update Models**: Add new schemas in `models/`
2. **Create Controllers**: Add business logic in `controllers/`
3. **Create Routes**: Add routes in `routes/`
4. **Create Views**: Add EJS templates in `views/`

### Database Schema

All data is stored in MongoDB collections:
- `admins`: Admin users
- `products`: Product catalog
- `portfolios`: Portfolio projects
- `services`: Services offered
- `events`: Calendar events
- `inquiries`: Contact form submissions
- `media`: Image/media files (binary storage)
- `settings`: Site-wide settings (singleton)

## Security Notes

- Change default admin password immediately
- Use strong `SESSION_SECRET` in production
- Configure proper CORS if needed
- Use environment variables for sensitive data
- Consider adding rate limiting for contact forms

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod` or check service status
- Verify `MONGODB_URI` in `.env` is correct

### Email Not Sending
- Check SMTP credentials in `.env`
- For Gmail, ensure App Password is used (not regular password)
- Check firewall/network settings

### Images Not Displaying
- Verify media upload completed successfully
- Check MongoDB connection
- Verify image route is accessible: `/admin/media/image/:id/:size`

## License

ISC

## Support

For issues or questions, contact the development team.

