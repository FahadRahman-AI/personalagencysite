/**
 * RibbonScene — the "systems in motion" curved gallery.
 *
 * Poster cards arranged on a cylindrical arc, rotated by scroll.
 * Card artwork is generated at runtime on 2D canvases (typographic
 * posters using the site's real fonts) — swap for real work shots
 * by replacing makePoster() output with loaded textures.
 * TODO(studio-fx): replace generated posters with real project art.
 */

import * as THREE from 'three';

const PALETTES: { bg: string; ink: string; accent: string }[] = [
  { bg: '#ece9e2', ink: '#0b0c10', accent: '#ff5a26' },
  { bg: '#0b0c10', ink: '#ece9e2', accent: '#ff5a26' },
  { bg: '#ff5a26', ink: '#0b0c10', accent: '#ece9e2' },
  { bg: '#d8cfc4', ink: '#17181c', accent: '#2c39ff' },
  { bg: '#101820', ink: '#dfe6ee', accent: '#7fe9ff' },
];

const TITLES = [
  'INTAKE FLOW',
  'OPS CONSOLE',
  'AI CONCIERGE',
  'QUOTE ENGINE',
  'NIGHT SHIFT',
  'DISPATCH',
  'PIPELINE',
  'CONTROL ROOM',
  'SIGNAL',
  'BOOKING UI',
];

function makePoster(i: number, displayFont: string, monoFont: string): HTMLCanvasElement {
  const W = 640;
  const H = 832;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const ctx = c.getContext('2d')!;
  const pal = PALETTES[i % PALETTES.length];
  const rng = (() => {
    let s = i * 7919 + 13;
    return () => ((s = (s * 16807) % 2147483647) / 2147483647);
  })();

  ctx.fillStyle = pal.bg;
  ctx.fillRect(0, 0, W, H);

  // Index + meta (mono)
  ctx.fillStyle = pal.ink;
  ctx.font = `300 22px ${monoFont}`;
  ctx.fillText(`SFX—${String(i + 1).padStart(2, '0')}`, 40, 64);
  ctx.textAlign = 'right';
  ctx.fillText('2026', W - 40, 64);
  ctx.textAlign = 'left';

  // Giant numeral
  ctx.font = `600 300px ${displayFont}`;
  ctx.globalAlpha = 0.1;
  ctx.fillText(String(i + 1).padStart(2, '0'), 24, H - 210);
  ctx.globalAlpha = 1;

  // Fake interface: rows / bars / nodes vary per seed
  const mode = i % 3;
  if (mode === 0) {
    for (let r = 0; r < 6; r++) {
      const y = 140 + r * 64;
      ctx.fillStyle = pal.ink;
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      ctx.arc(56, y, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 0.22;
      ctx.fillRect(84, y - 6, 180 + rng() * 260, 12);
      ctx.globalAlpha = 1;
    }
  } else if (mode === 1) {
    for (let r = 0; r < 4; r++) {
      const y = 150 + r * 92;
      ctx.strokeStyle = pal.ink;
      ctx.globalAlpha = 0.3;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(44, y, W - 88, 66);
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = r === 1 ? pal.accent : pal.ink;
      ctx.fillRect(44, y, 8, 66);
      ctx.globalAlpha = 1;
    }
  } else {
    ctx.strokeStyle = pal.ink;
    ctx.globalAlpha = 0.35;
    ctx.lineWidth = 1.5;
    for (let n = 0; n < 7; n++) {
      const x = 70 + rng() * (W - 150);
      const y = 150 + rng() * 330;
      ctx.strokeRect(x, y, 90 + rng() * 60, 54);
    }
    ctx.globalAlpha = 1;
  }

  // Accent chip
  ctx.fillStyle = pal.accent;
  ctx.fillRect(40, H - 176, 46, 20);

  // Title
  ctx.fillStyle = pal.ink;
  ctx.font = `600 52px ${displayFont}`;
  ctx.fillText(TITLES[i % TITLES.length], 40, H - 96);
  ctx.font = `300 18px ${monoFont}`;
  ctx.globalAlpha = 0.6;
  ctx.fillText('STUDIO FX — SYSTEM EXPLORATION', 40, H - 52);
  ctx.globalAlpha = 1;

  return c;
}

export class RibbonScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private group = new THREE.Group();
  private clock = new THREE.Clock();
  private rafId = 0;
  private running = false;
  private disposed = false;
  private progress = { current: 0, target: 0 };
  private disposables: { dispose(): void }[] = [];
  private canvas: HTMLCanvasElement;

  private onResize = () => this.resize();

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setClearColor(0x000000, 0);

    this.camera = new THREE.PerspectiveCamera(42, 1, 0.1, 60);
    this.camera.position.set(0, 0, 3.1);

    this.buildCards();
    this.scene.add(this.group);
    window.addEventListener('resize', this.onResize);
    this.resize();
  }

  private buildCards() {
    // next/font exposes the hashed family list via these CSS vars.
    const body = getComputedStyle(document.body);
    const displayFont = body.getPropertyValue('--font-display').trim() || 'sans-serif';
    const monoFont = body.getPropertyValue('--font-mono').trim() || 'monospace';

    const N = 10;
    const R = 7.2;
    const STEP = THREE.MathUtils.degToRad(11.5);
    const geo = new THREE.PlaneGeometry(1.24, 1.61);
    this.disposables.push(geo);

    for (let i = 0; i < N; i++) {
      const tex = new THREE.CanvasTexture(makePoster(i, displayFont, monoFont));
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
      const mat = new THREE.MeshBasicMaterial({ map: tex });
      const card = new THREE.Mesh(geo, mat);

      const theta = (i - (N - 1) / 2) * STEP;
      card.position.set(Math.sin(theta) * R, Math.sin(theta * 2) * 0.16, -Math.cos(theta) * R + R - 1.4);
      card.rotation.y = -theta;
      card.rotation.z = Math.sin(theta) * 0.06; // gentle banking along the arc
      this.group.add(card);
      this.disposables.push(tex, mat);
    }
  }

  /** Scroll scrub position, 0..1 */
  setProgress(p: number) {
    this.progress.target = p;
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
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
  }

  private tick = () => {
    if (!this.running || this.disposed) return;
    this.rafId = requestAnimationFrame(this.tick);
    const t = this.clock.getElapsedTime();

    this.progress.current += (this.progress.target - this.progress.current) * 0.075;
    const span = THREE.MathUtils.degToRad(11.5) * 9;
    this.group.rotation.y = (this.progress.current - 0.5) * span * 0.92;
    this.group.position.y = -0.22 + Math.sin(t * 0.5) * 0.02;

    this.renderer.render(this.scene, this.camera);
  };

  dispose() {
    this.disposed = true;
    this.stop();
    window.removeEventListener('resize', this.onResize);
    for (const d of this.disposables) d.dispose();
    this.disposables.length = 0;
    this.scene.clear();
    this.renderer.dispose();
  }
}
