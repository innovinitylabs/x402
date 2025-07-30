# 🚀 Deployment Guide

This guide will help you deploy the x402 Universal Payment Server to various platforms.

## 📋 Prerequisites

- Node.js 18+ installed
- A crypto wallet address (EVM compatible)
- Git repository access

## 🔧 Local Development

1. **Clone and setup**:
   ```bash
   git clone <your-repo-url>
   cd x402-universal-payment-server
   npm install
   ```

2. **Configure environment**:
   ```bash
   # Create .env file
   echo "ADDRESS=0xYourWalletAddress" > .env
   echo "FACILITATOR_URL=https://x402.org/facilitator" >> .env
   echo "NETWORK=base-sepolia" >> .env
   echo "PORT=4021" >> .env
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Test the server**:
   ```bash
   curl http://localhost:4021/api/health
   ```

## 🌐 Production Deployment

### Option 1: Railway (Recommended)

1. **Create Railway account** at [railway.app](https://railway.app)

2. **Connect your repository**:
   - Go to Railway dashboard
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure environment variables**:
   ```env
   ADDRESS=0xYourWalletAddress
   FACILITATOR_URL=https://x402.org/facilitator
   NETWORK=base-sepolia
   PORT=4021
   ```

4. **Deploy**:
   - Railway will automatically detect the Node.js app
   - It will install dependencies and start the server
   - Your app will be available at `https://your-app-name.railway.app`

### Option 2: Vercel

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Create vercel.json**:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "dist/index.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "dist/index.js"
       }
     ]
   }
   ```

3. **Build and deploy**:
   ```bash
   npm run build
   vercel --prod
   ```

### Option 3: Heroku

1. **Install Heroku CLI**:
   ```bash
   # macOS
   brew tap heroku/brew && brew install heroku
   ```

2. **Create Procfile**:
   ```
   web: node dist/index.js
   ```

3. **Deploy**:
   ```bash
   heroku create your-app-name
   heroku config:set ADDRESS=0xYourWalletAddress
   heroku config:set FACILITATOR_URL=https://x402.org/facilitator
   heroku config:set NETWORK=base-sepolia
   git push heroku main
   ```

### Option 4: DigitalOcean App Platform

1. **Create DigitalOcean account**

2. **Connect repository**:
   - Go to DigitalOcean App Platform
   - Click "Create App"
   - Connect your GitHub repository

3. **Configure build settings**:
   - Build Command: `npm run build`
   - Run Command: `npm start`
   - Environment: Node.js

4. **Set environment variables**:
   - `ADDRESS`: Your wallet address
   - `FACILITATOR_URL`: https://x402.org/facilitator
   - `NETWORK`: base-sepolia

## 🔒 Security Considerations

### Environment Variables
- Never commit `.env` files to version control
- Use platform-specific secret management
- Rotate keys regularly

### HTTPS
- Always use HTTPS in production
- Configure SSL certificates
- Use secure headers

### Rate Limiting
```javascript
// Add to your server
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
```

### Database (Production)
Replace in-memory storage with a real database:

```javascript
// Example with Redis
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

// Replace Map with Redis operations
const paymentSessions = {
  set: (id, session) => redis.setex(id, 300, JSON.stringify(session)),
  get: (id) => redis.get(id).then(data => data ? JSON.parse(data) : null),
  delete: (id) => redis.del(id)
};
```

## 📊 Monitoring

### Health Checks
```bash
# Add to your deployment
curl https://your-domain.com/api/health
```

### Logging
```javascript
// Add structured logging
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm test
      - name: Deploy to Railway
        uses: bervProject/railway-deploy@v1.0.0
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: ${{ secrets.RAILWAY_SERVICE }}
```

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### Integration Tests
```bash
# Test all endpoints
curl -X POST http://localhost:4021/api/donate \
  -H "Content-Type: application/json" \
  -d '{"amount": 1, "walletAddress": "0xTest"}'
```

## 📈 Performance Optimization

### Caching
```javascript
// Add caching headers
app.use((req, res, next) => {
  res.set('Cache-Control', 'public, max-age=300');
  next();
});
```

### Compression
```javascript
import compression from 'compression';
app.use(compression());
```

## 🚨 Troubleshooting

### Common Issues

1. **Port already in use**:
   ```bash
   lsof -ti:4021 | xargs kill -9
   ```

2. **Environment variables not loading**:
   ```bash
   # Check if .env is loaded
   console.log(process.env.ADDRESS);
   ```

3. **CORS issues**:
   ```javascript
   // Update CORS configuration
   app.use(cors({
     origin: ['https://yourdomain.com', 'http://localhost:3000'],
     credentials: true
   }));
   ```

### Debug Mode
```bash
# Run with debug logging
DEBUG=* npm run dev
```

## 📞 Support

- **GitHub Issues**: Report bugs and feature requests
- **Discord**: Join the x402 community
- **Documentation**: [x402.org](https://x402.org/)

---

**Happy deploying! 🚀** 