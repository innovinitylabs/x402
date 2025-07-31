const { paymentMiddleware } = require('x402-express');
const cors = require('cors');

// Enable CORS for widget embedding
const corsMiddleware = cors({
  origin: true,
  credentials: true
});

// In-memory storage for payment sessions
const paymentSessions = new Map();

module.exports = async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Apply CORS
    await new Promise((resolve) => corsMiddleware(req, res, resolve));

    const { amount = 1, customAmount } = req.body;
    const sessionId = `donation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Store session data
    paymentSessions.set(sessionId, {
      type: 'donation',
      amount: customAmount || amount,
      timestamp: Date.now(),
      status: 'pending'
    });

    // Configure payment middleware
    const config = {
      address: process.env.ADDRESS || '0x5e051c9106071baF1e4c087e3e06Fdd17396A433',
      facilitatorUrl: process.env.FACILITATOR_URL || 'https://x402.org/facilitator',
      network: process.env.NETWORK || 'base-sepolia',
      maxValue: BigInt(1000 * 10 ** 6), // Allow up to $1000 USDC
      sessionId
    };

    // Apply x402 payment middleware (this will trigger 402 if payment required)
    await new Promise((resolve, reject) => {
      paymentMiddleware(config)(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Update session status
    if (paymentSessions.has(sessionId)) {
      paymentSessions.get(sessionId).status = 'completed';
    }

    return res.status(200).json({
      success: true,
      message: 'Payment processed successfully',
      sessionId,
      amount: customAmount || amount
    });

  } catch (error) {
    console.error('Donation error:', error);
    return res.status(500).json({
      error: 'Payment processing failed',
      details: error.message
    });
  }
}; 