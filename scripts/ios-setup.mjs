// Adds the iPhone settings AdMob and the App Store need to ios/App/App/Info.plist.
// Safe to run again: it only adds keys that are missing. Run after "npx cap add ios".
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Replace with your real AdMob *App ID* (it has a "~" in it) once AdMob gives you one.
const ADMOB_APP_ID = 'ca-app-pub-3940256099942544~1458002511'; // Google's test app ID

const SKADNETWORKS = ['cstr6suwn9','4fzdc2evr5','2fnua5tdw4','ydx93a7ass','p78axxw29g','v72qych5uu','ludvb6z3bs','cp8zw746q7','3sh42y64q3','c6k4g5qg8m','s39g8k73mm','wg4vff78zm','3qy4746246','f38h382jlk','hs6bdukanm','mlmmfzh3r3','v4nxqhlyqp','wzmmz9fp6w','su67r6k2v3','yclnxrl5pm','t38b2kh725','7ug5zh24hu','gta9lk7p23','vutu7akeur','y5ghdn5j9k','v9wttpbfk9','n38lu8286q','47vhws6wlr','kbd757ywx3','9t245vhmpl','a2p9lx4jpn','22mmun2rn5','44jx6755aq','k674qkevps','4468km3ulz','2u9pt9hc89','8s468mfl3y','klf5c3l5u5','ppxm28t8ap','kbmxgpxpgc','uw77j35x4d','578prtvx9j','4dzt52r2t5','tl55sbb4fm','c3frkrj4fj','e5fvkxwrpn','8c4e2ghe7u','3rd42ekr43','97r2b46745','3qcr597p9d'];

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const plistPath = path.join(root, 'ios/App/App/Info.plist');
if (!fs.existsSync(plistPath)) { console.error('No ios/App/App/Info.plist yet. Run "npx cap add ios" first.'); process.exit(1); }
let plist = fs.readFileSync(plistPath, 'utf8');
const add = (key, xml) => { if (!plist.includes(`<key>${key}</key>`)) plist = plist.replace(/<\/dict>\s*<\/plist>\s*$/, `\t<key>${key}</key>\n${xml}\n</dict>\n</plist>\n`); };

add('GADApplicationIdentifier', `\t<string>${ADMOB_APP_ID}</string>`);
add('NSUserTrackingUsageDescription', '\t<string>This lets Beer Dye show ads that are more relevant to you. Ads pay for the game.</string>');
add('ITSAppUsesNonExemptEncryption', '\t<false/>');
add('SKAdNetworkItems', '\t<array>\n' + SKADNETWORKS.map(id => `\t\t<dict>\n\t\t\t<key>SKAdNetworkIdentifier</key>\n\t\t\t<string>${id}.skadnetwork</string>\n\t\t</dict>`).join('\n') + '\n\t</array>');
// the game is built for portrait: lock iPhone to portrait
plist = plist.replace(/(<key>UISupportedInterfaceOrientations<\/key>\s*<array>)[\s\S]*?(<\/array>)/, '$1\n\t\t<string>UIInterfaceOrientationPortrait</string>\n\t$2');
fs.writeFileSync(plistPath, plist);
console.log('Info.plist ready: AdMob app ID, tracking prompt text, SKAdNetwork IDs, portrait only.');
