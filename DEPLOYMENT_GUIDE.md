# 🚀 Deployment Guide - x402 Universal Payment Server

## ⚠️ Important: Free Hosting Options for Payment Servers

**You can run a payment server for free!** Here are the best free options that work well for payment processing.

### Why Always-On Matters:
- ✅ **Instant payment processing** - No cold start delays
- ✅ **Reliable webhook handling** - Payment confirmations arrive immediately
- ✅ **Widget responsiveness** - Users expect instant wallet connections
- ✅ **Professional service** - Payment systems should never be "sleeping"

### Free Options for Payment Servers:
- 🟢 **Vercel** (Free) - Always on, perfect for payments
- 🟢 **Netlify Functions** (Free) - Serverless, always available
- 🟡 **Render** (Free) - 15-minute timeout, but can be kept alive
- 🟡 **Railway** (Free trial) - 7-day free trial available

## 🎯 Recommended Deployment Options

### 1. Vercel (Recommended - Free)

Vercel offers excellent free hosting that's perfect for payment servers.

#### Quick Deploy:
1. Go to [Vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import your repository
4. Add environment variables in the dashboard:
   ```
   ADDRESS=0xYourWalletAddressHere
   NETWORK=base-sepolia
   FACILITATOR_URL=https://x402.org/facilitator
   NODE_ENV=production
   ```
5. Deploy!

#### Command Line:
```bash
npm install -g vercel
vercel
```

### 2. Netlify Functions (Free)

Netlify offers serverless functions that are always available.

1. Go to [Netlify.com](https://netlify.com)
2. Sign up and connect GitHub
3. Deploy your functions
4. Configure environment variables

### 3. Render (Free - with keep-alive)

Render offers free hosting with a workaround for the 15-minute timeout.

#### Quick Deploy:
1. Go to [Render.com](https://render.com)
2. Sign up with GitHub
3. Click "New" → "Web Service"
4. Connect your GitHub repository
5. Configure settings:
   - **Name**: `x402-payment-server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add environment variables:
   ```
   ADDRESS=0xYourWalletAddressHere
   NETWORK=base-sepolia
   FACILITATOR_URL=https://x402.org/facilitator
   PORT=10000
   NODE_ENV=production
   ```
7. Deploy!

#### Keep-Alive Workaround:
Add this to your `package.json` scripts to keep the server alive:
```json
"keep-alive": "curl -s https://your-app.onrender.com/api/health > /dev/null"
```

### 4. Railway (Free Trial - 7 days)

Railway offers a 7-day free trial for testing.

1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Add environment variables:
   ```
   ADDRESS=0xYourWalletAddressHere
   NETWORK=base-sepolia
   FACILITATOR_URL=https://x402.org/facilitator
   PORT=4021
   NODE_ENV=production
   ```
6. Deploy!

## 🔧 Environment Variables

Set these in your deployment platform:

```bash
ADDRESS=0xYourWalletAddressHere
NETWORK=base-sepolia
FACILITATOR_URL=https://x402.org/facilitator
NODE_ENV=production
```

## 🌐 After Deployment

Once deployed, your server will be available at:
- `https://your-app.vercel.app` (Vercel - recommended)
- `https://your-app.onrender.com` (Render - with keep-alive)
- `https://your-app.netlify.app` (Netlify - functions)

## 📋 Widget Embed Code

After deployment, use your server URL:

```html
<script src="https://your-app.vercel.app/widget.js"></script>
<div id="x402-widget"></div>
```

## 🎯 GitHub Pages Usage

GitHub Pages can still be used for:
- ✅ **Documentation and guides**
- ✅ **Static demo pages**
- ✅ **Configuration examples**
- ✅ **Widget embed instructions**

But **NOT** for the actual payment server.

## 🚀 Quick Deploy Commands

### Vercel (Recommended - Free):
```bash
npm install -g vercel
vercel
```

### Render (Free - with keep-alive):
```bash
# Connect via web interface
# No CLI required
# Go to render.com and connect your GitHub repo
```

### Netlify (Free):
```bash
# Connect via web interface
# No CLI required
# Go to netlify.com and connect your GitHub repo
```

## 🔍 Testing Your Deployment

After deployment, test your endpoints:

```bash
# Health check
curl https://your-app.vercel.app/api/health

# Widget
curl https://your-app.vercel.app/widget

# Test donation (will require wallet)
curl -X POST https://your-app.vercel.app/api/donate \
  -H "Content-Type: application/json" \
  -d '{"amount": 1}'
```

## 💡 Pro Tips

1. **Use Vercel** for the easiest free deployment experience
2. **Set up automatic deployments** on git push
3. **Test locally first** with `npm run dev`
4. **Monitor your logs** for any issues
5. **Use environment variables** for configuration
6. **Keep Render alive** with periodic health checks

## 🆘 Troubleshooting

### Common Issues:

1. **Port binding error**: Set `PORT` environment variable
2. **Wallet connection fails**: Check network configuration
3. **Payment fails**: Verify facilitator URL and network
4. **CORS errors**: Widget embedding should work with proper CORS setup

### Debug Commands:

```bash
# Check server logs (Vercel)
vercel logs

# Check server logs (Render)
# View logs in Render dashboard

# Check server logs (Netlify)
# View logs in Netlify dashboard

# View environment variables
# Check in your platform's dashboard
```

## 🎉 Success!

Once deployed, your payment server will be live and ready to accept real crypto payments via the x402 protocol - **completely free!** 