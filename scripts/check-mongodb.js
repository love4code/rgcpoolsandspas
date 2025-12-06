#!/usr/bin/env node

/**
 * Check if MongoDB is running and accessible
 */

const mongoose = require('mongoose');
require('dotenv').config();

const checkMongoDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rgcpoolandspa';
  
  console.log('🔍 Checking MongoDB connection...');
  console.log(`📍 URI: ${mongoURI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}\n`);
  
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 3000
    });
    
    console.log('✅ MongoDB is running and accessible!');
    console.log(`✅ Connected to: ${mongoose.connection.host}`);
    console.log(`✅ Database: ${mongoose.connection.name}\n`);
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB connection failed!\n');
    
    if (error.message.includes('ECONNREFUSED')) {
      console.error('MongoDB is not running or not accessible.\n');
      console.error('To start MongoDB locally:');
      console.error('  brew services start mongodb-community');
      console.error('  OR');
      console.error('  mongod\n');
      
      console.error('To use MongoDB Atlas (cloud):');
      console.error('  1. Create account at https://www.mongodb.com/cloud/atlas');
      console.error('  2. Create a cluster');
      console.error('  3. Get connection string');
      console.error('  4. Update MONGODB_URI in .env file\n');
    } else {
      console.error(`Error: ${error.message}\n`);
    }
    
    process.exit(1);
  }
};

checkMongoDB();


