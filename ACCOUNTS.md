# Turning on Beer Die accounts (Firebase)

Accounts keep each player's level, XP, name, arena and table in the cloud, so progress follows them to any phone. Until `firebase-config.js` is filled in, the game runs without logins and progress stays on each device.

## 1. Create the Firebase project (free)
1. Go to https://console.firebase.google.com and sign in with your Google account.
2. **Add project** → name it `beer-die` → you can turn Google Analytics off → **Create project**.

## 2. Turn on sign-in methods
1. Left menu → **Build → Authentication → Get started**.
2. **Sign-in method** tab → enable **Email/Password** → Save.
3. Enable **Google** → pick a support email → Save.
4. **Settings** tab → **Authorized domains** → **Add domain** → `matthiasg26.github.io`.

## 3. Create the database
1. Left menu → **Build → Firestore Database → Create database**.
2. Pick a location near you (for example `us-central`) → start in **production mode**.
3. Open the **Rules** tab, replace everything with the rules below, and **Publish**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

Each player can only read and write their own progress.

## 4. Get the web config
1. Project Overview (gear icon) → **Project settings** → scroll to **Your apps** → click the **</>** (Web) icon.
2. Nickname `beer-die-web` → **Register app** (no hosting needed).
3. Copy the `firebaseConfig = { ... }` object it shows.

## 5. Paste it in
Open `firebase-config.js` and replace `window.BEERDIE_FIREBASE = null;` with:

```js
window.BEERDIE_FIREBASE = { apiKey: "...", authDomain: "...", projectId: "...", storageBucket: "...", messagingSenderId: "...", appId: "..." };
```

These values are safe to publish; the rules above are what protect the data. Commit, wait a minute for GitHub Pages, and reload the game: the login screen appears.

## Notes for the phone app
- Email/password sign-in works inside an app wrapper (for example Capacitor) as-is.
- "Continue with Google" uses a popup, which works in browsers but not inside most app wrappers. When you wrap the game as an app, switch Google sign-in to the native plugin (for example `@capacitor-firebase/authentication`) or hide that button.
