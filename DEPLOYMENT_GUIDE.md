# 🚀 Deployment Guide - x402 Universal Payment Server

## ⚠️ Important: GitHub Pages Limitation

**GitHub Pages can only serve static files, not Node.js servers.** Your payment server needs to run on a platform that supports Node.js.

## 🎯 Recommended Deployment Options

### 1. Render (Recommended - Free)

Render provides free Node.js hosting with automatic deployments.

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

### 2. Vercel (Free)

Vercel offers excellent Node.js support with automatic deployments.

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

### 3. Railway (Paid - $5/month)

Railway offers excellent Node.js hosting with automatic deployments.

#### Quick Deploy:
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
   ```
6. Deploy!

#### Command Line:
```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

### 4. DigitalOcean App Platform

1. Go to [DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform)
2. Connect your GitHub repository
3. Configure environment variables
4. Deploy!

## 🔧 Environment Variables

Set these in your deployment platform:

```bash
ADDRESS=0xYourWalletAddressHere
NETWORK=base-sepolia
FACILITATOR_URL=https://x402.org/facilitator
PORT=4021
NODE_ENV=production
```

## 🌐 After Deployment

Once deployed, your server will be available at:
- `https://your-app.onrender.com` (Render)
- `https://your-app.vercel.app` (Vercel)
- `https://your-app.railway.app` (Railway - paid)

## 📋 Widget Embed Code

After deployment, use your server URL:

```html
<script src="https://your-app.onrender.com/widget.js"></script>
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

### Render (Recommended):
```bash
# Connect via web interface
# No CLI required
# Go to render.com and connect your GitHub repo
```

### Vercel:
```bash
npm install -g vercel
vercel
```

### Railway (Paid):
```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

## 🔍 Testing Your Deployment

After deployment, test your endpoints:

```bash
# Health check
curl https://your-app.onrender.com/api/health

# Widget
curl https://your-app.onrender.com/widget

# Test donation (will require wallet)
curl -X POST https://your-app.onrender.com/api/donate \
  -H "Content-Type: application/json" \
  -d '{"amount": 1}'
```

## 💡 Pro Tips

1. **Use Render** for the easiest free deployment experience
2. **Set up automatic deployments** on git push
3. **Test locally first** with `npm run dev`
4. **Monitor your logs** for any issues
5. **Use environment variables** for configuration

## 🆘 Troubleshooting

### Common Issues:

1. **Port binding error**: Set `PORT` environment variable
2. **Wallet connection fails**: Check network configuration
3. **Payment fails**: Verify facilitator URL and network
4. **CORS errors**: Widget embedding should work with proper CORS setup

### Debug Commands:

```bash
# Check server logs (Render)
# View logs in Render dashboard

# Check server logs (Vercel)
vercel logs

# Check server logs (Railway)
railway logs

# View environment variables
# Check in your platform's dashboard
```

## 🎉 Success!

Once deployed, your payment server will be live and ready to accept real crypto payments via the x402 protocol! 