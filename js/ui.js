// UI Management Module

let currentScreen = 'authScreen';

// Show specific screen
export function showScreen(screenName) {
    const screens = ['authScreen', 'dashboardScreen', 'chatScreen'];

    screens.forEach(screen => {
        const element = document.getElementById(screen);
        if (element) {
            if (screen === screenName) {
                element.classList.add('active');
            } else {
                element.classList.remove('active');
            }
        }
    });

    currentScreen = screenName;
    console.log(`📺 Screen changed to: ${screenName}`);
}

// Loading overlay functions
export function showLoading(text = 'Loading...') {
    const overlay = document.getElementById('loadingOverlay');
    const loadingText = overlay?.querySelector('.loading-text');

    if (overlay) {
        if (loadingText) loadingText.textContent = text;
        overlay.classList.remove('hidden');
    }
}

export function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.add('hidden');
    }
}

// Show notification toast
export function showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    if (!container) return;

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    container.appendChild(notification);

    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// Update user info in dashboard
export function updateUserInfo(userData) {
    const userName = document.getElementById('userName');
    const userCode = document.getElementById('userCode');
    const userInitial = document.getElementById('userInitial');

    if (userName) userName.textContent = userData.name;
    if (userCode) userCode.textContent = userData.code;
    if (userInitial) {
        userInitial.textContent = userData.name.charAt(0).toUpperCase();
    }
}

// Render friends list
export function renderFriendsList(friends) {
    const friendsList = document.getElementById('friendsList');
    if (!friendsList) return;

    if (friends.length === 0) {
        friendsList.innerHTML = `
            <div class="empty-state">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                <p>No friends yet</p>
                <p class="empty-state-subtitle">Add friends using their unique code</p>
            </div>
        `;
        return;
    }

    friendsList.innerHTML = friends.map(friend => `
        <div class="friend-item" data-friend-id="${friend.uid}">
            <div class="friend-avatar">
                <span>${friend.name.charAt(0).toUpperCase()}</span>
            </div>
            <div class="friend-details">
                <div class="friend-name">${friend.name}</div>
                <div class="friend-status">Code: ${friend.code}</div>
            </div>
        </div>
    `).join('');
}

// Render pending friend requests
export function renderPendingRequests(requests) {
    const requestsSection = document.getElementById('pendingRequestsSection');
    const requestsList = document.getElementById('requestsList');
    const requestsBadge = document.getElementById('requestsBadge');

    if (!requestsList || !requestsSection) return;

    if (requests.length === 0) {
        requestsSection.classList.add('hidden');
        return;
    }

    requestsSection.classList.remove('hidden');
    if (requestsBadge) requestsBadge.textContent = requests.length;

    requestsList.innerHTML = requests.map(request => `
        <div class="request-item" data-request-id="${request.id}">
            <div class="request-info">
                <div class="request-avatar">
                    <span>${request.fromName.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                    <div class="friend-name">${request.fromName}</div>
                    <div class="friend-status">Code: ${request.fromCode}</div>
                </div>
            </div>
            <div class="request-actions">
                <button class="btn-accept" data-request-id="${request.id}" data-from-uid="${request.from}">Accept</button>
                <button class="btn-reject" data-request-id="${request.id}">Reject</button>
            </div>
        </div>
    `).join('');
}

// Update chat header
export function updateChatHeader(friendData) {
    const chatFriendName = document.getElementById('chatFriendName');
    const chatFriendInitial = document.getElementById('chatFriendInitial');

    if (chatFriendName) chatFriendName.textContent = friendData.name;
    if (chatFriendInitial) {
        chatFriendInitial.textContent = friendData.name.charAt(0).toUpperCase();
    }
}

// Render messages
export function renderMessages(messages) {
    const messagesList = document.getElementById('messagesList');
    if (!messagesList) return;

    messagesList.innerHTML = messages.map(msg => {
        const messageClass = msg.isCurrentUser ? 'sent' : 'received';
        const time = formatTime(msg.timestamp);

        return `
            <div class="message ${messageClass}">
                <div class="message-bubble">
                    <div class="message-text">${escapeHtml(msg.text)}</div>
                    <div class="message-time">${time}</div>
                </div>
            </div>
        `;
    }).join('');

    // Auto scroll to bottom
    scrollToBottom();
}

// Append single message
export function appendMessage(message) {
    const messagesList = document.getElementById('messagesList');
    if (!messagesList) return;

    const messageClass = message.isCurrentUser ? 'sent' : 'received';
    const time = formatTime(message.timestamp);

    const messageElement = document.createElement('div');
    messageElement.className = `message ${messageClass}`;
    messageElement.innerHTML = `
        <div class="message-bubble">
            <div class="message-text">${escapeHtml(message.text)}</div>
            <div class="message-time">${time}</div>
        </div>
    `;

    messagesList.appendChild(messageElement);
    scrollToBottom();
}

// Auto scroll to bottom
export function scrollToBottom() {
    const messagesContainer = document.getElementById('messagesContainer');
    if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// Format timestamp
function formatTime(timestamp) {
    if (!timestamp) return '';

    let date;
    if (timestamp.toDate) {
        date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
        date = timestamp;
    } else {
        date = new Date(timestamp);
    }

    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Get current screen
export function getCurrentScreen() {
    return currentScreen;
}
