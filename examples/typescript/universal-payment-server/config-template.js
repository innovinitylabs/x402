// Configuration Template for x402 Universal Payment Server
// Copy this file to config.js and customize for your needs

module.exports = {
  // Server Configuration
  server: {
    port: process.env.PORT || 4021,
    environment: process.env.NODE_ENV || 'development',
    cors: {
      origin: true, // Allow all origins for widget embedding
      credentials: true
    }
  },

  // Wallet Configuration
  wallet: {
    address: process.env.ADDRESS || '0xYourWalletAddressHere', // Replace with your wallet address
    network: process.env.NETWORK || 'base-sepolia',
    facilitatorUrl: process.env.FACILITATOR_URL || 'https://x402.org/facilitator'
  },

  // Widget Configuration
  widget: {
    title: 'Support with Crypto',
    subtitle: 'Powered by x402 Protocol',
    defaultAmount: 1,
    amounts: [1, 5, 10],
    allowCustomAmount: true,
    maxAmount: 1000, // Maximum donation amount in USD
    theme: {
      primaryColor: '#00ff88',
      secondaryColor: '#00cc6a',
      backgroundColor: '#1a1a1a',
      textColor: '#ffffff'
    }
  },

  // Payment Configuration
  payment: {
    currency: 'USDC',
    maxValue: BigInt(1000 * 10 ** 6), // $1000 USDC (6 decimals)
    timeout: 300000, // 5 minutes
    retryAttempts: 3
  },

  // AI Agent Configuration
  aiAgent: {
    enabled: true,
    services: {
      'ai-service': {
        name: 'AI Service',
        description: 'Generic AI service payment',
        defaultAmount: 1
      },
      'data-service': {
        name: 'Data Service',
        description: 'Data processing service',
        defaultAmount: 5
      }
    }
  },

  // Session Management
  session: {
    timeout: 3600000, // 1 hour
    cleanupInterval: 300000, // 5 minutes
    maxSessions: 1000
  },

  // Security Configuration
  security: {
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // limit each IP to 100 requests per windowMs
    },
    cors: {
      origin: true,
      credentials: true
    }
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: 'json',
    timestamp: true
  },

  // Deployment Configuration
  deployment: {
    platform: 'vercel', // 'vercel', 'railway', 'render', 'heroku'
    buildCommand: 'npm install',
    startCommand: 'npm start',
    environment: {
      NODE_ENV: 'production'
    }
  },

  // Analytics (Optional)
  analytics: {
    enabled: false,
    provider: 'google', // 'google', 'plausible', 'custom'
    trackingId: process.env.ANALYTICS_ID || ''
  },

  // Customization Hooks
  hooks: {
    beforePayment: null, // Function to run before payment
    afterPayment: null,  // Function to run after payment
    onError: null        // Function to run on error
  }
};

// Usage Instructions:
// 1. Copy this file to config.js
// 2. Update the wallet.address with your wallet address
// 3. Customize other settings as needed
// 4. The server will automatically use this configuration

// Example customizations:
// - Change widget colors in widget.theme
// - Add new AI services in aiAgent.services
// - Modify payment limits in payment.maxValue
// - Update session timeouts in session.timeout 