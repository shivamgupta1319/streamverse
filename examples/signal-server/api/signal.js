import { WebSocketServer } from 'ws';

// WebSocket server for production deployment
let wss = null;
const clients = new Map(); // userId -> { ws, sessionId }
const sessions = new Map(); // sessionId -> Set<userId>

function send(ws, data) {
    if (ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify(data));
    }
}

function broadcastToSession(sessionId, data, excludeUserId) {
    const users = sessions.get(sessionId);
    if (!users) return;

    for (const userId of users) {
        if (userId === excludeUserId) continue;
        const client = clients.get(userId);
        if (client) send(client.ws, data);
    }
}

function handleWebSocket(ws) {
    let currentClient = null;

    ws.on('message', (raw) => {
        try {
            const msg = JSON.parse(raw.toString());

            if (msg.type === 'subscribe') {
                currentClient = { ws, userId: msg.userId, sessionId: null };
                clients.set(msg.userId, currentClient);
                send(ws, { type: 'subscribed', userId: msg.userId });
                console.log(`User ${msg.userId} subscribed`);
            }

            else if (msg.type === 'start-session' || msg.type === 'join-session') {
                if (!currentClient) return;

                const sessionId = msg.sessionId;
                currentClient.sessionId = sessionId;

                if (!sessions.has(sessionId)) {
                    sessions.set(sessionId, new Set());
                }

                const sessionUsers = sessions.get(sessionId);
                const existingUsers = Array.from(sessionUsers);

                sessionUsers.add(currentClient.userId);

                // Send existing users to the new joiner
                send(ws, { type: 'peers', peers: existingUsers });

                // Notify existing users about the new joiner
                broadcastToSession(sessionId, {
                    type: 'peer-joined',
                    userId: currentClient.userId
                }, currentClient.userId);

                console.log(`User ${currentClient.userId} joined session ${sessionId}`);
            }

            else if (msg.type === 'offer' || msg.type === 'answer' || msg.type === 'ice') {
                // Forward signaling messages between peers
                const targetClient = clients.get(msg.to);
                if (targetClient) {
                    send(targetClient.ws, {
                        type: msg.type,
                        from: currentClient.userId,
                        sdp: msg.sdp,
                        candidate: msg.candidate
                    });
                }
            }

            else if (msg.type === 'leave-session') {
                if (currentClient && currentClient.sessionId) {
                    const sessionUsers = sessions.get(currentClient.sessionId);
                    if (sessionUsers) {
                        sessionUsers.delete(currentClient.userId);
                        broadcastToSession(currentClient.sessionId, {
                            type: 'peer-left',
                            userId: currentClient.userId
                        });
                        if (sessionUsers.size === 0) {
                            sessions.delete(currentClient.sessionId);
                        }
                    }
                    currentClient.sessionId = null;
                }
            }

        } catch (error) {
            console.error('Error handling message:', error);
        }
    });

    ws.on('close', () => {
        if (currentClient) {
            clients.delete(currentClient.userId);
            if (currentClient.sessionId) {
                const sessionUsers = sessions.get(currentClient.sessionId);
                if (sessionUsers) {
                    sessionUsers.delete(currentClient.userId);
                    broadcastToSession(currentClient.sessionId, {
                        type: 'peer-left',
                        userId: currentClient.userId
                    });
                }
            }
            console.log(`User ${currentClient.userId} disconnected`);
        }
    });
}

// Vercel serverless function handler
export default function handler(req, res) {
    if (req.method === 'GET') {
        // Handle WebSocket upgrade
        if (req.headers.upgrade === 'websocket') {
            // This would need to be handled differently in Vercel
            // For now, we'll provide instructions
            res.status(200).json({
                message: 'WebSocket connections are not supported in this serverless environment',
                instructions: 'Please use the local signaling server for development or deploy to a platform that supports WebSocket servers'
            });
        } else {
            res.status(200).json({
                message: 'StreamVerse Signaling Server',
                status: 'running',
                connections: clients.size,
                sessions: sessions.size
            });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
} 