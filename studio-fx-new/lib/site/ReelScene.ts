/**
 * ReelScene — full-bleed GLSL cinema for the showreel. Five original
 * procedural "film frames", monochrome with a single accent.
 *
 * Sharpness contract: every line, cell edge and ring core is drawn at
 * 1px via fwidth()-based AA (GLSL3 for guaranteed derivatives); halos
 * are layered on top of crisp cores, never instead of them. Grain is
 * sampled in gl_FragCoord device pixels so DPR never stretches it.
 */

import * as THREE from 'three';

const VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
out vec4 fragColor;
uniform float uTime;
uniform float uProgress;
uniform vec2 uRes;
uniform vec3 uAccent;

float hash21(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x),
    mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

float fbm(vec2 p) {
  float a = 0.5, s = 0.0;
  for (int i = 0; i < 5; i++) {
    s += a * noise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return s;
}

/* 1px-wide line at d==0, antialiased in screen space */
float crisp(float d) {
  float w = fwidth(d) * 1.2;
  return smoothstep(w, 0.0, abs(d));
}

/* filled region d<0 with a 1px AA edge */
float fill(float d) {
  float w = fwidth(d) * 1.2;
  return smoothstep(w, -w, d);
}

/* 01 — the wire: flying down an engraved cable tunnel, the call
   racing past toward a warm vanishing point */
vec3 scene0(vec2 p, float t) {
  vec2 c = vec2(sin(t * 0.31) * 0.12, cos(t * 0.23) * 0.10);
  vec2 q = p - c;
  float r = max(length(q), 1e-3);
  float a = atan(q.y, q.x) + sin(t * 0.1) * 0.4 + 0.22 / r * 0.12;

  float z = 0.22 / r + t * 0.85;                    /* tunnel depth   */

  float ring = crisp(fract(z) - 0.5);               /* engraved hoops */
  float rail = crisp(fract(a * 1.90986 + z * 0.05) - 0.5); /* 12 rails */

  float far = smoothstep(0.025, 0.38, r);           /* depth falloff  */

  vec3 col = vec3(0.012);
  col += vec3(0.34) * ring * far;
  col += vec3(0.13) * rail * far;
  col += vec3(0.07) * fbm(vec2(a * 2.0, z * 0.6)) * far;  /* cable skin */

  /* the call — an accent band racing down the line */
  float pd = abs(fract(z * 0.5 - t * 0.6) - 0.5);
  col += uAccent * (crisp(pd - 0.03) * 0.95 + exp(-pd * 14.0) * 0.55) * far;

  /* small hot light at the end of the wire */
  col += uAccent * exp(-r * 16.0) * 0.35;
  col += vec3(1.0, 0.85, 0.75) * exp(-r * 40.0) * 0.4;
  return col;
}

/* 02 — signal strands: hard filament cores in soft smoke */
vec3 scene1(vec2 p, float t) {
  float x = p.x * 7.0 + 3.5;
  float lane = floor(x);
  float f = fbm(vec2(p.y * 1.5 + t * 0.14, lane * 3.7));
  float off = fract(x) - 0.5 + (f - 0.5) * 0.8;

  float halo = smoothstep(0.30, 0.02, abs(off));
  float core = crisp(off * 0.28);
  float tone = mix(0.07, 0.30, hash21(vec2(lane, 3.0)));

  vec3 col = vec3(0.018) + vec3(halo * tone * 0.5) + vec3(core * tone * 1.4);
  if (lane == 3.0) col += uAccent * (core * 0.85 + smoothstep(0.10, 0.01, abs(off)) * 0.25);
  col += vec3(noise(p * 26.0 + t * 0.05)) * 0.035;
  return col;
}

/* 03 — circuit floor: 1px grid, etched blocks, accent pulse */
vec3 scene2(vec2 p, float t) {
  vec2 g = p * 9.0;
  vec2 id = floor(g), f = fract(g);

  vec2 lf = min(f, 1.0 - f);
  vec2 dw = fwidth(g) * 1.2;
  float line = max(smoothstep(dw.x, 0.0, lf.x), smoothstep(dw.y, 0.0, lf.y));

  float b = step(hash21(id), 0.14);
  float inner = fill(max(abs(f.x - 0.5), abs(f.y - 0.5)) - 0.38);
  float etch = b * inner * (0.35 + 0.65 * fbm(g + t * 0.1));

  vec3 col = vec3(0.028) + vec3(0.13) * line + vec3(0.17) * etch;
  col += vec3(0.05) * b * crisp(max(abs(f.x - 0.5), abs(f.y - 0.5)) - 0.38);

  vec2 pp = vec2(mod(t * 0.22, 2.6) - 1.3, sin(t * 0.6) * 0.24);
  float pd = length(p - pp);
  col += uAccent * crisp(pd - 0.012) * 0.9;         /* hard dot rim   */
  col += uAccent * exp(-pd * 34.0) * 0.8;
  col += uAccent * exp(-pd * 8.0) * 0.10;
  return col;
}

/* 04 — night fog: soft smoke, one in-focus burning filament */
vec3 scene3(vec2 p, float t) {
  float n = fbm(p * 2.1 + vec2(t * 0.07, -t * 0.025));
  vec3 col = vec3(mix(0.022, 0.20, n));
  col += vec3(noise(p * 30.0 - t * 0.08)) * 0.03;   /* film texture   */

  float y = p.y + (n - 0.5) * 0.22;
  col += uAccent * crisp(y * 1.6) * 0.95;           /* sharp filament */
  col += uAccent * exp(-abs(y) * 34.0) * 0.16;
  return col;
}

/* 05 — deep radar: engraved 1px rings, sweeping arm with hard edge */
vec3 scene4(vec2 p, float t) {
  float r = length(p);
  float a = atan(p.y, p.x);

  float rd = (fract(r * 17.0 - t * 0.07) - 0.5) / 17.0;
  float ring = crisp(rd) * exp(-r * 1.1);
  vec3 col = vec3(0.028) + vec3(0.15) * ring;

  float ang = mod(a - t * 0.45, 6.28318);
  col += uAccent * smoothstep(0.55, 0.0, ang) * exp(-r * 2.0) * 0.30;
  col += uAccent * crisp(ang * r * 0.5) * exp(-r * 1.6) * 0.45; /* arm edge */
  col += vec3(0.9) * fill(r - 0.012);               /* center pip     */
  col += vec3(noise(p * 22.0)) * 0.025;
  return col;
}

void main() {
  float t = uTime;
  vec2 asp = (vUv - 0.5) * vec2(uRes.x / max(uRes.y, 1.0), 1.0);

  float prog = clamp(uProgress, 0.0, 0.999) * 5.0;
  float idx = floor(prog);
  float local = fract(prog);

  vec3 col;
  if (idx < 0.5) col = scene0(asp, t);
  else if (idx < 1.5) col = scene1(asp, t);
  else if (idx < 2.5) col = scene2(asp, t);
  else if (idx < 3.5) col = scene3(asp, t);
  else col = scene4(asp, t);

  float fade = smoothstep(0.0, 0.045, local) * smoothstep(1.0, 0.955, local);
  float vig = smoothstep(1.35, 0.42, length(vUv - 0.5) * 2.0);
  col *= vig;

  /* grain in device pixels — never stretched by DPR */
  col += (hash21(gl_FragCoord.xy + fract(t) * 100.0) - 0.5) * 0.04;

  fragColor = vec4(col * fade, 1.0);
}
`;

export class ReelScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  private clock = new THREE.Clock();
  private rafId = 0;
  private running = false;
  private disposed = false;
  private uniforms: Record<string, THREE.IUniform>;
  private mat: THREE.ShaderMaterial;
  private geo: THREE.PlaneGeometry;
  private canvas: HTMLCanvasElement;
  private target = 0;
  private current = 0;

  private onResize = () => this.resize();

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    this.uniforms = {
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uAccent: { value: new THREE.Color('#ff5a26') },
    };
    this.mat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms: this.uniforms,
      glslVersion: THREE.GLSL3,
    });
    this.geo = new THREE.PlaneGeometry(2, 2);
    this.scene.add(new THREE.Mesh(this.geo, this.mat));

    window.addEventListener('resize', this.onResize);
    this.resize();
  }

  setProgress(p: number) {
    this.target = p;
  }

  start() {
    if (this.running || this.disposed) return;
    this.running = true;
    this.rafId = requestAnimationFrame(this.tick);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.rafId);
  }

  private resize() {
    const r = this.canvas.parentElement?.getBoundingClientRect();
    const w = r?.width || window.innerWidth;
    const h = r?.height || window.innerHeight;
    this.renderer.setSize(w, h, false);
    // Shader works in drawing-buffer pixels, not CSS pixels.
    const buf = this.renderer.getDrawingBufferSize(new THREE.Vector2());
    (this.uniforms.uRes.value as THREE.Vector2).copy(buf);
  }

  private tick = () => {
    if (!this.running || this.disposed) return;
    this.rafId = requestAnimationFrame(this.tick);
    this.current += (this.target - this.current) * 0.09;
    this.uniforms.uProgress.value = this.current;
    this.uniforms.uTime.value = this.clock.getElapsedTime();
    this.renderer.render(this.scene, this.camera);
  };

  dispose() {
    this.disposed = true;
    this.stop();
    window.removeEventListener('resize', this.onResize);
    this.geo.dispose();
    this.mat.dispose();
    this.renderer.dispose();
  }
}
