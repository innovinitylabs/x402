// Configuration template for x402 Universal Payment Server
// Copy this file to config.js and customize for your needs

export const config = {
  // Your wallet address to receive payments
  walletAddress: "0xYourWalletAddressHere",

  // Network configuration
  network: "base-sepolia", // or "base" for mainnet
  facilitatorUrl: "https://x402.org/facilitator",

  // Server configuration
  port: 4021,

  // Widget customization
  widget: {
    title: "x402 Protocol Support",
    description: "Support with USDC using x402 protocol - instant, secure, no registration required",
    defaultAmount: "$1.00",
    amounts: [
      { value: 1, label: "Basic Support" },
      { value: 11, label: "Generous Support" },
      { value: 111, label: "Premium Support" },
      { value: "custom", label: "Choose your amount" }
    ],
    colors: {
      primary: "#f97316",
      secondary: "#4ade80",
      background: "#2a2a2a",
      text: "#ffffff"
    }
  },

  // Payment configuration
  payments: {
    defaultDonation: 1.00,
    defaultServiceFee: 0.10,
    minAmount: 0.01,
    sessionTimeout: 300, // 5 minutes
    serviceTimeout: 600   // 10 minutes
  },

  // API endpoints
  endpoints: {
    health: "/api/health",
    widget: "/widget",
    widgetJs: "/widget.js",
    donate: "/api/donate",
    donateCustom: "/api/donate/custom",
    servicePayment: "/api/pay/service",
    service: "/api/service",
    session: "/api/session",
    sessions: "/api/sessions"
  }
};

// Example usage:
// import { config } from './config.js';
// const walletAddress = config.walletAddress; 