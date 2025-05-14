const http = require('http');

// Generate a random email to avoid duplicates
const randomEmail = `test-${Math.floor(Math.random() * 10000)}@example.com`;

// Test data
const testUser = {
  fullName: 'API Test User',
  email: randomEmail,
  password: 'password123'
};

console.log(`Testing signup API with email: ${randomEmail}`);

// Prepare the request data
const data = JSON.stringify(testUser);

// Request options
const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/signup',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

// Make the request
const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  
  let responseBody = '';
  
  res.on('data', (chunk) => {
    responseBody += chunk;
  });
  
  res.on('end', () => {
    console.log('Response body:', responseBody);
    
    try {
      // Parse the response JSON
      const response = JSON.parse(responseBody);
      
      if (response.success) {
        console.log('Signup successful! User created:', response.user);
      } else {
        console.log('Signup failed with error:', response.message);
      }
    } catch (e) {
      console.error('Error parsing response:', e);
      console.log('Raw response:', responseBody);
    }
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

// Write data to request body
req.write(data);
req.end();

console.log('Request sent, waiting for response...'); 