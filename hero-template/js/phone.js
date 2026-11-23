// Procedural 3D phone: rounded titanium body, inset rounded screen (texture slot),
// glass glare, camera island, side keys. Swap `texture` for a real photo any time.
import * as THREE from 'three';
import { RoundedBoxGeometry } from '../vendor/addons/RoundedBoxGeometry.js';

export const PHONE = { w: 0.8, h: 1.65, d: 0.09 };

function roundedRectGeo(w, h, r) {
  const s = new THREE.Shape();
  const x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  const g = new THREE.ShapeGeometry(s, 10);
  const p = g.attributes.position, uv = g.attributes.uv;
  for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / w + 0.5, p.getY(i) / h + 0.5);
  return g;
}

let glareTex;
function glare() {
  if (glareTex) return glareTex;
  const c = document.createElement('canvas'); c.width = 64; c.height = 128;
  const x = c.getContext('2d');
  const g = x.createLinearGradient(0, 0, 64, 128);
  g.addColorStop(0, 'rgba(255,255,255,.34)'); g.addColorStop(.38, 'rgba(255,255,255,.07)');
  g.addColorStop(.42, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g; x.fillRect(0, 0, 64, 128);
  return (glareTex = new THREE.CanvasTexture(c));
}

export function buildPhone(screenTexture, { body = '#23262f' } = {}) {
  const { w, h, d } = PHONE;
  const g = new THREE.Group();

  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: body, metalness: 0.85, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.25,
  });
  g.add(new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 5, 0.12), bodyMat));

  const screenGeo = roundedRectGeo(w - 0.045, h - 0.045, 0.095);
  screenTexture.colorSpace = THREE.SRGBColorSpace;
  screenTexture.anisotropy = 8;
  const screen = new THREE.Mesh(screenGeo, new THREE.MeshBasicMaterial({ map: screenTexture, toneMapped: false }));
  screen.position.z = d / 2 + 0.002;
  g.add(screen);

  const gl = new THREE.Mesh(screenGeo, new THREE.MeshBasicMaterial({
    map: glare(), transparent: true, depthWrite: false, toneMapped: false,
  }));
  gl.position.z = d / 2 + 0.004;
  g.add(gl);

  // camera island (back)
  const lensMat = new THREE.MeshPhysicalMaterial({ color: '#0b0c10', metalness: 0.6, roughness: 0.15, clearcoat: 1 });
  const island = new THREE.Mesh(new RoundedBoxGeometry(0.36, 0.36, 0.03, 3, 0.07), bodyMat);
  island.position.set(-0.17, h / 2 - 0.26, -d / 2 - 0.012);
  g.add(island);
  [[-0.085, 0.07], [0.085, 0.07], [0, -0.085]].forEach(([x, y]) => {
    const l = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.04, 24), lensMat);
    l.rotation.x = Math.PI / 2;
    l.position.set(island.position.x + x, island.position.y + y, -d / 2 - 0.03);
    g.add(l);
  });

  // side keys
  const keyMat = new THREE.MeshPhysicalMaterial({ color: '#3a3f4c', metalness: 0.9, roughness: 0.3 });
  [[0.42, 0.14, 0.34], [0.2, 0.14, 0.34]].forEach(([y, len]) => {
    const k = new THREE.Mesh(new RoundedBoxGeometry(0.014, 0.16, 0.03, 2, 0.006), keyMat);
    k.position.set(w / 2 + 0.003, y, 0);
    g.add(k);
  });
  const pw = new THREE.Mesh(new RoundedBoxGeometry(0.014, 0.24, 0.03, 2, 0.006), keyMat);
  pw.position.set(-w / 2 - 0.003, 0.3, 0);
  g.add(pw);
  return g;
}
