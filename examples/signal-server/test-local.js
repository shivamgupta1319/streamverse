#!/usr/bin/env node

// 🧪 Test script for local signaling server
// Run this to verify your server works before deployment

import { WebSocket } from 'ws';

const SERVER_URL = 'ws://localhost:8787';

console.log('🧪 Testing StreamVerse Signaling Server...');
console.log(`📍 Server URL: ${SERVER_URL}`);
console.log('');

// Test 1: Basic connection
console.log('🔌 Test 1: Basic WebSocket Connection');
const ws = new WebSocket(SERVER_URL);

ws.on('open', () => {
    console.log('✅ WebSocket connection established');

    // Test 2: Subscribe
    console.log('📝 Test 2: User Subscription');
    ws.send(JSON.stringify({
        type: 'subscribe',
        userId: 'test-user'
    }));
});

ws.on('message', (data) => {
    const message = JSON.parse(data.toString());
    console.log(`📨 Received: ${JSON.stringify(message)}`);

    if (message.type === 'subscribed') {
        console.log('✅ User subscription successful');

        // Test 3: Join session
        console.log('🚪 Test 3: Join Session');
        ws.send(JSON.stringify({
            type: 'start-session',
            sessionId: 'test-room'
        }));

        // Close connection after tests
        setTimeout(() => {
            console.log('🔌 Closing connection...');
            ws.close();
            process.exit(0);
        }, 1000);
    }
});

ws.on('error', (error) => {
    console.error('❌ WebSocket error:', error.message);
    console.log('');
    console.log('💡 Make sure your signaling server is running:');
    console.log('   npm run server');
    process.exit(1);
});

ws.on('close', () => {
    console.log('🔌 Connection closed');
});

// Timeout after 10 seconds
setTimeout(() => {
    console.log('⏰ Test timeout - server may not be responding');
    process.exit(1);
}, 10000); 