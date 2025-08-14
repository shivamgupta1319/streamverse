#!/bin/bash

# 🚀 StreamVerse Demo Deployment Script
# This script automates the deployment of your StreamVerse demo

set -e

echo "🚀 StreamVerse Demo Deployment"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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
if [ ! -f "package.json" ] || [ ! -d "examples/basic-demo" ]; then
    print_error "Please run this script from the root of the StreamVerse project"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js 18+ is required. Current version: $(node --version)"
    exit 1
fi

print_success "Node.js version: $(node --version)"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI not found. Installing..."
    npm install -g vercel
    print_success "Vercel CLI installed"
else
    print_success "Vercel CLI found: $(vercel --version)"
fi

# Build the StreamVerse package
print_status "Building StreamVerse package..."
npm run build
print_success "Package built successfully"

# Navigate to demo directory
cd examples/basic-demo

# Install dependencies
print_status "Installing demo dependencies..."
npm install
print_success "Dependencies installed"

# Build the demo
print_status "Building demo..."
npm run build
print_success "Demo built successfully"

# Check if user is logged into Vercel
if ! vercel whoami &> /dev/null; then
    print_warning "Not logged into Vercel. Please login..."
    vercel login
fi

# Deploy to Vercel
print_status "Deploying to Vercel..."
print_warning "This will open Vercel in your browser. Follow the prompts to complete deployment."

# Deploy
if npm run deploy; then
    print_success "Demo deployed successfully! 🎉"
    echo ""
    echo "Next steps:"
    echo "1. Copy the deployment URL from Vercel"
    echo "2. Update your README.md with the demo link"
    echo "3. Share the demo with your community!"
    echo ""
    echo "For signaling server deployment, see DEPLOYMENT.md"
else
    print_error "Deployment failed. Please check the error messages above."
    exit 1
fi 