# 🚀 StreamVerse Signaling Server Deployment Guide

## 🚨 **Current Status: SIGNALING SERVER NOT DEPLOYED**

Your StreamVerse demo is successfully deployed, but the **signaling server is still only local**. This is why you're getting "signaling server connection failed" errors.

## 🌐 **Deployment Options (Choose One)**

### **Option 1: Railway (Recommended - Free & Easy)**

Railway is perfect for WebSocket servers and has a generous free tier.

#### **Step 1: Create Railway Account**

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create a new project

#### **Step 2: Deploy from GitHub**

1. **Connect your repository** to Railway
2. **Select the signal-server directory** as the source
3. **Railway will auto-detect** it's a Node.js app
4. **Deploy automatically**

#### **Step 3: Get Your URL**

- Railway will provide a URL like: `https://your-app.railway.app`
- **Convert to WebSocket**: `wss://your-app.railway.app`

### **Option 2: Render (Alternative - Free)**

#### **Step 1: Create Render Account**

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Create new **Web Service**

#### **Step 2: Configure Service**

- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment**: Node.js

#### **Step 3: Deploy**

- Connect your repository
- Select the `examples/signal-server` directory
- Deploy

### **Option 3: Heroku (Requires Credit Card)**

#### **Step 1: Install Heroku CLI**

```bash
npm install -g heroku
heroku login
```

#### **Step 2: Deploy**

```bash
cd examples/signal-server
heroku create your-signal-server
git push heroku main
```

## 🔧 **Update Demo Configuration**

Once your signaling server is deployed, update the demo to use it:

### **Method 1: Environment Variable (Recommended)**

Create a `.env` file in `examples/basic-demo/`:

```env
VITE_SIGNALING_URL=wss://your-signal-server.railway.app
```

### **Method 2: Direct Code Update**

Update `examples/basic-demo/main.js`:

```javascript
// Change this line:
signalingUrl: "ws://localhost:8787";

// To your deployed server:
signalingUrl: "wss://your-signal-server.railway.app";
```

## 🚀 **Quick Railway Deployment (Recommended)**

### **Step 1: Prepare Repository**

```bash
cd examples/signal-server
git add .
git commit -m "Add Railway deployment config"
git push origin main
```

### **Step 2: Deploy on Railway**

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Select `examples/signal-server` directory
6. Deploy

### **Step 3: Get WebSocket URL**

- Railway will show your app URL
- Convert to WebSocket: `wss://your-app.railway.app`

## 🧪 **Test Your Deployment**

### **Health Check**

Visit: `https://your-app.railway.app/health`
Should show: `{"status":"healthy","connections":0,"sessions":0}`

### **WebSocket Test**

Use a WebSocket testing tool or update your demo with the new URL.

## 🔄 **Redeploy Demo with New Signaling Server**

After deploying the signaling server:

```bash
# Update the demo configuration
cd examples/basic-demo

# Edit main.js to use your deployed signaling server
# Then redeploy:
npm run deploy
```

## 🚨 **Common Issues & Solutions**

### **WebSocket Connection Failed**

- Ensure you're using `wss://` (secure) for production
- Check if your hosting provider supports WebSockets
- Verify the server is running and accessible

### **CORS Issues**

- The signaling server handles WebSocket connections
- No CORS configuration needed for WebSocket

### **Port Issues**

- Railway/Render automatically assign ports
- Use `process.env.PORT` in your server code

## 📊 **Monitoring Your Signaling Server**

### **Railway Dashboard**

- Real-time logs
- Performance metrics
- Automatic restarts

### **Health Check Endpoint**

- `/health` shows current status
- Monitor connections and sessions
- Track uptime and performance

## 🎯 **Expected Results**

After successful deployment:

1. ✅ **Demo loads** without signaling errors
2. ✅ **Users can join rooms** successfully
3. ✅ **Video/audio streams** work between users
4. ✅ **Multi-user functionality** works across different devices
5. ✅ **Real-time communication** established

## 🔗 **Next Steps**

1. **Deploy signaling server** using Railway (recommended)
2. **Update demo configuration** with new WebSocket URL
3. **Test multi-user functionality** with deployed server
4. **Share your live demo** with the community

## 📞 **Need Help?**

- **Railway Docs**: [railway.app/docs](https://railway.app/docs)
- **Render Docs**: [render.com/docs](https://render.com/docs)
- **GitHub Issues**: [github.com/shivamgupta1319/streamverse/issues](https://github.com/shivamgupta1319/streamverse/issues)

---

**Ready to deploy your signaling server? Choose Railway for the easiest deployment! 🚀**
