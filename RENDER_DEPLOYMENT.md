# 🚀 StreamVerse Signaling Server - Render Deployment Guide

## 🎯 **Deploy to Render (Free & Easy)**

Since Railway deployment had issues, let's use **Render** instead. Render is excellent for WebSocket servers and has a generous free tier.

## 📋 **Prerequisites**

1. **GitHub Account** - Your code must be on GitHub
2. **Render Account** - Sign up at [render.com](https://render.com)
3. **Updated Code** - All changes committed and pushed to GitHub

## 🚀 **Step-by-Step Deployment**

### **Step 1: Prepare Your Repository**

First, commit and push all the new files:

```bash
# Go to your project root
cd /path/to/your/streamverse/project

# Add all new files
git add .

# Commit changes
git commit -m "Add Render deployment configuration for signaling server"

# Push to GitHub
git push origin main
```

### **Step 2: Create Render Account**

1. Go to [render.com](https://render.com)
2. Click "Get Started for Free"
3. Sign up with your GitHub account
4. Authorize Render to access your repositories

### **Step 3: Deploy Your Signaling Server**

1. **Click "New +"** in your Render dashboard
2. **Select "Web Service"**
3. **Connect your GitHub repository**
4. **Configure the service:**

   - **Name**: `streamverse-signal-server`
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `examples/signal-server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

5. **Click "Create Web Service"**

### **Step 4: Wait for Deployment**

- Render will automatically build and deploy your service
- This usually takes 2-5 minutes
- You'll see build logs in real-time

### **Step 5: Get Your WebSocket URL**

Once deployed, Render will show:

- **URL**: `https://your-app-name.onrender.com`
- **Convert to WebSocket**: `wss://your-app-name.onrender.com`

## 🧪 **Test Your Deployment**

### **Health Check**

Visit: `https://your-app-name.onrender.com/health`
Should show: `{"status":"healthy","connections":0,"sessions":0}`

### **WebSocket Test**

Use a WebSocket testing tool or update your demo with the new URL.

## 🔧 **Update Demo Configuration**

After successful deployment, update your demo to use the new signaling server:

### **Method 1: Environment Variable (Recommended)**

Create `.env` file in `examples/basic-demo/`:

```env
VITE_SIGNALING_URL=wss://your-app-name.onrender.com
```

### **Method 2: Direct Code Update**

Update `examples/basic-demo/main.js`:

```javascript
// Change this line:
signalingUrl: "ws://localhost:8787";

// To your deployed server:
signalingUrl: "wss://your-app-name.onrender.com";
```

## 🔄 **Redeploy Demo with New Signaling Server**

```bash
# Go to demo directory
cd examples/basic-demo

# Deploy with new configuration
npm run deploy
```

## 🚨 **Common Issues & Solutions**

### **Build Fails**

- Ensure `package.json` has correct scripts
- Check that all dependencies are in `package.json`
- Verify Node.js version compatibility

### **WebSocket Connection Failed**

- Ensure you're using `wss://` (secure) for production
- Check if the service is running (green status in Render)
- Verify the health check endpoint works

### **Service Won't Start**

- Check the start command: `npm start`
- Ensure `server.js` exists and is correct
- Check Render logs for error messages

## 📊 **Monitor Your Service**

### **Render Dashboard**

- Real-time logs
- Performance metrics
- Automatic restarts
- Uptime monitoring

### **Health Check Endpoint**

- `/health` shows current status
- Monitor connections and sessions
- Track uptime and performance

## 🎯 **Expected Results**

After successful deployment:

1. ✅ **Service shows "Live" status** in Render dashboard
2. ✅ **Health check endpoint** responds correctly
3. ✅ **Demo connects** without signaling errors
4. ✅ **Users can join rooms** successfully
5. ✅ **Video/audio streams** work between users
6. ✅ **Multi-user functionality** works across different devices

## 🔗 **Quick Commands**

```bash
# Test local server first
cd examples/signal-server
npm run test

# Run deployment guide
./deploy-render.sh

# After deployment, update demo and redeploy
cd ../basic-demo
npm run deploy
```

## 📞 **Need Help?**

- **Render Docs**: [render.com/docs](https://render.com/docs)
- **Render Support**: [render.com/support](https://render.com/support)
- **GitHub Issues**: [github.com/shivamgupta1319/streamverse/issues](https://github.com/shivamgupta1319/streamverse/issues)

## 🎉 **Success Checklist**

- [ ] Repository updated and pushed to GitHub
- [ ] Render account created and connected
- [ ] Web service deployed successfully
- [ ] Health check endpoint working
- [ ] Demo updated with new WebSocket URL
- [ ] Demo redeployed and working
- [ ] Multi-user functionality tested

---

**Ready to deploy to Render? Follow the steps above and your signaling server will be live! 🚀**

**Your StreamVerse demo will then work perfectly with real-time video calls! 🎥**
