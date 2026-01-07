import { auth, db } from './firebase-config.js';
import { signInAnonymously, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { generateUniqueCode, storeUserCode } from './user-code.js';
import { saveUserSession, clearUserSession } from './storage.js';
import { getRandomIcon } from './profile-icons.js';

// Current user state
export let currentUser = null;

// Sign in with display name
export async function signIn(displayName) {
    try {
        if (!displayName || displayName.trim().length === 0) {
            throw new Error("Display name is required");
        }

        // Sign in anonymously
        const userCredential = await signInAnonymously(auth);
        const user = userCredential.user;

        console.log("✅ Anonymous auth successful:", user.uid);

        // Check if user already has a code
        const userDoc = await getDoc(doc(db, 'users', user.uid));

        let code, iconId;
        if (userDoc.exists()) {
            // Existing user - retrieve code and icon
            const data = userDoc.data();
            code = data.code;
            iconId = data.iconId || 1;
            console.log("✅ Existing user, code:", code);
        } else {
            // New user - generate unique code and random icon
            code = await generateUniqueCode();
            iconId = getRandomIcon();
            await storeUserCode(user.uid, displayName.trim(), code, iconId);
        }

        // Save user session
        const userData = {
            uid: user.uid,
            name: displayName.trim(),
            code: code,
            iconId: iconId
        };

        saveUserSession(userData);
        currentUser = userData;

        return userData;
    } catch (error) {
        console.error("❌ Sign in error:", error);
        throw error;
    }
}

// Logout
export async function logout() {
    try {
        await signOut(auth);
        clearUserSession();
        currentUser = null;
        console.log("✅ User logged out");
        return true;
    } catch (error) {
        console.error("❌ Logout error:", error);
        throw error;
    }
}

// Auth state change listener
export function initAuthStateListener(callback) {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            // User is signed in
            try {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    const userData = {
                        uid: user.uid,
                        name: data.name,
                        code: data.code,
                        iconId: data.iconId || 1
                    };
                    currentUser = userData;
                    saveUserSession(userData);
                    callback(userData);
                } else {
                    callback(null);
                }
            } catch (error) {
                console.error("❌ Error fetching user data:", error);
                callback(null);
            }
        } else {
            // User is signed out
            currentUser = null;
            callback(null);
        }
    });
}
