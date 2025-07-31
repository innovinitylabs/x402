# ⚡ Quick Start Guide

Get your x402 Universal Payment Server running in 5 minutes!

## 🚀 Immediate Setup

### 1. Start the Server
```bash
npm run dev
```

### 2. Test the Widget
Open `demo.html` in your browser to see the donation widget in action!

### 3. Embed on Your Website
Add this code to any website:
```html
<script src="http://localhost:4021/widget.js"></script>
<div id="x402-widget"></div>
```

## 🧪 Test Everything

Run the comprehensive test suite:
```bash
node test-server.js
```

## 📡 API Quick Reference

### Health Check
```bash
curl http://localhost:4021/api/health
```

### Make a Donation
```bash
curl -X POST http://localhost:4021/api/donate \
  -H "Content-Type: application/json" \
  -d '{"amount": 1, "walletAddress": "0x5e051c9106071baF1e4c087e3e06Fdd17396A433"}'
```

### AI Agent Payment
```bash
curl -X POST http://localhost:4021/api/pay/service \
  -H "Content-Type: application/json" \
  -d '{"serviceRequest": "Generate weather report", "amount": 0.1}'
```

## 🎯 What You Get

✅ **Widget Donations**: Beautiful donation widget for websites  
✅ **AI Agent Payments**: API endpoints for automated payments  
✅ **Session Management**: Track and validate payments  
✅ **CORS Enabled**: Works across different domains  
✅ **Production Ready**: Easy to deploy and scale  

## 🚀 Deploy to Production

1. **Railway** (Recommended):
   - Connect GitHub repo to Railway
   - Set environment variables
   - Deploy automatically

2. **Update Widget URL**:
   ```html
   <script src="https://your-app.railway.app/widget.js"></script>
   <div id="x402-widget"></div>
   ```

## 📞 Need Help?

- **Demo**: Open `demo.html`
- **Docs**: See `README.md`
- **Deploy**: See `DEPLOYMENT.md`
- **Test**: Run `node test-server.js`

---

**Your server is ready! Accept crypto payments instantly! 🎉** 