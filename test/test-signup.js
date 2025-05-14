const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

// Load environment variables
dotenv.config();

// Connect to MongoDB
async function runTest() {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI is not defined in .env file');
      process.exit(1);
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Generate a random email to avoid duplicates
    const randomEmail = `test-${Math.floor(Math.random() * 10000)}@example.com`;
    
    console.log(`Testing signup with email: ${randomEmail}`);
    
    // Attempt to create a user directly
    const user = new User({
      fullName: 'Test User',
      email: randomEmail,
      password: 'password123'
    });
    
    console.log('Saving user...');
    await user.save();
    console.log('User created successfully:', {
      id: user._id,
      fullName: user.fullName,
      email: user.email
    });
    
    // Test login by comparing password
    console.log('Testing password comparison...');
    const isMatch = await user.comparePassword('password123');
    console.log('Password match:', isMatch);
    
    console.log('All tests completed successfully!');
  } catch (error) {
    console.error('Test failed with error:', error);
  } finally {
    // Close the database connection
    console.log('Closing database connection...');
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the test
runTest(); 