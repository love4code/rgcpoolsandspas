require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const Settings = require('../models/Settings');
const connectDB = require('../config/database');

const setup = async () => {
  try {
    console.log('Connecting to database...');
    await connectDB();

    // Create default admin if doesn't exist
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      console.log('Creating default admin user...');
      const admin = new Admin({
        username: process.env.ADMIN_USERNAME || 'admin',
        password: process.env.ADMIN_PASSWORD || 'admin123',
        email: process.env.ADMIN_EMAIL || 'admin@example.com'
      });
      await admin.save();
      console.log('✅ Default admin created!');
      console.log('   Username: ' + (process.env.ADMIN_USERNAME || 'admin'));
      console.log('   Password: ' + (process.env.ADMIN_PASSWORD || 'admin123'));
      console.log('   ⚠️  Please change the default password after first login!');
    } else {
      console.log('✅ Admin user already exists');
    }

    // Initialize settings if doesn't exist
    const settings = await Settings.getSettings();
    console.log('✅ Settings initialized');

    console.log('\n✅ Setup completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Start the server: npm start');
    console.log('2. Visit http://localhost:3000/admin/login');
    console.log('3. Log in with the admin credentials above');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Setup error:', error);
    process.exit(1);
  }
};

setup();

