#!/usr/bin/env node

// Test client for AI agents to interact with x402 payment server
// This demonstrates how AI agents can pay for services

import { privateKeyToAccount } from 'viem/accounts';
import { wrapFetchWithPayment } from 'x402-fetch';

const DEMO_PRIVATE_KEY = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'; // Demo key
const SERVER_URL = 'http://localhost:4021';

async function testAIAgentPayments() {
  console.log('🤖 AI Agent Payment Test\n');

  try {
    // Create a demo account (in real usage, AI would have its own wallet)
    const account = privateKeyToAccount(DEMO_PRIVATE_KEY);
    console.log(`💳 AI Agent Wallet: ${account.address}`);

    // Wrap fetch with payment capability
    const fetchWithPayment = wrapFetchWithPayment(fetch, account);

    console.log('\n📋 Testing AI Service Endpoints...\n');

    // Test 1: Basic AI Service ($0.10)
    console.log('1️⃣ Testing Basic AI Service ($0.10)...');
    try {
      const response = await fetchWithPayment(`${SERVER_URL}/api/ai/service`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceRequest: 'Generate a weather report for San Francisco',
          amount: 0.1
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Payment successful!');
        console.log('📝 Service Response:', result.response.data);
        console.log('🆔 Session ID:', result.sessionId);
      } else {
        console.log('❌ Payment failed:', response.status);
      }
    } catch (error) {
      console.log('⚠️ Test requires actual wallet connection:', error.message);
    }

    // Test 2: Premium AI Service ($1.00)
    console.log('\n2️⃣ Testing Premium AI Service ($1.00)...');
    try {
      const response = await fetchWithPayment(`${SERVER_URL}/api/ai/premium`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceRequest: 'Advanced market analysis with predictions',
          amount: 1.0
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Payment successful!');
        console.log('📝 Service Response:', result.response.data);
        console.log('🏆 Quality:', result.response.quality);
        console.log('🆔 Session ID:', result.sessionId);
      } else {
        console.log('❌ Payment failed:', response.status);
      }
    } catch (error) {
      console.log('⚠️ Test requires actual wallet connection:', error.message);
    }

    // Test 3: Check what payment is required (without paying)
    console.log('\n3️⃣ Testing Payment Requirements (No Payment)...');
    try {
      const response = await fetch(`${SERVER_URL}/api/ai/service`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceRequest: 'Test request',
          amount: 0.1
        })
      });

      if (response.status === 402) {
        const paymentInfo = await response.json();
        console.log('💰 Payment Required (HTTP 402)');
        console.log('🔗 Pay To:', paymentInfo.accepts[0].payTo);
        console.log('💵 Amount:', paymentInfo.accepts[0].maxAmountRequired, 'USDC wei');
        console.log('🌐 Network:', paymentInfo.accepts[0].network);
      }
    } catch (error) {
      console.log('❌ Error:', error.message);
    }

    // Test 4: Session validation
    console.log('\n4️⃣ Testing Session Management...');
    try {
      const response = await fetch(`${SERVER_URL}/api/sessions`);
      if (response.ok) {
        const sessions = await response.json();
        console.log('📊 Active Sessions:', sessions.sessions.length);
        if (sessions.sessions.length > 0) {
          console.log('🆔 Latest Session:', sessions.sessions[0].id);
        }
      }
    } catch (error) {
      console.log('❌ Error:', error.message);
    }

  } catch (error) {
    console.error('❌ Test Error:', error.message);
  }
}

// Test donation endpoints too
async function testDonationEndpoints() {
  console.log('\n💝 Testing Donation Endpoints...\n');

  // Test donation payment requirements
  try {
    const response = await fetch(`${SERVER_URL}/api/donate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 5 })
    });

    if (response.status === 402) {
      const paymentInfo = await response.json();
      console.log('💰 Donation Payment Required (HTTP 402)');
      console.log('🔗 Pay To:', paymentInfo.accepts[0].payTo);
      console.log('💵 Amount:', paymentInfo.accepts[0].maxAmountRequired, 'USDC wei');
      console.log('🌐 Network:', paymentInfo.accepts[0].network);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

async function runTests() {
  console.log('🚀 x402 Universal Payment Server - AI Agent Test\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Check server health
  try {
    const health = await fetch(`${SERVER_URL}/api/health`);
    if (health.ok) {
      const info = await health.json();
      console.log('✅ Server is healthy');
      console.log('💰 Receiving payments to:', info.config.payTo);
      console.log('🌐 Network:', info.config.network);
      console.log('🔗 Facilitator:', info.config.facilitator);
    }
  } catch (error) {
    console.log('❌ Server not running. Start with: npm run dev');
    process.exit(1);
  }

  await testAIAgentPayments();
  await testDonationEndpoints();

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ Tests completed!');
  console.log('🌐 View widget: http://localhost:4021/widget');
  console.log('📚 API docs: http://localhost:4021/api/health');
  console.log('💡 For real payments, use a wallet with x402-fetch');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

runTests().catch(console.error); 