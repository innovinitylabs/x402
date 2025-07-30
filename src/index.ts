import { config } from "dotenv";
import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import { paymentMiddleware, Network, Resource } from "x402-express";

config();

// Configuration from environment variables
const facilitatorUrl = process.env.FACILITATOR_URL as Resource || "https://x402.org/facilitator";
const payTo = process.env.ADDRESS || "0x5e051c9106071baF1e4c087e3e06Fdd17396A433";
const network = (process.env.NETWORK as Network) || "base-sepolia";
const port = parseInt(process.env.PORT || "4021");

if (!payTo) {
  console.error("❌ Please set your wallet ADDRESS in the .env file");
  process.exit(1);
}

const app = express();

// Enable CORS for widget and API access
app.use(cors({
  origin: true, // Allow all origins for widget embedding
  credentials: true,
}));

// Parse JSON bodies
app.use(express.json());

// In-memory storage for payment sessions (use Redis/DB in production)
interface PaymentSession {
  id: string;
  walletAddress: string;
  amount: string;
  createdAt: Date;
  expiresAt: Date;
  type: "donation" | "service";
  serviceRequest?: string;
  used?: boolean;
}

const paymentSessions = new Map<string, PaymentSession>();

// Configure x402 payment middleware for REAL crypto payments
app.use(
  paymentMiddleware(
    payTo as `0x${string}`,
    {
      // Widget donation endpoint - REAL crypto payment
      "POST /api/donate": {
        price: "$1.00", // Default donation amount
        network,
        config: {
          description: "Support with USDC using x402 protocol",
          maxTimeoutSeconds: 300, // 5 minutes
        },
      },
      // AI agent service payment endpoint - REAL crypto payment
      "POST /api/pay/service": {
        price: "$0.10", // Default service fee
        network,
        config: {
          description: "AI agent service payment",
          maxTimeoutSeconds: 300,
        },
      },
      // Custom amount donation endpoint - REAL crypto payment
      "POST /api/donate/custom": {
        price: "$0.01", // Minimum amount, will be overridden
        network,
        config: {
          description: "Custom donation amount",
          maxTimeoutSeconds: 300,
        },
      },
    },
    {
      url: facilitatorUrl,
    },
  ),
);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "x402 Universal Payment Server is running",
    config: {
      network,
      payTo,
      facilitator: facilitatorUrl,
      endpoints: {
        widget: "/widget",
        donate: "/api/donate",
        service: "/api/pay/service",
        custom: "/api/donate/custom",
      },
    },
  });
});

// Widget HTML endpoint - serves the donation widget
app.get("/widget", (req, res) => {
  const widgetHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>x402 Donation Widget</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #1a1a1a;
            color: #ffffff;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
        }
        
        .widget-container {
            background: #2a2a2a;
            border-radius: 12px;
            padding: 24px;
            max-width: 400px;
            width: 100%;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        
        .header {
            display: flex;
            align-items: center;
            margin-bottom: 16px;
        }
        
        .lightning-icon {
            color: #ffd700;
            font-size: 24px;
            margin-right: 8px;
        }
        
        .title {
            font-size: 18px;
            font-weight: 600;
        }
        
        .default-amount {
            color: #4ade80;
            font-size: 14px;
            margin-bottom: 8px;
        }
        
        .description {
            color: #9ca3af;
            font-size: 14px;
            line-height: 1.4;
            margin-bottom: 24px;
        }
        
        .amount-section {
            margin-bottom: 24px;
        }
        
        .amount-label {
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 12px;
        }
        
        .amount-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
        }
        
        .amount-button {
            background: #374151;
            border: none;
            border-radius: 8px;
            padding: 12px;
            color: white;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        
        .amount-button:hover {
            background: #4b5563;
        }
        
        .amount-button.active {
            background: #f97316;
        }
        
        .amount-value {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 4px;
        }
        
        .amount-label-text {
            font-size: 12px;
            opacity: 0.8;
        }
        
        .custom-input {
            background: #374151;
            border: none;
            border-radius: 8px;
            padding: 12px;
            color: white;
            width: 100%;
            font-size: 14px;
            margin-top: 8px;
            display: none;
        }
        
        .custom-input.show {
            display: block;
        }
        
        .donate-button {
            background: #f97316;
            border: none;
            border-radius: 8px;
            padding: 16px;
            color: white;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            width: 100%;
            transition: all 0.2s;
        }
        
        .donate-button:hover {
            background: #ea580c;
        }
        
        .donate-button:disabled {
            background: #6b7280;
            cursor: not-allowed;
        }
        
        .status {
            margin-top: 16px;
            padding: 12px;
            border-radius: 8px;
            font-size: 14px;
            text-align: center;
            display: none;
        }
        
        .status.success {
            background: #065f46;
            color: #d1fae5;
        }
        
        .status.error {
            background: #7f1d1d;
            color: #fecaca;
        }
        
        .status.loading {
            background: #1e40af;
            color: #dbeafe;
        }
        
        .wallet-info {
            background: #374151;
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 16px;
            font-size: 12px;
            color: #9ca3af;
        }
        
        .wallet-section {
            margin-bottom: 20px;
            padding: 16px;
            background: #374151;
            border-radius: 8px;
        }
        
        .wallet-button {
            background: #f97316;
            border: none;
            border-radius: 8px;
            padding: 12px 16px;
            color: white;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            width: 100%;
            margin-bottom: 8px;
        }
        
        .wallet-status {
            font-size: 12px;
            color: #9ca3af;
            text-align: center;
        }
        
        /* Mobile responsiveness */
        @media (max-width: 480px) {
            .widget-container {
                padding: 16px;
                margin: 8px;
            }
            
            .amount-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 8px;
            }
            
            .header {
                font-size: 14px;
            }
            
            .title {
                font-size: 16px;
            }
        }
        
        /* Loading animation */
        .loading-spinner {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid #f3f3f3;
            border-top: 2px solid #f97316;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-right: 8px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        /* Success animation */
        .success-checkmark {
            display: inline-block;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #10b981;
            position: relative;
            margin-right: 8px;
        }
        
        .success-checkmark::after {
            content: '';
            position: absolute;
            left: 5px;
            top: 2px;
            width: 4px;
            height: 8px;
            border: solid white;
            border-width: 0 2px 2px 0;
            transform: rotate(45deg);
        }
        
        /* Error icon */
        .error-icon {
            display: inline-block;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #ef4444;
            position: relative;
            margin-right: 8px;
        }
        
        .error-icon::before,
        .error-icon::after {
            content: '';
            position: absolute;
            width: 8px;
            height: 2px;
            background: white;
            top: 7px;
            left: 4px;
        }
        
        .error-icon::before {
            transform: rotate(45deg);
        }
        
        .error-icon::after {
            transform: rotate(-45deg);
        }
        
        /* Pulse animation for wallet connection */
        .pulse {
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.7; }
            100% { opacity: 1; }
        }
    </style>
</head>
<body>
    <div class="widget-container">
        <div class="header">
            <span class="lightning-icon">⚡</span>
            <span class="title">x402 Protocol Support</span>
        </div>
        
        <div class="wallet-info">
            💰 Receiving payments to: ${payTo}<br>
            🔗 Network: ${network}
        </div>
        
        <div class="wallet-section">
            <div class="wallet-status" id="wallet-status">Connect your wallet to make payments</div>
            <button class="wallet-button" onclick="connectWallet()" id="connect-wallet-btn">Connect Wallet</button>
        </div>
        
        <div class="default-amount" id="selected-amount">$1.00</div>
        <div class="description">
            Support with USDC using x402 protocol - instant, secure, no registration required
        </div>
        
        <div class="amount-section">
            <div class="amount-label">Choose Amount:</div>
            <div class="amount-grid">
                <button class="amount-button active" data-amount="1">
                    <div class="amount-value">$1</div>
                    <div class="amount-label-text">Basic Support</div>
                </button>
                <button class="amount-button" data-amount="11">
                    <div class="amount-value">$11</div>
                    <div class="amount-label-text">Generous Support</div>
                </button>
                <button class="amount-button" data-amount="111">
                    <div class="amount-value">$111</div>
                    <div class="amount-label-text">Premium Support</div>
                </button>
                <button class="amount-button" data-amount="custom">
                    <div class="amount-value">Custom</div>
                    <div class="amount-label-text">Choose your amount</div>
                </button>
            </div>
            <input type="number" class="custom-input" placeholder="Enter custom amount" min="0.01" step="0.01">
        </div>
        
        <button class="donate-button" onclick="handleDonation()" id="donate-btn" disabled>Support Now</button>
        
        <div class="status" id="status"></div>
    </div>

    <script type="module">
        import { createWalletClient, custom } from 'https://esm.sh/viem';
        import { baseSepolia } from 'https://esm.sh/viem/chains';
        import { wrapFetchWithPayment } from 'https://esm.sh/x402-fetch';
        
        let selectedAmount = 1;
        let customAmount = '';
        let walletClient = null;
        let isWalletConnected = false;
        
        // Update the green amount display
        function updateAmountDisplay() {
            const amountDisplay = document.getElementById('selected-amount');
            if (selectedAmount === 'custom') {
                amountDisplay.textContent = customAmount ? '$' + parseFloat(customAmount).toFixed(2) : '$0.00';
            } else {
                amountDisplay.textContent = '$' + selectedAmount + '.00';
            }
        }
        
        // Handle amount selection
        document.querySelectorAll('.amount-button').forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                document.querySelectorAll('.amount-button').forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                const amount = button.dataset.amount;
                const customInput = document.querySelector('.custom-input');
                
                if (amount === 'custom') {
                    customInput.classList.add('show');
                    customInput.focus();
                    selectedAmount = 'custom';
                } else {
                    customInput.classList.remove('show');
                    selectedAmount = parseInt(amount);
                }
                
                // Update the amount display
                updateAmountDisplay();
            });
        });
        
        // Handle custom amount input
        document.querySelector('.custom-input').addEventListener('input', (e) => {
            customAmount = e.target.value;
            updateAmountDisplay();
        });
        
        // Connect wallet function with enhanced error handling and animations
        async function connectWallet() {
            const statusEl = document.getElementById('wallet-status');
            const btnEl = document.getElementById('connect-wallet-btn');
            const donateBtn = document.getElementById('donate-btn');
            
            try {
                statusEl.innerHTML = '<span class="loading-spinner"></span>Connecting wallet...';
                btnEl.disabled = true;
                btnEl.classList.add('pulse');
                
                // Check if MetaMask is installed
                if (typeof window.ethereum === 'undefined') {
                    throw new Error('Please install MetaMask or another Ethereum wallet');
                }
                
                // Request account access
                const accounts = await window.ethereum.request({ 
                    method: 'eth_requestAccounts' 
                });
                
                if (accounts.length === 0) {
                    throw new Error('No accounts found');
                }
                
                // Check if on correct network (Base Sepolia)
                const chainId = await window.ethereum.request({ 
                    method: 'eth_chainId' 
                });
                
                const baseSepoliaChainIdHex = '0x14a34'; // 84532 in hex
                
                if (chainId !== baseSepoliaChainIdHex) {
                    try {
                        await window.ethereum.request({
                            method: 'wallet_switchEthereumChain',
                            params: [{ chainId: baseSepoliaChainIdHex }],
                        });
                    } catch (switchError) {
                        // This error code indicates that the chain has not been added to browser wallet
                        if (switchError.code === 4902) {
                            await window.ethereum.request({
                                method: 'wallet_addEthereumChain',
                                params: [{
                                    chainId: baseSepoliaChainIdHex,
                                    chainName: 'Base Sepolia',
                                    nativeCurrency: {
                                        name: 'Ethereum',
                                        symbol: 'ETH',
                                        decimals: 18,
                                    },
                                    rpcUrls: ['https://sepolia.base.org'],
                                    blockExplorerUrls: ['https://sepolia.basescan.org'],
                                }],
                            });
                        } else {
                            throw switchError;
                        }
                    }
                }
                
                // Create viem wallet client
                walletClient = createWalletClient({
                    account: accounts[0],
                    chain: baseSepolia,
                    transport: custom(window.ethereum)
                });
                
                isWalletConnected = true;
                statusEl.innerHTML = '<span class="success-checkmark"></span>Wallet connected: ' + accounts[0].slice(0, 6) + '...' + accounts[0].slice(-4);
                btnEl.textContent = 'Connected';
                btnEl.disabled = true;
                btnEl.classList.remove('pulse');
                donateBtn.disabled = false;
                
                showStatus('Wallet connected successfully!', 'success');
                
            } catch (error) {
                console.error('Wallet connection error:', error);
                statusEl.innerHTML = '<span class="error-icon"></span>Failed to connect wallet: ' + error.message;
                btnEl.disabled = false;
                btnEl.classList.remove('pulse');
                showStatus('Wallet connection failed: ' + error.message, 'error');
            }
        }
        
        async function handleDonation() {
            if (!isWalletConnected || !walletClient) {
                showStatus('Please connect your wallet first', 'error');
                return;
            }
            
            const button = document.getElementById('donate-btn');
            const status = document.getElementById('status');
            
            // Get the final amount
            const amount = selectedAmount === 'custom' ? parseFloat(customAmount) : selectedAmount;
            
            if (selectedAmount === 'custom' && (!customAmount || parseFloat(customAmount) < 0.01)) {
                showStatus('Please enter a valid amount (minimum $0.01)', 'error');
                return;
            }
            
            button.disabled = true;
            button.innerHTML = '<span class="loading-spinner"></span>Processing...';
            showStatus('Initiating payment...', 'loading');
            
            try {
                // Create fetch with payment wrapper
                const fetchWithPay = wrapFetchWithPayment(fetch, walletClient, BigInt(1000 * 10 ** 6)); // Allow up to $1000 USDC
                
                const response = await fetchWithPay('/api/donate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        amount: amount,
                        walletAddress: '${payTo}',
                    }),
                });
                
                if (response.ok) {
                    const data = await response.json();
                    showStatus('Thank you for your support! Payment completed successfully!', 'success');
                    
                    // Add success animation
                    button.innerHTML = '<span class="success-checkmark"></span>Payment Successful!';
                    button.style.background = '#10b981';
                    
                    // Reset after 3 seconds
                    setTimeout(() => {
                        button.textContent = 'Support Now';
                        button.style.background = '#f97316';
                        button.disabled = false;
                    }, 3000);
                } else {
                    throw new Error('Payment failed');
                }
            } catch (error) {
                console.error('Donation error:', error);
                showStatus('Payment failed: ' + error.message, 'error');
                button.textContent = 'Support Now';
                button.disabled = false;
            }
        }
        
        function showStatus(message, type) {
            const status = document.getElementById('status');
            
            // Add appropriate icon based on type
            let icon = '';
            if (type === 'loading') {
                icon = '<span class="loading-spinner"></span>';
            } else if (type === 'success') {
                icon = '<span class="success-checkmark"></span>';
            } else if (type === 'error') {
                icon = '<span class="error-icon"></span>';
            }
            
            status.innerHTML = icon + message;
            status.className = \`status \${type}\`;
            status.style.display = 'block';
            
            if (type !== 'loading') {
                setTimeout(() => {
                    status.style.display = 'none';
                }, 5000);
            }
        }
        
        // Initialize amount display
        updateAmountDisplay();
        
        // Make functions global for onclick handlers
        window.connectWallet = connectWallet;
        window.handleDonation = handleDonation;
    </script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html');
  res.send(widgetHtml);
});

// Widget JavaScript endpoint - for embedding
app.get("/widget.js", (req, res) => {
  const widgetScript = `
(function() {
    // Create widget iframe
    const iframe = document.createElement('iframe');
    iframe.src = '${req.protocol}://${req.get('host')}/widget';
    iframe.style.border = 'none';
    iframe.style.width = '100%';
    iframe.style.height = '500px';
    iframe.style.maxWidth = '400px';
    iframe.style.borderRadius = '12px';
    
    // Insert widget into the page
    const container = document.currentScript.parentNode;
    container.appendChild(iframe);
})();`;

  res.setHeader('Content-Type', 'application/javascript');
  res.send(widgetScript);
});

// Donation endpoint - now protected by REAL x402 middleware
app.post("/api/donate", (req, res) => {
  const { amount = 1, walletAddress } = req.body;

  const sessionId = uuidv4();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes

  const session: PaymentSession = {
    id: sessionId,
    walletAddress: walletAddress || payTo,
    amount: amount.toString(),
    createdAt: now,
    expiresAt,
    type: "donation",
  };

  paymentSessions.set(sessionId, session);

  res.json({
    success: true,
    sessionId,
    message: "Donation payment initiated",
    session: {
      id: sessionId,
      type: "donation",
      amount: amount,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    },
  });
});

// AI agent service payment endpoint - now protected by REAL x402 middleware
app.post("/api/pay/service", (req, res) => {
  const { serviceRequest, walletAddress, amount = 0.1 } = req.body;

  if (!serviceRequest) {
    return res.status(400).json({ error: "Service request is required" });
  }

  const sessionId = uuidv4();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes

  const session: PaymentSession = {
    id: sessionId,
    walletAddress: walletAddress || payTo,
    amount: amount.toString(),
    createdAt: now,
    expiresAt,
    type: "service",
    serviceRequest,
  };

  paymentSessions.set(sessionId, session);

  res.json({
    success: true,
    sessionId,
    message: "Service payment initiated",
    session: {
      id: sessionId,
      type: "service",
      amount: amount,
      serviceRequest,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    },
  });
});

// Custom donation endpoint - now protected by REAL x402 middleware
app.post("/api/donate/custom", (req, res) => {
  const { amount, walletAddress } = req.body;

  if (!amount || parseFloat(amount) < 0.01) {
    return res.status(400).json({ error: "Amount must be at least $0.01" });
  }

  const sessionId = uuidv4();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes

  const session: PaymentSession = {
    id: sessionId,
    walletAddress: walletAddress || payTo,
    amount: amount.toString(),
    createdAt: now,
    expiresAt,
    type: "donation",
  };

  paymentSessions.set(sessionId, session);

  res.json({
    success: true,
    sessionId,
    message: "Custom donation payment initiated",
    session: {
      id: sessionId,
      type: "donation",
      amount: amount,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    },
  });
});

// Validate payment session
app.get("/api/session/:sessionId", (req, res) => {
  const sessionId = req.params.sessionId;
  const session = paymentSessions.get(sessionId);

  if (!session) {
    return res.status(404).json({ valid: false, error: "Session not found" });
  }

  const now = new Date();
  const isExpired = now > session.expiresAt;
  const isUsed = session.type === "service" && session.used;

  if (isExpired || isUsed) {
    return res.json({
      valid: false,
      error: isExpired ? "Session expired" : "Service already used",
      session: {
        id: session.id,
        type: session.type,
        amount: session.amount,
        createdAt: session.createdAt.toISOString(),
        expiresAt: session.expiresAt.toISOString(),
        used: session.used,
      }
    });
  }

  // Mark service sessions as used
  if (session.type === "service") {
    session.used = true;
    paymentSessions.set(sessionId, session);
  }

  return res.json({
    valid: true,
    session: {
      id: session.id,
      type: session.type,
      amount: session.amount,
      serviceRequest: session.serviceRequest,
      createdAt: session.createdAt.toISOString(),
      expiresAt: session.expiresAt.toISOString(),
      remainingTime: session.expiresAt.getTime() - now.getTime(),
    },
  });
});

// Get active sessions
app.get("/api/sessions", (req, res) => {
  const activeSessions = Array.from(paymentSessions.values())
    .filter(session => {
      const isExpired = new Date() > session.expiresAt;
      const isUsed = session.type === "service" && session.used;
      return !isExpired && !isUsed;
    })
    .map(session => ({
      id: session.id,
      type: session.type,
      amount: session.amount,
      serviceRequest: session.serviceRequest,
      createdAt: session.createdAt.toISOString(),
      expiresAt: session.expiresAt.toISOString(),
    }));

  res.json({ sessions: activeSessions });
});

// AI agent service endpoint - after payment verification
app.post("/api/service", (req, res) => {
  const { sessionId, request } = req.body;

  if (!sessionId || !request) {
    return res.status(400).json({ error: "Session ID and request are required" });
  }

  const session = paymentSessions.get(sessionId);

  if (!session) {
    return res.status(404).json({ error: "Session not found" });
  }

  if (session.type !== "service") {
    return res.status(400).json({ error: "Invalid session type" });
  }

  const now = new Date();
  if (now > session.expiresAt) {
    return res.status(400).json({ error: "Session expired" });
  }

  if (session.used) {
    return res.status(400).json({ error: "Service already used" });
  }

  // Mark as used
  session.used = true;
  paymentSessions.set(sessionId, session);

  // Process the service request (this is where you'd implement your service logic)
  const response = {
    success: true,
    message: "Service request processed successfully",
    request: request,
    sessionId: sessionId,
    processedAt: now.toISOString(),
    // Add your service response here
    data: {
      result: "Service completed",
      timestamp: now.toISOString(),
    }
  };

  res.json(response);
});

console.log(`
🚀 x402 Universal Payment Server
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 Accepting payments to: ${payTo}
🔗 Network: ${network}
🌐 Port: ${port}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Available Endpoints:
   - Widget: http://localhost:${port}/widget
   - Widget JS: http://localhost:${port}/widget.js
   - Donation: POST /api/donate
   - Service Payment: POST /api/pay/service
   - Custom Donation: POST /api/donate/custom
   - Service: POST /api/service
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 Widget Embed Code:
   <script src="http://localhost:${port}/widget.js"></script>
   <div id="x402-widget"></div>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛠️  Ready to accept REAL crypto payments via x402 protocol!
📚 Learn more: https://x402.org
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
}); 