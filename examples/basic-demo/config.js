// StreamVerse Demo Configuration
export const config = {
    // Signaling server URL for production deployment
    signalingUrl: 'wss://streamverse-1fpt.onrender.com',

    // Environment
    environment: 'production',

    // Feature flags
    features: {
        videoCalls: true,
        screenSharing: true,
        audioOnly: true,
        multiUser: true
    },

    // UI settings
    ui: {
        theme: 'light',
        language: 'en',
        autoConnect: false
    }
}; 