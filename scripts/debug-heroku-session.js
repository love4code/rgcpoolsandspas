#!/usr/bin/env node

/**
 * Debug Heroku Session Issues
 * This script helps diagnose session/login problems on Heroku
 */

require('dotenv').config();

console.log('========================================');
console.log('Heroku Session Debugging Tool');
console.log('========================================\n');

// Check environment
const isHeroku = !!process.env.DYNO;
console.log('Environment Detection:');
console.log('  - Heroku (DYNO):', isHeroku ? 'Yes ✅' : 'No');
console.log('  - NODE_ENV:', process.env.NODE_ENV || 'not set');
console.log('  - Production mode:', (process.env.NODE_ENV === 'production' || isHeroku) ? 'Yes' : 'No');
console.log('');

// Check session configuration
console.log('Session Configuration:');
console.log('  - SESSION_SECRET:', process.env.SESSION_SECRET ? 'Set ✅ (' + process.env.SESSION_SECRET.substring(0, 10) + '...)' : '❌ NOT SET');
console.log('  - Secure cookies:', (process.env.NODE_ENV === 'production' || isHeroku) ? 'Yes (HTTPS required)' : 'No');
console.log('  - SameSite:', 'lax');
console.log('');

// Check MongoDB
console.log('MongoDB Configuration:');
console.log('  - MONGODB_URI:', process.env.MONGODB_URI ? 'Set ✅' : '❌ NOT SET');
if (process.env.MONGODB_URI) {
  const mongoUri = process.env.MONGODB_URI;
  // Mask password in URI
  const maskedUri = mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:***@');
  console.log('  - Connection string:', maskedUri.substring(0, 60) + '...');
}
console.log('');

// Check admin credentials
console.log('Admin Configuration:');
console.log('  - ADMIN_USERNAME:', process.env.ADMIN_USERNAME || 'not set (default: admin)');
console.log('  - ADMIN_PASSWORD:', process.env.ADMIN_PASSWORD ? 'Set ✅' : '❌ NOT SET');
console.log('  - ADMIN_EMAIL:', process.env.ADMIN_EMAIL || 'not set');
console.log('');

// Test MongoDB connection
if (process.env.MONGODB_URI) {
  console.log('Testing MongoDB connection...');
  const mongoose = require('mongoose');
  const mongoUrl = process.env.MONGODB_URI;
  
  mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
  })
    .then(async () => {
      console.log('  ✅ MongoDB connection successful');
      
      // Check if admin exists
      const Admin = require('../models/Admin');
      const adminUsername = process.env.ADMIN_USERNAME || 'admin';
      const admin = await Admin.findOne({ username: adminUsername });
      
      if (admin) {
        console.log('  ✅ Admin user exists');
        console.log('     Username:', admin.username);
        console.log('     Email:', admin.email || 'not set');
      } else {
        console.log('  ❌ Admin user NOT found');
        console.log('     Run: heroku run node scripts/setup.js --app YOUR_APP_NAME');
      }
      
      await mongoose.connection.close();
      process.exit(0);
    })
    .catch(error => {
      console.log('  ❌ MongoDB connection failed:', error.message);
      process.exit(1);
    });
} else {
  console.log('⚠️  MONGODB_URI not set - cannot test connection');
  process.exit(1);
}

