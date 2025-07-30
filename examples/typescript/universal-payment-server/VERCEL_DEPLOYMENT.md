# 🚀 Vercel Deployment Guide

This project is optimized for **Vercel deployment** - the perfect free hosting solution for payment servers!

## 🏗️ **Project Structure**

```
your-vercel-app/
├── api/                    # Backend API routes (serverless functions)
│   ├── donate.js          # POST /api/donate
│   ├── pay-service.js     # POST /api/pay/service
│   ├── widget.js          # GET /api/widget
│   └── health.js          # GET /api/health
├── public/                # Static files
│   ├── index.html         # Demo page
│   └── widget.js          # Widget script
├── vercel.json           # Vercel configuration
└── package.json          # Dependencies
```

## 🚀 **Quick Deploy to Vercel**

### **Option 1: Deploy from GitHub (Recommended)**

1. **Fork this repository** to your GitHub account
2. Go to [Vercel.com](https://vercel.com) and sign up with GitHub
3. Click **"New Project"**
4. Import your forked repository
5. Configure environment variables:
   ```
   ADDRESS=0xYourWalletAddressHere
   NETWORK=base-sepolia
   FACILITATOR_URL=https://x402.org/facilitator
   NODE_ENV=production
   ```
6. Click **"Deploy"**

### **Option 2: Deploy from CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Set environment variables
vercel env add ADDRESS
vercel env add NETWORK
vercel env add FACILITATOR_URL
```

## ⚙️ **Environment Variables**

Set these in your Vercel dashboard:

| Variable | Value | Description |
|----------|-------|-------------|
| `ADDRESS` | `0xYourWalletAddressHere` | Your wallet address for receiving payments |
| `NETWORK` | `base-sepolia` | Blockchain network (base-sepolia for testing) |
| `FACILITATOR_URL` | `https://x402.org/facilitator` | x402 facilitator URL |
| `NODE_ENV` | `production` | Environment mode |

## 🌐 **After Deployment**

Your app will be available at:
- **Demo Page**: `https://your-app.vercel.app`
- **Widget**: `https://your-app.vercel.app/api/widget`
- **API**: `https://your-app.vercel.app/api/donate`

## 📋 **Widget Embed Code**

After deployment, use this code on any website:

```html
<script src="https://your-app.vercel.app/widget.js"></script>
<div id="x402-widget"></div>
```

## 🔌 **API Endpoints**

### **Health Check**
```bash
curl https://your-app.vercel.app/api/health
```

### **Widget Page**
```bash
curl https://your-app.vercel.app/api/widget
```

### **Donation Payment**
```bash
curl -X POST https://your-app.vercel.app/api/donate \
  -H "Content-Type: application/json" \
  -d '{"amount": 5}'
```

### **AI Agent Payment**
```bash
curl -X POST https://your-app.vercel.app/api/pay-service \
  -H "Content-Type: application/json" \
  -d '{
    "serviceId": "ai-service",
    "amount": 10,
    "walletAddress": "0xYourWalletAddressHere"
  }'
```

## 🎯 **Usage Options**

### **1. Full Demo Site**
- Visit `https://your-app.vercel.app`
- Shows the complete demo with embedded widget
- Perfect for showcasing your payment server

### **2. API Only**
- Use only the backend endpoints
- Embed widget on your own website
- Perfect for integration into existing sites

### **3. Widget Only**
- Use `https://your-app.vercel.app/widget.js`
- Embed on any website
- Minimal integration required

## 💡 **Benefits of Vercel**

- ✅ **Always-on** - No cold starts for active projects
- ✅ **Free tier** - Perfect for payment servers
- ✅ **Automatic deployments** - Deploy on git push
- ✅ **Global CDN** - Fast worldwide access
- ✅ **Serverless functions** - Pay only for usage
- ✅ **Custom domains** - Use your own domain
- ✅ **Environment variables** - Secure configuration

## 🔧 **Customization**

### **Update Wallet Address**
1. Go to Vercel dashboard
2. Navigate to Settings → Environment Variables
3. Update the `ADDRESS` variable
4. Redeploy automatically

### **Change Network**
1. Update `NETWORK` environment variable
2. Supported networks: `base-sepolia`, `base-mainnet`

### **Custom Styling**
1. Edit `public/widget.js` for widget styling
2. Edit `public/index.html` for demo page
3. Deploy changes automatically

## 🆘 **Troubleshooting**

### **Common Issues:**

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

### **Debug Commands:**

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

## 🎉 **Success!**

Once deployed, your payment server will be:
- ✅ **Live and accessible** at `https://your-app.vercel.app`
- ✅ **Ready for real payments** via x402 protocol
- ✅ **Widget embeddable** on any website
- ✅ **API accessible** for AI agent integration
- ✅ **Completely free** to host and use

**Your universal payment server is now live!** 🚀 