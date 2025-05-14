const http = require('http');

// Generate a random email to avoid duplicates
const randomEmail = `test-${Math.floor(Math.random() * 10000)}@example.com`;

// Test data
const testUser = {
  fullName: 'Auth Flow Test User',
  email: randomEmail,
  password: 'password123'
};

console.log('=== AUTHENTICATION FLOW TEST ===');
console.log(`Testing with email: ${randomEmail}`);

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

// Run the test flow
async function runTest() {
  try {
    // Step 1: Sign up
    console.log('\n=== STEP 1: USER SIGNUP ===');
    
    const signupData = JSON.stringify(testUser);
    const signupOptions = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/signup',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(signupData)
      }
    };
    
    console.log('Sending signup request...');
    const signupResponse = await makeRequest(signupOptions, signupData);
    
    console.log(`Signup Status: ${signupResponse.statusCode}`);
    console.log('Signup Response:', JSON.stringify(signupResponse.body, null, 2));
    
    if (!signupResponse.body.success) {
      throw new Error(`Signup failed: ${signupResponse.body.message}`);
    }
    
    console.log('✅ Signup successful!');
    
    // Step 2: Login
    console.log('\n=== STEP 2: USER LOGIN ===');
    
    const loginData = JSON.stringify({
      email: testUser.email,
      password: testUser.password
    });
    
    const loginOptions = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(loginData)
      }
    };
    
    console.log('Sending login request...');
    const loginResponse = await makeRequest(loginOptions, loginData);
    
    console.log(`Login Status: ${loginResponse.statusCode}`);
    console.log('Login Response:', JSON.stringify(loginResponse.body, null, 2));
    
    if (!loginResponse.body.success) {
      throw new Error(`Login failed: ${loginResponse.body.message}`);
    }
    
    console.log('✅ Login successful!');
    
    // Step 3: Try with wrong password
    console.log('\n=== STEP 3: LOGIN WITH WRONG PASSWORD ===');
    
    const wrongLoginData = JSON.stringify({
      email: testUser.email,
      password: 'wrongpassword'
    });
    
    const wrongLoginOptions = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(wrongLoginData)
      }
    };
    
    console.log('Sending login request with wrong password...');
    const wrongLoginResponse = await makeRequest(wrongLoginOptions, wrongLoginData);
    
    console.log(`Wrong Login Status: ${wrongLoginResponse.statusCode}`);
    console.log('Wrong Login Response:', JSON.stringify(wrongLoginResponse.body, null, 2));
    
    if (wrongLoginResponse.body.success) {
      throw new Error('Login with wrong password succeeded when it should have failed');
    }
    
    console.log('✅ Login with wrong password correctly failed!');
    
    console.log('\n=== TEST COMPLETED SUCCESSFULLY ===');
  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
  }
}

// Run the tests
runTest(); 