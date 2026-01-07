// Settings Module - Profile editing and icon selection
import { db } from './firebase-config.js';
import { currentUser } from './auth.js';
import { doc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { PROFILE_ICONS, getIconById, getIconGradient } from './profile-icons.js';
import { saveUserSession, getUserSession } from './storage.js';

let selectedIconId = null;

// Initialize settings screen
export function initializeSettings(userData) {
    // Set current profile data
    document.getElementById('currentProfileName').textContent = userData.name;
    document.getElementById('currentProfileCode').textContent = userData.code;
    document.getElementById('editNameInput').value = userData.name;

    // Set current icon
    selectedIconId = userData.iconId || 1;
    const currentIconEl = document.getElementById('currentProfileIcon');
    currentIconEl.style.background = getIconGradient(selectedIconId);

    // Render icon grid
    renderIconGrid();
}

// Render icon selection grid
function renderIconGrid() {
    const iconGrid = document.getElementById('iconGrid');
    iconGrid.innerHTML = '';

    PROFILE_ICONS.forEach(icon => {
        const iconOption = document.createElement('div');
        iconOption.className = 'icon-option';
        iconOption.style.background = icon.gradient;
        iconOption.dataset.iconId = icon.id;

        if (icon.id === selectedIconId) {
            iconOption.classList.add('selected');
        }

        iconOption.addEventListener('click', () => selectIcon(icon.id));
        iconGrid.appendChild(iconOption);
    });
}

// Select an icon
function selectIcon(iconId) {
    selectedIconId = iconId;

    // Update UI
    const currentIconEl = document.getElementById('currentProfileIcon');
    currentIconEl.style.background = getIconGradient(iconId);

    // Update selection in grid
    document.querySelectorAll('.icon-option').forEach(el => {
        el.classList.remove('selected');
        if (parseInt(el.dataset.iconId) === iconId) {
            el.classList.add('selected');
        }
    });
}

// Save settings
export async function saveSettings() {
    try {
        if (!currentUser) {
            throw new Error("User not authenticated");
        }

        const newName = document.getElementById('editNameInput').value.trim();

        if (!newName || newName.length === 0) {
            throw new Error("Name cannot be empty");
        }

        if (newName.length > 20) {
            throw new Error("Name must be 20 characters or less");
        }

        // Update Firestore
        const userRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userRef, {
            name: newName,
            iconId: selectedIconId
        });

        // Update current user object
        currentUser.name = newName;
        currentUser.iconId = selectedIconId;

        // Update session storage
        saveUserSession(currentUser);

        console.log("✅ Settings saved");
        return { name: newName, iconId: selectedIconId };
    } catch (error) {
        console.error("❌ Error saving settings:", error);
        throw error;
    }
}

// Get selected icon ID
export function getSelectedIconId() {
    return selectedIconId;
}
