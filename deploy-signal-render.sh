#!/bin/bash

# 🚀 StreamVerse Signaling Server - One-Click Render Deployment

set -e

echo "🚀 StreamVerse Signaling Server - Render Deployment"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "examples/signal-server" ]; then
    print_error "Please run this script from the root of the StreamVerse project"
    exit 1
fi

# Check if git is available
if ! command -v git &> /dev/null; then
    print_error "Git is not installed. Please install Git first."
    exit 1
fi

# Check git status
print_status "Checking git status..."
if [ -n "$(git status --porcelain)" ]; then
    print_warning "You have uncommitted changes. Committing them now..."
    git add .
    git commit -m "Prepare for Render deployment - $(date)"
    print_success "Changes committed"
else
    print_success "No uncommitted changes"
fi

# Check if we're on main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    print_warning "You're not on the main branch. Current branch: $CURRENT_BRANCH"
    read -p "Do you want to continue? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_error "Deployment cancelled"
        exit 1
    fi
fi

# Push to GitHub
print_status "Pushing to GitHub..."
if git push origin main; then
    print_success "Code pushed to GitHub successfully"
else
    print_error "Failed to push to GitHub. Please check your git configuration."
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Repository is ready for Render deployment!${NC}"
echo ""
echo -e "${BLUE}🚀 Next Steps:${NC}"
echo "1. Go to https://render.com and sign up with GitHub"
echo "2. Click 'New +' → 'Web Service'"
echo "3. Connect your GitHub repository"
echo "4. Configure:"
echo "   - Name: streamverse-signal-server"
echo "   - Environment: Node"
echo "   - Root Directory: examples/signal-server"
echo "   - Build Command: npm install"
echo "   - Start Command: npm start"
echo "5. Click 'Create Web Service'"
echo ""
echo -e "${YELLOW}💡 After deployment, you'll get a URL like:${NC}"
echo "   https://your-app-name.onrender.com"
echo "   Convert to WebSocket: wss://your-app-name.onrender.com"
echo ""
echo -e "${GREEN}🎯 Then update your demo and redeploy!${NC}"
echo ""
echo -e "${BLUE}📚 Full guide available in: RENDER_DEPLOYMENT.md${NC}" 