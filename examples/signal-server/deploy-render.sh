#!/bin/bash

# 🚀 StreamVerse Signaling Server Render Deployment Script

echo "🚀 Deploying StreamVerse Signaling Server to Render..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}📋 Prerequisites:${NC}"
echo "1. Render account (render.com)"
echo "2. GitHub repository connected"
echo "3. Git repository with latest changes"

echo ""
echo -e "${YELLOW}🚀 Quick Deployment Steps:${NC}"
echo "1. Go to render.com and sign up with GitHub"
echo "2. Click 'New +' → 'Web Service'"
echo "3. Connect your GitHub repository"
echo "4. Configure the service:"
echo "   - Name: streamverse-signal-server"
echo "   - Environment: Node"
echo "   - Build Command: npm install"
echo "   - Start Command: npm start"
echo "5. Click 'Create Web Service'"

echo ""
echo -e "${GREEN}✅ After Deployment:${NC}"
echo "1. Copy your Render app URL"
echo "2. Convert to WebSocket: wss://your-app.onrender.com"
echo "3. Update demo configuration with new URL"
echo "4. Redeploy demo"

echo ""
echo -e "${BLUE}🔧 Manual CLI Deployment (if you have Render CLI):${NC}"
echo "npm install -g @render/cli"
echo "render login"
echo "render deploy"

echo ""
echo -e "${GREEN}🎯 Your signaling server will be live and ready for WebRTC connections!${NC}"
echo ""
echo -e "${YELLOW}💡 Pro Tip: Render automatically assigns HTTPS and handles WebSocket upgrades${NC}" 