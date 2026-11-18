import * as THREE from 'three';
import { RoomEnvironment } from '../vendor/addons/RoomEnvironment.js';
import { createRibbon } from './ribbons.js';
import { buildPhone } from './phone.js';
import * as S from './screens.js';

/* =====================================================================
   CONFIG — everything you are likely to tweak lives here
   ===================================================================== */
const CFG = {
  hold: 0.2,            // fraction of each slide (either side) where nothing moves
  sweepAngle: 0.2,      // radians; tilt of the ribbon sweep line
  smoothing: 7,         // scroll inertia (higher = snappier)
  introSeconds: 3.6,
  red:  { width: 2.7, amp: 0.36, freq: 8.4,  twist: 0.95,  colors: ['#6e0816', '#d81c2b', '#ff5a63'] },
  blue: { width: 2.1, amp: 0.55, freq: 10.2, twist: 1.35, colors: ['#0c1f8f', '#2a52f0', '#86adff'] }, // red ≈ 30% thicker (set both to taste)
};

// Phone-screen photos (Magnific-generated). Set a value to null to fall back to the drawn illustration.
const PHOTOS = {
  momAndChild: 'img/mother-daughter.jpg',
  man: 'img/man-waving.jpg',
  vendor: 'img/vendor-qr.jpg',
  bills: 'img/bills-thumbsup.jpg',
};

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;

/* ---------- renderer / scene ---------- */
const canvas = document.getElementById('gl');
const panel = document.getElementById('panel');
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
renderer.setClearColor(0x000000, 0);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.localClippingEnabled = true;
renderer.toneMapping = THREE.NoToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.9;

const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 60);
const key = new THREE.DirectionalLight(0xffffff, 1.2); key.position.set(-3, 4, 6); scene.add(key);

/* ---------- ribbons (red thicker than blue) ---------- */
const redRibbon = createRibbon({ ...CFG.red, phase: 0.0, speed: 1.1 });
const blueRibbon = createRibbon({ ...CFG.blue, phase: 2.1, speed: 1.35, ringR: 1.75, ringTurns: 1.15, ringTilt: -0.8 });
const ribbonGroup = new THREE.Group();
ribbonGroup.rotation.z = CFG.sweepAngle;
ribbonGroup.position.z = 1.1;                   // in front of the phones
ribbonGroup.add(blueRibbon, redRibbon);
redRibbon.renderOrder = 2; blueRibbon.renderOrder = 1;
scene.add(ribbonGroup);

/* ---------- clip planes: object swap is hidden under the red ribbon ---------- */
const N = new THREE.Vector3(-Math.sin(CFG.sweepAngle), Math.cos(CFG.sweepAngle), 0);
const FAR = 1e4;

function makeSlide(build) {
  const root = new THREE.Group();
  const content = build();
  root.add(content);
  // halo: soft disc + ring that "opens" as the object is revealed
  const halo = new THREE.Group();
  const disc = new THREE.Mesh(new THREE.CircleGeometry(2.15, 96), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.11, depthWrite: false }));
  const ring = new THREE.Mesh(new THREE.RingGeometry(2.15, 2.18, 128), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.45, depthWrite: false }));
  halo.add(disc, ring); halo.position.z = -0.9; root.add(halo);
  const enter = new THREE.Plane(N.clone().negate(), FAR);   // keep side "behind" the sweep line
  const exit = new THREE.Plane(N.clone(), FAR);             // keep side "ahead" of the sweep line
  root.traverse((o) => {
    if (!o.material) return;
    [].concat(o.material).forEach((m) => { m.clippingPlanes = [enter, exit]; });
  });
  scene.add(root);
  return { root, content, halo, enter, exit };
}

/* ---------- scene builders (one per slide; add your own) ---------- */
function coins(from, to, lift = 1.1, count = 12) {
  const g = new THREE.Group();
  const geo = new THREE.CylinderGeometry(0.075, 0.075, 0.02, 24);
  const mat = new THREE.MeshBasicMaterial({ color: 0xffe08a });
  const items = [];
  for (let i = 0; i < count; i++) { const m = new THREE.Mesh(geo, mat); m.rotation.x = Math.PI / 2; g.add(m); items.push(m); }
  const a = new THREE.Vector3(...from), b = new THREE.Vector3(...to);
  g.userData.tick = (t) => items.forEach((m, i) => {
    const k = (t * 0.28 + i / count) % 1;
    m.position.lerpVectors(a, b, k); m.position.y += Math.sin(k * Math.PI) * lift;
    m.rotation.z = t * 3 + i; m.scale.setScalar(Math.sin(k * Math.PI) * 1.1 + 0.15);
  });
  return g;
}
function floatCard(tex, w, h) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false }));
  return m;
}

const BUILDERS = {
  transfer() { // two phones, screens facing each other
    const g = new THREE.Group();
    const a = buildPhone(S.momAndChildScreen({ photo: PHOTOS.momAndChild })); a.position.set(-1.15, 0.12, 0); a.rotation.set(0.04, 0.62, 0.07);
    const b = buildPhone(S.manScreen({ photo: PHOTOS.man }));         b.position.set(1.15, -0.1, 0);  b.rotation.set(0.04, -0.62, -0.07);
    const c = coins([-0.7, 0.7, 0.3], [0.7, 0.7, 0.3], 0.8);
    g.add(a, b, c); g.userData.parts = { a, b }; g.userData.extra = [c];
    return g;
  },
  merchant() {
    const g = new THREE.Group();
    const p = buildPhone(S.vendorScreen({ photo: PHOTOS.vendor })); p.position.set(-0.5, 0, 0); p.rotation.set(0.04, -0.38, 0.05); p.scale.setScalar(1.12);
    const card = floatCard(S.qrCardTexture(), 1.25, 1.55); card.position.set(1.08, -0.15, 0.45); card.rotation.set(0.05, -0.5, -0.06);
    g.add(p, card); g.userData.parts = { p, card };
    return g;
  },
  bills() {
    const g = new THREE.Group();
    const p = buildPhone(S.billsScreen({ photo: PHOTOS.bills })); p.position.set(0, 0, 0); p.rotation.set(0.04, 0.34, -0.05); p.scale.setScalar(1.12);
    const c1 = floatCard(S.chipTexture('ECG · Paid', '#16a34a', 330), 1.3, 0.47); c1.position.set(-0.95, 0.8, 0.6);
    const c2 = floatCard(S.chipTexture('Airtime · Done', '#2563eb', 380), 1.5, 0.47); c2.position.set(0.9, -0.55, 0.65);
    g.add(p, c1, c2); g.userData.parts = { p, c1, c2 };
    return g;
  },
};

const copyEls = [...document.querySelectorAll('.copy-slide')];
const slides = copyEls.map((el) => makeSlide(BUILDERS[el.dataset.scene]));
const COUNT = slides.length;
document.getElementById('story').style.setProperty('--n', COUNT);

/* ---------- layout ---------- */
let viewW = 1, viewH = 1, extentE = 6, shiftPx = 0;
function resize() {
  const r = panel.getBoundingClientRect();
  viewW = Math.max(1, r.width); viewH = Math.max(1, r.height);
  renderer.setSize(viewW, viewH, false);
  const aspect = viewW / viewH;
  const mobile = innerWidth < 860;
  shiftPx = mobile ? 0 : viewW * 0.12;                       // keep objects clear of the curved edge
  const usable = (viewW - shiftPx * 0.9) / viewH;
  camera.aspect = aspect;
  camera.position.set(0, 0, Math.max(10, 9.4 / usable));
  camera.setViewOffset(viewW, viewH, -shiftPx, 0, viewW, viewH);
  camera.updateProjectionMatrix();
  const h = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  const w = h * aspect;
  // half-extent of the visible stage projected on the sweep normal (+ margin for shift/ribbon z)
  extentE = (Math.abs(N.x) * w * 0.62 + Math.abs(N.y) * h * 0.52);
  for (const r of [redRibbon, blueRibbon]) r.material.uniforms.uSpan.value = w * 2.2;
}
addEventListener('resize', resize); resize();

const TRAIL = 2.1;
const D0 = () => -(extentE + CFG.red.width * 0.5 + 0.3);                          // red fully below the stage
const D1 = () => extentE + TRAIL + 0.7 + CFG.blue.width * 0.5 + 0.3;              // blue fully above it

/* ---------- scroll ---------- */
let target = 0, cur = 0;
const maxScroll = () => Math.max(1, document.getElementById('story').offsetHeight - innerHeight);
const readScroll = () => { target = clamp(scrollY / innerHeight, 0, COUNT - 1); };
addEventListener('scroll', readScroll, { passive: true }); readScroll();
cur = target;

const trans = (s, k) => clamp((s - (k + CFG.hold)) / (1 - 2 * CFG.hold));
const ease = (q) => q * q * (3 - 2 * q);

/* ---------- pointer parallax ---------- */
const ptr = { x: 0, y: 0, sx: 0, sy: 0 };
addEventListener('pointermove', (e) => { ptr.x = (e.clientX / innerWidth) * 2 - 1; ptr.y = (e.clientY / innerHeight) * 2 - 1; });

/* ---------- dots + copy ---------- */
const dots = [...document.querySelectorAll('.dots button')];
dots.forEach((d, i) => d.addEventListener('click', () => scrollTo({ top: i * innerHeight, behavior: reduceMotion ? 'auto' : 'smooth' })));
document.querySelector('.scroll-hint')?.addEventListener('click', () => scrollTo({ top: innerHeight, behavior: 'smooth' }));

/* ---------- frame loop ---------- */
const clock = new THREE.Clock();
let introT = reduceMotion ? CFG.introSeconds : 0;
const introDone = () => introT >= CFG.introSeconds;
document.documentElement.classList.add('is-loading');

function setRibbon(mesh, { time, d, ring, widthMul, twistMul, ampMul }) {
  const u = mesh.material.uniforms, b = mesh.userData.base;
  u.uTime.value = time; u.uD.value = d; u.uRing.value = ring;
  u.uWidth.value = b.width * widthMul; u.uTwist.value = b.twist * twistMul; u.uAmp.value = b.amp * ampMul;
}

function frame() {
  const dt = Math.min(clock.getDelta(), 0.05);
  const t = clock.elapsedTime * (reduceMotion ? 0.15 : 1);
  if (!introDone()) introT += dt;
  cur += (target - cur) * (1 - Math.exp(-CFG.smoothing * dt));
  if (Math.abs(target - cur) < 1e-4) cur = target;
  ptr.sx += (ptr.x - ptr.sx) * 0.06; ptr.sy += (ptr.y - ptr.sy) * 0.06;

  const d0 = D0(), d1 = D1();
  const dAt = (q) => lerp(d0, d1, q);                  // sweep-line offset along N for q 0..1
  let ribbonsOn = false;

  /* -- active transition (scroll) -- */
  const k = clamp(Math.floor(cur), 0, COUNT - 2);
  const qRaw = COUNT > 1 && introDone() ? trans(cur, k) : 0;
  const q = ease(qRaw);
  if (qRaw > 0 && qRaw < 1) {
    ribbonsOn = true;
    const dr = dAt(q);
    const trail = TRAIL + 0.7 * Math.sin(q * Math.PI * 2 + k);          // blue weaves close/far from red
    const env = 0.55 + 0.45 * Math.sin(q * Math.PI);                    // flutter peaks mid-sweep
    setRibbon(redRibbon, { time: t + k * 3.1, d: dr, ring: 0, widthMul: 1, twistMul: env, ampMul: env });
    setRibbon(blueRibbon, { time: t + k * 3.1 + 1.7, d: dr - trail, ring: 0, widthMul: 1, twistMul: 0.6 + env, ampMul: 0.7 + env * 0.5 });
  }

  /* -- intro: ring around the first object, then unfurl & fly out -- */
  let intro = 1;
  if (!introDone()) {
    ribbonsOn = true;
    const ringW = 1 - smooth(1.5, 2.6, introT);
    const out = smooth(2.2, CFG.introSeconds, introT);
    const wm = lerp(0.28, 1, smooth(1.5, 2.8, introT));
    const dr = lerp(0, d1, ease(out));
    setRibbon(redRibbon, { time: introT * 1.2, d: dr, ring: ringW, widthMul: wm, twistMul: 1, ampMul: 0.8 });
    setRibbon(blueRibbon, { time: introT * 1.2 + 1.7, d: dr - TRAIL * out, ring: ringW, widthMul: wm, twistMul: 1, ampMul: 0.8 });
    intro = smooth(0.35, 1.9, introT);
  } else if (!document.documentElement.classList.contains('is-ready')) {
    document.documentElement.classList.remove('is-loading'); document.documentElement.classList.add('is-ready');
  }
  if (introT > 0.4) document.documentElement.classList.add('copy-in');
  ribbonGroup.visible = ribbonsOn;

  /* -- slides: clip planes + idle motion -- */
  slides.forEach((s, i) => {
    const qIn = i === 0 ? 1 : ease(trans(cur, i - 1));
    const qOut = i === COUNT - 1 ? 0 : ease(trans(cur, i));
    s.root.visible = qIn > 0 && qOut < 1;
    // enter: keep n·p <= d_in   (plane normal -N, constant +d)
    s.enter.constant = i === 0 ? FAR : dAt(qIn);
    // exit: keep n·p >= d_out   (plane normal +N, constant -d)
    s.exit.constant = i === COUNT - 1 ? FAR : -dAt(qOut);

    const reveal = i === 0 ? intro : smooth(0.35, 1, qIn);
    const hide = smooth(0, 0.5, qOut);
    const scl = 1.18 * lerp(0.82, 1, reveal) * lerp(1, 0.96, hide);
    s.content.scale.setScalar(scl);
    s.content.rotation.y = ptr.sx * 0.12 + (1 - reveal) * 0.5;
    s.content.rotation.x = ptr.sy * 0.06;
    s.content.position.y = Math.sin(t * 0.9 + i) * 0.06;
    s.halo.scale.setScalar(lerp(0.4, 1, reveal) * (1 + Math.sin(t * 0.8 + i) * 0.015));
    s.halo.children.forEach((m) => { m.material.opacity = (m === s.halo.children[0] ? 0.11 : 0.45) * reveal; });
    s.content.children.forEach((c) => c.userData.tick?.(t));
    if (s.content.userData.parts) {
      const P = s.content.userData.parts; let j = 0;
      for (const key in P) { const o = P[key]; o.userData.baseY ??= o.position.y; o.position.y = o.userData.baseY + Math.sin(t * 1.1 + j * 1.9 + i) * 0.05; j++; }
    }
  });

  /* -- copy crossfade (left, white side) -- */
  copyEls.forEach((el, i) => {
    const dist = cur - i;
    const a = clamp(1 - (Math.abs(dist) - 0.2) / 0.22);
    el.style.opacity = a;
    el.style.transform = `translate3d(0, ${(-dist * 70).toFixed(1)}px, 0)`;
    el.style.visibility = a > 0.01 ? 'visible' : 'hidden';
    el.toggleAttribute('inert', a < 0.6);
  });
  const act = Math.round(cur);
  dots.forEach((d, i) => d.setAttribute('aria-current', i === act ? 'true' : 'false'));
  document.documentElement.style.setProperty('--hint', cur < 0.15 ? 1 : 0);

  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// test hook (used by the screenshot script; harmless in production)
window.__hero = { setScroll: (s) => { target = cur = s; }, skipIntro: () => { introT = CFG.introSeconds; } };
