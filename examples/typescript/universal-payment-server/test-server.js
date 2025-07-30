#!/usr/bin/env node

/**
 * Test script for x402 Universal Payment Server
 * Run with: node test-server.js
 */

const BASE_URL = 'http://localhost:4021';

async function testEndpoint(method, path, data = null) {
  const url = `${BASE_URL}${path}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    const result = await response.json();

    console.log(`✅ ${method} ${path} - Status: ${response.status}`);
    console.log(`   Response:`, JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.log(`❌ ${method} ${path} - Error:`, error.message);
    return null;
  }
}

async function runTests() {
  console.log('🧪 Testing x402 Universal Payment Server\n');

  // Test 1: Health check
  console.log('1. Testing health endpoint...');
  await testEndpoint('GET', '/api/health');

  // Test 2: Widget HTML
  console.log('\n2. Testing widget HTML endpoint...');
  const widgetResponse = await fetch(`${BASE_URL}/widget`);
  console.log(`   Status: ${widgetResponse.status}`);
  console.log(`   Content-Type: ${widgetResponse.headers.get('content-type')}`);

  // Test 3: Widget JavaScript
  console.log('\n3. Testing widget JavaScript endpoint...');
  const widgetJsResponse = await fetch(`${BASE_URL}/widget.js`);
  console.log(`   Status: ${widgetJsResponse.status}`);
  console.log(`   Content-Type: ${widgetJsResponse.headers.get('content-type')}`);

  // Test 4: Donation endpoint
  console.log('\n4. Testing donation endpoint...');
  await testEndpoint('POST', '/api/donate', {
    amount: 1,
    walletAddress: '0x5e051c9106071baF1e4c087e3e06Fdd17396A433'
  });

  // Test 5: Custom donation endpoint
  console.log('\n5. Testing custom donation endpoint...');
  await testEndpoint('POST', '/api/donate/custom', {
    amount: 5.50,
    walletAddress: '0x5e051c9106071baF1e4c087e3e06Fdd17396A433'
  });

  // Test 6: AI agent service payment
  console.log('\n6. Testing AI agent service payment...');
  const servicePayment = await testEndpoint('POST', '/api/pay/service', {
    serviceRequest: 'Generate a weather report for New York',
    walletAddress: '0x5e051c9106071baF1e4c087e3e06Fdd17396A433',
    amount: 0.1
  });

  // Test 7: Use service (if payment was successful)
  if (servicePayment && servicePayment.sessionId) {
    console.log('\n7. Testing service usage...');
    await testEndpoint('POST', '/api/service', {
      sessionId: servicePayment.sessionId,
      request: 'Generate a weather report for New York'
    });
  }

  // Test 8: Get active sessions
  console.log('\n8. Testing sessions endpoint...');
  await testEndpoint('GET', '/api/sessions');

  // Test 9: Validate session (if we have one)
  if (servicePayment && servicePayment.sessionId) {
    console.log('\n9. Testing session validation...');
    await testEndpoint('GET', `/api/session/${servicePayment.sessionId}`);
  }

  console.log('\n🎉 All tests completed!');
  console.log('\n📋 Server Status:');
  console.log(`   - Health: http://localhost:4021/api/health`);
  console.log(`   - Widget: http://localhost:4021/widget`);
  console.log(`   - Demo: Open demo.html in your browser`);
  console.log('\n💡 Next steps:');
  console.log('   1. Open demo.html to see the widget in action');
  console.log('   2. Deploy to production using DEPLOYMENT.md');
  console.log('   3. Update widget URLs to your production domain');
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch(`${BASE_URL}/api/health`);
    if (response.ok) {
      console.log('✅ Server is running at', BASE_URL);
      return true;
    }
  } catch (error) {
    console.log('❌ Server is not running. Please start it with: npm run dev');
    return false;
  }
}

// Run tests
async function main() {
  const serverRunning = await checkServer();
  if (serverRunning) {
    await runTests();
  } else {
    process.exit(1);
  }
}

main().catch(console.error); 