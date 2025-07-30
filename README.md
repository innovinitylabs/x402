# x402 Universal Payment Server

A universal payment server that enables both widget donations and AI agent payments using the [x402 protocol](https://x402.org/). This server makes it easy for anyone to receive crypto payments through a simple widget or API endpoints.

## 🚀 Features

- **Widget Donations**: Embed a beautiful donation widget on any website
- **AI Agent Payments**: Handle payments from AI agents for services
- **Custom Amounts**: Support for custom donation amounts
- **Session Management**: Track payment sessions and validate them
- **CORS Enabled**: Works across different domains
- **Simple Integration**: Just a few lines of code to get started

## 📋 Prerequisites

- Node.js 18+ and npm
- A crypto wallet address to receive payments
- (Optional) Coinbase Developer Platform account for mainnet

## 🛠️ Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/x402-universal-payment-server.git
   cd x402-universal-payment-server
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment**:
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env with your wallet address
   ADDRESS=0xYourWalletAddress
   ```

4. **Start the server**:
   ```bash
   npm run dev
   ```

## 🔧 Configuration

Create a `.env` file with the following variables:

```env
# Your wallet address to receive payments
ADDRESS=0x5e051c9106071baF1e4c087e3e06Fdd17396A433

# x402 Facilitator URL (use testnet for development)
FACILITATOR_URL=https://x402.org/facilitator

# Network (base-sepolia for testnet, base for mainnet)
NETWORK=base-sepolia

# Server port
PORT=4021
```

## 📡 API Endpoints

### Health Check
```http
GET /api/health
```

### Widget
```http
GET /widget
GET /widget.js
```

### Donations
```http
POST /api/donate
POST /api/donate/custom
```

### AI Agent Services
```http
POST /api/pay/service
POST /api/service
```

### Session Management
```http
GET /api/session/:sessionId
GET /api/sessions
```

## 🎨 Widget Integration

### Option 1: Simple Embed
Add this to your HTML:
```html
<script src="http://localhost:4021/widget.js"></script>
<div id="x402-widget"></div>
```

### Option 2: Direct iframe
```html
<iframe 
  src="http://localhost:4021/widget" 
  style="border: none; width: 100%; height: 500px; max-width: 400px; border-radius: 12px;">
</iframe>
```

### Option 3: Custom Styling
```html
<div style="max-width: 400px; margin: 0 auto;">
  <script src="http://localhost:4021/widget.js"></script>
  <div id="x402-widget"></div>
</div>
```

## 🤖 AI Agent Integration

### 1. Request Service Payment
```javascript
const response = await fetch('http://localhost:4021/api/pay/service', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    serviceRequest: 'Generate a weather report for New York',
    walletAddress: '0xReceiverAddress',
    amount: 0.1
  })
});

const { sessionId } = await response.json();
```

### 2. Use the Service
```javascript
const serviceResponse = await fetch('http://localhost:4021/api/service', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sessionId: sessionId,
    request: 'Generate a weather report for New York'
  })
});

const result = await serviceResponse.json();
```

## 💡 Usage Examples

### For Website Owners
1. Add the widget to your website
2. Users can donate with USDC
3. Receive payments instantly to your wallet

### For AI Agents
1. Send a payment request with service details
2. Complete the payment using x402 protocol
3. Use the service and get results

### For Service Providers
1. Deploy this server
2. Configure your wallet address
3. AI agents can pay for your services automatically

## 🔒 Security Considerations

- **Production**: Use HTTPS and secure environment variables
- **Database**: Replace in-memory storage with Redis/PostgreSQL
- **Validation**: Add proper input validation and rate limiting
- **Authentication**: Implement proper session management
- **Monitoring**: Add logging and monitoring for production use

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 4021
CMD ["node", "dist/index.js"]
```

### GitHub Actions (for GitHub Pages)
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## 📚 x402 Protocol

This server implements the [x402 protocol](https://x402.org/), which:

- Uses HTTP 402 status code for payment requests
- Enables instant crypto payments
- Works with any EVM-compatible blockchain
- Requires no user registration
- Supports automated AI agent payments

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [x402.org](https://x402.org/)
- **GitHub Issues**: [Report bugs here](https://github.com/your-username/x402-universal-payment-server/issues)
- **Discord**: [Join the community](https://discord.gg/invite/cdp)

## 🙏 Acknowledgments

- Built on the [x402 protocol](https://x402.org/)
- Inspired by the need for universal crypto payments
- Thanks to the Coinbase Developer Platform team

---

**Made with ❤️ for the crypto community**
