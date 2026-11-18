// Phone-screen content.
//
// PLACEHOLDERS: the people below are drawn illustrations so the template runs with
// zero external assets. To use real photography (recommended for production), pass
// `photo: 'img/mother-daughter.jpg'` — any 540x1114-ish portrait image — and the
// UI chips are still drawn on top. See README.md for the shot list / prompts.
import * as THREE from 'three';

export const SCREEN_W = 540, SCREEN_H = 1114;

function canvas() {
  const c = document.createElement('canvas');
  c.width = SCREEN_W; c.height = SCREEN_H;
  return [c, c.getContext('2d')];
}
const rr = (x, a, b, w, h, r) => { x.beginPath(); x.roundRect(a, b, w, h, r); };

/* ---------- people ---------- */
function person(x, o) {
  const { cx, base, s = 1, skin = '#6b4330', hair = '#17110e', top = '#e63946', style = 'afro', wave = 0, kid = false } = o;
  const r = 62 * s;
  const shoulderRy = (kid ? 84 : 108) * s;
  const headY = base - shoulderRy - r * 0.55;

  // wave arm (behind body)
  if (wave) {
    const sx = cx + wave * 92 * s, sy = base - shoulderRy * 0.55;
    const hx = cx + wave * 150 * s, hy = headY - r * 0.55;
    x.lineCap = 'round';
    x.strokeStyle = top; x.lineWidth = 40 * s; x.beginPath(); x.moveTo(sx, sy); x.lineTo((sx + hx) / 2, (sy + hy) / 2 + 8 * s); x.stroke();
    x.strokeStyle = skin; x.lineWidth = 30 * s; x.beginPath(); x.moveTo((sx + hx) / 2, (sy + hy) / 2 + 8 * s); x.lineTo(hx, hy); x.stroke();
    x.fillStyle = skin; x.beginPath(); x.arc(hx, hy - 14 * s, 25 * s, 0, 7); x.fill();
    x.strokeStyle = 'rgba(255,255,255,.75)'; x.lineWidth = 4 * s;
    for (let i = 0; i < 2; i++) { x.beginPath(); x.arc(hx, hy - 14 * s, (38 + i * 13) * s, wave > 0 ? -2.3 : -0.84, wave > 0 ? -0.84 : -2.3 + Math.PI * 0.0, wave < 0); x.stroke(); }
  }
  // shoulders
  x.fillStyle = top; x.beginPath(); x.ellipse(cx, base, 128 * s, shoulderRy, 0, Math.PI, 0); x.fill();
  // neck
  x.fillStyle = shade(skin, -14); rr(x, cx - 19 * s, headY + r * 0.6, 38 * s, 56 * s, 12 * s); x.fill();
  // hair behind
  x.fillStyle = hair;
  if (style === 'afro') { x.beginPath(); x.arc(cx, headY - r * 0.2, r * 1.3, 0, 7); x.fill(); }
  if (style === 'buns') { [-1, 1].forEach(k => { x.beginPath(); x.arc(cx + k * r * 0.95, headY - r * 0.75, r * 0.46, 0, 7); x.fill(); }); }
  // head
  x.fillStyle = skin; x.beginPath(); x.ellipse(cx, headY, r * 0.92, r, 0, 0, 7); x.fill();
  // ears
  [-1, 1].forEach(k => { x.beginPath(); x.ellipse(cx + k * r * 0.93, headY + r * 0.05, r * 0.13, r * 0.2, 0, 0, 7); x.fill(); });
  // hair front
  x.fillStyle = hair;
  if (style === 'afro' || style === 'buns') { x.beginPath(); x.ellipse(cx, headY - r * 0.62, r * 0.95, r * 0.5, 0, Math.PI, 0); x.fill(); }
  if (style === 'short') { x.beginPath(); x.ellipse(cx, headY - r * 0.5, r * 0.95, r * 0.55, 0, Math.PI, 0); x.fill(); }
  if (style === 'wrap') { // head wrap
    x.fillStyle = o.wrap || '#2563eb'; x.beginPath(); x.ellipse(cx, headY - r * 0.5, r * 1.02, r * 0.62, 0, Math.PI, 0); x.fill();
    x.beginPath(); x.arc(cx + r * 0.2, headY - r * 1.05, r * 0.36, 0, 7); x.fill();
  }
  // face
  x.fillStyle = '#1a0f0b';
  [-1, 1].forEach(k => { x.beginPath(); x.ellipse(cx + k * r * 0.38, headY - r * 0.02, r * 0.09, r * 0.12, 0, 0, 7); x.fill(); });
  x.fillStyle = 'rgba(255,255,255,.8)';
  [-1, 1].forEach(k => { x.beginPath(); x.arc(cx + k * r * 0.38 + 2 * s, headY - r * 0.07, r * 0.035, 0, 7); x.fill(); });
  x.strokeStyle = shade(hair, 6); x.lineWidth = 5 * s; x.lineCap = 'round';
  [-1, 1].forEach(k => { x.beginPath(); x.moveTo(cx + k * r * 0.58, headY - r * 0.26); x.quadraticCurveTo(cx + k * r * 0.38, headY - r * 0.36, cx + k * r * 0.2, headY - r * 0.26); x.stroke(); });
  x.fillStyle = 'rgba(255,120,110,.22)';
  [-1, 1].forEach(k => { x.beginPath(); x.arc(cx + k * r * 0.58, headY + r * 0.26, r * 0.17, 0, 7); x.fill(); });
  // big smile with teeth
  x.fillStyle = '#4a1414'; x.beginPath(); x.ellipse(cx, headY + r * 0.36, r * 0.4, r * 0.25, 0, 0, Math.PI); x.fill();
  x.fillStyle = '#fff'; x.beginPath(); x.ellipse(cx, headY + r * 0.33, r * 0.34, r * 0.1, 0, 0, Math.PI); x.fill();
  x.strokeStyle = '#2b100c'; x.lineWidth = 3 * s; x.beginPath(); x.ellipse(cx, headY + r * 0.36, r * 0.4, r * 0.25, 0, 0, Math.PI); x.stroke();
  // nose
  x.strokeStyle = shade(skin, -26); x.lineWidth = 3.5 * s; x.beginPath(); x.moveTo(cx - 6 * s, headY + r * 0.2); x.quadraticCurveTo(cx, headY + r * 0.27, cx + 6 * s, headY + r * 0.2); x.stroke();
  if (o.beard) { x.fillStyle = hair; x.globalAlpha = .9; x.beginPath(); x.ellipse(cx, headY + r * 0.62, r * 0.62, r * 0.28, 0, 0, Math.PI); x.fill(); x.globalAlpha = 1; // beard under smile
    x.fillStyle = '#4a1414'; x.beginPath(); x.ellipse(cx, headY + r * 0.36, r * 0.4, r * 0.25, 0, 0, Math.PI); x.fill();
    x.fillStyle = '#fff'; x.beginPath(); x.ellipse(cx, headY + r * 0.33, r * 0.34, r * 0.1, 0, 0, Math.PI); x.fill(); }
}
let x; // current ctx (set per texture)
const shade = (hex, amt) => {
  const n = parseInt(hex.slice(1), 16);
  const c = (v) => Math.max(0, Math.min(255, v + amt));
  return `rgb(${c(n >> 16 & 255)},${c(n >> 8 & 255)},${c(n & 255)})`;
};

function backdrop(c1, c2, c3) {
  const g = x.createLinearGradient(0, 0, SCREEN_W * 0.4, SCREEN_H);
  g.addColorStop(0, c1); g.addColorStop(.55, c2); g.addColorStop(1, c3);
  x.fillStyle = g; x.fillRect(0, 0, SCREEN_W, SCREEN_H);
  // soft bokeh
  for (let i = 0; i < 9; i++) {
    const px = (i * 137) % SCREEN_W, py = (i * 211) % 700 + 40, pr = 30 + (i * 29) % 70;
    x.fillStyle = `rgba(255,255,255,${0.05 + (i % 3) * 0.03})`; x.beginPath(); x.arc(px, py, pr, 0, 7); x.fill();
  }
}
function statusBar() {
  x.fillStyle = '#fff'; x.font = '600 26px system-ui, sans-serif'; x.textAlign = 'left'; x.fillText('9:41', 46, 52);
  x.fillStyle = '#0a0a0c'; rr(x, SCREEN_W / 2 - 62, 22, 124, 38, 19); x.fill();
  x.fillStyle = '#fff'; rr(x, SCREEN_W - 98, 36, 48, 20, 6); x.fill();
}
function chip(title, sub, accent = '#16a34a', y = SCREEN_H - 250) {
  x.fillStyle = 'rgba(255,255,255,.96)'; x.shadowColor = 'rgba(0,0,0,.25)'; x.shadowBlur = 30; x.shadowOffsetY = 10;
  rr(x, 34, y, SCREEN_W - 68, 176, 34); x.fill(); x.shadowColor = 'transparent';
  x.fillStyle = accent; x.beginPath(); x.arc(92, y + 88, 31, 0, 7); x.fill();
  x.strokeStyle = '#fff'; x.lineWidth = 8; x.lineCap = 'round'; x.lineJoin = 'round';
  x.beginPath(); x.moveTo(78, y + 88); x.lineTo(89, y + 100); x.lineTo(108, y + 76); x.stroke();
  x.textAlign = 'left'; x.fillStyle = '#11131a'; x.font = '700 33px system-ui, sans-serif'; x.fillText(title, 146, y + 80);
  x.fillStyle = '#5b6070'; x.font = '500 26px system-ui, sans-serif'; x.fillText(sub, 146, y + 122);
}
function finish(photo, draw) {
  const [c, ctx] = canvas(); x = ctx;
  const tex = new THREE.CanvasTexture(c);
  draw();
  if (photo) {
    const img = new Image();
    img.onload = () => { // cover-fit the photo, then redraw chips on top
      const k = Math.max(SCREEN_W / img.width, SCREEN_H / img.height);
      x = ctx; x.drawImage(img, (SCREEN_W - img.width * k) / 2, (SCREEN_H - img.height * k) / 2, img.width * k, img.height * k);
      statusBar(); tex.needsUpdate = true;
    };
    img.src = photo;
  }
  return tex;
}

/* ---------- screens ---------- */
export function momAndChildScreen({ photo } = {}) {
  return finish(photo, () => {
    backdrop('#ffb36b', '#ff7a6e', '#b83280');
    person(x, { cx: 190, base: 760, s: 1.12, skin: '#6a4230', hair: '#140e0b', top: '#fff', style: 'wrap', wrap: '#2563eb' });
    person(x, { cx: 392, base: 800, s: 0.78, skin: '#7a4d37', hair: '#140e0b', top: '#e63946', style: 'buns', wave: 1, kid: true });
    statusBar();
    chip('Sending to Kofi', 'GH₵ 500.00 · Instant', '#16a34a');
  });
}
export function manScreen({ photo } = {}) {
  return finish(photo, () => {
    backdrop('#5ad1e6', '#3b82f6', '#312e81');
    person(x, { cx: 262, base: 780, s: 1.22, skin: '#5b3827', hair: '#0f0a08', top: '#e63946', style: 'short', wave: -1, beard: true });
    statusBar();
    chip('Received from Ama', 'GH₵ 500.00 · Just now', '#16a34a');
  });
}
export function vendorScreen({ photo } = {}) {
  return finish(photo, () => {
    backdrop('#ffd36e', '#ff9a56', '#e0442f');
    person(x, { cx: 270, base: 790, s: 1.2, skin: '#6c4432', hair: '#140e0b', top: '#1d4ed8', style: 'wrap', wrap: '#e63946' });
    statusBar();
    chip('Payment received', 'GH₵ 85.00 · MoMo QR', '#16a34a');
  });
}
export function billsScreen({ photo } = {}) {
  return finish(photo, () => {
    backdrop('#a78bfa', '#4f46e5', '#1e1b4b');
    person(x, { cx: 262, base: 790, s: 1.2, skin: '#5f3b29', hair: '#0f0a08', top: '#fff', style: 'short', wave: 1 });
    statusBar();
    chip('Bills paid', 'ECG · Airtime · Water', '#16a34a');
  });
}

/* ---------- floating cards ---------- */
export function qrCardTexture() {
  const c = document.createElement('canvas'); c.width = 420; c.height = 520; const k = c.getContext('2d');
  k.fillStyle = '#fff'; k.beginPath(); k.roundRect(0, 0, 420, 520, 40); k.fill();
  k.fillStyle = '#e63946'; k.beginPath(); k.roundRect(0, 0, 420, 96, [40, 40, 0, 0]); k.fill();
  k.fillStyle = '#fff'; k.font = '800 40px system-ui, sans-serif'; k.textAlign = 'center'; k.fillText('Scan to pay', 210, 62);
  const n = 25, cell = 12, ox = 210 - (n * cell) / 2, oy = 130;
  const finder = (a, b) => { k.fillStyle = '#12141c'; k.fillRect(ox + a * cell, oy + b * cell, 7 * cell, 7 * cell); k.fillStyle = '#fff'; k.fillRect(ox + (a + 1) * cell, oy + (b + 1) * cell, 5 * cell, 5 * cell); k.fillStyle = '#12141c'; k.fillRect(ox + (a + 2) * cell, oy + (b + 2) * cell, 3 * cell, 3 * cell); };
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  k.fillStyle = '#12141c';
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    const inF = (i < 8 && j < 8) || (i > n - 9 && j < 8) || (i < 8 && j > n - 9);
    if (!inF && rnd() > 0.52) k.fillRect(ox + i * cell, oy + j * cell, cell, cell);
  }
  finder(0, 0); finder(n - 7, 0); finder(0, n - 7);
  k.fillStyle = '#6b7080'; k.font = '600 26px system-ui, sans-serif'; k.fillText('Mama Esi Provisions', 210, 484);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
export function chipTexture(label, color = '#16a34a', w = 400) {
  const c = document.createElement('canvas'); c.width = w; c.height = 120; const k = c.getContext('2d');
  k.fillStyle = '#fff'; k.shadowColor = 'rgba(0,0,0,.2)'; k.shadowBlur = 18; k.shadowOffsetY = 6;
  k.beginPath(); k.roundRect(12, 8, w - 24, 92, 46); k.fill(); k.shadowColor = 'transparent';
  k.fillStyle = color; k.beginPath(); k.arc(70, 54, 28, 0, 7); k.fill();
  k.strokeStyle = '#fff'; k.lineWidth = 7; k.lineCap = 'round'; k.lineJoin = 'round';
  k.beginPath(); k.moveTo(58, 54); k.lineTo(67, 64); k.lineTo(84, 43); k.stroke();
  k.fillStyle = '#11131a'; k.font = '700 34px system-ui, sans-serif'; k.textAlign = 'left'; k.fillText(label, 118, 66);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
