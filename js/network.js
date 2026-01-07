// Network Status Monitor
let isOnline = navigator.onLine;
let reconnectAttempts = 0;

// Network status change handlers
export function initNetworkMonitoring(onlineCallback, offlineCallback) {
    window.addEventListener('online', () => {
        isOnline = true;
        reconnectAttempts = 0;
        console.log('✅ Network: Online');
        if (onlineCallback) onlineCallback();
    });

    window.addEventListener('offline', () => {
        isOnline = false;
        console.log('📡 Network: Offline');
        if (offlineCallback) offlineCallback();
    });
}

// Get current network status
export function getNetworkStatus() {
    return isOnline;
}

// Connection quality detection (optional)
export function checkConnection() {
    return new Promise((resolve) => {
        const start = Date.now();
        fetch('https://www.gstatic.com/generate_204', {
            mode: 'no-cors',
            cache: 'no-store'
        })
            .then(() => {
                const latency = Date.now() - start;
                resolve({ online: true, latency });
            })
            .catch(() => {
                resolve({ online: false, latency: null });
            });
    });
}
