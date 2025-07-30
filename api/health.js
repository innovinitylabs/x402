module.exports = function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.status(200).json({
    status: 'healthy',
    service: 'x402 Universal Payment Server',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      widget: '/api/widget',
      donate: '/api/donate',
      'pay-service': '/api/pay-service'
    },
    config: {
      address: process.env.ADDRESS || '0x5e051c9106071baF1e4c087e3e06Fdd17396A433',
      network: process.env.NETWORK || 'base-sepolia',
      facilitatorUrl: process.env.FACILITATOR_URL || 'https://x402.org/facilitator'
    }
  });
} 