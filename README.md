# x402 Universal Payment Server

A universal payment server that enables both **donation widgets** and **AI agent payments** using the [x402 protocol](https://x402.org/). This server makes it easy for anyone to receive crypto payments through a simple widget or API endpoints.

## 🚀 Features

- **💝 Donation Widget**: Beautiful, embeddable donation widget for any website
- **🤖 AI Agent Payments**: Direct HTTP 402 payments from AI agents for services
- **💰 Custom Amounts**: Support for custom donation amounts
- **📊 Session Management**: Track payment sessions and validate them
- **🔒 CORS Enabled**: Works across different domains
- **⚡ Simple Integration**: Just a few lines of code to get started
- **🌐 Real Crypto**: Actual payments on Base Sepolia (testnet) or Base (mainnet)

## 📋 Prerequisites

- Node.js 18+ and npm
- A crypto wallet address to receive payments (your wallet on Base network)
- (Optional) Coinbase Developer Platform account for mainnet

## 🛠️ Quick Start

### 1. Clone and Install
```bash
git clone https://github.com/your-username/x402-universal-payment-server.git
cd x402-universal-payment-server
npm install
```

### 2. Configure Environment
```bash
# Copy the example environment file
cp env.example .env

# Edit .env with your wallet address
ADDRESS=0xYourWalletAddress
FACILITATOR_URL=https://x402.org/facilitator
NETWORK=base-sepolia
PORT=4021
```

### 3. Start the Server
```bash
npm run dev
```

### 4. Test the Widget
Open http://localhost:4021/widget in your browser and test with your Base Sepolia wallet!

## 🎨 Widget Integration

### Simple Embed
Add this to any website:
```html
<script src="http://localhost:4021/widget.js"></script>
<div id="x402-widget"></div>
```

### Custom Styling
```html
<div style="max-width: 400px; margin: 0 auto;">
  <script src="http://localhost:4021/widget.js"></script>
  <div id="x402-widget"></div>
</div>
```

### iframe Embed
```html
<iframe 
  src="http://localhost:4021/widget" 
  style="border: none; width: 100%; height: 500px; max-width: 400px; border-radius: 12px;">
</iframe>
```

## 🤖 AI Agent Integration

### For AI Agents to Send You Money

AI agents can directly pay for services using HTTP 402:

```javascript
// AI Agent payment example
const response = await fetch('http://localhost:4021/api/ai/service', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    serviceRequest: 'Generate a weather report for New York',
    amount: 0.1
  })
});

const result = await response.json();
console.log(result.response.data); // Service result after payment
```

### Available AI Service Endpoints

1. **Basic AI Service** (`/api/ai/service`) - $0.10
   ```bash
   curl -X POST http://localhost:4021/api/ai/service \
     -H "Content-Type: application/json" \
     -d '{"serviceRequest": "Generate a summary", "amount": 0.1}'
   ```

2. **Premium AI Service** (`/api/ai/premium`) - $1.00
   ```bash
   curl -X POST http://localhost:4021/api/ai/premium \
     -H "Content-Type: application/json" \
     -d '{"serviceRequest": "Advanced analysis", "amount": 1.0}'
   ```

## 📡 API Endpoints

### Free Endpoints
- `GET /api/health` - Health check
- `GET /widget` - Widget HTML page
- `GET /widget.js` - Widget JavaScript
- `GET /api/session/:sessionId` - Validate session
- `GET /api/sessions` - List active sessions

### Paid Endpoints (require x402 payment)
- `POST /api/donate` - Standard donation ($1.00)
- `POST /api/donate/custom` - Custom donation (amount specified)
- `POST /api/ai/service` - AI service payment ($0.10)
- `POST /api/ai/premium` - Premium AI service ($1.00)

## 💡 How It Works

### For Donations
1. User visits your website with the embedded widget
2. User selects amount and clicks "Donate"
3. Widget triggers wallet popup for payment approval
4. After payment confirmation, donation is complete
5. Funds are received in your wallet address

### For AI Agents
1. AI agent makes HTTP request to your service endpoint
2. Server responds with HTTP 402 Payment Required
3. AI agent processes payment automatically
4. Server provides the requested service/data
5. You receive payment for each service call

## 🔧 Configuration

Edit the `.env` file:

```env
# Your wallet address to receive payments
ADDRESS=0x5e051c9106071baF1e4c087e3e06Fdd17396A433

# x402 Facilitator URL
FACILITATOR_URL=https://x402.org/facilitator

# Network (base-sepolia for testnet, base for mainnet)
NETWORK=base-sepolia

# Server port
PORT=4021
```

## 🌐 Deployment

### Local Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Environment Setup for Production
- Set `NETWORK=base` for mainnet
- Use HTTPS (required for wallet connections)
- Set up proper domain and SSL certificate
- Consider using Redis/Database instead of in-memory storage

## 🔒 Security Considerations

- **Production**: Use HTTPS and secure environment variables
- **Database**: Replace in-memory storage with Redis/PostgreSQL for production
- **Validation**: Add proper input validation and rate limiting
- **Monitoring**: Add logging and monitoring for production use
- **Session Management**: Implement proper session cleanup and expiration

## 📚 x402 Protocol

This server implements the [x402 protocol](https://x402.org/), which:

- Uses HTTP 402 status code for payment requests
- Enables instant crypto payments
- Works with any EVM-compatible blockchain
- Requires no user registration or API keys
- Supports automated AI agent payments
- Provides seamless wallet integration

## 🚀 Use Cases

### For Website Owners
- Accept crypto donations on your blog/website
- Monetize content with micro-payments
- Receive tips from supporters
- No payment processor fees

### For AI Developers
- Monetize AI services with automatic payments
- Accept payments from other AI agents
- Build paid APIs that AI can use autonomously
- Create pay-per-use AI services

### For Service Providers
- Accept automated payments for any service
- Build payment-gated APIs
- Create subscription-like services
- Enable machine-to-machine payments

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support & Resources

- **Documentation**: [x402.org](https://x402.org/)
- **GitHub Issues**: [Report bugs here](https://github.com/coinbase/x402/issues)
- **Discord**: [Join the community](https://discord.gg/invite/cdp)
- **Builder**: [valipokkann.in](https://valipokkann.in)

## 🙏 Acknowledgments

- Built on the [x402 protocol](https://x402.org/) by Coinbase
- Inspired by the need for universal crypto payments
- Thanks to the Coinbase Developer Platform team

---

**Made with ❤️ for the crypto and AI community**

Ready to accept crypto payments from both humans and AI agents! 🚀
