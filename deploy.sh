#!/bin/bash

# x402 Universal Payment Server - Quick Deploy Script
# This script helps you quickly deploy your payment server

set -e

echo "🚀 x402 Universal Payment Server - Quick Deploy"
echo "================================================"

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# Your wallet address to receive payments
ADDRESS=0xYourWalletAddressHere

# Network configuration
NETWORK=base-sepolia

# Facilitator URL
FACILITATOR_URL=https://x402.org/facilitator

# Server port
PORT=4021
EOF
    echo "✅ Created .env file. Please update your wallet address!"
    echo "💡 Edit .env and replace 0xYourWalletAddressHere with your wallet address"
fi

# Check if config.js exists
if [ ! -f config.js ]; then
    echo "📝 Creating config.js file..."
    cp config-template.js config.js
    echo "✅ Created config.js file. You can customize it later!"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if server is already running
if pgrep -f "tsx src/index.ts" > /dev/null; then
    echo "🛑 Stopping existing server..."
    pkill -f "tsx src/index.ts"
    sleep 2
fi

# Start the server
echo "🚀 Starting server..."
npm run dev &

# Wait a moment for server to start
sleep 3

# Check if server is running
if curl -s http://localhost:4021/api/health > /dev/null; then
    echo "✅ Server is running successfully!"
    echo ""
    echo "🌐 Server URLs:"
    echo "   - Health Check: http://localhost:4021/api/health"
    echo "   - Widget Demo: http://localhost:4021/widget"
    echo "   - Demo Page: http://localhost:4021"
    echo ""
    echo "📋 Widget Embed Code:"
    echo "   <script src=\"http://localhost:4021/widget.js\"></script>"
    echo "   <div id=\"x402-widget\"></div>"
    echo ""
    echo "💡 To stop the server, run: pkill -f 'tsx src/index.ts'"
    echo "💡 To view logs, run: tail -f logs/server.log"
else
    echo "❌ Server failed to start. Check the logs above."
    exit 1
fi

echo ""
echo "🎉 Deployment complete! Your payment server is ready."
echo "📚 For more information, see README.md" 