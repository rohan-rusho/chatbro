// Real-Time Chat Module
import { db } from './firebase-config.js';
import { currentUser } from './auth.js';
import {
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Current chat state
let currentChatId = null;
let currentFriendData = null;
let messagesUnsubscribe = null;

// Generate chat ID (consistent between two users)
function generateChatId(uid1, uid2) {
    return uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
}

// Open chat with a friend
export async function openChat(friendUid, friendData) {
    try {
        if (!currentUser) {
            throw new Error("User not authenticated");
        }

        currentChatId = generateChatId(currentUser.uid, friendUid);
        currentFriendData = friendData;

        // Create/update chat document
        const chatRef = doc(db, 'chats', currentChatId);
        await setDoc(chatRef, {
            participants: [currentUser.uid, friendUid],
            createdAt: new Date().toISOString(),
            lastMessageAt: serverTimestamp()
        }, { merge: true });

        console.log("✅ Chat opened:", currentChatId);
        return { chatId: currentChatId, friendData };
    } catch (error) {
        console.error("❌ Error opening chat:", error);
        throw error;
    }
}

// Send message
export async function sendMessage(text) {
    try {
        if (!currentChatId) {
            throw new Error("No active chat");
        }

        if (!text || text.trim().length === 0) {
            throw new Error("Message cannot be empty");
        }

        const messagesRef = collection(db, 'chats', currentChatId, 'messages');

        await addDoc(messagesRef, {
            senderId: currentUser.uid,
            text: text.trim(),
            timestamp: serverTimestamp(),
            createdAt: new Date().toISOString()
        });

        // Update last message timestamp in chat
        const chatRef = doc(db, 'chats', currentChatId);
        await setDoc(chatRef, {
            lastMessage: text.trim(),
            lastMessageAt: serverTimestamp()
        }, { merge: true });

        console.log("✅ Message sent");
        return true;
    } catch (error) {
        console.error("❌ Error sending message:", error);
        throw error;
    }
}

// Listen to messages (real-time)
export function listenToMessages(callback) {
    if (!currentChatId) return;

    const messagesRef = collection(db, 'chats', currentChatId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    messagesUnsubscribe = onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                text: data.text,
                senderId: data.senderId,
                timestamp: data.timestamp || data.createdAt,
                isCurrentUser: data.senderId === currentUser.uid
            };
        });
        callback(messages);
    });
}

// Cleanup chat listeners
export function cleanupChatListeners() {
    if (messagesUnsubscribe) {
        messagesUnsubscribe();
        messagesUnsubscribe = null;
    }
    currentChatId = null;
    currentFriendData = null;
}

// Get current chat info
export function getCurrentChatInfo() {
    return {
        chatId: currentChatId,
        friendData: currentFriendData
    };
}
