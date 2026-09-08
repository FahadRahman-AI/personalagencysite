/**
 * MonogramScene — the Studio FX mark as real extruded geometry.
 *
 * Two material stories:
 *  - 'chrome': black-chrome with an orange rim catch (hero)
 *  - 'stone':  matte dark slab turning slowly in fog (services)
 *
 * Everything procedural: letters are hand-authored THREE.Shape
 * outlines, reflections come from a PMREM-baked RoomEnvironment,
 * fog is an fbm fullscreen quad. No assets.
 */

import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export type MonogramVariant = 'chrome' | 'stone';

interface Options {
  variant: MonogramVariant;
  withFog?: boolean;
  /** overall scale multiplier */
  scale?: number;
}

const FOG_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.99999, 1.0);
  }
`;

const FOG_FRAGMENT = /* glsl */ `
  uniform float uTime;
  uniform float uAspect;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }

  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x),
               mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }

  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    mat2 r = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 5; i++) { v += a * noise(p); p = r * p * 2.02; a *= 0.5; }
    return v;
  }

  void main() {
    vec2 uv = (vUv - 0.5) * vec2(uAspect, 1.0);
    float t = uTime * 0.03;
    vec2 q = vec2(fbm(uv * 1.3 + t), fbm(uv * 1.3 - t * 0.6 + 3.1));
    float f = fbm(uv * 1.9 + q * 1.6 + t * 0.4);
    float smoke = smoothstep(0.28, 0.95, f);
    vec3 col = mix(vec3(0.012, 0.014, 0.02), vec3(0.20, 0.21, 0.24), smoke * 0.85);
    float vig = 1.0 - smoothstep(0.3, 1.2, length(vUv - 0.5) * 1.7);
    col *= 0.4 + 0.6 * vig;
    col += (hash(vUv * 1237.0 + uTime) - 0.5) * 0.014;
    gl_FragColor = vec4(col, 1.0);
  }
`;

/** Blocky F outline in unit space (0..0.62 x, 0..1 y) */
function letterF(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.lineTo(0.22, 0);
  s.lineTo(0.22, 0.39);
  s.lineTo(0.54, 0.39);
  s.lineTo(0.54, 0.61);
  s.lineTo(0.22, 0.61);
  s.lineTo(0.22, 0.78);
  s.lineTo(0.62, 0.78);
  s.lineTo(0.62, 1);
  s.lineTo(0, 1);
  s.closePath();
  return s;
}

/** X outline (0..0.72 x, 0..1 y) */
function letterX(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(0, 1);
  s.lineTo(0.22, 1);
  s.lineTo(0.36, 0.64);
  s.lineTo(0.5, 1);
  s.lineTo(0.72, 1);
  s.lineTo(0.47, 0.5);
  s.lineTo(0.72, 0);
  s.lineTo(0.5, 0);
  s.lineTo(0.36, 0.36);
  s.lineTo(0.22, 0);
  s.lineTo(0, 0);
  s.lineTo(0.25, 0.5);
  s.closePath();
  return s;
}

export class MonogramScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private group = new THREE.Group();
  private clock = new THREE.Clock();
  private fogMat: THREE.ShaderMaterial | null = null;
  private pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  private rafId = 0;
  private running = false;
  private disposed = false;
  private introAt = -1;
  private variant: MonogramVariant;
  private disposables: { dispose(): void }[] = [];
  private canvas: HTMLCanvasElement;
  /** When non-null, scroll progress (0–1) drives rotation instead of time. */
  private scrollProgress: number | null = null;

  private onPointer = (e: PointerEvent) => {
    this.pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
    this.pointer.ty = -(e.clientY / window.innerHeight) * 2 + 1;
  };
  private onResize = () => this.resize();

  constructor(canvas: HTMLCanvasElement, opts: Options) {
    this.canvas = canvas;
    this.variant = opts.variant;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: !opts.withFog,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = opts.variant === 'chrome' ? 1.25 : 1.0;
    if (!opts.withFog) this.renderer.setClearColor(0x000000, 0);

    this.camera = new THREE.PerspectiveCamera(40, 1, 0.1, 60);
    this.camera.position.set(0, 0, 5.4);

    // Reflections for the PBR chrome.
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environment = envTex;
    this.disposables.push({ dispose: () => envTex.dispose() }, { dispose: () => pmrem.dispose() });

    if (opts.withFog) this.buildFog();
    this.buildLetters(opts.scale ?? 1);
    this.buildLights();

    window.addEventListener('pointermove', this.onPointer, { passive: true });
    window.addEventListener('resize', this.onResize);
    this.resize();
  }

  private buildFog() {
    const geo = new THREE.PlaneGeometry(2, 2);
    this.fogMat = new THREE.ShaderMaterial({
      vertexShader: FOG_VERTEX,
      fragmentShader: FOG_FRAGMENT,
      depthWrite: false,
      depthTest: false,
      uniforms: { uTime: { value: 0 }, uAspect: { value: 1 } },
    });
    const quad = new THREE.Mesh(geo, this.fogMat);
    quad.frustumCulled = false;
    quad.renderOrder = -1;
    this.scene.add(quad);
    this.disposables.push(geo, this.fogMat);
  }

  private buildLetters(scaleMul: number) {
    const extrude: THREE.ExtrudeGeometryOptions = {
      depth: 0.42,
      bevelEnabled: true,
      bevelThickness: 0.045,
      bevelSize: 0.04,
      bevelSegments: 5,
      curveSegments: 8,
    };

    const material =
      this.variant === 'chrome'
        ? new THREE.MeshPhysicalMaterial({
            color: 0x101318,
            metalness: 1.0,
            roughness: 0.24,
            clearcoat: 1.0,
            clearcoatRoughness: 0.16,
            reflectivity: 1.0,
          })
        : new THREE.MeshStandardMaterial({
            color: 0x232427,
            metalness: 0.12,
            roughness: 0.88,
            flatShading: false,
          });
    this.disposables.push(material);

    const scale = 2.35 * scaleMul;

    const fGeo = new THREE.ExtrudeGeometry(letterF(), extrude);
    fGeo.center();
    const f = new THREE.Mesh(fGeo, material);
    f.scale.setScalar(scale);
    f.position.set(-0.82, 0.1, -0.34);

    const xGeo = new THREE.ExtrudeGeometry(letterX(), extrude);
    xGeo.center();
    const x = new THREE.Mesh(xGeo, material);
    x.scale.setScalar(scale);
    x.position.set(0.55, -0.28, 0.3);

    this.group.add(f, x);
    this.group.rotation.z = -0.06;
    this.scene.add(this.group);
    this.disposables.push(fGeo, xGeo);
  }

  private buildLights() {
    if (this.variant === 'chrome') {
      const key = new THREE.DirectionalLight(0xffffff, 2.2);
      key.position.set(4, 6, 6);
      const rim = new THREE.DirectionalLight(0xff5a26, 9); // the orange catch
      rim.position.set(-6, -2, -4);
      const fill = new THREE.DirectionalLight(0x4a5aff, 0.7);
      fill.position.set(-3, 2, 5);
      this.scene.add(key, rim, fill);
    } else {
      const key = new THREE.DirectionalLight(0xffffff, 1.6);
      key.position.set(2, 8, 4);
      const under = new THREE.DirectionalLight(0xff5a26, 0.5);
      under.position.set(0, -6, 2);
      const amb = new THREE.AmbientLight(0x404048, 1.2);
      this.scene.add(key, under, amb);
    }
  }

  /**
   * Drive rotation from scroll progress (0–1) instead of the time-based idle.
   * Pass null to return to time-driven animation.
   */
  setScrollOverride(progress: number | null) {
    this.scrollProgress = progress;
  }

  /** Play the scale/settle intro (call when preloader clears). */
  intro() {
    this.introAt = this.clock.getElapsedTime();
  }

  start() {
    if (this.running || this.disposed) return;
    this.running = true;
    this.clock.getDelta();
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
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
    if (this.fogMat) this.fogMat.uniforms.uAspect.value = w / h;
  }

  private tick = () => {
    if (!this.running || this.disposed) return;
    this.rafId = requestAnimationFrame(this.tick);
    const t = this.clock.getElapsedTime();

    this.pointer.x += (this.pointer.tx - this.pointer.x) * 0.045;
    this.pointer.y += (this.pointer.ty - this.pointer.y) * 0.045;

    // Intro: settle up from below with an ease-out.
    let introLift = 0;
    let introScale = 1;
    if (this.introAt >= 0) {
      const k = Math.min(1, (t - this.introAt) / 1.6);
      const e = 1 - Math.pow(1 - k, 3);
      introLift = (1 - e) * -1.1;
      introScale = 0.86 + 0.14 * e;
    } else {
      introScale = 0.86;
      introLift = -1.1;
    }

    if (this.scrollProgress !== null) {
      // Scroll-scrubbed: full 2π rotation across the pinned track + pointer tilt
      const p = this.scrollProgress;
      this.group.rotation.y = p * Math.PI * 2 - Math.PI + this.pointer.x * 0.22;
      this.group.rotation.x = Math.sin(p * Math.PI) * 0.3 - this.pointer.y * 0.16;
    } else if (this.variant === 'chrome') {
      this.group.rotation.y = Math.sin(t * 0.3) * 0.4 + this.pointer.x * 0.38;
      this.group.rotation.x = Math.sin(t * 0.22) * 0.07 - this.pointer.y * 0.26;
    } else {
      this.group.rotation.y = t * 0.22 + this.pointer.x * 0.15;
      this.group.rotation.x = Math.sin(t * 0.18) * 0.1 - this.pointer.y * 0.1;
    }
    this.group.position.y = Math.sin(t * 0.75) * 0.07 + introLift;
    this.group.scale.setScalar(introScale);

    if (this.fogMat) this.fogMat.uniforms.uTime.value = t;

    this.renderer.render(this.scene, this.camera);
  };

  dispose() {
    this.disposed = true;
    this.stop();
    window.removeEventListener('pointermove', this.onPointer);
    window.removeEventListener('resize', this.onResize);
    for (const d of this.disposables) d.dispose();
    this.disposables.length = 0;
    this.scene.clear();
    this.renderer.dispose();
  }
}
