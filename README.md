# StreamVerse — Zero-Config Real-Time Video Calls and Streaming

🚀 **TypeScript SDK for effortless WebRTC-based real-time communication**

[![NPM Version](https://img.shields.io/npm/v/streamverse.svg)](https://www.npmjs.com/package/streamverse)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Try%20Now-green.svg)](https://streamverse-r39103o0y-shivam-guptas-projects-b7b5484e.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

StreamVerse makes building video calls, voice calls, live streaming, and screen sharing as simple as a few lines of code. **For multi-user functionality, a signaling server is required** — we provide both a hosted service and a local setup option.

## 🌟 What is StreamVerse?

StreamVerse is a production-ready TypeScript SDK that abstracts away WebRTC complexity, signaling servers, and connection management. Whether you're building a video chat app, live streaming platform, or collaborative tool with screen sharing, StreamVerse handles the heavy lifting so you can focus on your user experience.

### ✨ Key Features

- 🎯 **Zero Configuration** — Works out of the box with hosted signaling service
- 📡 **Simple API** — Subscribe by userId, publish streams, handle remote streams
- 🎥 **Multi-Stream Support** — Camera, microphone, screen sharing, custom streams
- ⚡ **Auto-Scaling** — P2P for small groups, SFU for larger audiences
- 🔄 **Bi-Directional** — Any participant can send and receive multiple streams
- 🛠 **TypeScript First** — Full type safety and excellent developer experience
- 📱 **Cross-Platform** — Works in browsers, React Native, and Electron

## 📦 Installation

```bash
npm install streamverse
```

## 🚀 Quick Start

### 🌐 **Live Demo - Try Before You Install!**

**Experience StreamVerse in action:** [**Live Demo**](https://streamverse-r39103o0y-shivam-guptas-projects-b7b5484e.vercel.app)

- ✅ **Multi-user video calls** - Test with multiple browser tabs
- ✅ **Screen sharing** - Real-time screen presentation
- ✅ **Audio streaming** - Voice-only communication
- ✅ **Zero setup** - Just open and start testing!

> **💡 Pro Tip:** Open the demo in multiple browser tabs with different names to test multi-user functionality!

```typescript
import { createStreamShareClient } from "streamverse";

// Create client (uses hosted service by default)
const client = createStreamShareClient({ userId: "alice" });

// Subscribe and join room
await client.subscribe("alice");
await client.startSession("my-room");

// Publish your camera
const stream = await navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true,
});
await client.publishStream(stream, "camera");

// Handle remote streams
client.onRemoteStream(({ userId, stream }) => {
  console.log(`Received stream from ${userId}`);
  // Add to your UI
});
```

## 🏗️ Monorepo Structure

This repository contains:

- **`packages/streamverse/`** — The main StreamVerse SDK package
- **`examples/basic-demo/`** — Complete demo showcasing all features
- **`examples/signal-server/`** — Local signaling server for development/testing

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+ (recommend using `nvm`)
- NPM 9+

### Getting Started

1. **Clone and install:**

   ```bash
   git clone <repository-url>
   cd npm-package
   npm install
   ```

2. **Build the SDK:**

   ```bash
   npm run build
   ```

3. **Run with local signaling server:**

   ```bash
   # Terminal 1: Start local signaling server
   npm run server

   # Terminal 2: Start demo app
   npm run demo
   ```

4. **Test multi-user:**
   - Open `http://localhost:5173` in multiple browser tabs
   - Use different names (Alice, Bob, etc.)
   - Join the same room and start streaming!

## 🚨 Important: Signaling Server Requirement

**For multi-user functionality, StreamVerse requires a signaling server to coordinate WebRTC connections between peers.**

### Option 1: Use Our Hosted Service (Recommended)

```typescript
// Uses hosted service automatically (default)
const client = createStreamShareClient({ userId: "alice" });
```

### Option 2: Run Local Signaling Server

For development or custom deployments:

```bash
# Clone our signal server
git clone https://github.com/shivamgupta1319/streamverse.git
cd signal-server
npm install
npm start
# Server runs on ws://localhost:8787
```

Then configure your client:

```typescript
const client = createStreamShareClient({
  userId: "alice",
  signalingUrl: "ws://localhost:8787",
});
```

### Option 3: Use the Example Signal Server

This repository includes a ready-to-use signaling server:

```bash
# From the monorepo root
npm run server
# Starts signal server on ws://localhost:8787
```

The demo automatically uses this local server when available.

## 🎯 Use Cases

### 📞 Video Calls

Build Zoom-like video calling with just a few lines of code:

```typescript
const client = createStreamShareClient({ userId: "user123" });
await client.subscribe("user123");
await client.startSession("call-room");
```

### 🎥 Live Streaming

Create live streaming platforms where hosts broadcast to audiences:

```typescript
// Host publishes stream
await client.publishStream(cameraStream, "camera");

// Viewers automatically receive the stream
client.onRemoteStream(({ userId, stream }) => {
  // Display host's stream
});
```

### 🖥️ Screen Sharing

Add screen sharing to any application:

```typescript
const screenStream = await navigator.mediaDevices.getDisplayMedia({
  video: true,
  audio: true,
});
await client.publishStream(screenStream, "screen");
```

### 🎮 Interactive Experiences

Build collaborative tools, virtual events, gaming platforms, and more.

## 🏛️ Architecture

StreamVerse automatically chooses the best architecture for your use case:

- **🔗 Direct P2P** (2-4 users): Ultra-low latency for small groups
- **🌐 SFU (Selective Forwarding Unit)** (5+ users): Scalable for larger audiences
- **☁️ Hosted Infrastructure**: Zero-config experience with our managed service

**Note:** All architectures require a signaling server to establish initial connections.

## 📚 Documentation

- **📖 [API Reference](packages/streamverse/README.md)** — Complete API documentation
- **🎮 [Demo Guide](examples/README.md)** — How to run and test examples
- **🚀 [Signaling Server Setup](SIGNALING_SERVER_SETUP.md)** — Complete signaling server guide
- **📦 [Publishing Guide](PUBLISHING.md)** — How to publish to NPM

## 🧪 Testing

```bash
# Run all tests
npm test

# Test with local signaling server
npm run server  # Terminal 1: Signal server
npm run demo    # Terminal 2: Demo application

# Test package contents
cd packages/streamverse
npm pack --dry-run
```

## 🚀 Production Deployment

### Hosted Service (Easiest)

Use our managed signaling service (default):

```typescript
// No configuration needed - uses hosted service
const client = createStreamShareClient({ userId: "alice" });
```

### Self-Hosted Signaling Server

For production control:

1. **Deploy the signal server:**

   ```bash
   git clone https://github.com/shivamgupta1319/streamverse.git
   cd signal-server
   npm install
   # Deploy to your cloud provider (AWS, GCP, Azure, etc.)
   ```

2. **Configure your client:**
   ```typescript
   const client = createStreamShareClient({
     userId: "alice",
     signalingUrl: "wss://your-signal-server.com",
   });
   ```

## 📈 Package Stats

- **Size:** ~10KB minified + gzipped
- **Dependencies:** Minimal (only `mediasoup-client`)
- **TypeScript:** Full type definitions included
- **Formats:** ESM, CommonJS, and TypeScript definitions
- **Browser Support:** Modern browsers with WebRTC support

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](packages/streamverse/LICENSE) for details.

## 🔗 Links

- 📦 [NPM Package](https://www.npmjs.com/package/streamverse)
- 🐙 [GitHub Repository](https://github.com/shivamgupta1319/streamverse)
- 🌐 [Documentation](https://streamverse.dev)
- 🚀 [Signal Server](https://github.com/shivamgupta1319/streamverse)
- 💬 [Community Discord](https://discord.gg/streamverse)
- 🐛 [Issue Tracker](https://github.com/shivamgupta1319/streamverse/issues)

---

**StreamVerse** — Making real-time communication accessible to every developer 🚀
