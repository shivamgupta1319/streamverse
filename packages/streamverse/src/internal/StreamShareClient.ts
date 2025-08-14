import type {
  RemoteStreamEvent,
  StreamKind,
  StreamShareClient,
  StreamShareOptions,
} from "../index";

export function createStreamShareClient(
  options: StreamShareOptions
): StreamShareClient {
  return new StreamShareClientImpl(options);
}

type SignalMessage =
  | { type: "subscribed"; userId: string }
  | { type: "peers"; peers: string[] }
  | { type: "peer-joined"; userId: string }
  | { type: "peer-left"; userId: string }
  | { type: "offer"; from: string; sdp: string }
  | { type: "answer"; from: string; sdp: string }
  | { type: "ice"; from: string; candidate: RTCIceCandidateInit };

class StreamShareClientImpl implements StreamShareClient {
  private readonly userId: string;
  private readonly signalingUrl: string;
  private ws?: WebSocket;
  private sessionId?: string;
  private localStream?: MediaStream;
  private remoteListeners: Set<(event: RemoteStreamEvent) => void> = new Set();
  private peerConnections = new Map<
    string,
    RTCPeerConnection & { _pendingCandidates?: RTCIceCandidateInit[] }
  >();
  private remoteStreams = new Map<string, MediaStream>();

  constructor(options: StreamShareOptions) {
    this.userId = options.userId;
    this.signalingUrl = options.signalingUrl ?? "ws://localhost:8787";
  }

  private ensureSocket(): Promise<void> {
    if (this.ws && this.ws.readyState === WebSocket.OPEN)
      return Promise.resolve();
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(this.signalingUrl);
      this.ws = ws;
      ws.onopen = () => {
        this.send({ type: "subscribe", userId: this.userId });
        resolve();
      };
      ws.onmessage = (ev) => this.onSignal(JSON.parse(ev.data as string));
      ws.onerror = (e) => reject(e);
      ws.onclose = () => {
        // cleanup on close
        for (const pc of this.peerConnections.values()) pc.close();
        this.peerConnections.clear();
        this.remoteStreams.clear();
      };
    });
  }

  private send(msg: any) {
    this.ws?.send(JSON.stringify(msg));
  }

  async subscribe(userId: string): Promise<void> {
    void userId;
    await this.ensureSocket();
  }

  async startSession(sessionId: string): Promise<void> {
    await this.ensureSocket();
    this.sessionId = sessionId;
    this.send({ type: "start-session", sessionId });
  }

  async joinSession(sessionId: string): Promise<void> {
    await this.ensureSocket();
    this.sessionId = sessionId;
    this.send({ type: "join-session", sessionId });
  }

  async publishStream(
    stream: MediaStream,
    kind: StreamKind = "camera"
  ): Promise<void> {
    void kind;
    this.localStream = stream;
    for (const [peerId, pc] of this.peerConnections) {
      this.addTracksToPeer(pc, stream);
      await this.createAndSendOffer(peerId, pc);
    }
  }

  onRemoteStream(listener: (event: RemoteStreamEvent) => void): () => void {
    this.remoteListeners.add(listener);
    return () => this.remoteListeners.delete(listener);
  }

  private emitRemote(event: RemoteStreamEvent) {
    for (const listener of this.remoteListeners) listener(event);
  }

  private async onSignal(msg: SignalMessage) {
    if (msg.type === "peers") {
      // Only create offers to existing peers when we join
      for (const peerId of msg.peers) {
        const pc = this.getOrCreatePeer(peerId);
        if (this.localStream) this.addTracksToPeer(pc, this.localStream);
        // Create offer since we're the joiner
        await this.createAndSendOffer(peerId, pc);
      }
      return;
    }
    if (msg.type === "peer-joined") {
      // A new peer joined - they will send us an offer, so just create the peer
      this.getOrCreatePeer(msg.userId);
      return;
    }
    if (msg.type === "peer-left") {
      const pc = this.peerConnections.get(msg.userId);
      pc?.close();
      this.peerConnections.delete(msg.userId);
      this.remoteStreams.delete(msg.userId);
      return;
    }
    if (msg.type === "offer") {
      try {
        const pc = this.getOrCreatePeer(msg.from);
        if (pc.signalingState !== "stable") {
          console.warn(
            `Peer ${msg.from} not in stable state:`,
            pc.signalingState
          );
          return;
        }
        await pc.setRemoteDescription({ type: "offer", sdp: msg.sdp });
        // Process any queued ICE candidates
        if (pc._pendingCandidates) {
          for (const candidate of pc._pendingCandidates) {
            await pc.addIceCandidate(candidate);
          }
          pc._pendingCandidates = [];
        }
        if (this.localStream) this.addTracksToPeer(pc, this.localStream);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        this.send({ type: "answer", to: msg.from, sdp: answer.sdp! });
      } catch (error) {
        console.error(`Error handling offer from ${msg.from}:`, error);
      }
      return;
    }
    if (msg.type === "answer") {
      try {
        const pc = this.peerConnections.get(msg.from);
        if (!pc) return;
        if (pc.signalingState !== "have-local-offer") {
          console.warn(
            `Peer ${msg.from} not expecting answer, state:`,
            pc.signalingState
          );
          return;
        }
        await pc.setRemoteDescription({ type: "answer", sdp: msg.sdp });
        // Process any queued ICE candidates
        if (pc._pendingCandidates) {
          for (const candidate of pc._pendingCandidates) {
            await pc.addIceCandidate(candidate);
          }
          pc._pendingCandidates = [];
        }
      } catch (error) {
        console.error(`Error handling answer from ${msg.from}:`, error);
      }
      return;
    }
    if (msg.type === "ice") {
      try {
        const pc = this.peerConnections.get(msg.from);
        if (!pc) return;
        if (pc.remoteDescription) {
          await pc.addIceCandidate(msg.candidate);
        } else {
          // Queue ICE candidates until remote description is set
          if (!pc._pendingCandidates) pc._pendingCandidates = [];
          pc._pendingCandidates.push(msg.candidate);
        }
      } catch (error) {
        console.error(`Error handling ICE from ${msg.from}:`, error);
      }
      return;
    }
  }

  private getOrCreatePeer(
    peerId: string
  ): RTCPeerConnection & { _pendingCandidates?: RTCIceCandidateInit[] } {
    let pc = this.peerConnections.get(peerId);
    if (pc) return pc;
    pc = new RTCPeerConnection({
      iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }],
    });
    pc.onicecandidate = (e) => {
      if (e.candidate)
        this.send({ type: "ice", to: peerId, candidate: e.candidate });
    };
    pc.ontrack = (e) => {
      let stream = this.remoteStreams.get(peerId);
      if (!stream) {
        stream = new MediaStream();
        this.remoteStreams.set(peerId, stream);
      }
      stream.addTrack(e.track);
      this.emitRemote({ userId: peerId, stream });
    };
    pc.onconnectionstatechange = () => {
      if (pc?.connectionState === "failed") pc.restartIce();
    };
    // If we already have a local stream, attach its tracks now
    if (this.localStream) this.addTracksToPeer(pc, this.localStream);
    this.peerConnections.set(peerId, pc);
    return pc;
  }

  private addTracksToPeer(pc: RTCPeerConnection, stream: MediaStream) {
    const existing = new Set(pc.getSenders().map((s) => s.track?.id));
    for (const track of stream.getTracks()) {
      if (existing.has(track.id)) continue;
      pc.addTrack(track, stream);
    }
  }

  private async createAndSendOffer(peerId: string, pc: RTCPeerConnection) {
    const offer = await pc.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    });
    await pc.setLocalDescription(offer);
    this.send({ type: "offer", to: peerId, sdp: offer.sdp! });
  }

  async close(): Promise<void> {
    if (this.sessionId) this.send({ type: "leave-session" });
    for (const pc of this.peerConnections.values()) pc.close();
    this.peerConnections.clear();
    this.remoteStreams.clear();
    this.ws?.close();
  }
}
