// Main Application Controller
import { signIn, logout, initAuthStateListener, currentUser } from './auth.js';
import { sendFriendRequest, acceptFriendRequest, rejectFriendRequest, listenToFriendRequests, listenToFriendsList, cleanupFriendsListeners } from './friends.js';
import { openChat, sendMessage, listenToMessages, cleanupChatListeners, getCurrentChatInfo } from './chat.js';
import {
    showScreen,
    showLoading,
    hideLoading,
    showNotification,
    updateUserInfo,
    renderFriendsList,
    renderPendingRequests,
    updateChatHeader,
    renderMessages,
    appendMessage
} from './ui.js';

// DOM Elements
let signInBtn, displayNameInput;
let logoutBtn, sendRequestBtn, friendCodeInput;
let backToDashboardBtn, sendMessageBtn, messageInput;

// State management
let isSendingMessage = false;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 ChatBro App Initializing...");

    initDOMElements();
    initEventListeners();
    initAuthListener();
});

// Initialize DOM element references
function initDOMElements() {
    // Auth screen
    signInBtn = document.getElementById('signInBtn');
    displayNameInput = document.getElementById('displayName');

    // Dashboard
    logoutBtn = document.getElementById('logoutBtn');
    sendRequestBtn = document.getElementById('sendRequestBtn');
    friendCodeInput = document.getElementById('friendCodeInput');

    // Chat screen
    backToDashboardBtn = document.getElementById('backToDashboard');
    sendMessageBtn = document.getElementById('sendMessageBtn');
    messageInput = document.getElementById('messageInput');
}

// Initialize event listeners
function initEventListeners() {
    // Auth screen - Sign In
    if (signInBtn) {
        signInBtn.addEventListener('click', handleSignIn);
    }

    if (displayNameInput) {
        displayNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSignIn();
            }
        });
    }

    // Dashboard - Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Dashboard - Send Friend Request
    if (sendRequestBtn) {
        sendRequestBtn.addEventListener('click', handleSendFriendRequest);
    }

    if (friendCodeInput) {
        friendCodeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSendFriendRequest();
            }
        });

        // Only allow numbers
        friendCodeInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        });
    }

    // Dashboard - Friend item clicks (delegated)
    document.addEventListener('click', (e) => {
        const friendItem = e.target.closest('.friend-item');
        if (friendItem) {
            const friendId = friendItem.dataset.friendId;
            handleOpenChat(friendId, friendItem);
        }

        // Accept request
        const acceptBtn = e.target.closest('.btn-accept');
        if (acceptBtn) {
            const requestId = acceptBtn.dataset.requestId;
            const fromUid = acceptBtn.dataset.fromUid;
            handleAcceptRequest(requestId, fromUid);
        }

        // Reject request
        const rejectBtn = e.target.closest('.btn-reject');
        if (rejectBtn) {
            const requestId = rejectBtn.dataset.requestId;
            handleRejectRequest(requestId);
        }
    });

    // Chat screen - Back to dashboard
    if (backToDashboardBtn) {
        backToDashboardBtn.addEventListener('click', handleBackToDashboard);
    }

    // Chat screen - Send message
    if (sendMessageBtn) {
        sendMessageBtn.addEventListener('click', handleSendMessage);
    }

    if (messageInput) {
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault(); // Prevent default Enter behavior
                if (!isSendingMessage) {
                    handleSendMessage();
                }
            }
        });

        // Enable/disable send button based on input
        messageInput.addEventListener('input', (e) => {
            if (sendMessageBtn) {
                sendMessageBtn.disabled = e.target.value.trim().length === 0;
            }
        });
    }
}

// Initialize auth state listener
function initAuthListener() {
    initAuthStateListener((userData) => {
        hideLoading();

        if (userData) {
            console.log("✅ User authenticated:", userData);
            onUserAuthenticated(userData);
        } else {
            console.log("📭 No user authenticated");
            showScreen('authScreen');
        }
    });
}

// Handle sign in
async function handleSignIn() {
    const name = displayNameInput?.value?.trim();

    if (!name) {
        showNotification("Please enter your name", 'error');
        return;
    }

    try {
        showLoading('Creating your account...');
        const userData = await signIn(name);
        showNotification(`Welcome, ${userData.name}! Your code is ${userData.code}`, 'success');
    } catch (error) {
        hideLoading();
        showNotification(error.message || 'Failed to sign in', 'error');
    }
}

// Handle logout
async function handleLogout() {
    try {
        cleanupFriendsListeners();
        cleanupChatListeners();
        await logout();
        showScreen('authScreen');
        showNotification('Logged out successfully', 'info');
    } catch (error) {
        showNotification('Failed to logout', 'error');
    }
}

// When user is authenticated
function onUserAuthenticated(userData) {
    updateUserInfo(userData);
    showScreen('dashboardScreen');

    // Start listening to friend requests
    listenToFriendRequests((requests) => {
        renderPendingRequests(requests);
    });

    // Start listening to friends list
    listenToFriendsList((friends) => {
        renderFriendsList(friends);
    });
}

// Handle send friend request
async function handleSendFriendRequest() {
    const code = friendCodeInput?.value?.trim();

    if (!code || code.length !== 4) {
        showNotification('Please enter a valid 4-digit code', 'error');
        return;
    }

    try {
        showLoading('Sending request...');
        const result = await sendFriendRequest(code);
        hideLoading();
        showNotification(`Friend request sent to ${result.name}!`, 'success');
        if (friendCodeInput) friendCodeInput.value = '';
    } catch (error) {
        hideLoading();
        showNotification(error.message || 'Failed to send request', 'error');
    }
}

// Handle accept friend request
async function handleAcceptRequest(requestId, fromUid) {
    try {
        showLoading('Accepting request...');
        await acceptFriendRequest(requestId, fromUid);
        hideLoading();
        showNotification('Friend request accepted!', 'success');
    } catch (error) {
        hideLoading();
        showNotification(error.message || 'Failed to accept request', 'error');
    }
}

// Handle reject friend request
async function handleRejectRequest(requestId) {
    try {
        await rejectFriendRequest(requestId);
        showNotification('Friend request rejected', 'info');
    } catch (error) {
        showNotification(error.message || 'Failed to reject request', 'error');
    }
}

// Handle open chat
async function handleOpenChat(friendUid, friendElement) {
    try {
        const friendName = friendElement.querySelector('.friend-name')?.textContent;
        const friendData = {
            uid: friendUid,
            name: friendName
        };

        showLoading('Opening chat...');
        await openChat(friendUid, friendData);
        updateChatHeader(friendData);

        // Start listening to messages
        listenToMessages((messages) => {
            renderMessages(messages);
        });

        hideLoading();
        showScreen('chatScreen');
    } catch (error) {
        hideLoading();
        showNotification(error.message || 'Failed to open chat', 'error');
    }
}

// Handle back to dashboard
function handleBackToDashboard() {
    cleanupChatListeners();
    showScreen('dashboardScreen');
}

// Handle send message
async function handleSendMessage() {
    const text = messageInput?.value?.trim();

    if (!text || isSendingMessage) {
        return;
    }

    try {
        isSendingMessage = true;
        if (sendMessageBtn) sendMessageBtn.disabled = true;

        await sendMessage(text);

        if (messageInput) {
            messageInput.value = '';
            messageInput.focus();
        }
    } catch (error) {
        showNotification(error.message || 'Failed to send message', 'error');
    } finally {
        isSendingMessage = false;
        if (sendMessageBtn) {
            sendMessageBtn.disabled = messageInput?.value?.trim().length === 0;
        }
    }
}

console.log("✅ App.js loaded");
