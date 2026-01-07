# ChatBro - Premium Real-Time Chat Application

## 🚀 Quick Start

### Running the Application

**IMPORTANT**: This application uses ES modules and Firebase, which require serving from an HTTP server. It **cannot** be opened directly from the file system (`file://` protocol) due to browser CORS restrictions.

### Option 1: Using Live Server (VS Code Extension)

1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"
4. The application will open at `http://localhost:5500` (or similar)

### Option 2: Using Python

```bash
# Navigate to project directory
cd "d:\All Stuff\Chatting Application"

# Start HTTP server
python -m http.server 8080

# Open browser to http://localhost:8080
```

### Option 3: Using Node.js (npx)

```bash
# Navigate to project directory
cd "d:\All Stuff\Chatting Application"

# Start HTTP server
npx serve -l 8080

# Open browser to http://localhost:8080
```

### Option 4: Using PHP

```bash
# Navigate to project directory
cd "d:\All Stuff\Chatting Application"

# Start HTTP server
php -S localhost:8080

# Open browser to http://localhost:8080
```

---

## 📱 Features

✅ **Anonymous Authentication** - No email/password required, just enter your name  
✅ **Unique 4-Digit Codes** - Each user gets a permanent, collision-free code  
✅ **Friend Request System** - Connect with others using their code  
✅ **Real-Time Messaging** - Instant one-to-one chat with Firebase  
✅ **Auto-Login** - Session persists across browser restarts  
✅ **Premium UI** - Glassmorphism design with smooth animations  
✅ **Responsive** - Works on desktop and mobile devices  

---

## 🎯 How to Use

### 1. Sign Up / Login

1. Open the application in your browser
2. Enter your display name (e.g., "Rohan")
3. Click "Get Started"
4. You'll be assigned a unique 4-digit code (e.g., **4827**)

### 2. Add Friends

1. Get your friend's 4-digit code
2. On the dashboard, enter their code in the "Add Friend" field
3. Click "Send Request"
4. Your friend will see a pending request

### 3. Accept Friend Requests

1. When someone sends you a request, you'll see a badge on "Pending Requests"
2. Click "Accept" to become friends
3. Click "Reject" to decline the request

### 4. Start Chatting

1. Once you're friends, they'll appear in your "Friends" list
2. Click on their name to open the chat
3. Type your message and press Enter or click the send button
4. Messages are delivered instantly in real-time!

---

## 🔧 Technical Details

### Architecture

- **Frontend**: Vanilla HTML, CSS, JavaScript (ES Modules)
- **Backend**: Firebase (Firestore + Anonymous Auth)
- **Real-time**: Firestore real-time listeners
- **Storage**: Firebase Firestore + localStorage

### File Structure

```
Chatting Application/
├── index.html              # Main HTML file
├── styles.css              # Premium design system
├── js/
│   ├── firebase-config.js  # Firebase initialization
│   ├── storage.js          # LocalStorage helpers
│   ├── user-code.js        # Code generation system
│   ├── auth.js             # Authentication logic
│   ├── friends.js          # Friend request system
│   ├── chat.js             # Real-time messaging
│   ├── ui.js               # UI management
│   └── app.js              # Main app controller
└── README.md               # This file
```

### Firestore Database Structure

```
users/
  {uid}/
    name: string
    code: string (4-digit)
    createdAt: timestamp

friendRequests/
  {requestId}/
    from: uid
    to: uid
    fromName: string
    fromCode: string
    status: "pending"
    createdAt: timestamp

friends/
  {uid}/
    friends: [uid, uid, ...]

chats/
  {chatId}/  # Format: "{smallerUid}_{largerUid}"
    participants: [uid, uid]
    createdAt: timestamp
    lastMessage: string
    lastMessageAt: timestamp
    
    messages/
      {messageId}/
        senderId: uid
        text: string
        timestamp: timestamp
```

---

## 🔐 Firebase Security Rules

**IMPORTANT**: For production use, you must configure Firestore security rules in the Firebase Console.

Navigate to: **Firebase Console → Firestore Database → Rules**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read all profiles, write only their own
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    // Friend requests visible to sender and receiver
    match /friendRequests/{requestId} {
      allow read: if request.auth != null && 
        (resource.data.from == request.auth.uid || 
         resource.data.to == request.auth.uid);
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.to;
    }
    
    // Friends list
    match /friends/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    // Chats - only participants can access
    match /chats/{chatId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in resource.data.participants;
      
      match /messages/{messageId} {
        allow read: if request.auth != null && 
          request.auth.uid in get(/databases/$(database)/documents/chats/$(chatId)).data.participants;
        allow create: if request.auth != null && 
          request.auth.uid in get(/databases/$(database)/documents/chats/$(chatId)).data.participants;
      }
    }
  }
}
```

Click **Publish** to apply the rules.

---

## ⚠️ Known Limitations

1. **4-Digit Code System**: Supports up to 10,000 unique users (codes 0000-9999). For larger scale, consider 5-6 digit codes.

2. **Anonymous Authentication**: Users lose access if they clear browser data completely. Consider adding email/password as a backup option.

3. **Firebase Credentials**: Currently hardcoded in the source code. For production, use environment variables or Firebase Hosting.

---

## 🎨 UI/UX Features

- **Glassmorphism** - Modern frosted glass effect with backdrop blur
- **Smooth Animations** - Page transitions, message sends, hover effects
- **Dark Theme** - Premium dark color palette with vibrant gradients
- **Responsive Design** - Mobile-first approach, works on all screen sizes
- **Custom Scrollbar** - Styled with gradient colors
- **Loading States** - Spinners and skeletons for better UX
- **Toast Notifications** - Success, error, and info messages

---

## 🐛 Troubleshooting

### "Failed to initialize Firebase"

- Check your internet connection
- Verify Firebase credentials are correct
- Check browser console for detailed errors

### "CORS error" or JavaScript modules not loading

- Make sure you're using an HTTP server (not `file://` protocol)
- See "Running the Application" section above

### Messages not sending

- Check Firebase Console → Firestore Database
- Verify security rules are configured
- Check browser console for errors

### Friend request not appearing

- Both users must be online for real-time updates
- Try refreshing the page
- Check Firestore console for data

---

## 📞 Support

For issues with:
- **Firebase**: Check [Firebase Documentation](https://firebase.google.com/docs)
- **Browser Compatibility**: Requires modern browser with ES6 module support
- **Network Issues**: Firestore requires stable internet connection

---

## 🚀 Deployment Options

### Option 1: Firebase Hosting (Recommended)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize hosting
firebase init hosting

# Deploy
firebase deploy
```

### Option 2: Netlify

1. Drag and drop the project folder to [Netlify Drop](https://app.netlify.com/drop)
2. Your app will be live instantly!

### Option 3: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Option 4: GitHub Pages

1. Push code to GitHub repository
2. Go to Settings → Pages
3. Select source branch and save

---

## 📝 License

This project is open source and available for educational purposes.

---

## 🎉 Enjoy ChatBro!

Start chatting with friends using unique codes. No phone numbers, no complex setup - just simple, real-time messaging!
