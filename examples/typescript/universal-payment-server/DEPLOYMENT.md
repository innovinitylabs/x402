# 🚀 Deployment Guide

This example is optimized for **Vercel deployment** - the perfect free hosting solution for payment servers!

## Quick Deploy

### Option 1: Deploy from GitHub (Recommended)

1. **Fork this repository** to your GitHub account
2. Go to [Vercel.com](https://vercel.com) and sign up with GitHub
3. Click **"New Project"** and import your forked repository
4. Navigate to `examples/typescript/universal-payment-server/`
5. Configure environment variables:
   ```
   ADDRESS=0xYourWalletAddressHere
   NETWORK=base-sepolia
   FACILITATOR_URL=https://x402.org/facilitator
   NODE_ENV=production
   ```
6. Click **"Deploy"**

### Option 2: Deploy from CLI

```bash
# Navigate to the example directory
cd examples/typescript/universal-payment-server

# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables
vercel env add ADDRESS
vercel env add NETWORK
vercel env add FACILITATOR_URL
```

## Environment Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `ADDRESS` | `0xYourWalletAddressHere` | Your wallet address for receiving payments |
| `NETWORK` | `base-sepolia` | Blockchain network (base-sepolia for testing) |
| `FACILITATOR_URL` | `https://x402.org/facilitator` | x402 facilitator URL |
| `NODE_ENV` | `production` | Environment mode |

## After Deployment

Your app will be available at:
- **Demo Page**: `https://your-app.vercel.app`
- **Widget**: `https://your-app.vercel.app/api/widget`
- **API**: `https://your-app.vercel.app/api/donate`

## Widget Embed Code

```html
<script src="https://your-app.vercel.app/widget.js"></script>
<div id="x402-widget"></div>
```

## Customization

1. **Update wallet address** in Vercel environment variables
2. **Customize widget** by editing `public/widget.js`
3. **Modify demo page** by editing `public/index.html`
4. **Add new endpoints** in the `api/` folder

## Benefits

- ✅ **Always-on** - No cold starts for active projects
- ✅ **Free tier** - Perfect for payment servers
- ✅ **Automatic deployments** - Deploy on git push
- ✅ **Global CDN** - Fast worldwide access
- ✅ **Serverless functions** - Pay only for usage

## Learn More

- [x402 Protocol](https://x402.org)
- [Vercel Documentation](https://vercel.com/docs)
- [Base Sepolia Testnet](https://docs.base.org/guides/deploy-smart-contracts)

---

**This example demonstrates how to build a universal payment server using the x402 protocol.** 