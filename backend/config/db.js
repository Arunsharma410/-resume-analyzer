// backend/config/db.js
// 🗄️ MongoDB Connection Configuration
// This file handles connecting to MongoDB Atlas

const mongoose = require('mongoose');

// 🔧 Connection options for better performance
const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // These options ensure stable connection
      serverSelectionTimeoutMS: 5000,  // Timeout after 5s
      socketTimeoutMS: 45000,          // Close sockets after 45s
    });

    // Success message with host info
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database Name: ${conn.connection.name}`);

    return conn;

  } catch (error) {
    // Log the error clearly
    console.error('❌ MongoDB Connection Failed!');
    console.error(`Error: ${error.message}`);
    
    // Exit process with failure code
    // This stops the server if DB connection fails
    process.exit(1);
  }
};

// 🔌 Handle connection events AFTER initial connection
mongoose.connection.on('connected', () => {
  console.log('🟢 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error(`🔴 Mongoose connection error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('🟡 Mongoose disconnected from MongoDB');
});

// 🛑 Handle app termination gracefully
// When you press Ctrl+C, close DB connection properly
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🔌 MongoDB connection closed (App Terminated)');
  process.exit(0);
});

module.exports = connectDB;