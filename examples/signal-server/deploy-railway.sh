#!/bin/bash

# 🚀 StreamVerse Signaling Server Railway Deployment Script

echo "🚀 Deploying StreamVerse Signaling Server to Railway..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}📋 Prerequisites:${NC}"
echo "1. Railway account (railway.app)"
echo "2. GitHub repository connected"
echo "3. Railway CLI installed (optional)"

echo ""
echo -e "${YELLOW}🚀 Quick Deployment Steps:${NC}"
echo "1. Go to railway.app and create new project"
echo "2. Select 'Deploy from GitHub repo'"
echo "3. Choose this repository"
echo "4. Select 'examples/signal-server' as source directory"
echo "5. Deploy!"

echo ""
echo -e "${GREEN}✅ After Deployment:${NC}"
echo "1. Copy your Railway app URL"
echo "2. Convert to WebSocket: wss://your-app.railway.app"
echo "3. Update demo configuration with new URL"
echo "4. Redeploy demo"

echo ""
echo -e "${BLUE}🔧 Manual CLI Deployment (if you have Railway CLI):${NC}"
echo "railway login"
echo "railway init"
echo "railway up"

echo ""
echo -e "${GREEN}🎯 Your signaling server will be live and ready for WebRTC connections!${NC}" 