require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const connectDB = require('../config/database');

const testLogin = async () => {
  try {
    console.log('Testing admin login setup...\n');
    
    await connectDB();
    
    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    
    console.log(`Looking for admin with username: ${username}`);
    
    const admin = await Admin.findOne({ username });
    
    if (!admin) {
      console.log('❌ Admin user not found!');
      console.log('\nCreating admin user...');
      
      const newAdmin = new Admin({
        username: username,
        password: password,
        email: process.env.ADMIN_EMAIL || 'admin@example.com'
      });
      
      await newAdmin.save();
      console.log('✅ Admin user created!');
      console.log(`   Username: ${username}`);
      console.log(`   Password: ${password}`);
    } else {
      console.log('✅ Admin user found!');
      console.log(`   Username: ${admin.username}`);
      console.log(`   Email: ${admin.email || 'Not set'}`);
      
      // Test password
      const isMatch = await admin.comparePassword(password);
      if (isMatch) {
        console.log('✅ Password is correct!');
      } else {
        console.log('❌ Password does not match!');
        console.log(`   Expected password: ${password}`);
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

testLogin();

