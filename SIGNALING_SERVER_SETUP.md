# 🚀 StreamVerse Signaling Server Setup Guide

## 🚨 Important: Why Do You Need a Signaling Server?

**StreamVerse requires a signaling server for multi-user functionality.** Here's why:

- **WebRTC Coordination**: WebRTC needs to exchange connection information (offers, answers, ICE candidates) between peers
- **Peer Discovery**: Users need to find each other in the same session/room
- **Session Management**: Managing who joins/leaves sessions
- **NAT Traversal**: Helping peers behind firewalls connect to each other

**Without a signaling server, you can only see your own video stream.**

## 🎯 Quick Setup Options

### Option 1: Use Our Hosted Service (Recommended for Production)

**No setup required!** StreamVerse uses our hosted signaling service by default:

```typescript
// Automatically uses hosted service
const client = createStreamShareClient({ userId: "alice" });
```

✅ **Pros:**

- Zero configuration
- Production-ready
- Global CDN
- Automatic scaling

❌ **Cons:**

- Requires internet connection
- Less control over infrastructure

### Option 2: Use the Example Signal Server (Best for Development)

This repository includes a ready-to-use signaling server:

```bash
# From the project root
npm run server
# Starts on ws://localhost:8787
```

Then configure your client:

```typescript
const client = createStreamShareClient({
  userId: "alice",
  signalingUrl: "ws://localhost:8787",
});
```

✅ **Pros:**

- Works offline
- Full control
- Easy debugging
- No external dependencies

❌ **Cons:**

- Manual setup required
- Not production-ready

### Option 3: Clone Our Standalone Signal Server

For more advanced development or custom deployments:

```bash
# Clone the standalone server
git clone https://github.com/shivamgupta1319/streamverse.git
cd signal-server
npm install
npm start
# Server runs on ws://localhost:8787
```

## 🔧 Development Workflow

### Multi-User Testing Setup

1. **Terminal 1 - Start the signaling server:**

   ```bash
   cd /path/to/streamverse-project
   npm run server
   ```

2. **Terminal 2 - Start your app:**

   ```bash
   npm run demo
   # or your own development server
   ```

3. **Test multi-user:**
   - Open `http://localhost:5173` in multiple browser tabs
   - Use different usernames (Alice, Bob, Charlie)
   - Join the same room name
   - Start streaming to see each other!

### Client Configuration

```typescript
// For local development
const client = createStreamShareClient({
  userId: "your-username",
  signalingUrl: "ws://localhost:8787", // Local server
});

// For production
const client = createStreamShareClient({
  userId: "your-username",
  // Uses hosted service automatically
});
```

## 🚀 Production Deployment

### Self-Hosted Signaling Server

For production control, deploy your own signaling server:

1. **Deploy the server:**

   ```bash
   # Clone and prepare
   git clone https://github.com/shivamgupta1319/streamverse.git
   cd signal-server
   npm install

   # Deploy to your cloud provider:
   # - AWS EC2/ECS/Lambda
   # - Google Cloud Run/Compute Engine
   # - Azure Container Instances
   # - DigitalOcean Droplets
   # - Heroku, Railway, etc.
   ```

2. **Configure for production:**

   ```javascript
   // Add to your server
   const port = process.env.PORT || 8787;
   const wss = new WebSocketServer({
     port,
     // Add SSL/TLS configuration for wss://
   });
   ```

3. **Update your client:**
   ```typescript
   const client = createStreamShareClient({
     userId: "alice",
     signalingUrl: "wss://your-domain.com", // Your deployed server
   });
   ```

### Production Considerations

- **HTTPS/WSS**: Use secure WebSocket connections (wss://) in production
- **SSL Certificate**: Required for HTTPS domains
- **CORS**: Configure properly for your domain
- **Scaling**: Consider load balancing for high traffic
- **Monitoring**: Add logging and health checks
- **Security**: Implement authentication if needed

## 🛠️ Server Implementation Details

The signaling server handles these WebSocket messages:

```javascript
// User subscription
{ type: 'subscribe', userId: 'alice' }

// Session management
{ type: 'start-session', sessionId: 'room-123' }
{ type: 'join-session', sessionId: 'room-123' }

// WebRTC signaling
{ type: 'offer', targetUserId: 'bob', offer: {...} }
{ type: 'answer', targetUserId: 'alice', answer: {...} }
{ type: 'ice', targetUserId: 'bob', candidate: {...} }

// Cleanup
{ type: 'leave-session' }
```

## 🐛 Troubleshooting

### "No Remote Streams Received"

**Problem:** You can see your own video but not others.

**Solutions:**

1. ✅ **Check signaling server is running:**

   ```bash
   # Should show server running
   npm run server
   ```

2. ✅ **Verify client configuration:**

   ```typescript
   // Make sure signalingUrl matches your server
   const client = createStreamShareClient({
     userId: "alice",
     signalingUrl: "ws://localhost:8787", // Check this URL
   });
   ```

3. ✅ **Check browser console for errors:**
   - Open Developer Tools → Console
   - Look for WebSocket connection errors
   - Verify no CORS issues

### "WebSocket Connection Failed"

**Problem:** Client can't connect to signaling server.

**Solutions:**

1. ✅ **Server not running:** Start with `npm run server`
2. ✅ **Wrong URL:** Check `signalingUrl` matches server address
3. ✅ **Firewall:** Ensure port 8787 is not blocked
4. ✅ **HTTPS/HTTP mismatch:** Use `ws://` for HTTP, `wss://` for HTTPS

### "Users Can't See Each Other"

**Problem:** Multiple users join but don't see each other's streams.

**Solutions:**

1. ✅ **Same session ID:** Ensure all users join the same room name
2. ✅ **Different user IDs:** Each user needs a unique userId
3. ✅ **Publish streams:** Make sure users call `publishStream()`
4. ✅ **Event listeners:** Register `onRemoteStream` before joining

## 📚 Additional Resources

- **📖 [StreamVerse Documentation](https://streamverse.dev)**
- **🎮 [Demo Source Code](./examples/basic-demo/)**
- **🔧 [Signal Server Source](./examples/signal-server/)**
- **💬 [Community Support](https://discord.gg/streamverse)**
- **🐛 [Report Issues](https://github.com/shivamgupta1319/streamverse/issues)**

---

**🎯 Ready to build real-time communication apps?** Choose your setup option above and start coding!
