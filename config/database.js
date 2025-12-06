const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rgcpoolandspa';
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('\n❌ MongoDB connection error:');
    console.error(error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.error('\n💡 MongoDB is not running or not accessible.');
      console.error('\nTo fix this:');
      console.error('1. Start MongoDB locally:');
      console.error('   brew services start mongodb-community');
      console.error('   OR');
      console.error('   mongod');
      console.error('\n2. OR use MongoDB Atlas (cloud):');
      console.error('   Set MONGODB_URI in .env file to your Atlas connection string');
      console.error('   Example: mongodb+srv://user:pass@cluster.mongodb.net/rgcpoolandspa');
    }
    
    console.error('\n⚠️  Server will not start without a database connection.\n');
    process.exit(1);
  }
};

module.exports = connectDB;

