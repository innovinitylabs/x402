# Universal Payment Server Example

A complete, production-ready payment server that accepts crypto donations via the x402 protocol. This example demonstrates how to build a universal payment server that can handle both widget donations and AI agent payments.

## 🚀 Features

- ✅ **Real crypto payments** via x402 protocol
- ✅ **Embeddable widget** for any website
- ✅ **AI agent payment API** for automated transactions
- ✅ **Vercel deployment** - Free hosting
- ✅ **Wallet integration** - MetaMask, Coinbase Wallet
- ✅ **Base Sepolia support** - Testnet ready
- ✅ **Customizable** - Easy to configure for your needs

## 🏗️ Architecture

```
universal-payment-server/
├── api/                    # Backend API routes (serverless functions)
│   ├── donate.js          # POST /api/donate
│   ├── pay-service.js     # POST /api/pay/service
│   ├── widget.js          # GET /api/widget
│   └── health.js          # GET /api/health
├── public/                # Static files
│   ├── index.html         # Demo page
│   └── widget.js          # Widget script
├── vercel.json           # Vercel configuration
├── package.json          # Dependencies
└── config-template.js    # Template for customization
```

## 🚀 Quick Start

### 1. Fork and Deploy

1. **Fork this repository** to your GitHub account
2. Go to [Vercel.com](https://vercel.com) and sign up with GitHub
3. Click **"New Project"** and import your forked repository
4. Configure environment variables:
   ```
   ADDRESS=0xYourWalletAddressHere
   NETWORK=base-sepolia
   FACILITATOR_URL=https://x402.org/facilitator
   NODE_ENV=production
   ```
5. Click **"Deploy"**

### 2. Customize for Your Wallet

1. **Update wallet address** in Vercel environment variables
2. **Test the deployment** at `https://your-app.vercel.app`
3. **Embed the widget** on your website

## 📋 Widget Embed Code

After deployment, use this code on any website:

```html
<script src="https://your-app.vercel.app/widget.js"></script>
<div id="x402-widget"></div>
```

## 🔌 API Endpoints

### Health Check
```bash
curl https://your-app.vercel.app/api/health
```

### Widget Page
```bash
curl https://your-app.vercel.app/api/widget
```

### Donation Payment
```bash
curl -X POST https://your-app.vercel.app/api/donate \
  -H "Content-Type: application/json" \
  -d '{"amount": 5}'
```

### AI Agent Payment
```bash
curl -X POST https://your-app.vercel.app/api/pay-service \
  -H "Content-Type: application/json" \
  -d '{
    "serviceId": "ai-service",
    "amount": 10,
    "walletAddress": "0xYourWalletAddressHere"
  }'
```

## 🎯 Usage Options

### 1. Full Demo Site
- Visit `https://your-app.vercel.app`
- Shows the complete demo with embedded widget
- Perfect for showcasing your payment server

### 2. API Only
- Use only the backend endpoints
- Embed widget on your own website
- Perfect for integration into existing sites

### 3. Widget Only
- Use `https://your-app.vercel.app/widget.js`
- Embed on any website
- Minimal integration required

## ⚙️ Configuration

### Environment Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `ADDRESS` | `0xYourWalletAddressHere` | Your wallet address for receiving payments |
| `NETWORK` | `base-sepolia` | Blockchain network (base-sepolia for testing) |
| `FACILITATOR_URL` | `https://x402.org/facilitator` | x402 facilitator URL |
| `NODE_ENV` | `production` | Environment mode |

### Customization

#### Update Wallet Address
1. Go to Vercel dashboard
2. Navigate to Settings → Environment Variables
3. Update the `ADDRESS` variable
4. Redeploy automatically

#### Change Network
1. Update `NETWORK` environment variable
2. Supported networks: `base-sepolia`, `base-mainnet`

#### Custom Styling
1. Edit `public/widget.js` for widget styling
2. Edit `public/index.html` for demo page
3. Deploy changes automatically

## 🛠️ Development

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Test endpoints
node test-server.js
```

### Project Structure

- **`api/`** - Serverless functions for Vercel
- **`public/`** - Static files served by Vercel
- **`vercel.json`** - Vercel configuration
- **`package.json`** - Dependencies and scripts

## 🔧 Customization Guide

### Adding New Payment Types

1. Create new API endpoint in `api/`
2. Add payment middleware configuration
3. Update widget if needed
4. Test with real wallet

### Styling the Widget

1. Edit `public/widget.js`
2. Modify CSS styles
3. Test on different websites
4. Deploy changes

### Adding New Networks

1. Update network configuration
2. Test wallet connection
3. Verify facilitator support
4. Update documentation

## 🆘 Troubleshooting

### Common Issues

1. **"Module not found" errors**
   - Ensure all dependencies are in `package.json`
   - Vercel will install them automatically

2. **Environment variables not working**
   - Check Vercel dashboard → Settings → Environment Variables
   - Redeploy after adding variables

3. **Widget not loading**
   - Check browser console for errors
   - Verify the widget.js file is accessible

4. **Payment failures**
   - Ensure wallet is connected to Base Sepolia
   - Check facilitator URL is correct
   - Verify wallet has sufficient funds

### Debug Commands

```bash
# Check deployment status
vercel ls

# View logs
vercel logs

# Redeploy
vercel --prod

# Check environment variables
vercel env ls
```

## 🎉 Benefits

- ✅ **Always-on** - No cold starts for active projects
- ✅ **Free tier** - Perfect for payment servers
- ✅ **Automatic deployments** - Deploy on git push
- ✅ **Global CDN** - Fast worldwide access
- ✅ **Serverless functions** - Pay only for usage
- ✅ **Custom domains** - Use your own domain
- ✅ **Environment variables** - Secure configuration

## 📚 Learn More

- [x402 Protocol Documentation](https://x402.org)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [Base Sepolia Testnet](https://docs.base.org/guides/deploy-smart-contracts)
- [MetaMask Integration](https://docs.metamask.io/guide/)

## 🤝 Contributing

This is an example for the x402 protocol. To contribute:

1. Fork the main x402 repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

---

**Built with ❤️ for the x402 community** 