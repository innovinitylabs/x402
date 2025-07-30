# 🚀 GitHub Pages Deployment Guide

## Quick Deploy to GitHub Pages

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Add universal payment server with GitHub Pages support"
git push origin main
```

### Step 2: Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **GitHub Actions**
5. Your site will deploy automatically

### Step 3: Access Your Live Site
Your widget will be available at:
```
https://yourusername.github.io/x402
```

## 🎯 Testing Your Deployment

### Test the Widget
1. Open your live site: `https://yourusername.github.io/x402`
2. Try the donation widget
3. Verify it works correctly

### Test API Endpoints
```bash
# Health check
curl https://yourusername.github.io/x402/api/health

# Widget endpoints
curl https://yourusername.github.io/x402/widget
curl https://yourusername.github.io/x402/widget.js
```

### Embed on Any Website
```html
<script src="https://yourusername.github.io/x402/widget.js"></script>
<div id="x402-widget"></div>
```

## 🔧 Customization

### Change Wallet Address
Edit `.env` file:
```env
ADDRESS=0xYourNewWalletAddress
```

### Customize Widget
Edit `src/index.ts` and modify the widget HTML section.

### Update Styling
Modify the CSS in the widget HTML to match your brand.

## 🚨 Important Notes

1. **Environment Variables**: GitHub Pages doesn't support server-side environment variables. For production, consider using Railway, Vercel, or Heroku.

2. **Static Files**: GitHub Pages serves static files only. The server functionality will work for the widget, but API endpoints need a proper server.

3. **HTTPS**: GitHub Pages automatically provides HTTPS.

## 🎉 Success!

Once deployed, you'll have:
- ✅ Live widget at `https://yourusername.github.io/x402`
- ✅ Embeddable widget for any website
- ✅ API endpoints for AI agent payments
- ✅ Beautiful demo page

---

**Ready to deploy! 🚀** 