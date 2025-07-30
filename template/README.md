# 🚀 x402 Universal Payment Server Template

A universal payment server that enables both widget donations and AI agent payments using the [x402 protocol](https://x402.org/). This template makes it easy for anyone to deploy their own payment server.

## 🎯 Quick Start

### 1. Fork this Repository
Click the "Fork" button at the top right of this page.

### 2. Configure Your Wallet
Edit the `.env` file and replace the wallet address:
```env
ADDRESS=0xYourWalletAddressHere
```

### 3. Deploy to GitHub Pages
- Go to your forked repository
- Go to Settings → Pages
- Set Source to "GitHub Actions"
- The server will automatically deploy

### 4. Use Your Widget
Add this to any website:
```html
<script src="https://yourusername.github.io/x402/widget.js"></script>
<div id="x402-widget"></div>
```

## 🔧 Customization

### Change Donation Amounts
Edit `src/index.ts` and modify the widget HTML:
```javascript
// Change default amounts
<button class="amount-button active" data-amount="5">
    <div class="amount-value">$5</div>
    <div class="amount-label-text">Basic Support</div>
</button>
```

### Change Styling
Modify the CSS in the widget HTML to match your brand colors.

### Add Custom Endpoints
Add new API endpoints in `src/index.ts`:
```javascript
app.post("/api/custom-service", (req, res) => {
  // Your custom service logic
});
```

## 📡 API Endpoints

- `GET /api/health` - Health check
- `GET /widget` - Widget HTML
- `GET /widget.js` - Widget JavaScript
- `POST /api/donate` - Standard donation
- `POST /api/donate/custom` - Custom amount donation
- `POST /api/pay/service` - AI agent service payment
- `POST /api/service` - Use paid service

## 🤖 AI Agent Integration

AI agents can use these endpoints to pay for services:

```javascript
// 1. Request service payment
const response = await fetch('https://yourusername.github.io/x402/api/pay/service', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    serviceRequest: 'Generate a weather report',
    amount: 0.1
  })
});

const { sessionId } = await response.json();

// 2. Use the service
const result = await fetch('https://yourusername.github.io/x402/api/service', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sessionId: sessionId,
    request: 'Generate a weather report'
  })
});
```

## 🚀 Deployment Options

### GitHub Pages (Recommended)
- Fork this repository
- Configure your wallet address
- Enable GitHub Pages in settings
- Your server will be available at `https://yourusername.github.io/x402`

### Railway
- Connect your GitHub repository to Railway
- Set environment variables
- Deploy automatically

### Vercel
- Import your GitHub repository to Vercel
- Configure environment variables
- Deploy with one click

## 🔒 Security

- **Production**: Use HTTPS (automatic with GitHub Pages)
- **Environment Variables**: Never commit sensitive data
- **Rate Limiting**: Consider adding rate limiting for production
- **Database**: Replace in-memory storage with Redis/PostgreSQL

## 📚 Learn More

- [x402 Protocol Documentation](https://x402.org/)
- [Coinbase Developer Platform](https://www.coinbase.com/developer-platform)
- [Base Network](https://base.org/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Made with ❤️ for the crypto community** 