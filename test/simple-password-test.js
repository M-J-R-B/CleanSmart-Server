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
    const randomEmail = `test-plain-${Math.floor(Math.random() * 10000)}@example.com`;
    const password = 'simple123';
    
    console.log(`Testing signup with email: ${randomEmail} and password: ${password}`);
    
    // Create a user with plain password
    const user = new User({
      fullName: 'Plain Password Test',
      email: randomEmail,
      password: password
    });
    
    console.log('Saving user...');
    await user.save();
    console.log('User created successfully:', {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      password: user.password // This should now be stored as plain text
    });
    
    // Test plain password comparison
    console.log('Testing password comparison...');
    const isCorrectMatch = await user.comparePassword(password);
    console.log('Correct password match:', isCorrectMatch);
    
    const isWrongMatch = await user.comparePassword('wrongpassword');
    console.log('Wrong password match:', isWrongMatch);
    
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