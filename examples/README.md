# StreamVerse Examples

This folder contains examples demonstrating how to use the StreamVerse package.

## 📁 Available Examples

### `basic-demo/`

A complete, production-ready demo showcasing all StreamVerse features:

- ✅ Multi-user video calls
- ✅ Screen sharing
- ✅ Audio-only streaming
- ✅ Beautiful, responsive UI
- ✅ Error handling and status updates

### `signal-server/`

A minimal WebSocket signaling server for development and testing. This server handles:

- User subscription and session management
- WebRTC signaling (offers, answers, ICE candidates)
- Peer discovery and connection coordination
- Session cleanup when users leave

## 🚨 Important: Signaling Server Requirement

**StreamVerse requires a signaling server for multi-user functionality.** The signaling server coordinates WebRTC connections between peers.

## 🚀 Quick Start

### For Multi-User Testing (Recommended)

1. **Start the signaling server:**

   ```bash
   # Terminal 1 - from project root
   npm run server
   ```

2. **Start the demo:**

   ```bash
   # Terminal 2 - from project root
   npm run demo
   ```

3. **Test multi-user:**
   - Open `http://localhost:5173` in multiple tabs
   - Use different names (Alice, Bob, etc.)
   - Join the same room name
   - Both should see each other's video!

The demo is configured to use the local signaling server (`ws://localhost:8787`) for multi-user testing.

## 🚨 Signaling Server Requirement

**Important:** StreamVerse requires a signaling server for multi-user functionality. The signaling server coordinates WebRTC connections between peers.

### Quick Setup Options:

1. **Use the included signal server (recommended for development):**

   ```bash
   npm run server  # Starts on ws://localhost:8787
   ```

2. **Clone our standalone signal server:**

   ```bash
   git clone https://github.com/shivamgupta1319/streamverse.git
   cd signal-server
   npm install
   npm start
   ```

3. **Use the hosted service (for production):**
   ```typescript
   // Default configuration uses hosted service
   const client = createStreamShareClient({ userId: "alice" });
   ```

### For Single-User Testing

1. **Start demo only:**

   ```bash
   npm run demo
   ```

2. **Note:** Without a signaling server, you'll only see your own video (no remote streams)

## 🎯 What You'll Learn

The basic demo shows you how to:

- Create a StreamVerse client with zero configuration
- Join/create rooms
- Handle different stream types (camera, screen, audio)
- Manage remote streams from other users
- Handle errors and connection states
- Build a complete video calling interface

## 💡 Usage in Your App

The demo code shows the complete StreamVerse API:

```javascript
import { createStreamShareClient } from "streamverse";

// Create client (uses hosted service by default)
const client = createStreamShareClient({ userId: "your-user-id" });

// Join a room
await client.subscribe("your-user-id");
await client.startSession("room-name");

// Start streaming
const stream = await navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true,
});
await client.publishStream(stream, "camera");

// Handle remote streams
client.onRemoteStream(({ userId, stream }) => {
  // Display remote user's video/audio
});
```

## 🔧 Local Development Setup

If you want to run your own signaling server for development:

1. **Option A: Use the included server:**

   ```bash
   cd examples/signal-server
   npm install
   npm start
   # Server runs on ws://localhost:8787
   ```

2. **Option B: Clone standalone server:**

   ```bash
   git clone https://github.com/shivamgupta1319/streamverse.git
   cd signal-server
   npm install
   npm start
   ```

3. **Configure your client to use local server:**
   ```javascript
   const client = createStreamShareClient({
     userId: "alice",
     signalingUrl: "ws://localhost:8787",
   });
   ```

## 🚀 Production Deployment

For production apps:

1. **Use hosted service (easiest):**

   ```javascript
   // Uses StreamVerse hosted signaling service
   const client = createStreamShareClient({ userId: "alice" });
   ```

2. **Deploy your own signaling server:**
   - Deploy the signal server to your cloud provider
   - Configure your client with your server URL
   - Ensure HTTPS/WSS for production

## 🔧 Customization

The basic demo is designed to be:

- **Easily customizable** - Modify the UI to match your brand
- **Production-ready** - Includes proper error handling and state management
- **Educational** - Well-commented code showing best practices

Feel free to copy and modify the demo code for your own projects!
