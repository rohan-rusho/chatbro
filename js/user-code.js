// User Code Generation System
import { db } from './firebase-config.js';
import { collection, query, where, getDocs, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Generate a random 4-digit code
function generateRandomCode() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

// Check if code already exists in Firestore
async function checkCodeExists(code) {
    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('code', '==', code));
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
    } catch (error) {
        console.error("❌ Error checking code existence:", error);
        throw error;
    }
}

// Generate unique 4-digit code (with collision detection)
export async function generateUniqueCode(maxAttempts = 10) {
    let attempts = 0;

    while (attempts < maxAttempts) {
        const code = generateRandomCode();
        const exists = await checkCodeExists(code);

        if (!exists) {
            console.log(`✅ Unique code generated: ${code}`);
            return code;
        }

        attempts++;
        console.log(`⚠️ Code collision detected (${code}), retrying... (${attempts}/${maxAttempts})`);
    }

    throw new Error("Failed to generate unique code after maximum attempts");
}

// Store user code and profile in Firestore
export async function storeUserCode(uid, name, code, iconId = 1) {
    try {
        const userRef = doc(db, 'users', uid);
        await setDoc(userRef, {
            name: name,
            code: code,
            iconId: iconId,
            createdAt: new Date().toISOString()
        });
        console.log(`✅ User code stored: ${code} for user ${name} with icon ${iconId}`);
        return true;
    } catch (error) {
        console.error("❌ Error storing user code:", error);
        throw error;
    }
}
