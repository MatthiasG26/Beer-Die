// Builds the app's web bundle into www/: the game plus every library it needs, stored locally
// so the iPhone app doesn't depend on outside CDNs to start.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const www = path.join(root, 'www');
fs.rmSync(www, { recursive: true, force: true });
fs.mkdirSync(path.join(www, 'vendor'), { recursive: true });

const vendor = [
  ['node_modules/three/build/three.min.js', 'vendor/three.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'],
  ['node_modules/mqtt/dist/mqtt.min.js', 'vendor/mqtt.min.js', 'https://cdn.jsdelivr.net/npm/mqtt@5.10.1/dist/mqtt.min.js'],
  ['node_modules/firebase/firebase-app-compat.js', 'vendor/firebase-app-compat.js', 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js'],
  ['node_modules/firebase/firebase-auth-compat.js', 'vendor/firebase-auth-compat.js', 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js'],
  ['node_modules/firebase/firebase-firestore-compat.js', 'vendor/firebase-firestore-compat.js', 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js'],
];

let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
for (const [from, to, url] of vendor) {
  const src = path.join(root, from);
  if (!fs.existsSync(src)) throw new Error(`Missing ${from}. Run "npm install" first.`);
  fs.copyFileSync(src, path.join(www, to));
  if (!html.includes(url)) throw new Error(`index.html no longer loads ${url}; update scripts/build-app.mjs`);
  html = html.split(url).join(to);
}
fs.writeFileSync(path.join(www, 'index.html'), html);
for (const f of ['firebase-config.js', 'app-config.js', 'privacy.html']) fs.copyFileSync(path.join(root, f), path.join(www, f));
console.log('Built www/ with', vendor.length, 'bundled libraries.');
