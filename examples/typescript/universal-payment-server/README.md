# Universal Payment Server Example

A universal payment server that enables both widget donations and AI agent payments using the x402 protocol. This example demonstrates how to create a server that can handle both human donations and automated AI agent payments.

## 🚀 Features

- **Widget Donations**: Beautiful, embeddable donation widget
- **AI Agent Payments**: API endpoints for automated payments
- **Session Management**: Track and validate payment sessions
- **CORS Enabled**: Works across different domains
- **Easy Deployment**: Fork-and-deploy ready

## 🎯 Quick Start

### 1. Fork and Deploy
```bash
# Fork this repository
# Clone your fork
git clone https://github.com/yourusername/x402.git
cd x402/examples/typescript/universal-payment-server

# Configure your wallet
echo "ADDRESS=0xYourWalletAddress" > .env

# Install dependencies
npm install

# Start development server
npm run dev
```

### 2. Deploy to Production
- **GitHub Pages**: Enable Pages in repository settings
- **Railway**: Connect repository and deploy
- **Vercel**: Import repository and deploy
- **Heroku**: Push to Heroku with `git push heroku main`

### 3. Use the Widget
Add this to any website:
```html
<script src="https://yourdomain.com/widget.js"></script>
<div id="x402-widget"></div>
```

## 📡 API Endpoints

### Widget
- `GET /widget` - Widget HTML
- `GET /widget.js` - Widget JavaScript

### Payments
- `POST /api/donate` - Standard donation
- `POST /api/donate/custom` - Custom amount donation
- `POST /api/pay/service` - AI agent service payment

### Services
- `POST /api/service` - Use paid service
- `GET /api/session/:id` - Validate session
- `GET /api/sessions` - List active sessions

### Health
- `GET /api/health` - Server status

## 🤖 AI Agent Integration

AI agents can use these endpoints to pay for services:

```javascript
// 1. Request service payment
const response = await fetch('/api/pay/service', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    serviceRequest: 'Generate a weather report',
    amount: 0.1
  })
});

const { sessionId } = await response.json();

// 2. Use the service
const result = await fetch('/api/service', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sessionId: sessionId,
    request: 'Generate a weather report'
  })
});
```

## 🔧 Configuration

### Environment Variables
```env
ADDRESS=0xYourWalletAddress
FACILITATOR_URL=https://x402.org/facilitator
NETWORK=base-sepolia
PORT=4021
```

### Customization
Edit `src/index.ts` to customize:
- Donation amounts
- Widget styling
- Payment timeouts
- Service logic

## 🎨 Widget Customization

The widget supports customization through CSS variables:

```css
:root {
  --primary-color: #f97316;
  --secondary-color: #4ade80;
  --background-color: #2a2a2a;
  --text-color: #ffffff;
}
```

## 🔒 Security Considerations

- **Production**: Use HTTPS and secure environment variables
- **Database**: Replace in-memory storage with Redis/PostgreSQL
- **Rate Limiting**: Add rate limiting for production use
- **Validation**: Implement proper input validation

## 📚 Learn More

- [x402 Protocol](https://x402.org/)
- [Base Network](https://base.org/)
- [Coinbase Developer Platform](https://www.coinbase.com/developer-platform)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**This example demonstrates how to build a universal payment server that works for both human donations and AI agent payments using the x402 protocol.** 