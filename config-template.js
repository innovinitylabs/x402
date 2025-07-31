// x402 Universal Payment Server Configuration Template
// Copy this file to config.js and customize for your needs

module.exports = {
  // Server Configuration
  server: {
    port: process.env.PORT || 4021,
    host: process.env.HOST || 'localhost',
    environment: process.env.NODE_ENV || 'development'
  },

  // Wallet Configuration
  wallet: {
    address: process.env.ADDRESS || '0x5e051c9106071baF1e4c087e3e06Fdd17396A433',
    network: process.env.NETWORK || 'base-sepolia',
    facilitatorUrl: process.env.FACILITATOR_URL || 'https://x402.org/facilitator'
  },

  // Widget Configuration
  widget: {
    title: 'Support This Project',
    description: 'Support with USDC using x402 protocol - instant, secure, no registration required',
    amounts: [
      { value: 1, label: 'Basic Support' },
      { value: 11, label: 'Generous Support' },
      { value: 111, label: 'Premium Support' },
      { value: 'custom', label: 'Choose your amount' }
    ],
    defaultAmount: 1,
    minAmount: 0.01,
    maxAmount: 1000,
    currency: 'USDC',
    showCustomAmount: true
  },

  // Widget Styling
  styling: {
    theme: 'dark', // 'dark' or 'light'
    primaryColor: '#00ff88',
    secondaryColor: '#f97316',
    backgroundColor: '#0f0f23',
    borderRadius: '10px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',

    // Custom CSS overrides
    customCSS: `
      /* Add your custom CSS here */
      .widget-container {
        box-shadow: 0 4px 20px rgba(0, 255, 136, 0.1);
      }
    `
  },

  // Payment Configuration
  payment: {
    timeout: 300, // 5 minutes
    maxTimeoutSeconds: 300,
    retryAttempts: 3,
    confirmations: 1
  },

  // AI Agent Configuration
  aiAgent: {
    enabled: true,
    defaultServiceFee: 0.10,
    services: {
      'text-generation': { price: 0.05, description: 'AI text generation service' },
      'image-analysis': { price: 0.15, description: 'AI image analysis service' },
      'data-processing': { price: 0.20, description: 'AI data processing service' }
    }
  },

  // Session Management
  session: {
    storage: 'memory', // 'memory', 'redis', 'database'
    ttl: 3600, // 1 hour
    cleanupInterval: 300 // 5 minutes
  },

  // Security Configuration
  security: {
    cors: {
      origin: true, // Allow all origins for widget embedding
      credentials: true
    },
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // limit each IP to 100 requests per windowMs
    }
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: 'json',
    enableConsole: true,
    enableFile: false
  },

  // Deployment Configuration
  deployment: {
    platform: 'github-pages', // 'github-pages', 'vercel', 'railway', 'heroku'
    domain: process.env.DOMAIN || 'your-domain.com',
    ssl: true
  },

  // Analytics (Optional)
  analytics: {
    enabled: false,
    provider: 'google', // 'google', 'plausible', 'custom'
    trackingId: process.env.ANALYTICS_ID || ''
  },

  // Custom Endpoints
  customEndpoints: {
    enabled: false,
    endpoints: [
      // Add your custom endpoints here
      // { path: '/api/custom', method: 'POST', handler: 'customHandler' }
    ]
  }
};

// Usage Examples:
// 
// 1. Change wallet address:
//    wallet: { address: '0xYourWalletAddressHere' }
//
// 2. Customize widget amounts:
//    widget: {
//      amounts: [
//        { value: 5, label: 'Coffee' },
//        { value: 25, label: 'Lunch' },
//        { value: 100, label: 'Dinner' }
//      ]
//    }
//
// 3. Change theme colors:
//    styling: {
//      primaryColor: '#ff6b6b',
//      secondaryColor: '#4ecdc4'
//    }
//
// 4. Add custom CSS:
//    styling: {
//      customCSS: `
//        .widget-container {
//          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//        }
//      `
//    } 