// Firebase Configuration and Initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Firebase configuration (provided by user)
const firebaseConfig = {
    apiKey: "AIzaSyBlaqHteigd6ZzB73qsbm6TouuS-Kkiqag",
    authDomain: "chatbro-74bd7.firebaseapp.com",
    projectId: "chatbro-74bd7",
    storageBucket: "chatbro-74bd7.firebasestorage.app",
    messagingSenderId: "214170261094",
    appId: "1:214170261094:web:1b17a8bfdd067efc4c7fa7"
};

// Initialize Firebase
let app;
let auth;
let db;

try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("✅ Firebase initialized successfully");
} catch (error) {
    console.error("❌ Firebase initialization error:", error);
    alert("Failed to initialize Firebase. Please check your configuration.");
}

// Export Firebase instances
export { app, auth, db };
