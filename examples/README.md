# 🎮 StreamVerse Examples & Demo

This directory contains working examples and demos of StreamVerse in action. Perfect for testing, learning, and showcasing the package's capabilities.

## 🌐 **Live Demo - Try It Now!**

**Experience StreamVerse in action:** [**Live Demo**](https://streamverse-r39103o0y-shivam-guptas-projects-b7b5484e.vercel.app)

- ✅ **Multi-user video calls** - Test with multiple browser tabs
- ✅ **Screen sharing** - Real-time screen presentation
- ✅ **Audio streaming** - Voice-only communication
- ✅ **Zero setup** - Just open and start testing!

> **💡 Pro Tip:** Open the demo in multiple browser tabs with different names to test multi-user functionality!

## 🚀 Quick Start

### 1. Start Local Development

```bash
# Start the signaling server (required for WebRTC)
npm run server

# In another terminal, start the demo
npm run demo
```

### 2. Test Multi-User Functionality

1. Open `http://localhost:3000` in multiple browser tabs
2. Use different names (Alice, Bob, Charlie, etc.)
3. Join the same room name
4. Start streaming and see each other!

## 📁 Examples Overview

### `basic-demo/` - Complete Feature Demo

- **Video calls** with HD quality
- **Screen sharing** for presentations
- **Audio-only** mode for voice calls
- **Multi-user** support (test with multiple tabs)
- **Responsive design** for all devices
- **Beautiful UI** with modern design

### `signal-server/` - Local Signaling Server

- **WebSocket-based** signaling for WebRTC
- **Room management** for multiple sessions
- **Peer coordination** for connection establishment
- **Local development** and testing

## 🎯 Demo Features

### ✨ What You Can Test

1. **Join Rooms** - Create or join existing video rooms
2. **Video Streaming** - Share your camera with others
3. **Screen Sharing** - Present your screen in real-time
4. **Audio Streaming** - Voice-only communication
5. **Multi-User** - See multiple participants simultaneously
6. **Responsive UI** - Works on desktop, tablet, and mobile

### 🎮 Interactive Elements

- **Real-time status updates** with beautiful animations
- **Loading states** for better user experience
- **Error handling** with helpful messages
- **Keyboard shortcuts** (Ctrl+Enter, Ctrl+Esc)
- **Feature highlights** showcasing capabilities

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

```bash
# Deploy with one command
npm run deploy:demo

# Or manually
cd examples/basic-demo
npm run deploy
```

### Option 2: Netlify

```bash
npm run deploy:demo:netlify
```

### Option 3: GitHub Pages

```bash
cd examples/basic-demo
npm run build
# Then push dist/ folder to GitHub Pages
```

## 🔧 Configuration

### Environment Variables

Create `.env` file in `examples/basic-demo/`:

```env
# For production signaling server
VITE_SIGNALING_URL=wss://your-signaling-server.com

# For local development (default)
VITE_SIGNALING_URL=ws://localhost:8787
```

### Custom Signaling Server

Update `examples/basic-demo/main.js`:

```javascript
const signalingUrl =
  import.meta.env.VITE_SIGNALING_URL || "ws://localhost:8787";

client = createStreamShareClient({
  userId,
  signalingUrl,
});
```

## 🚨 Important Notes

### Signaling Server Requirement

- **WebRTC requires a signaling server** to establish connections
- **Local development**: Use `npm run server` for testing
- **Production**: Deploy your own server or use hosted service

### Browser Compatibility

- **Modern browsers** with WebRTC support
- **HTTPS required** for camera/microphone access
- **Chrome, Firefox, Safari, Edge** supported

### Media Permissions

- **Camera access** required for video streaming
- **Microphone access** required for audio
- **Screen sharing** requires user interaction

## 🧪 Testing Checklist

### Local Testing

- [ ] Signaling server running (`npm run server`)
- [ ] Demo accessible at `http://localhost:3000`
- [ ] Camera/microphone permissions granted
- [ ] Can join rooms and start streaming
- [ ] Multiple tabs can connect to same room

### Production Testing

- [ ] Demo deployed and accessible
- [ ] Signaling server deployed and accessible
- [ ] HTTPS enabled for media access
- [ ] Cross-browser compatibility verified
- [ ] Mobile responsiveness tested

## 🐛 Troubleshooting

### Common Issues

1. **"Cannot connect to signaling server"**

   - Ensure `npm run server` is running
   - Check port 8787 is not blocked
   - Verify WebSocket URL format

2. **"Camera/microphone access denied"**

   - Use HTTPS in production
   - Check browser permissions
   - Ensure user interaction before media access

3. **"Screen sharing not supported"**
   - Use modern browsers
   - Check browser permissions
   - Ensure user interaction

### Debug Mode

Enable console logging in `examples/basic-demo/main.js`:

```javascript
// Add this for detailed logging
console.log("StreamVerse client created:", client);
console.log("Joining room:", roomId);
```

## 📱 Mobile Testing

### Responsive Design

- **Mobile-first** approach
- **Touch-friendly** controls
- **Adaptive layouts** for all screen sizes
- **Performance optimized** for mobile devices

### Mobile Considerations

- **Battery usage** optimization
- **Data usage** management
- **Touch gestures** support
- **Orientation changes** handled

## 🔄 Continuous Integration

### GitHub Actions

Automate deployment with `.github/workflows/deploy-demo.yml`:

```yaml
name: Deploy Demo
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm ci
      - run: npm run deploy:demo
```

## 📊 Analytics & Monitoring

### Built-in Monitoring

- **Performance metrics** tracking
- **Error reporting** and logging
- **User interaction** analytics
- **Connection quality** monitoring

### Custom Analytics

Add Google Analytics or other tracking services for user insights.

## 🎉 Success Metrics

### Demo Goals

- **User engagement** with interactive features
- **Feature discovery** through guided testing
- **Package adoption** after positive experience
- **Community feedback** and improvement suggestions

### Key Performance Indicators

- **Page load time** < 3 seconds
- **Connection establishment** < 5 seconds
- **Stream quality** HD (720p+) maintained
- **User satisfaction** through feedback collection

## 🔗 Related Resources

- **[Main Package](../packages/streamverse/README.md)** - Complete API documentation
- **[Deployment Guide](../DEPLOYMENT.md)** - Comprehensive deployment instructions
- **[Signal Server Setup](../SIGNALING_SERVER_SETUP.md)** - Signaling server configuration
- **[GitHub Repository](https://github.com/shivamgupta1319/streamverse)** - Source code and issues

---

**Ready to showcase StreamVerse? 🚀**

Deploy your demo and let users experience the power of zero-config WebRTC before they install your package!
