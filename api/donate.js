export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount = 1 } = req.body;

    // For now, just return success without x402 middleware
    return res.status(200).json({
      success: true,
      message: 'Payment processed successfully (simulated)',
      amount: amount,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Donation error:', error);
    return res.status(500).json({
      error: 'Payment processing failed',
      details: error.message
    });
  }
} 