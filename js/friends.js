// Friends & Friend Requests Module
import { db } from './firebase-config.js';
import { currentUser } from './auth.js';
import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    getDoc,
    setDoc,
    arrayUnion,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Real-time listeners
let friendRequestsUnsubscribe = null;
let friendsListUnsubscribe = null;

// Send friend request
export async function sendFriendRequest(targetCode) {
    try {
        if (!currentUser) {
            throw new Error("User not authenticated");
        }

        if (!targetCode || targetCode.length !== 4) {
            throw new Error("Invalid code. Please enter a 4-digit code.");
        }

        // Find user with this code
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('code', '==', targetCode));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            throw new Error("No user found with this code");
        }

        const targetUserDoc = querySnapshot.docs[0];
        const targetUid = targetUserDoc.id;
        const targetUserData = targetUserDoc.data();

        // Check if trying to add self
        if (targetUid === currentUser.uid) {
            throw new Error("You cannot add yourself as a friend");
        }

        // Check if already friends
        const friendsDoc = await getDoc(doc(db, 'friends', currentUser.uid));
        if (friendsDoc.exists() && friendsDoc.data().friends?.includes(targetUid)) {
            throw new Error("You are already friends with this user");
        }

        // Check if request already exists
        const requestsRef = collection(db, 'friendRequests');
        const existingRequestQuery = query(
            requestsRef,
            where('from', '==', currentUser.uid),
            where('to', '==', targetUid),
            where('status', '==', 'pending')
        );
        const existingRequests = await getDocs(existingRequestQuery);

        if (!existingRequests.empty) {
            throw new Error("Friend request already sent");
        }

        // Create friend request
        await addDoc(collection(db, 'friendRequests'), {
            from: currentUser.uid,
            fromName: currentUser.name,
            fromCode: currentUser.code,
            to: targetUid,
            toName: targetUserData.name,
            status: 'pending',
            createdAt: new Date().toISOString()
        });

        console.log("✅ Friend request sent to:", targetUserData.name);
        return { success: true, name: targetUserData.name };
    } catch (error) {
        console.error("❌ Error sending friend request:", error);
        throw error;
    }
}

// Listen to friend requests (real-time)
export function listenToFriendRequests(callback) {
    if (!currentUser) return;

    const requestsRef = collection(db, 'friendRequests');
    const q = query(
        requestsRef,
        where('to', '==', currentUser.uid),
        where('status', '==', 'pending')
    );

    friendRequestsUnsubscribe = onSnapshot(q, (snapshot) => {
        const requests = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(requests);
    });
}

// Accept friend request
export async function acceptFriendRequest(requestId, fromUid) {
    try {
        if (!currentUser) {
            throw new Error("User not authenticated");
        }

        // Add to both users' friends lists
        const currentUserFriendsRef = doc(db, 'friends', currentUser.uid);
        const friendFriendsRef = doc(db, 'friends', fromUid);

        await setDoc(currentUserFriendsRef, {
            friends: arrayUnion(fromUid)
        }, { merge: true });

        await setDoc(friendFriendsRef, {
            friends: arrayUnion(currentUser.uid)
        }, { merge: true });

        // Delete the friend request
        await deleteDoc(doc(db, 'friendRequests', requestId));

        console.log("✅ Friend request accepted");
        return true;
    } catch (error) {
        console.error("❌ Error accepting friend request:", error);
        throw error;
    }
}

// Reject friend request
export async function rejectFriendRequest(requestId) {
    try {
        await deleteDoc(doc(db, 'friendRequests', requestId));
        console.log("✅ Friend request rejected");
        return true;
    } catch (error) {
        console.error("❌ Error rejecting friend request:", error);
        throw error;
    }
}

// Listen to friends list (real-time)
export function listenToFriendsList(callback) {
    if (!currentUser) return;

    const friendsRef = doc(db, 'friends', currentUser.uid);

    friendsListUnsubscribe = onSnapshot(friendsRef, async (snapshot) => {
        if (!snapshot.exists()) {
            callback([]);
            return;
        }

        const friendUids = snapshot.data().friends || [];

        if (friendUids.length === 0) {
            callback([]);
            return;
        }

        // Fetch friend details
        const friendsData = [];
        for (const friendUid of friendUids) {
            const friendDoc = await getDoc(doc(db, 'users', friendUid));
            if (friendDoc.exists()) {
                friendsData.push({
                    uid: friendUid,
                    ...friendDoc.data()
                });
            }
        }

        callback(friendsData);
    });
}

// Cleanup listeners
export function cleanupFriendsListeners() {
    if (friendRequestsUnsubscribe) {
        friendRequestsUnsubscribe();
        friendRequestsUnsubscribe = null;
    }
    if (friendsListUnsubscribe) {
        friendsListUnsubscribe();
        friendsListUnsubscribe = null;
    }
}
