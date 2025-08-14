#!/bin/bash

# StreamVerse Demo Deployment Script
# This script prepares the demo for deployment by switching to the deployment package.json

echo "🚀 Preparing StreamVerse Demo for Deployment..."

# Backup original package.json
cp package.json package.dev.json

# Use deployment package.json
cp package.deploy.json package.json

# Install production dependencies
echo "📦 Installing production dependencies..."
npm install

# Build the demo
echo "🔨 Building demo..."
npm run build

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

# Restore original package.json
echo "🔄 Restoring development package.json..."
cp package.dev.json package.json

echo "✅ Deployment complete!"
echo "📱 Your demo is now live!" 