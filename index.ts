import { config } from "dotenv";
import express from "express";
import cors from "cors";
import { paymentMiddleware, Resource, Network } from "x402-express";
import { v4 as uuidv4 } from "uuid";

config();

// Configuration from environment variables
const facilitatorUrl = process.env.FACILITATOR_URL as Resource || "https://x402.org/facilitator";
const payTo = process.env.ADDRESS as `0x${string}`;
const network = (process.env.NETWORK as Network) || "base-sepolia";
const port = parseInt(process.env.PORT || "4021");

if (!payTo) {
  console.error("❌ Please set your wallet ADDRESS in the .env file");
  console.error("Copy env.example to .env and add your wallet address");
  process.exit(1);
}

const app = express();

// Enable CORS
app.use(cors({
  origin: true,
  credentials: true,
}));

// Parse JSON bodies
app.use(express.json());

// Serve static files
app.use(express.static('public'));

// Simple in-memory storage for sessions (use Redis/DB in production)
interface Session {
  id: string;
  createdAt: Date;
  expiresAt: Date;
  type: "donation" | "ai-service";
  amount: number;
  description?: string;
  serviceRequest?: string;
  used?: boolean;
}

const sessions = new Map<string, Session>();

// Configure x402 payment middleware
app.use(
  paymentMiddleware(
    payTo,
    {
      // Donation endpoints
      "/api/donate": {
        price: "$1.00", // Default donation amount
        network,
      },
      "/api/donate/custom": {
        price: "$5.00", // Custom donation amount (will be overridden)
        network,
      },
      // AI Agent service endpoints
      "/api/ai/service": {
        price: "$0.10", // AI service payment
        network,
      },
      "/api/ai/premium": {
        price: "$1.00", // Premium AI service
        network,
      },
    },
    {
      url: facilitatorUrl,
    },
  ),
);

// ========================================
// FREE ENDPOINTS (No payment required)
// ========================================

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "x402 Universal Payment Server",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    config: {
      network,
      payTo,
      facilitator: facilitatorUrl,
    },
    endpoints: {
      donations: ["/api/donate", "/api/donate/custom"],
      aiServices: ["/api/ai/service", "/api/ai/premium"],
      widget: ["/widget", "/widget.js"],
      sessions: ["/api/session/:id", "/api/sessions"],
    },
  });
});

// Widget HTML page
app.get("/widget", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>x402 Donation Widget</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #0a0a0a; color: #ffffff; 
            display: flex; justify-content: center; align-items: center; 
            min-height: 100vh; padding: 20px; 
        }
        .widget-container {
            background: #1a1a1a; border-radius: 16px; padding: 32px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3); border: 1px solid #333;
            max-width: 400px; width: 100%;
        }
        .widget-title { 
            font-size: 24px; font-weight: 700; margin-bottom: 8px; text-align: center;
            background: linear-gradient(135deg, #00ff88, #00cc6a);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .widget-subtitle { color: #888; font-size: 14px; text-align: center; margin-bottom: 24px; }
        .amount-options { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px; }
        .amount-option {
            background: #2a2a2a; border: 2px solid #333; border-radius: 8px;
            padding: 16px 12px; text-align: center; cursor: pointer;
            transition: all 0.3s ease; font-weight: 600;
        }
        .amount-option:hover { border-color: #00ff88; }
        .amount-option.selected { 
            border-color: #00ff88; background: linear-gradient(135deg, #00ff88, #00cc6a); color: #000; 
        }
        .custom-amount { margin-bottom: 24px; }
        .custom-amount input {
            width: 100%; background: #2a2a2a; border: 2px solid #333; border-radius: 8px;
            padding: 16px; color: #fff; font-size: 16px; transition: border-color 0.3s ease;
        }
        .custom-amount input:focus { outline: none; border-color: #00ff88; }
        .selected-amount {
            background: linear-gradient(135deg, #00ff88, #00cc6a); color: #000;
            padding: 16px; border-radius: 8px; text-align: center; margin-bottom: 24px;
            font-weight: 700; font-size: 18px;
        }
        .donate-btn {
            width: 100%; background: linear-gradient(135deg, #ff6b6b, #ee5a52); color: #fff;
            border: none; border-radius: 8px; padding: 16px; font-size: 16px; font-weight: 700;
            cursor: pointer; transition: all 0.3s ease; margin-bottom: 16px;
        }
        .donate-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(255, 107, 107, 0.3); }
        .donate-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .status-message {
            text-align: center; padding: 12px; border-radius: 8px; margin-bottom: 16px;
            font-size: 14px; display: none;
        }
        .status-success { background: #1a2a1a; border: 1px solid #00ff88; color: #00ff88; }
        .status-error { background: #2a1a1a; border: 1px solid #ff6b6b; color: #ff6b6b; }
        .status-loading { background: #1a1a2a; border: 1px solid #6b6bff; color: #6b6bff; }
        .footer { 
            text-align: center; margin-top: 24px; padding-top: 16px; 
            border-top: 1px solid #333; color: #666; font-size: 12px; 
        }
        .footer a { color: #00ff88; text-decoration: none; }
        .footer a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="widget-container">
        <div class="widget-title">Support with Crypto</div>
        <div class="widget-subtitle">Powered by x402 Protocol</div>
        
        <div class="amount-options">
            <div class="amount-option" data-amount="1">
                <div style="font-size: 18px; font-weight: 700;">$1</div>
                <div style="font-size: 12px; opacity: 0.8; margin-top: 4px;">Quick Tip</div>
            </div>
            <div class="amount-option" data-amount="5">
                <div style="font-size: 18px; font-weight: 700;">$5</div>
                <div style="font-size: 12px; opacity: 0.8; margin-top: 4px;">Nice!</div>
            </div>
            <div class="amount-option" data-amount="10">
                <div style="font-size: 18px; font-weight: 700;">$10</div>
                <div style="font-size: 12px; opacity: 0.8; margin-top: 4px;">Awesome!</div>
            </div>
        </div>
        
        <div class="custom-amount">
            <input type="number" placeholder="Custom amount (USD)" min="0.01" step="0.01">
        </div>
        
        <div class="selected-amount">
            Selected: $<span id="selected-amount-value">1.00</span>
        </div>
        
        <div class="status-message" id="status-message"></div>
        
        <button class="donate-btn" id="donate-btn">Donate with Crypto</button>
        
        <div class="footer">
            <p>Built with ❤️ by <a href="https://valipokkann.in" target="_blank">valipokkann</a></p>
            <p>Powered by <a href="https://x402.org" target="_blank">x402 protocol</a></p>
        </div>
    </div>
    
    <script src="/widget.js"></script>
</body>
</html>
  `);
});

// Widget JavaScript
app.get("/widget.js", (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.send(`
// x402 Universal Payment Widget
(function () {
  'use strict';
  
  let selectedAmount = 1;
  
  function initWidget() {
    const container = document.getElementById('x402-widget');
    if (!container) return;
    
    container.innerHTML = \`
      <div style="background: #1a1a1a; border-radius: 16px; padding: 32px; max-width: 400px; width: 100%; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #ffffff;">
        <div style="font-size: 24px; font-weight: 700; margin-bottom: 8px; text-align: center; background: linear-gradient(135deg, #00ff88, #00cc6a); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Support with Crypto</div>
        <div style="color: #888; font-size: 14px; text-align: center; margin-bottom: 24px;">Powered by x402 Protocol</div>
        
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px;">
          <div class="amount-option" data-amount="1" style="background: #2a2a2a; border: 2px solid #333; border-radius: 8px; padding: 16px 12px; text-align: center; cursor: pointer; transition: all 0.3s ease; font-weight: 600;">
            <div style="font-size: 18px; font-weight: 700;">$1</div>
            <div style="font-size: 12px; opacity: 0.8; margin-top: 4px;">Quick Tip</div>
          </div>
          <div class="amount-option" data-amount="5" style="background: #2a2a2a; border: 2px solid #333; border-radius: 8px; padding: 16px 12px; text-align: center; cursor: pointer; transition: all 0.3s ease; font-weight: 600;">
            <div style="font-size: 18px; font-weight: 700;">$5</div>
            <div style="font-size: 12px; opacity: 0.8; margin-top: 4px;">Nice!</div>
          </div>
          <div class="amount-option" data-amount="10" style="background: #2a2a2a; border: 2px solid #333; border-radius: 8px; padding: 16px 12px; text-align: center; cursor: pointer; transition: all 0.3s ease; font-weight: 600;">
            <div style="font-size: 18px; font-weight: 700;">$10</div>
            <div style="font-size: 12px; opacity: 0.8; margin-top: 4px;">Awesome!</div>
          </div>
        </div>
        
        <div style="margin-bottom: 24px;">
          <input type="number" placeholder="Custom amount (USD)" min="0.01" step="0.01" style="width: 100%; background: #2a2a2a; border: 2px solid #333; border-radius: 8px; padding: 16px; color: #fff; font-size: 16px;">
        </div>
        
        <div style="background: linear-gradient(135deg, #00ff88, #00cc6a); color: #000; padding: 16px; border-radius: 8px; text-align: center; margin-bottom: 24px; font-weight: 700; font-size: 18px;">
          Selected: $<span id="selected-amount-value">1.00</span>
        </div>
        
        <div id="status-message" style="text-align: center; padding: 12px; border-radius: 8px; margin-bottom: 16px; font-size: 14px; display: none;"></div>
        
        <button id="donate-btn" style="width: 100%; background: linear-gradient(135deg, #ff6b6b, #ee5a52); color: #fff; border: none; border-radius: 8px; padding: 16px; font-size: 16px; font-weight: 700; cursor: pointer; transition: all 0.3s ease;">
          Donate with Crypto
        </button>
        
        <div style="text-align: center; margin-top: 24px; padding-top: 16px; border-top: 1px solid #333; color: #666; font-size: 12px;">
          <p>Built with ❤️ by <a href="https://valipokkann.in" target="_blank" style="color: #00ff88; text-decoration: none;">valipokkann</a></p>
          <p>Powered by <a href="https://x402.org" target="_blank" style="color: #00ff88; text-decoration: none;">x402 protocol</a></p>
        </div>
      </div>
    \`;
    
    setupEventListeners();
    updateSelectedAmount();
  }
  
  function setupEventListeners() {
    const amountOptions = document.querySelectorAll('.amount-option');
    const customInput = document.querySelector('#x402-widget input[type="number"]');
    const donateBtn = document.getElementById('donate-btn');
    
    amountOptions.forEach(option => {
      option.addEventListener('click', () => {
        amountOptions.forEach(opt => {
          opt.style.borderColor = '#333';
          opt.style.background = '#2a2a2a';
          opt.style.color = '#fff';
        });
        option.style.borderColor = '#00ff88';
        option.style.background = 'linear-gradient(135deg, #00ff88, #00cc6a)';
        option.style.color = '#000';
        selectedAmount = parseFloat(option.dataset.amount);
        updateSelectedAmount();
      });
    });
    
    if (customInput) {
      customInput.addEventListener('input', () => {
        const value = parseFloat(customInput.value);
        if (value > 0) {
          amountOptions.forEach(opt => {
            opt.style.borderColor = '#333';
            opt.style.background = '#2a2a2a';
            opt.style.color = '#fff';
          });
          selectedAmount = value;
          updateSelectedAmount();
        }
      });
    }
    
    if (donateBtn) {
      donateBtn.addEventListener('click', handleDonation);
    }
  }
  
  function updateSelectedAmount() {
    const amountValue = document.getElementById('selected-amount-value');
    if (amountValue) {
      amountValue.textContent = selectedAmount.toFixed(2);
    }
  }
  
  function showStatus(message, type) {
    const statusEl = document.getElementById('status-message');
    if (statusEl) {
      statusEl.textContent = message;
      statusEl.style.display = 'block';
      statusEl.style.background = type === 'success' ? '#1a2a1a' : type === 'error' ? '#2a1a1a' : '#1a1a2a';
      statusEl.style.border = type === 'success' ? '1px solid #00ff88' : type === 'error' ? '1px solid #ff6b6b' : '1px solid #6b6bff';
      statusEl.style.color = type === 'success' ? '#00ff88' : type === 'error' ? '#ff6b6b' : '#6b6bff';
    }
  }
  
  async function handleDonation() {
    const donateBtn = document.getElementById('donate-btn');
    if (donateBtn) {
      donateBtn.disabled = true;
      donateBtn.textContent = 'Processing...';
    }
    
    showStatus('Processing payment...', 'loading');
    
    try {
      // Import x402-fetch dynamically
      const { wrapFetchWithPayment } = await import('https://cdn.jsdelivr.net/npm/x402-fetch@0.4.2/+esm');
      
      // Create a wallet-aware fetch function
      const fetchWithPayment = wrapFetchWithPayment(fetch, window.ethereum);
      
      const response = await fetchWithPayment('/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: selectedAmount })
      });
      
      if (response.ok) {
        const result = await response.json();
        showStatus('Payment completed successfully! Thank you for your support! 🎉', 'success');
        if (donateBtn) {
          donateBtn.style.background = 'linear-gradient(135deg, #00ff88, #00cc6a)';
          donateBtn.style.color = '#000';
          donateBtn.textContent = 'Thank you! ✓';
        }
        
        setTimeout(() => {
          if (donateBtn) {
            donateBtn.style.background = 'linear-gradient(135deg, #ff6b6b, #ee5a52)';
            donateBtn.style.color = '#fff';
            donateBtn.textContent = 'Donate with Crypto';
            donateBtn.disabled = false;
          }
          document.getElementById('status-message').style.display = 'none';
        }, 3000);
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
      console.error('Donation error:', error);
      showStatus(\`Payment failed: \${error.message}\`, 'error');
      if (donateBtn) {
        donateBtn.disabled = false;
        donateBtn.textContent = 'Donate with Crypto';
      }
    }
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }
})();
  `);
});

// Session management
app.get("/api/session/:sessionId", (req, res) => {
  const sessionId = req.params.sessionId;
  const session = sessions.get(sessionId);

  if (!session) {
    return res.status(404).json({ valid: false, error: "Session not found" });
  }

  const now = new Date();
  const isExpired = now > session.expiresAt;
  const isUsed = session.used;

  if (isExpired || isUsed) {
    return res.json({
      valid: false,
      error: isExpired ? "Session expired" : "Session already used",
      session: {
        id: session.id,
        type: session.type,
        createdAt: session.createdAt.toISOString(),
        expiresAt: session.expiresAt.toISOString(),
        used: session.used,
      }
    });
  }

  return res.json({
    valid: true,
    session: {
      id: session.id,
      type: session.type,
      amount: session.amount,
      description: session.description,
      createdAt: session.createdAt.toISOString(),
      expiresAt: session.expiresAt.toISOString(),
      remainingTime: session.expiresAt.getTime() - now.getTime(),
    },
  });
});

// List active sessions
app.get("/api/sessions", (req, res) => {
  const activeSessions = Array.from(sessions.values())
    .filter(session => {
      const isExpired = new Date() > session.expiresAt;
      return !isExpired && !session.used;
    })
    .map(session => ({
      id: session.id,
      type: session.type,
      amount: session.amount,
      description: session.description,
      createdAt: session.createdAt.toISOString(),
      expiresAt: session.expiresAt.toISOString(),
    }));

  res.json({ sessions: activeSessions });
});

// ========================================
// PAID ENDPOINTS (x402 payment required)
// ========================================

// Standard donation endpoint ($1.00)
app.post("/api/donate", (req, res) => {
  const { amount = 1 } = req.body;
  const sessionId = uuidv4();
  const now = new Date();

  const session: Session = {
    id: sessionId,
    createdAt: now,
    expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000), // 24 hours
    type: "donation",
    amount,
    description: `Donation of $${amount}`,
  };

  sessions.set(sessionId, session);

  res.json({
    success: true,
    message: "Thank you for your donation!",
    sessionId,
    amount,
    session: {
      id: sessionId,
      type: "donation",
      amount,
      createdAt: now.toISOString(),
      expiresAt: session.expiresAt.toISOString(),
    },
  });
});

// Custom donation endpoint
app.post("/api/donate/custom", (req, res) => {
  const { amount = 5 } = req.body;
  const sessionId = uuidv4();
  const now = new Date();

  const session: Session = {
    id: sessionId,
    createdAt: now,
    expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000), // 24 hours
    type: "donation",
    amount,
    description: `Custom donation of $${amount}`,
  };

  sessions.set(sessionId, session);

  res.json({
    success: true,
    message: `Thank you for your ${amount > 10 ? 'generous' : 'kind'} donation!`,
    sessionId,
    amount,
    session: {
      id: sessionId,
      type: "donation",
      amount,
      createdAt: now.toISOString(),
      expiresAt: session.expiresAt.toISOString(),
    },
  });
});

// AI Agent service endpoint ($0.10)
app.post("/api/ai/service", (req, res) => {
  const { serviceRequest, amount = 0.1 } = req.body;
  const sessionId = uuidv4();
  const now = new Date();

  const session: Session = {
    id: sessionId,
    createdAt: now,
    expiresAt: new Date(now.getTime() + 60 * 60 * 1000), // 1 hour
    type: "ai-service",
    amount,
    description: `AI service: ${serviceRequest || 'General service'}`,
    serviceRequest,
  };

  sessions.set(sessionId, session);

  res.json({
    success: true,
    message: "AI service access granted",
    sessionId,
    amount,
    serviceRequest,
    response: {
      data: `Service result for: ${serviceRequest || 'your request'}`,
      timestamp: now.toISOString(),
      sessionId,
    },
    session: {
      id: sessionId,
      type: "ai-service",
      amount,
      createdAt: now.toISOString(),
      expiresAt: session.expiresAt.toISOString(),
      validFor: "1 hour",
    },
  });
});

// AI Agent premium service endpoint ($1.00)
app.post("/api/ai/premium", (req, res) => {
  const { serviceRequest, amount = 1.0 } = req.body;
  const sessionId = uuidv4();
  const now = new Date();

  const session: Session = {
    id: sessionId,
    createdAt: now,
    expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000), // 24 hours
    type: "ai-service",
    amount,
    description: `Premium AI service: ${serviceRequest || 'Premium service'}`,
    serviceRequest,
  };

  sessions.set(sessionId, session);

  res.json({
    success: true,
    message: "Premium AI service access granted",
    sessionId,
    amount,
    serviceRequest,
    response: {
      data: `Premium service result for: ${serviceRequest || 'your request'}`,
      quality: "premium",
      features: ["priority processing", "enhanced accuracy", "extended support"],
      timestamp: now.toISOString(),
      sessionId,
    },
    session: {
      id: sessionId,
      type: "ai-service",
      amount,
      createdAt: now.toISOString(),
      expiresAt: session.expiresAt.toISOString(),
      validFor: "24 hours",
    },
  });
});

// Start server
app.listen(port, () => {
  console.log(`
🚀 x402 Universal Payment Server
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 Receiving payments to: ${payTo}
🔗 Network: ${network}
🌐 Server: http://localhost:${port}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Endpoints:
   🎯 Widget: http://localhost:${port}/widget
   💝 Donations: /api/donate, /api/donate/custom
   🤖 AI Services: /api/ai/service, /api/ai/premium
   📊 Sessions: /api/session/:id, /api/sessions
   ❤️  Health: /api/health
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛠️  Ready for both donations and AI agent payments!
📚 Learn more: https://x402.org
💬 Get help: https://discord.gg/invite/cdp
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
}); 