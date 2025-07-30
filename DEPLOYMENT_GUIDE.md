# 🚀 Deployment Guide - x402 Universal Payment Server

## ⚠️ Important: Always-On Hosting Required

**For a payment receiving system, your server must be always online.** Free tiers with inactivity timeouts (like Render's 15-minute timeout) are not suitable for payment servers.

### Why Always-On Matters:
- ✅ **Instant payment processing** - No cold start delays
- ✅ **Reliable webhook handling** - Payment confirmations arrive immediately
- ✅ **Widget responsiveness** - Users expect instant wallet connections
- ✅ **Professional service** - Payment systems should never be "sleeping"

### Recommended for Payment Servers:
- 🟢 **Railway** ($5/month) - Always on, perfect for payments
- 🟢 **DigitalOcean App Platform** - Enterprise-grade reliability
- 🟡 **Vercel** (Free) - May have cold starts but generally reliable
- 🔴 **Render** (Free) - 15-minute timeout, not suitable for payments

## 🎯 Recommended Deployment Options

### 1. Railway (Recommended - $5/month)

Railway offers always-on hosting perfect for payment servers.

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
   NODE_ENV=production
   ```
6. Deploy!

#### Command Line:
```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

### 2. DigitalOcean App Platform (Free tier available)

DigitalOcean offers reliable always-on hosting.

1. Go to [DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform)
2. Connect your GitHub repository
3. Configure environment variables
4. Deploy!

### 3. Vercel (Free - but with limitations)

Vercel offers excellent Node.js support but may have cold starts.

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

### 4. Render (Free - 15min timeout)

⚠️ **Warning**: Render free tier has 15-minute inactivity timeout, not suitable for payment servers.



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
- `https://your-app.railway.app` (Railway - always on)
- `https://your-app.vercel.app` (Vercel - may have cold starts)
- `https://your-app.onrender.com` (Render - 15min timeout)

## 📋 Widget Embed Code

After deployment, use your server URL:

```html
<script src="https://your-app.railway.app/widget.js"></script>
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

### Railway (Recommended - Always On):
```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

### Vercel (Free - may have cold starts):
```bash
npm install -g vercel
vercel
```

### Render (Free - 15min timeout):
```bash
# Connect via web interface
# No CLI required
# Go to render.com and connect your GitHub repo
```

## 🔍 Testing Your Deployment

After deployment, test your endpoints:

```bash
# Health check
curl https://your-app.railway.app/api/health

# Widget
curl https://your-app.railway.app/widget

# Test donation (will require wallet)
curl -X POST https://your-app.railway.app/api/donate \
  -H "Content-Type: application/json" \
  -d '{"amount": 1}'
```

## 💡 Pro Tips

1. **Use Railway** for always-on hosting perfect for payment servers
2. **Set up automatic deployments** on git push
3. **Test locally first** with `npm run dev`
4. **Monitor your logs** for any issues
5. **Use environment variables** for configuration
6. **Consider DigitalOcean** for enterprise-grade reliability

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