import { createStreamShareClient } from 'streamverse';

// DOM elements
const userIdInput = document.getElementById('userId');
const roomIdInput = document.getElementById('roomId');
const streamTypeSelect = document.getElementById('streamType');
const joinBtn = document.getElementById('joinBtn');
const publishBtn = document.getElementById('publishBtn');
const leaveBtn = document.getElementById('leaveBtn');
const statusDiv = document.getElementById('status');
const videosContainer = document.getElementById('videos');
const joinLoading = document.getElementById('joinLoading');
const publishLoading = document.getElementById('publishLoading');

// State
let client = null;
let isJoined = false;
let isPublishing = false;

// Utility functions
function updateStatus(message, type = 'info') {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
}

function showLoading(button, loadingElement) {
    button.disabled = true;
    loadingElement.style.display = 'inline-block';
}

function hideLoading(button, loadingElement) {
    button.disabled = false;
    loadingElement.style.display = 'none';
}

function createVideoElement(userId, stream, isLocal = false) {
    // Remove existing video for this user first
    const existingVideo = document.getElementById(`video-${userId}`);
    if (existingVideo) {
        existingVideo.remove();
    }

    const videoCard = document.createElement('div');
    videoCard.className = 'video-card';
    videoCard.id = `video-${userId}`;

    const video = document.createElement('video');
    video.srcObject = stream;
    video.autoplay = true;
    video.playsInline = true;
    video.muted = isLocal; // Mute local video to prevent feedback

    const label = document.createElement('div');
    label.className = 'video-label';
    label.textContent = isLocal ? `${userId} (You)` : userId;

    videoCard.appendChild(video);
    videoCard.appendChild(label);
    videosContainer.appendChild(videoCard);

    return videoCard;
}

function removeVideoElement(userId) {
    const videoElement = document.getElementById(`video-${userId}`);
    if (videoElement) {
        videoElement.remove();
    }
}

// Event handlers
joinBtn.addEventListener('click', async () => {
    const userId = userIdInput.value.trim();
    const roomId = roomIdInput.value.trim();

    if (!userId || !roomId) {
        updateStatus('❌ Please enter both your name and room name', 'error');
        return;
    }

    try {
        updateStatus('🔄 Connecting to room...', 'info');
        showLoading(joinBtn, joinLoading);

        // Create client (use local server for testing)
        client = createStreamShareClient({
            userId,
            signalingUrl: 'ws://localhost:8787'
        });

        // Set up remote stream handler
        const unsubscribe = client.onRemoteStream(({ userId: remoteUserId, stream }) => {
            console.log(`📹 Received stream from ${remoteUserId}`);
            createVideoElement(remoteUserId, stream, false);
            updateStatus(`✅ Connected! ${remoteUserId} joined the room.`, 'success');
        });

        // Store unsubscribe function for cleanup
        client._unsubscribeRemoteStream = unsubscribe;

        // Subscribe and join room
        await client.subscribe(userId);
        await client.startSession(roomId); // This will create or join the room

        isJoined = true;
        updateStatus(`✅ Successfully joined room "${roomId}"! Click "Start Streaming" to share your video.`, 'success');

        // Update UI
        publishBtn.disabled = false;
        leaveBtn.disabled = false;
        userIdInput.disabled = true;
        roomIdInput.disabled = true;

    } catch (error) {
        console.error('Failed to join room:', error);

        let errorMessage = 'Failed to join room';
        if (error.message.includes('WebSocket')) {
            errorMessage = '❌ Cannot connect to signaling server. Please ensure the local server is running (npm run server)';
        } else if (error.message.includes('permission')) {
            errorMessage = '❌ Permission denied. Please check your browser settings.';
        } else {
            errorMessage = `❌ ${error.message}`;
        }

        updateStatus(errorMessage, 'error');
        hideLoading(joinBtn, joinLoading);
    }
});

publishBtn.addEventListener('click', async () => {
    if (!client || !isJoined) return;

    try {
        updateStatus('🔄 Starting stream...', 'info');
        showLoading(publishBtn, publishLoading);

        const streamType = streamTypeSelect.value;
        let stream;

        // Get media stream based on selected type
        switch (streamType) {
            case 'screen':
                stream = await navigator.mediaDevices.getDisplayMedia({
                    video: true,
                    audio: true
                });
                break;
            case 'audio':
                stream = await navigator.mediaDevices.getUserMedia({
                    video: false,
                    audio: true
                });
                break;
            default: // camera
                stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });
                break;
        }

        // Create local video element
        createVideoElement(userIdInput.value, stream, true);

        // Publish stream
        await client.publishStream(stream, streamType);

        isPublishing = true;
        updateStatus(`🎥 ${streamType === 'screen' ? 'Screen sharing' : streamType === 'audio' ? 'Audio streaming' : 'Video streaming'} active! Others can now see/hear you.`, 'success');

        publishBtn.textContent = 'Streaming...';
        streamTypeSelect.disabled = true;
        hideLoading(publishBtn, publishLoading);

        // Handle stream end (for screen sharing)
        if (streamType === 'screen') {
            stream.getVideoTracks()[0].addEventListener('ended', () => {
                updateStatus('🖥️ Screen sharing ended', 'info');
                removeVideoElement(userIdInput.value);
                publishBtn.textContent = 'Start Streaming';
                publishBtn.disabled = false;
                streamTypeSelect.disabled = false;
                isPublishing = false;
            });
        }

    } catch (error) {
        console.error('Failed to start streaming:', error);
        hideLoading(publishBtn, publishLoading);

        let errorMessage = 'Failed to start streaming';
        if (error.name === 'NotAllowedError') {
            errorMessage = '❌ Camera/microphone access denied. Please allow access and try again.';
        } else if (error.name === 'NotFoundError') {
            errorMessage = '❌ No camera/microphone found. Please check your devices.';
        } else if (error.name === 'NotSupportedError') {
            errorMessage = '❌ Screen sharing not supported in this browser.';
        } else if (error.message.includes('WebSocket')) {
            errorMessage = '❌ Connection lost. Please try rejoining the room.';
        } else {
            errorMessage = `❌ ${error.message}`;
        }

        updateStatus(errorMessage, 'error');
    }
});

leaveBtn.addEventListener('click', async () => {
    if (!client) return;

    try {
        updateStatus('🔄 Leaving room...', 'info');

        // Clean up remote stream listener
        if (client._unsubscribeRemoteStream) {
            client._unsubscribeRemoteStream();
        }

        // Close client connection
        await client.close();
        client = null;

        // Clear all videos
        videosContainer.innerHTML = '';

        // Reset state
        isJoined = false;
        isPublishing = false;

        // Reset UI
        joinBtn.disabled = false;
        publishBtn.disabled = true;
        publishBtn.textContent = 'Start Streaming';
        leaveBtn.disabled = true;
        userIdInput.disabled = false;
        roomIdInput.disabled = false;
        streamTypeSelect.disabled = false;

        updateStatus('👋 Left the room successfully. You can join again anytime!', 'info');

    } catch (error) {
        console.error('Error leaving room:', error);
        updateStatus(`❌ Error leaving room: ${error.message}`, 'error');
    }
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (client) {
        client.close();
    }
});

// Show initial help
setTimeout(() => {
    if (!isJoined) {
        updateStatus('💡 Tip: Open this page in multiple browser tabs with different names to test multi-user video calls!', 'info');
    }
}, 5000);

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
            case 'Enter':
                if (!isJoined && !joinBtn.disabled) {
                    joinBtn.click();
                } else if (isJoined && !isPublishing && !publishBtn.disabled) {
                    publishBtn.click();
                }
                e.preventDefault();
                break;
            case 'Escape':
                if (isJoined && !leaveBtn.disabled) {
                    leaveBtn.click();
                }
                e.preventDefault();
                break;
        }
    }
});

// Add helpful tooltips
const tooltips = {
    'joinBtn': 'Ctrl+Enter: Quick join',
    'publishBtn': 'Ctrl+Enter: Quick start streaming',
    'leaveBtn': 'Ctrl+Esc: Quick leave'
};

Object.entries(tooltips).forEach(([id, tooltip]) => {
    const element = document.getElementById(id);
    if (element) {
        element.title = tooltip;
    }
}); 