import { Device } from "mediasoup-client";
import type {
  RemoteStreamEvent,
  StreamKind,
  StreamShareClient,
  StreamShareOptions,
} from "../index";

export function createStreamShareClient(
  options: StreamShareOptions
): StreamShareClient {
  return new MediasoupStreamShareClient(options);
}

type SignalMessage =
  | { type: "subscribed"; userId: string }
  | { type: "peers"; peers: string[] }
  | { type: "peer-joined"; userId: string }
  | { type: "peer-left"; userId: string }
  | { type: "router-capabilities"; rtpCapabilities: any }
  | {
      type: "send-transport-created";
      id: string;
      iceParameters: any;
      iceCandidates: any;
      dtlsParameters: any;
    }
  | {
      type: "recv-transport-created";
      id: string;
      iceParameters: any;
      iceCandidates: any;
      dtlsParameters: any;
    }
  | { type: "transport-connected"; transportId: string }
  | { type: "produced"; producerId: string }
  | {
      type: "consumed";
      consumerId: string;
      producerId: string;
      kind: string;
      rtpParameters: any;
      userId: string;
    }
  | { type: "consumer-resumed"; consumerId: string }
  | { type: "new-producer"; userId: string; producerId: string; kind: string }
  | { type: "error"; message: string };

class MediasoupStreamShareClient implements StreamShareClient {
  private readonly userId: string;
  private readonly signalingUrl: string;
  private ws?: WebSocket;
  private sessionId?: string;
  private device?: Device;
  private sendTransport?: any;
  private recvTransport?: any;
  private producers = new Map<string, any>();
  private consumers = new Map<string, any>();
  private remoteListeners: Set<(event: RemoteStreamEvent) => void> = new Set();
  private remoteStreams = new Map<string, MediaStream>();

  constructor(options: StreamShareOptions) {
    this.userId = options.userId;
    this.signalingUrl = options.signalingUrl ?? "ws://localhost:8788";
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
      ws.onclose = () => this.cleanup();
    });
  }

  private send(msg: any) {
    this.ws?.send(JSON.stringify(msg));
  }

  async subscribe(userId: string): Promise<void> {
    void userId;
    await this.ensureSocket();
    await this.initializeDevice();
  }

  private async initializeDevice() {
    this.device = new Device();
    this.send({ type: "get-router-capabilities" });
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
    if (!this.device?.loaded || !this.sendTransport) {
      console.warn("Device not ready or send transport not created");
      return;
    }

    for (const track of stream.getTracks()) {
      try {
        const producer = await this.sendTransport.produce({ track });
        this.producers.set(producer.id, producer);
        console.log(`Produced ${track.kind} track:`, producer.id);
      } catch (error) {
        console.error("Error producing track:", error);
      }
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
    try {
      if (msg.type === "router-capabilities") {
        if (!this.device) return;
        await this.device.load({ routerRtpCapabilities: msg.rtpCapabilities });
        console.log("Device loaded with router capabilities");
        this.send({ type: "create-send-transport" });
        this.send({ type: "create-recv-transport" });
        return;
      }

      if (msg.type === "send-transport-created") {
        this.sendTransport = this.device!.createSendTransport({
          id: msg.id,
          iceParameters: msg.iceParameters,
          iceCandidates: msg.iceCandidates,
          dtlsParameters: msg.dtlsParameters,
        });

        this.sendTransport.on(
          "connect",
          async (params: any, callback: any, errback: any) => {
            try {
              this.send({
                type: "connect-transport",
                transportId: msg.id,
                dtlsParameters: params.dtlsParameters,
              });
              callback();
            } catch (error) {
              errback(error);
            }
          }
        );

        this.sendTransport.on(
          "produce",
          async (params: any, callback: any, errback: any) => {
            try {
              this.send({
                type: "produce",
                transportId: msg.id,
                kind: params.kind,
                rtpParameters: params.rtpParameters,
              });
              // Simple callback with placeholder ID - server will provide real ID
              callback({ id: "temp-" + Date.now() });
            } catch (error) {
              errback(error);
            }
          }
        );
        return;
      }

      if (msg.type === "recv-transport-created") {
        this.recvTransport = this.device!.createRecvTransport({
          id: msg.id,
          iceParameters: msg.iceParameters,
          iceCandidates: msg.iceCandidates,
          dtlsParameters: msg.dtlsParameters,
        });

        this.recvTransport.on(
          "connect",
          async (params: any, callback: any, errback: any) => {
            try {
              this.send({
                type: "connect-transport",
                transportId: msg.id,
                dtlsParameters: params.dtlsParameters,
              });
              callback();
            } catch (error) {
              errback(error);
            }
          }
        );
        return;
      }

      if (msg.type === "new-producer") {
        if (this.recvTransport) {
          this.send({ type: "consume", producerId: msg.producerId });
        }
        return;
      }

      if (msg.type === "consumed") {
        if (!this.recvTransport) return;
        const consumer = await this.recvTransport.consume({
          id: msg.consumerId,
          producerId: msg.producerId,
          kind: msg.kind,
          rtpParameters: msg.rtpParameters,
        });

        this.consumers.set(consumer.id, consumer);

        let stream = this.remoteStreams.get(msg.userId);
        if (!stream) {
          stream = new MediaStream();
          this.remoteStreams.set(msg.userId, stream);
        }

        stream.addTrack(consumer.track);
        this.emitRemote({ userId: msg.userId, stream });
        this.send({ type: "resume-consumer", consumerId: msg.consumerId });
        return;
      }

      if (msg.type === "peer-left") {
        const stream = this.remoteStreams.get(msg.userId);
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
          this.remoteStreams.delete(msg.userId);
        }
        return;
      }
    } catch (error) {
      console.error("Error handling signal:", error);
    }
  }

  private cleanup() {
    this.sendTransport?.close();
    this.recvTransport?.close();
    for (const producer of this.producers.values()) producer.close();
    for (const consumer of this.consumers.values()) consumer.close();
    this.producers.clear();
    this.consumers.clear();
    for (const stream of this.remoteStreams.values()) {
      stream.getTracks().forEach((track) => track.stop());
    }
    this.remoteStreams.clear();
  }

  async close(): Promise<void> {
    if (this.sessionId) this.send({ type: "leave-session" });
    this.cleanup();
    this.ws?.close();
  }
}
