// Satin ribbon: a flat strip whose centre-line, width and twist are evaluated
// entirely in the vertex shader (cheap, no CPU geometry updates per frame).
//
//   centre-line  = wave  (sin, W-like) .mix(ring)   <- "ring" is the intro circle
//   cross-axis   = side vector rotated by a travelling twist  -> the 3D "flag" flip
//   shading      = two-light satin (diffuse wrap + tight spec + broad sheen + fresnel)
import * as THREE from 'three';

const vert = /* glsl */ `
uniform float uTime, uD, uSpan, uWidth, uAmp, uFreq, uSpeed, uPhase;
uniform float uTwist, uTwistFreq, uRing, uRingR, uRingTurns, uRingTilt;
varying vec3 vN; varying vec3 vW; varying float vU; varying float vV;

vec3 centre(float u){
  float x = (u - 0.5) * uSpan;
  float a = u * uFreq + uTime * uSpeed + uPhase;
  vec3 p = vec3(x,
                uD + uAmp * sin(a) + 0.35 * uAmp * sin(a * 2.3 + 1.7),
                uAmp * 2.2 * cos(a * 0.8 + 0.6));
  float ang = u * 6.2831853 * uRingTurns + uTime * 0.9 + uPhase;
  float r = uRingR * (1.0 + 0.12 * sin(ang * 2.0 + uTime));
  vec3 q = vec3(r * cos(ang), r * sin(ang), 0.35 * sin(ang + uTime * 0.7));
  float c = cos(uRingTilt), s = sin(uRingTilt);
  q = vec3(q.x, q.y * c - q.z * s, q.y * s + q.z * c);
  return mix(p, q, uRing);
}

void main(){
  float u = uv.x;
  float v = uv.y * 2.0 - 1.0;
  float e = 0.002;
  vec3 c  = centre(u);
  vec3 T  = normalize(centre(min(u + e, 1.0)) - centre(max(u - e, 0.0)));
  vec3 side = normalize(cross(vec3(0.0, 0.0, 1.0), T));
  vec3 nrm  = cross(T, side);
  float th = uTwist * sin(u * uTwistFreq + uTime * uSpeed * 0.8 + uPhase * 1.3);
  vec3 side2 = side * cos(th) + nrm * sin(th);
  vec3 nrm2  = -side * sin(th) + nrm * cos(th);
  vec3 pos = c + side2 * v * 0.5 * uWidth;

  vec4 w = modelMatrix * vec4(pos, 1.0);
  vW = w.xyz;
  vN = normalize(mat3(modelMatrix) * nrm2);
  vU = u; vV = v;
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

const frag = /* glsl */ `
uniform vec3 uCol1, uCol2, uCol3;
varying vec3 vN; varying vec3 vW; varying float vU; varying float vV;
void main(){
  vec3 N = normalize(vN);
  vec3 V = normalize(cameraPosition - vW);
  bool back = dot(N, V) < 0.0;
  if (back) N = -N;                          // two-sided satin
  vec3 L  = normalize(vec3(-0.5, 0.8, 0.7));
  vec3 L2 = normalize(vec3(0.7, -0.3, 0.5));
  float diff = dot(N, L) * 0.5 + 0.5;
  vec3 H = normalize(L + V);
  float nh = max(dot(N, H), 0.0);
  float spec  = pow(nh, 70.0);
  float sheen = pow(nh, 9.0) * 0.22;
  float fres  = pow(1.0 - max(dot(N, V), 0.0), 3.0);
  vec3 base = mix(uCol1, uCol2, diff);
  base = mix(base, uCol3, fres * 0.55);
  base += uCol3 * max(dot(N, L2), 0.0) * 0.22;
  vec3 col = base * (0.55 + 0.65 * diff) + vec3(1.0, 0.96, 0.96) * spec * 0.45 + uCol3 * sheen;
  if (back) col *= 0.72;                                        // underside reads darker -> twists are legible
  col += uCol3 * pow(abs(vV), 7.0) * 0.55;                      // bright rim separates ribbon from the red panel
  col *= mix(0.8, 1.0, smoothstep(0.0, 0.04, 1.0 - abs(vV)));
  gl_FragColor = vec4(col, 1.0);
}`;

const hex = (h) => {
  const n = parseInt(h.slice(1), 16);
  return new THREE.Vector3((n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255);
};

export function createRibbon(opts) {
  const o = Object.assign({
    width: 3, amp: 0.5, freq: 7.5, speed: 1.1, twist: 0.5, twistFreq: 6,
    phase: 0, ringR: 1.45, ringTurns: 1.4, ringTilt: 1.0,
    colors: ['#7a0a18', '#e0222f', '#ff6a70'],
  }, opts);

  const geo = new THREE.PlaneGeometry(1, 1, 260, 10);
  const mat = new THREE.ShaderMaterial({
    vertexShader: vert, fragmentShader: frag, side: THREE.DoubleSide,
    uniforms: {
      uTime: { value: 0 }, uD: { value: 0 }, uSpan: { value: 14 },
      uWidth: { value: o.width }, uAmp: { value: o.amp }, uFreq: { value: o.freq },
      uSpeed: { value: o.speed }, uPhase: { value: o.phase },
      uTwist: { value: o.twist }, uTwistFreq: { value: o.twistFreq },
      uRing: { value: 0 }, uRingR: { value: o.ringR }, uRingTurns: { value: o.ringTurns },
      uRingTilt: { value: o.ringTilt },
      uCol1: { value: hex(o.colors[0]) }, uCol2: { value: hex(o.colors[1]) }, uCol3: { value: hex(o.colors[2]) },
    },
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.frustumCulled = false;
  mesh.userData.base = o;
  return mesh;
}
