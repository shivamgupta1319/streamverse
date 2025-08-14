# StreamVerse

🚀 **Zero-Config Real-Time Video Calls and Streaming**

StreamVerse is a TypeScript SDK that makes real-time communication effortless. Build video calls, voice calls, live shows, and screen sharing with **zero server setup** for single-user testing, or use our hosted signaling service for multi-user functionality!

[![NPM Version](https://img.shields.io/npm/v/streamverse.svg)](https://www.npmjs.com/package/streamverse)
[![NPM Downloads](https://img.shields.io/npm/dm/streamverse.svg)](https://www.npmjs.com/package/streamverse)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

## ✨ Features

- 🎯 **Zero Configuration** — No server setup required, works out of the box
- 📡 **Simple API** — Subscribe by userId, publish streams, handle remote streams
- 🎥 **Multi-Stream Support** — Camera, microphone, screen sharing, custom media streams
- ⚡ **Auto-Scaling Architecture** — P2P for small groups, SFU for large audiences
- 🔄 **Bi-Directional Streaming** — Any user can send and receive multiple streams
- 🛠 **Developer-Friendly** — Focus on your UI, not WebRTC complexity
- 📱 **Cross-Platform** — Works in browsers, React Native, and Electron
- 🔒 **Type-Safe** — Full TypeScript support with comprehensive type definitions

## 📦 Installation

```bash
npm install streamverse
```

## 🚀 Quick Start

### Basic Video Call (Zero Config!)

```typescript
import { createStreamShareClient } from "streamverse";

// Create client - uses hosted signaling service automatically!
const client = createStreamShareClient({ userId: "alice" });

// Subscribe and join session
await client.subscribe("alice");
await client.startSession("my-room");

// Get user media and publish
const stream = await navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true,
});
await client.publishStream(stream, "camera");

// Handle remote streams
client.onRemoteStream(({ userId, stream }) => {
  const video = document.createElement("video");
  video.srcObject = stream;
  video.autoplay = true;
  video.muted = false; // Don't mute remote streams
  document.body.appendChild(video);
});

// Clean up when done
await client.close();
```

> **Note:** For multi-user functionality, StreamVerse requires a signaling server to coordinate WebRTC connections. By default, it uses our hosted service. For local development, see the [Local Development](#local-development) section.

### Screen Sharing

```typescript
// Get screen sharing stream
const screenStream = await navigator.mediaDevices.getDisplayMedia({
  video: true,
  audio: true,
});

// Publish screen stream
await client.publishStream(screenStream, "screen");

// Remote users will receive it via onRemoteStream callback
```

### Voice-Only Call

```typescript
// Audio-only stream
const audioStream = await navigator.mediaDevices.getUserMedia({
  video: false,
  audio: true,
});

await client.publishStream(audioStream, "microphone");
```

### Live Streaming (One-to-Many)

```typescript
// Host: Publish stream for many viewers
const client = createStreamShareClient({ userId: "host" });
await client.subscribe("host");
await client.startSession("live-show");

const stream = await navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true,
});
await client.publishStream(stream, "camera");

// Viewers: Join and receive host's stream
const viewer = createStreamShareClient({ userId: "viewer1" });
await viewer.subscribe("viewer1");
await viewer.startSession("live-show"); // Same session ID

viewer.onRemoteStream(({ userId, stream }) => {
  if (userId === "host") {
    // Display host's stream
    displayStream(stream);
  }
});
```

## 📚 API Reference

### `createStreamShareClient(options)`

Creates a new StreamVerse client instance.

**Options:**

- `userId` (string, required): Unique identifier for this user
- `signalingUrl` (string, optional): Custom signaling server URL

**Returns:** `StreamShareClient`

### `StreamShareClient` Methods

#### `subscribe(userId: string): Promise<void>`

Subscribe the client with the given user ID to start receiving session invitations and remote streams.

#### `startSession(sessionId: string): Promise<void>`

Start a new session or join an existing session with the given ID.

#### `publishStream(stream: MediaStream, kind?: StreamKind): Promise<void>`

Publish a media stream to all other participants in the session.

**Stream Kinds:**

- `'camera'` — Video from camera
- `'microphone'` — Audio from microphone
- `'screen'` — Screen sharing
- `'custom'` — Custom media stream

#### `onRemoteStream(callback: (event: RemoteStreamEvent) => void): () => void`

Listen for remote streams from other participants. Returns an unsubscribe function.

**RemoteStreamEvent:**

```typescript
{
  userId: string; // ID of the user who sent the stream
  stream: MediaStream; // The media stream
}
```

#### `close(): Promise<void>`

Clean up the client, close all connections, and stop all streams.

## 🏗️ Architecture

StreamVerse automatically chooses the best architecture for your use case:

- **🔗 Direct P2P** (2-4 users): Ultra-low latency for small groups
- **🌐 SFU (Selective Forwarding Unit)** (5+ users): Scalable for larger audiences
- **☁️ Hosted Infrastructure**: Zero-config experience with managed signaling service

## 🎯 Use Cases

### 📞 Video Conferencing

Build Zoom-like video calls with minimal code:

```typescript
const client = createStreamShareClient({ userId: "user123" });
await client.subscribe("user123");
await client.startSession("meeting-room");

// Publish camera + audio
const stream = await navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true,
});
await client.publishStream(stream, "camera");
```

### 🎥 Live Streaming Platforms

Create Twitch-like streaming experiences:

```typescript
// Streamer
await client.publishStream(gameStream, "screen");
await client.publishStream(cameraStream, "camera");

// Viewers join the same session and receive streams automatically
```

### 🖥️ Screen Sharing Apps

Add screen sharing to any application:

```typescript
const screenStream = await navigator.mediaDevices.getDisplayMedia({
  video: true,
});
await client.publishStream(screenStream, "screen");
```

### 🎮 Interactive Experiences

Perfect for:

- Virtual events and webinars
- Online gaming with voice chat
- Collaborative tools and whiteboards
- Customer support with video
- Educational platforms
- Social audio apps

## 🌟 Why StreamVerse?

**Without StreamVerse:**

```typescript
// 200+ lines of WebRTC boilerplate
const pc = new RTCPeerConnection(iceServers);
pc.onicecandidate = (event) => {
  /* signaling logic */
};
pc.ontrack = (event) => {
  /* handle remote streams */
};
// ... complex signaling server setup
// ... SDP offer/answer handling
// ... ICE candidate exchange
// ... connection state management
```

**With StreamVerse:**

```typescript
// 5 lines of code
const client = createStreamShareClient({ userId: "alice" });
await client.subscribe("alice");
await client.startSession("room");
await client.publishStream(stream, "camera");
client.onRemoteStream(({ stream }) => displayStream(stream));
```

## 🔧 Advanced Configuration

### Custom Signaling Server

```typescript
const client = createStreamShareClient({
  userId: "alice",
  signalingUrl: "wss://your-signaling-server.com",
});
```

### Local Development

For local development with multi-user testing:

```bash
# Option 1: Use our standalone signal server
git clone https://github.com/streamverse/signal-server.git
cd signal-server
npm install
npm start

# Option 2: Use the example from this repo
cd examples/signal-server
npm install
npm start
```

Then configure your client:

```typescript
const client = createStreamShareClient({
  userId: "alice",
  signalingUrl: "ws://localhost:8787",
});
```

### Error Handling

```typescript
try {
  await client.startSession("room");
} catch (error) {
  console.error("Failed to join session:", error);
}
```

### Connection Events

```typescript
// Monitor connection state
client.onConnectionStateChange((state) => {
  console.log("Connection state:", state);
});
```

## 📱 Framework Integration

### React

```jsx
import { useEffect, useState } from "react";
import { createStreamShareClient } from "streamverse";

function VideoCall({ userId, roomId }) {
  const [client, setClient] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState([]);

  useEffect(() => {
    const setupClient = async () => {
      const newClient = createStreamShareClient({ userId });

      newClient.onRemoteStream(({ userId, stream }) => {
        setRemoteStreams((prev) => [...prev, { userId, stream }]);
      });

      await newClient.subscribe(userId);
      await newClient.startSession(roomId);

      setClient(newClient);
    };

    setupClient();

    return () => {
      if (client) client.close();
    };
  }, [userId, roomId]);

  return (
    <div>
      {remoteStreams.map(({ userId, stream }) => (
        <VideoElement key={userId} stream={stream} />
      ))}
    </div>
  );
}
```

### Vue.js

```vue
<template>
  <div>
    <video
      v-for="stream in remoteStreams"
      :key="stream.userId"
      :srcObject="stream.stream"
      autoplay
    />
  </div>
</template>

<script>
import { createStreamShareClient } from "streamverse";

export default {
  data() {
    return {
      client: null,
      remoteStreams: [],
    };
  },
  async mounted() {
    this.client = createStreamShareClient({ userId: this.userId });

    this.client.onRemoteStream(({ userId, stream }) => {
      this.remoteStreams.push({ userId, stream });
    });

    await this.client.subscribe(this.userId);
    await this.client.startSession(this.roomId);
  },
  beforeUnmount() {
    if (this.client) this.client.close();
  },
};
</script>
```

## 🚀 Deployment

### Production Considerations

1. **HTTPS Required**: WebRTC requires HTTPS in production
2. **STUN/TURN Servers**: Configure for NAT traversal
3. **Signaling Server**: Use our hosted service or deploy your own
4. **Error Handling**: Implement proper error handling and reconnection logic

### Hosted Service

StreamVerse includes a hosted signaling service for zero-config deployment. For production applications with high traffic, consider:

- Custom signaling server deployment
- CDN integration for global reach
- Load balancing for scalability
- Analytics and monitoring

## 🔍 Browser Support

StreamVerse works in all modern browsers that support WebRTC:

- ✅ Chrome 60+
- ✅ Firefox 60+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🐛 Troubleshooting

### Common Issues

**"Permission denied" for camera/microphone:**

```typescript
// Request permissions explicitly
try {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });
} catch (error) {
  if (error.name === "NotAllowedError") {
    console.log("Camera/microphone permission denied");
  }
}
```

**Connection failures:**

- Ensure HTTPS in production
- Check firewall settings
- Verify STUN/TURN server configuration

**No remote streams received:**

- Verify both clients joined the same session
- Check that streams are being published
- Ensure `onRemoteStream` callback is registered before joining

## 📊 Performance

- **Latency**: <100ms for P2P connections
- **Bandwidth**: Adaptive bitrate based on network conditions
- **CPU Usage**: Optimized WebRTC implementation
- **Memory**: Minimal memory footprint (~2MB)
- **Concurrent Users**: Scales with SFU architecture

## 🔐 Security

- End-to-end encryption via WebRTC DTLS
- Secure WebSocket connections (WSS)
- No media data stored on servers
- GDPR and privacy compliant

## 📈 Monitoring

```typescript
// Monitor connection quality
client.onStats((stats) => {
  console.log("Bitrate:", stats.bitrate);
  console.log("Packet loss:", stats.packetLoss);
  console.log("RTT:", stats.roundTripTime);
});
```

## 🤝 Support & Community

- 📖 [Documentation](https://streamverse.dev)
- 💬 [Discord Community](https://discord.gg/streamverse)
- 🐛 [Issue Tracker](https://github.com/streamverse/streamverse/issues)
- 📧 [Email Support](mailto:support@streamverse.dev)

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🎉 Contributing

We welcome contributions! Please see our [Contributing Guide](https://github.com/streamverse/streamverse/blob/main/CONTRIBUTING.md) for details.

---

**StreamVerse** — Zero-config real-time communication for developers 🚀

_Made with ❤️ for the developer community_
