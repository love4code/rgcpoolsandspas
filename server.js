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

const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    secure: false // Set to true in production with HTTPS
  },
  name: 'rgcpool.sid' // Custom session name to avoid conflicts
};

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

