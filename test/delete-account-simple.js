const http = require('http');

// Test data - REPLACE THESE WITH REAL CREDENTIALS
const email = 'test-user@example.com';
const password = 'password123';

// Request body
const data = JSON.stringify({
  email: email,
  password: password,
  confirmation: 'DELETE'
});

// Request options
const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/delete-account',
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

console.log('Sending test DELETE request with credentials:');
console.log(`- Email: ${email}`);
console.log(`- Password: ${password}`);
console.log(`- Confirmation: 'DELETE'`);
console.log('\nRequest body:', data);

// Make the request
const req = http.request(options, (res) => {
  console.log(`\nStatus: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);
  
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
        console.log('✅ Account deletion successful!');
      } else {
        console.log('❌ Account deletion failed:', response.message);
        if (response.details) {
          console.log('Details:', response.details);
        }
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