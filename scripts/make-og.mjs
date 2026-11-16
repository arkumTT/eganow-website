// Renders public/og/<slug>.png (1200x630) for every card in src/data/og-cards.mjs.
//   npm run og        (needs Playwright + Chromium available; the generated PNGs are committed, so a normal build never needs this)
// Fonts and logos are embedded from node_modules / public/brand, so the output is deterministic and offline.
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright';
import { OG_CARDS, OG_SIZE } from '../src/data/og-cards.mjs';

const font = (pkg, file) => `data:font/woff2;base64,${readFileSync(`node_modules/@fontsource/${pkg}/files/${file}`).toString('base64')}`;
const FONTS = `
@font-face { font-family: Poppins; font-weight: 700; src: url(${font('poppins', 'poppins-latin-700-normal.woff2')}) format('woff2'); }
@font-face { font-family: Poppins; font-weight: 600; src: url(${font('poppins', 'poppins-latin-600-normal.woff2')}) format('woff2'); }
@font-face { font-family: Inter; font-weight: 500; src: url(${font('inter', 'inter-latin-500-normal.woff2')}) format('woff2'); }`;
const svg = (f) => readFileSync(`public/brand/${f}`, 'utf8');
const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THEMES = {
  personal: { bg: '#f8f9fa', ink: '#111827', muted: '#4b5563', plane: '#cc0229', plane2: '#ffb3bf', wordmark: 'eganow-wordmark-red.svg',   tile: '#ffffff', icon: 'eganow-icon.svg', overline: '#cc0229' },
  business: { bg: '#f8f9fa', ink: '#111827', muted: '#4b5563', plane: '#1f8fff', plane2: '#b9dcff', wordmark: 'eganow-wordmark-red.svg',   tile: '#ffffff', icon: 'eganow-icon.svg', overline: '#374151' },
  neutral:  { bg: '#0a0d14', ink: '#ffffff', muted: '#cfd4da', plane: '#cc0229', plane2: '#1f8fff', wordmark: 'eganow-wordmark-white.svg', tile: '#ffffff', icon: 'eganow-icon.svg', overline: '#cfd4da' },
};

function html(c) {
  const t = THEMES[c.world];
  const n = c.headline.length; const size = n <= 13 ? 104 : n <= 19 ? 84 : n <= 26 ? 68 : 62; // size by length so the headline stays inside the text column
  return `<!doctype html><meta charset="utf-8"><style>${FONTS}
  * { box-sizing: border-box; margin: 0; }
  html, body { width: ${OG_SIZE.width}px; height: ${OG_SIZE.height}px; overflow: hidden; }
  body { background: ${t.bg}; color: ${t.ink}; font-family: Inter, sans-serif; position: relative; }
  .p2 { position: absolute; top: 0; right: 0; width: 54%; height: 100%; background: ${t.plane2}; clip-path: polygon(40% 0, 100% 0, 100% 100%, 0 100%); ${c.world === 'neutral' ? 'opacity: .9;' : 'opacity: .6;'} }
  .p1 { position: absolute; top: 0; right: 0; width: 46%; height: 100%; background: ${t.plane}; clip-path: polygon(36% 0, 100% 0, 100% 100%, 0 100%); }
  .tile { position: absolute; right: 96px; top: 50%; translate: 0 -50%; width: 250px; height: 250px; border-radius: 56px; background: ${t.tile}; display: grid; place-items: center; box-shadow: 0 40px 70px -20px rgba(10,13,20,.55); rotate: 6deg; }
  .tile img { width: 150px; height: 150px; }
  .col { position: absolute; left: 72px; top: 64px; bottom: 64px; width: 540px; display: flex; flex-direction: column; }
  .wm { height: 58px; width: auto; align-self: flex-start; }
  .mid { margin-top: auto; margin-bottom: auto; padding-top: 18px; }
  .over { font: 600 22px/1 Poppins, sans-serif; letter-spacing: .1em; text-transform: uppercase; color: ${t.overline}; display: flex; align-items: center; gap: 12px; margin-bottom: 22px; }
  .over i { display: block; width: 14px; height: 14px; border-radius: 3px; background: ${c.world === 'business' ? '#1f8fff' : c.world === 'neutral' ? '#1f8fff' : '#cc0229'}; }
  h1 { font: 700 ${size}px/1.05 Poppins, sans-serif; letter-spacing: -0.025em; color: ${t.ink}; text-wrap: balance; }
  .sub { margin-top: 22px; font: 500 28px/1.35 Inter, sans-serif; color: ${t.muted}; max-width: 500px; text-wrap: pretty; }
  .url { font: 600 24px/1 Poppins, sans-serif; color: ${t.muted}; letter-spacing: .02em; }
  </style>
  <div class="p2"></div><div class="p1"></div>
  <div class="tile"><img src="data:image/svg+xml;base64,${Buffer.from(svg(t.icon)).toString('base64')}" alt=""></div>
  <div class="col">
    <img class="wm" src="data:image/svg+xml;base64,${Buffer.from(svg(t.wordmark)).toString('base64')}" alt="">
    <div class="mid"><div class="over"><i></i>${esc(c.label)}</div><h1>${esc(c.headline)}</h1><p class="sub">${esc(c.sub)}</p></div>
    <div class="url">eganow.com</div>
  </div>`;
}

mkdirSync('public/og', { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: OG_SIZE, deviceScaleFactor: 1 });
for (const c of OG_CARDS) {
  await page.setContent(html(c), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const buf = await page.screenshot({ type: 'png', clip: { x: 0, y: 0, ...OG_SIZE } });
  writeFileSync(`public/og/${c.slug}.png`, buf);
  console.log(`public/og/${c.slug}.png  ${(buf.length / 1024).toFixed(0)} KB`);
}
await browser.close();
