# Putting Beer Dye on the App Store (with ads)

Everything in this repository is already set up for an iPhone app: the Xcode project (`ios/`), the app icon and launch screen, AdMob ads between games, account deletion, chat report/block, and a privacy policy page. What's left needs your Apple and Google accounts and your Mac.

---

## 1. Join the Apple Developer Program ($99/year)
1. Go to https://developer.apple.com/programs/enroll and sign in with your Apple ID.
2. Enroll as an **Individual**. Approval usually takes 1–2 days.
3. You can do steps 2–4 below while you wait.

## 2. Update the database rules (for chat reports)
Firebase console → **Firestore Database → Rules**, replace everything with this, then **Publish**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
    match /reports/{id} {
      allow create: if request.auth != null;
    }
  }
}
```

Reported chat messages show up under **Firestore → Data → reports**. Check them now and then; Apple requires that you respond to reports.

## 3. Build and run it on your iPhone (Mac)
1. Install **Xcode** from the Mac App Store (free, large download), open it once, and accept the prompts.
2. Install **Node.js** (LTS) from https://nodejs.org.
3. Open **Terminal** and run:
   ```
   git clone https://github.com/MatthiasG26/Beer-Die.git
   cd Beer-Die
   npm install
   npm run ios
   ```
   This builds the game, syncs it into the iOS project, and opens Xcode.
4. In Xcode, click **App** in the left sidebar → **Signing & Capabilities** → **Team**: pick your Apple ID (add it under Xcode → Settings → Accounts if needed).
5. Plug in your iPhone, choose it at the top of Xcode, and press ▶ Run. On the phone, allow the developer in **Settings → General → VPN & Device Management** the first time.

You'll see Google's **test** ads after every 2 finished games. That's expected until step 4.

Any time the game changes, run `npm run ios` again to rebuild the app with the latest version.

## 4. Real ads: set up Google AdMob
1. Go to https://admob.google.com and sign in with your Google account. Fill in payment info (this is how you get paid).
2. **Apps → Add app → iOS**. Say it's not published yet. Name it **Beer Dye**.
3. Copy the **App ID** (looks like `ca-app-pub-1234567890123456~1234567890`, with a `~`).
4. **Ad units → Add ad unit → Interstitial**, name it `between-games`. Copy the **ad unit ID** (with a `/`).
5. In this repository:
   - `scripts/ios-setup.mjs`: replace `ADMOB_APP_ID` with your App ID, then delete the line `<key>GADApplicationIdentifier</key>` and the line under it from `ios/App/App/Info.plist` and run `node scripts/ios-setup.mjs` (it re-adds it with your ID).
   - `app-config.js`: set `iosInterstitial` to your ad unit ID and `testing` to `false`.
6. Run `npm run ios` again.

Never tap your own real ads; Google bans accounts for that. Keep `testing: true` while you're playing it yourself during development.

## 5. Create the app in App Store Connect
1. https://appstoreconnect.apple.com → **Apps → + → New App**.
   - Platform: iOS · Name: **Beer Dye** (or another name if taken) · Language: English
   - Bundle ID: **com.matthiasg26.beerdie** (create it at developer.apple.com → Identifiers if it's not listed)
   - SKU: `beerdie1`
2. **App Privacy**: answer the questionnaire:
   - Contact info: **Email address** (for the account; linked to the user; not used for tracking)
   - Identifiers: **Device ID** (AdMob; used for third-party advertising; may be used for tracking)
   - Usage data: **Product interaction** and **Advertising data** (AdMob)
   - User content: **Other user content** (chat)
   - Privacy Policy URL: `https://matthiasg26.github.io/Beer-Die/privacy.html`
3. **Age rating**: answer honestly. The game shows alcohol (beer cups, the name) but doesn't reward drinking, and it has unrestricted chat. Expect **17+**.
4. **Screenshots**: run the app in the iPhone 16 Pro Max simulator in Xcode (or your phone) and take screenshots of the menu and a game. You need 6.9" or 6.7" iPhone screenshots.
5. Description, keywords (e.g. `beer die, dice, party game, college, multiplayer`), support URL (`https://matthiasg26.github.io/Beer-Die/`).

## 6. Upload and submit
1. In Xcode: top bar device → **Any iOS Device (arm64)** → menu **Product → Archive**.
2. When the Organizer opens: **Distribute App → App Store Connect → Upload**.
3. In App Store Connect, open the build under **TestFlight** to test it on your phone first (optional but smart).
4. On the app's version page: pick the build, fill **App Review Information** (your contact info; for the demo account, create a test account in the game and give its email/password so reviewers can try sign-in), then **Add for Review → Submit**.

Review usually takes 1–3 days. If Apple rejects something, send me the message and I'll fix it.

---

## What's already handled for App Review
- **Account deletion** (5.1.1(v)): menu → under your level → **Delete account**.
- **Chat safety** (1.2): slur filter on names/chat; tap any message to **Report** or **Block**; contact email in Rules.
- **Login services** (4.8): the app offers only email/password, so Sign in with Apple isn't required. (Google sign-in stays on the website.)
- **Trademarks** (5.2): the University of Dallas table becomes a generic **College** table inside the app.
- **Alcohol** (1.4.3): the game never tells anyone to drink; keep it that way in the description and screenshots too.
- **Ads**: only between games, with Apple's tracking prompt.

## Before you launch big
Online play currently goes through a free public relay server. It's fine for friends, but for thousands of players it should move to your own Firebase (Realtime Database), which also blocks people from faking game moves. Ask me to do that before you promote the app widely.
