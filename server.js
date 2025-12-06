require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const connectDB = require('./config/database');
const publicRoutes = require('./routes/publicRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy - Required for Heroku to work correctly with sessions
app.set('trust proxy', 1);

// Connect to database
connectDB();

// View engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

// Session configuration
const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/rgcpoolandspa';
// Detect if running on Heroku (Heroku sets DYNO env variable)
const isHeroku = !!process.env.DYNO;
const isProduction = process.env.NODE_ENV === 'production' || isHeroku;

// Session configuration - optimized for Heroku
// On Heroku (HTTPS), we need secure cookies
const useSecureCookies = isProduction && process.env.SESSION_SECURE !== 'false';

const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  rolling: true, // Reset expiration on every request
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    secure: useSecureCookies, // Use secure cookies in production (Heroku uses HTTPS)
    sameSite: 'lax' // Use 'lax' for better compatibility - works with secure cookies on same domain
  },
  name: 'rgcpool.sid' // Custom session name to avoid conflicts
};

if (isHeroku) {
  console.log('🌐 Running on Heroku');
  console.log('📋 Session config - secure:', sessionConfig.cookie.secure, 'sameSite:', sessionConfig.cookie.sameSite);
  console.log('🔑 Session secret set:', !!process.env.SESSION_SECRET);
  console.log('🔗 MongoDB URI set:', !!process.env.MONGODB_URI);
}

// Create MongoDB store with error handling
try {
  sessionConfig.store = MongoStore.create({
    mongoUrl: mongoUrl,
    touchAfter: 24 * 3600, // Lazy session update - only update if session was modified
    autoRemove: 'native' // Use MongoDB TTL index for session cleanup
  });
  console.log('✅ Session store configured with MongoDB');
} catch (error) {
  console.warn('⚠️  Could not create MongoStore, sessions may not persist:', error.message);
}

app.use(session(sessionConfig));

app.use(flash());

// Make flash messages available to all views
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', publicRoutes);
app.use('/admin', adminRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('error', { message: 'Page not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

