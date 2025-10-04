# ManageBuddy – Firebase Setup Guide 🔥

## Quick Setup (5 minutes)

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name: `managebuddy` (or your choice)
4. Disable Google Analytics (optional)
5. Click **"Create project"**

### 2. Add Web App to Firebase

1. In your Firebase project, click the **web icon** (</>)
2. Register app name: `ManageBuddy`
3. **Copy the Firebase configuration** (you'll need this next)
4. Click **"Continue to console"**

### 3. Configure Your App

Open `/config/firebase.ts` and replace with your Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "AIza...",                    // Your API key
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123:web:abc123"
};
```

### 4. Enable Email Authentication

1. In Firebase Console, go to **Authentication**
2. Click **"Get started"**
3. Click **"Sign-in method"** tab
4. Click **"Email/Password"**
5. Toggle **"Enable"**
6. Click **"Save"**

### 5. Create Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **"Create database"**
3. Select **"Start in test mode"**
4. Choose your location (closest to your users)
5. Click **"Enable"**

### 6. Set Security Rules

1. Go to **Firestore Database** → **Rules** tab
2. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /expenses/{expenseId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && 
        request.resource.data.userId == request.auth.uid;
    }
  }
}
```

3. Click **"Publish"**

## ✅ Test Your Setup

```bash
# Start the app
bun run start

# Or test in browser
bun run start-web
```

1. Create a new account
2. Complete onboarding (name, income, personality)
3. Add an expense
4. Check Firestore Console to see your data

## 🔍 Verify in Firebase Console

### Check Authentication
- Go to **Authentication** → **Users**
- You should see your test user

### Check Firestore
- Go to **Firestore Database** → **Data**
- You should see:
  - `users` collection with your profile
  - `expenses` collection with your test expense

## 🚨 Common Issues

### "Firebase: Error (auth/invalid-api-key)"
- Double-check your `apiKey` in `/config/firebase.ts`
- Make sure you copied the entire key

### "Missing or insufficient permissions"
- Verify Firestore security rules are published
- Check that Authentication is enabled

### "Network request failed"
- Check your internet connection
- Verify Firebase project is active
- Try restarting the dev server

## 🔐 Production Security

Before deploying to production:

1. **Update Firestore Rules** to production mode
2. **Enable App Check** in Firebase Console
3. **Use environment variables** for Firebase config
4. **Enable email verification** in Authentication settings
5. **Set up billing alerts** in Firebase Console

## 📱 Next Steps

- Customize theme colors in `/constants/colors.ts`
- Add more expense categories in `/types/index.ts`
- Modify personality messages in `/contexts/AppContext.tsx`
- Deploy to App Store/Google Play with EAS

## 💡 Tips

- Use **test mode** for development
- Switch to **production rules** before launch
- Monitor usage in Firebase Console
- Set up **Firebase Analytics** for insights

## 🆘 Need Help?

- [Firebase Documentation](https://firebase.google.com/docs)
- [Expo + Firebase Guide](https://docs.expo.dev/guides/using-firebase/)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

---

Happy coding! 🚀
