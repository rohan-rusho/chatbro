// Listener Management - Prevent duplicates and memory leaks

class ListenerManager {
    constructor() {
        this.activeListeners = new Map();
    }

    // Register a listener
    register(key, unsubscribe) {
        // If listener already exists, unsubscribe it first
        if (this.activeListeners.has(key)) {
            const existingUnsubscribe = this.activeListeners.get(key);
            if (typeof existingUnsubscribe === 'function') {
                existingUnsubscribe();
            }
        }

        this.activeListeners.set(key, unsubscribe);
        console.log(`📡 Listener registered: ${key}`);
    }

    // Unregister a specific listener
    unregister(key) {
        if (this.activeListeners.has(key)) {
            const unsubscribe = this.activeListeners.get(key);
            if (typeof unsubscribe === 'function') {
                unsubscribe();
            }
            this.activeListeners.delete(key);
            console.log(`🔇 Listener unregistered: ${key}`);
        }
    }

    // Unregister all listeners
    unregisterAll() {
        for (const [key, unsubscribe] of this.activeListeners.entries()) {
            if (typeof unsubscribe === 'function') {
                unsubscribe();
            }
        }
        this.activeListeners.clear();
        console.log(`🔇 All listeners unregistered (${this.activeListeners.size} total)`);
    }

    // Get listener count
    getCount() {
        return this.activeListeners.size;
    }

    // Check if listener exists
    has(key) {
        return this.activeListeners.has(key);
    }
}

// Export singleton instance
export const listenerManager = new ListenerManager();

// Listener keys (constants)
export const LISTENER_KEYS = {
    FRIEND_REQUESTS: 'friendRequests',
    FRIENDS_LIST: 'friendsList',
    CHAT_MESSAGES: 'chatMessages',
    USER_PROFILE: 'userProfile'
};
