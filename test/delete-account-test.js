const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const TaskGroup = require('../models/TaskGroup');

// Load environment variables
dotenv.config();

// Function to make an HTTP request
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let responseBody = '';
      
      res.on('data', (chunk) => {
        responseBody += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = {
            statusCode: res.statusCode,
            headers: res.headers,
            body: JSON.parse(responseBody)
          };
          resolve(response);
        } catch (e) {
          reject(new Error(`Error parsing response: ${e.message}, Raw: ${responseBody}`));
        }
      });
    });
    
    req.on('error', (e) => {
      reject(new Error(`Request error: ${e.message}`));
    });
    
    if (data) {
      req.write(data);
    }
    
    req.end();
  });
}

// Main test function
async function testDeleteAccount() {
  try {
    console.log('=== DELETE ACCOUNT TEST ===');
    
    // Connect to database
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI is not defined in .env file');
      process.exit(1);
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // 1. Create a test user
    console.log('\n=== STEP 1: CREATE TEST USER ===');
    const testEmail = `delete-test-${Math.floor(Math.random() * 10000)}@example.com`;
    const testPassword = 'password123';
    
    const testUser = new User({
      fullName: 'Delete Test User',
      email: testEmail,
      password: testPassword
    });
    
    await testUser.save();
    console.log(`Test user created: ${testEmail} (${testUser._id})`);
    
    // 2. Create a test task group for this user
    console.log('\n=== STEP 2: CREATE TEST TASK GROUP ===');
    const testTaskGroup = new TaskGroup({
      userId: testUser._id,
      areaName: 'Test Area for Deletion',
      tasks: ['Test task 1', 'Test task 2'],
      progress: 0,
      dateCreated: Date.now()
    });
    
    await testTaskGroup.save();
    console.log(`Test task group created: ${testTaskGroup._id}`);
    
    // 3. Attempt to delete account without confirmation (should fail)
    console.log('\n=== STEP 3: DELETE ACCOUNT WITHOUT CONFIRMATION (SHOULD FAIL) ===');
    
    const failData = JSON.stringify({
      email: testEmail,
      password: testPassword
      // Missing confirmation
    });
    
    const failOptions = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/delete-account',
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(failData)
      }
    };
    
    const failResponse = await makeRequest(failOptions, failData);
    console.log(`Status: ${failResponse.statusCode}`);
    console.log('Response:', JSON.stringify(failResponse.body, null, 2));
    
    if (failResponse.statusCode !== 400) {
      throw new Error('Request should have failed with status 400 due to missing confirmation');
    }
    
    console.log('✅ Successfully detected missing confirmation');
    
    // 4. Delete account with proper confirmation
    console.log('\n=== STEP 4: DELETE ACCOUNT WITH CONFIRMATION ===');
    
    const deleteData = JSON.stringify({
      email: testEmail,
      password: testPassword,
      confirmation: 'DELETE'
    });
    
    const deleteOptions = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/delete-account',
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(deleteData)
      }
    };
    
    const deleteResponse = await makeRequest(deleteOptions, deleteData);
    console.log(`Status: ${deleteResponse.statusCode}`);
    console.log('Response:', JSON.stringify(deleteResponse.body, null, 2));
    
    if (!deleteResponse.body.success) {
      throw new Error(`Account deletion failed: ${deleteResponse.body.message}`);
    }
    
    console.log('✅ Account deletion request successful');
    
    // 5. Verify user is deleted
    console.log('\n=== STEP 5: VERIFY USER IS DELETED ===');
    
    const deletedUser = await User.findOne({ email: testEmail });
    console.log('User exists after deletion:', !!deletedUser);
    
    if (deletedUser) {
      throw new Error('User still exists after deletion');
    }
    
    // 6. Verify task groups are deleted
    console.log('\n=== STEP 6: VERIFY TASK GROUPS ARE DELETED ===');
    
    const remainingTaskGroups = await TaskGroup.find({ userId: testUser._id });
    console.log('Remaining task groups count:', remainingTaskGroups.length);
    
    if (remainingTaskGroups.length > 0) {
      throw new Error('Task groups still exist after user deletion');
    }
    
    console.log('\n=== TEST COMPLETED SUCCESSFULLY ===');
    console.log('✅ Account and all associated data deleted successfully');
    
  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
  } finally {
    // Close database connection
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log('Database connection closed');
    }
  }
}

// Run the test
testDeleteAccount(); 