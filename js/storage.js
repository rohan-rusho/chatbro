// Session Management - Enhanced with last active chat tracking

const STORAGE_KEYS = {
    USER_SESSION: 'chatbro_user_session',
    USER_UID: 'chatbro_user_uid',
    USER_NAME: 'chatbro_user_name',
    USER_CODE: 'chatbro_user_code',
    LAST_ACTIVE_CHAT: 'chatbro_last_chat',
    LAST_SCROLL_POS: 'chatbro_scroll_pos'
};

// Save user session data
export function saveUserSession(userData) {
    try {
        localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(userData));
        if (userData.uid) localStorage.setItem(STORAGE_KEYS.USER_UID, userData.uid);
        if (userData.name) localStorage.setItem(STORAGE_KEYS.USER_NAME, userData.name);
        if (userData.code) localStorage.setItem(STORAGE_KEYS.USER_CODE, userData.code);
        console.log("✅ User session saved to localStorage");
    } catch (error) {
        console.error("❌ Error saving user session:", error);
    }
}

// Get user session data
export function getUserSession() {
    try {
        const sessionData = localStorage.getItem(STORAGE_KEYS.USER_SESSION);
        return sessionData ? JSON.parse(sessionData) : null;
    } catch (error) {
        console.error("❌ Error retrieving user session:", error);
        return null;
    }
}

// Clear user session (on logout)
export function clearUserSession() {
    try {
        Object.values(STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
        console.log("✅ User session cleared");
    } catch (error) {
        console.error("❌ Error clearing user session:", error);
    }
}

// Save last active chat
export function saveLastActiveChat(chatId, friendData) {
    try {
        const chatState = {
            chatId,
            friendData,
            timestamp: Date.now()
        };
        localStorage.setItem(STORAGE_KEYS.LAST_ACTIVE_CHAT, JSON.stringify(chatState));
    } catch (error) {
        console.error("❌ Error saving last active chat:", error);
    }
}

// Get last active chat
export function getLastActiveChat() {
    try {
        const chatState = localStorage.getItem(STORAGE_KEYS.LAST_ACTIVE_CHAT);
        if (!chatState) return null;

        const parsed = JSON.parse(chatState);
        // Only restore if less than 1 hour old
        const oneHour = 60 * 60 * 1000;
        if (Date.now() - parsed.timestamp > oneHour) {
            clearLastActiveChat();
            return null;
        }

        return parsed;
    } catch (error) {
        console.error("❌ Error retrieving last active chat:", error);
        return null;
    }
}

// Clear last active chat
export function clearLastActiveChat() {
    try {
        localStorage.removeItem(STORAGE_KEYS.LAST_ACTIVE_CHAT);
    } catch (error) {
        console.error("❌ Error clearing last active chat:", error);
    }
}

// Save scroll position
export function saveScrollPosition(chatId, position) {
    try {
        const scrollData = {
            [chatId]: position
        };
        localStorage.setItem(STORAGE_KEYS.LAST_SCROLL_POS, JSON.stringify(scrollData));
    } catch (error) {
        console.error("❌ Error saving scroll position:", error);
    }
}

// Get scroll position
export function getScrollPosition(chatId) {
    try {
        const scrollData = localStorage.getItem(STORAGE_KEYS.LAST_SCROLL_POS);
        if (!scrollData) return null;

        const parsed = JSON.parse(scrollData);
        return parsed[chatId] || null;
    } catch (error) {
        console.error("❌ Error retrieving scroll position:", error);
        return null;
    }
}

// Get specific session value
export function getSessionValue(key) {
    try {
        return localStorage.getItem(STORAGE_KEYS[key]);
    } catch (error) {
        console.error("❌ Error retrieving session value:", error);
        return null;
    }
}
