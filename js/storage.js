// Local Storage Helper Functions

const STORAGE_KEYS = {
    USER_SESSION: 'chatbro_user_session',
    USER_UID: 'chatbro_user_uid',
    USER_NAME: 'chatbro_user_name',
    USER_CODE: 'chatbro_user_code'
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

// Get specific session value
export function getSessionValue(key) {
    try {
        return localStorage.getItem(STORAGE_KEYS[key]);
    } catch (error) {
        console.error("❌ Error retrieving session value:", error);
        return null;
    }
}
