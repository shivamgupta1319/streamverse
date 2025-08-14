export type StreamKind = "camera" | "screen" | "audio";

export interface StreamShareOptions {
  userId: string;
  signalingUrl?: string;
}

export interface RemoteStreamEvent {
  userId: string;
  stream: MediaStream;
}

export interface StreamShareClient {
  subscribe(userId: string): Promise<void>;
  startSession(sessionId: string): Promise<void>;
  joinSession(sessionId: string): Promise<void>;
  publishStream(stream: MediaStream, kind?: StreamKind): Promise<void>;
  onRemoteStream(listener: (event: RemoteStreamEvent) => void): () => void;
  close(): Promise<void>;
}

export { createStreamShareClient } from "./internal/HostedClient";
