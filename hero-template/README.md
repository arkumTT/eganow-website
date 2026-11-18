# Eganow scroll-hero template

A scroll-driven hero system: **white side = copy** (eyebrow, title, subtext, two buttons),
**red side = a WebGL stage**. On scroll, a thick **red** and a thinner **blue** satin ribbon
wave across the red side, cover the current 3D object and reveal the next one.
Page load plays an intro where the ribbons loop in a circle around the first object,
then unfurl and fly off.

## Run it
ES modules need HTTP (not `file://`):
```bash
cd hero-template && npx serve .      # or: python3 -m http.server 8000
```
No build step. Three.js r170 is vendored in `vendor/` so it works offline.

## How the transition works
1. **Ribbons** (`js/ribbons.js`) – a flat strip whose centre-line (a W-like sine wave), width and
   travelling twist are computed in the vertex shader; satin look in the fragment shader.
   Red is ~30% wider than blue (`CFG.red.width` / `CFG.blue.width` in `js/main.js`).
2. **The swap is real, not a crossfade** – each slide's meshes get two clipping planes that follow the
   red ribbon's centre-line. The old object is clipped away *ahead* of the ribbon and the new object
   appears *behind* it, so the cut is always hidden under the red ribbon.
3. **Scroll → progress** – one sticky viewport; `scrollY / innerHeight` drives everything with inertia.
   `CFG.hold` is the dead-zone each slide rests in. Proximity scroll-snap helps it land on a hold.
4. **Intro** – `introSeconds`; ribbons morph ring → sweep (`uRing` uniform).

## Add / edit a slide
1. Add an `<article class="copy-slide" data-scene="mything">` in `index.html` (+ a dot button).
2. Add `BUILDERS.mything = () => { …return THREE.Group }` in `js/main.js` (use `buildPhone(texture)`).
3. Add a snap marker `<i class="snap" style="top:300vh">` and the page height updates itself.

## Replace the placeholders (important)
* **Logo** – `index.html` has a stand-in wordmark; drop in the official Eganow SVG.
* **Brand colours/font** – tokens at the top of `styles.css`; ribbon colours in `CFG`.
* **People on screens** – currently *drawn illustrations* (`js/screens.js`). For production use real
  photography: `S.momAndChildScreen({ photo: 'img/mother-daughter.jpg' })` (portrait, ≥1080×2200;
  the UI chip is drawn on top). Suggested shots, all warm, natural light, smiling to camera:
  * Transfer – Ghanaian mother (30–35) + child (4–5) waving; and a man (30–45) waving back.
  * Merchant – market-stall owner holding up a QR code.
  * Bills – young adult paying a bill with a thumbs-up.
* **Phone model** – built procedurally (`js/phone.js`). A branded GLB can replace it via `GLTFLoader`.

## Accessibility / perf
Copy lives in real HTML (no-JS readable), inactive slides are `inert`, dots are buttons,
`prefers-reduced-motion` slows ribbon motion, DPR is capped at 2, ribbons render only mid-transition.
