import { config } from "dotenv";
import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";

config();

// Configuration from environment variables
const facilitatorUrl = process.env.FACILITATOR_URL || "https://x402.org/facilitator";
const payTo = process.env.ADDRESS || "0x5e051c9106071baF1e4c087e3e06Fdd17396A433";
const network = process.env.NETWORK || "base-sepolia";
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
    </style>
</head>
<body>
    <div class="widget-container">
        <div class="header">
            <span class="lightning-icon">⚡</span>
            <span class="title">x402 Protocol Support</span>
        </div>
        
        <div class="default-amount">$1.00</div>
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
        
        <button class="donate-button" onclick="handleDonation()">Support Now</button>
        
        <div class="status" id="status"></div>
    </div>

    <script>
        let selectedAmount = 1;
        let customAmount = '';
        
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
                } else {
                    customInput.classList.remove('show');
                    selectedAmount = parseInt(amount);
                }
            });
        });
        
        // Handle custom amount input
        document.querySelector('.custom-input').addEventListener('input', (e) => {
            customAmount = e.target.value;
        });
        
        async function handleDonation() {
            const button = document.querySelector('.donate-button');
            const status = document.getElementById('status');
            
            // Get the final amount
            const amount = selectedAmount === 'custom' ? parseFloat(customAmount) : selectedAmount;
            
            if (selectedAmount === 'custom' && (!customAmount || parseFloat(customAmount) < 0.01)) {
                showStatus('Please enter a valid amount (minimum $0.01)', 'error');
                return;
            }
            
            button.disabled = true;
            button.textContent = 'Processing...';
            showStatus('Initiating payment...', 'loading');
            
            try {
                const response = await fetch('/api/donate', {
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
                    showStatus('Thank you for your support!', 'success');
                    
                    // Simulate payment completion
                    setTimeout(() => {
                        showStatus('Payment completed successfully!', 'success');
                        button.textContent = 'Support Now';
                        button.disabled = false;
                    }, 2000);
                } else {
                    throw new Error('Payment failed');
                }
            } catch (error) {
                console.error('Donation error:', error);
                showStatus('Payment failed. Please try again.', 'error');
            } finally {
                button.textContent = 'Support Now';
                button.disabled = false;
            }
        }
        
        function showStatus(message, type) {
            const status = document.getElementById('status');
            status.textContent = message;
            status.className = \`status \${type}\`;
            status.style.display = 'block';
            
            if (type !== 'loading') {
                setTimeout(() => {
                    status.style.display = 'none';
                }, 5000);
            }
        }
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

// Donation endpoint
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

// AI agent service payment endpoint
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

// Custom donation endpoint
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
🛠️  Ready to accept payments via x402 protocol!
📚 Learn more: https://x402.org
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
}); 