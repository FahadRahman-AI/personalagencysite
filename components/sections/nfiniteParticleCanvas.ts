/** Canvas 2D particle + wireframe — optimized for 60fps */

export type Particle = {
  x: number;
  y: number;
  z: number;
  targetX: number;
  targetY: number;
  targetZ: number;
  vx: number;
  vy: number;
  vz: number;
  bright: number;
};

export type MouseState = {
  nx: number;
  ny: number;
  active: boolean;
};

export type SceneBuffers = {
  px: Float32Array;
  py: Float32Array;
  z2: Float32Array;
  scale: Float32Array;
  bright: Uint8Array;
  bins: number[][];
};

const BOX_HALF = { w: 165, h: 115, d: 245 };
const BASE_ROT_X = -0.32;
const DEPTH_BINS = 20;

const BOX_VERTICES: [number, number, number][] = [
  [-BOX_HALF.w, -BOX_HALF.h, -BOX_HALF.d],
  [BOX_HALF.w, -BOX_HALF.h, -BOX_HALF.d],
  [BOX_HALF.w, BOX_HALF.h, -BOX_HALF.d],
  [-BOX_HALF.w, BOX_HALF.h, -BOX_HALF.d],
  [-BOX_HALF.w, -BOX_HALF.h, BOX_HALF.d],
  [BOX_HALF.w, -BOX_HALF.h, BOX_HALF.d],
  [BOX_HALF.w, BOX_HALF.h, BOX_HALF.d],
  [-BOX_HALF.w, BOX_HALF.h, BOX_HALF.d],
];

const BOX_EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 0],
  [4, 5], [5, 6], [6, 7], [7, 4],
  [0, 4], [1, 5], [2, 6], [3, 7],
];

export function getParticleCount(): number {
  if (typeof window === "undefined") return 5_500;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const lowMem = "deviceMemory" in navigator && (navigator as Navigator & { deviceMemory?: number }).deviceMemory! < 4;
  if (coarse || lowMem) return 3_200;
  return 5_500;
}

function gaussian(scale: number) {
  return ((Math.random() + Math.random() + Math.random()) / 1.5 - 0.5) * 2 * scale;
}

function randomSurfacePoint(): [number, number, number] {
  const face = Math.floor(Math.random() * 6);
  const u = Math.random() * 2 - 1;
  const v = Math.random() * 2 - 1;
  const { w, h, d } = BOX_HALF;
  switch (face) {
    case 0: return [u * w, v * h, -d];
    case 1: return [u * w, v * h, d];
    case 2: return [-w, u * h, v * d];
    case 3: return [w, u * h, v * d];
    case 4: return [u * w, -h, v * d];
    default: return [u * w, h, v * d];
  }
}

function sampleEdge(a: [number, number, number], b: [number, number, number]): [number, number, number] {
  const t = Math.random();
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

export function createParticles(): Particle[] {
  const total = getParticleCount();
  const particles: Particle[] = [];
  const cloud = { x: 360, y: 270, z: 300 };

  const surfaceTarget = Math.floor(total * 0.55);
  for (let i = 0; i < surfaceTarget; i++) {
    const [tx, ty, tz] = randomSurfacePoint();
    const j = 5;
    particles.push({
      x: 0, y: 0, z: 0,
      targetX: tx + (Math.random() * 2 - 1) * j,
      targetY: ty + (Math.random() * 2 - 1) * j,
      targetZ: tz + (Math.random() * 2 - 1) * j,
      vx: (Math.random() * 2 - 1) * 0.012,
      vy: (Math.random() * 2 - 1) * 0.012,
      vz: (Math.random() * 2 - 1) * 0.012,
      bright: Math.random() < 0.14 ? 1 : 0,
    });
  }

  for (const [ai, bi] of BOX_EDGES) {
    const a = BOX_VERTICES[ai];
    const b = BOX_VERTICES[bi];
    for (let i = 0; i < 36; i++) {
      const [tx, ty, tz] = sampleEdge(a, b);
      particles.push({
        x: 0, y: 0, z: 0, targetX: tx, targetY: ty, targetZ: tz,
        vx: (Math.random() * 2 - 1) * 0.01,
        vy: (Math.random() * 2 - 1) * 0.01,
        vz: (Math.random() * 2 - 1) * 0.01,
        bright: Math.random() < 0.22 ? 1 : 0,
      });
    }
  }

  while (particles.length < total) {
    particles.push({
      x: 0, y: 0, z: 0,
      targetX: gaussian(cloud.x),
      targetY: gaussian(cloud.y),
      targetZ: gaussian(cloud.z),
      vx: (Math.random() * 2 - 1) * 0.01,
      vy: (Math.random() * 2 - 1) * 0.01,
      vz: (Math.random() * 2 - 1) * 0.01,
      bright: Math.random() < 0.08 ? 1 : 0,
    });
  }

  return particles;
}

export function createSceneBuffers(count: number): SceneBuffers {
  return {
    px: new Float32Array(count),
    py: new Float32Array(count),
    z2: new Float32Array(count),
    scale: new Float32Array(count),
    bright: new Uint8Array(count),
    bins: Array.from({ length: DEPTH_BINS }, () => []),
  };
}

function drawWireBox(
  ctx: CanvasRenderingContext2D,
  boxScale: number,
  cosY: number,
  sinY: number,
  cosX: number,
  sinX: number,
  cx: number,
  cy: number,
  alpha: number,
) {
  const fov = 480;
  const proj = (x: number, y: number, z: number) => {
    const x1 = x * cosY - z * sinY;
    const z1 = x * sinY + z * cosY;
    const y1 = y * cosX - z1 * sinX;
    const z2 = y * sinX + z1 * cosX;
    const s = fov / (fov + z2 + 580);
    return { x: x1 * s + cx, y: y1 * s + cy, s };
  };

  ctx.strokeStyle = `rgba(140, 195, 255, ${alpha})`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (const [a, b] of BOX_EDGES) {
    const va = BOX_VERTICES[a];
    const vb = BOX_VERTICES[b];
    const pa = proj(va[0] * boxScale, va[1] * boxScale, va[2] * boxScale);
    const pb = proj(vb[0] * boxScale, vb[1] * boxScale, vb[2] * boxScale);
    ctx.moveTo(pa.x, pa.y);
    ctx.lineTo(pb.x, pb.y);
  }
  ctx.stroke();
}

export function drawNfiniteScene(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  particles: Particle[],
  buffers: SceneBuffers,
  rotY: number,
  rotX: number,
  scrollProgress: number,
  mouse: MouseState,
) {
  const cx = w * 0.5 + (mouse.nx - 0.5) * 48;
  const cy = h * 0.5 + (mouse.ny - 0.5) * 32;
  const lerp = 0.04 + scrollProgress * 0.08;
  const cosY = Math.cos(rotY);
  const sinY = Math.sin(rotY);
  const cosX = Math.cos(rotX);
  const sinX = Math.sin(rotX);
  const fov = 480;
  const count = particles.length;

  ctx.fillStyle = "#060608";
  ctx.fillRect(0, 0, w, h);

  const { px, py, z2, scale, bright, bins } = buffers;
  for (let b = 0; b < DEPTH_BINS; b++) bins[b]!.length = 0;

  let zMin = Infinity;
  let zMax = -Infinity;

  for (let i = 0; i < count; i++) {
    const p = particles[i]!;
    p.x += (p.targetX - p.x) * lerp;
    p.y += (p.targetY - p.y) * lerp;
    p.z += (p.targetZ - p.z) * lerp;
    if (mouse.active) {
      p.x += (mouse.nx - 0.5) * 0.35;
      p.y += (mouse.ny - 0.5) * 0.28;
    }
    p.x += p.vx;
    p.y += p.vy;
    p.z += p.vz;

    const x1 = p.x * cosY - p.z * sinY;
    const z1 = p.x * sinY + p.z * cosY;
    const y1 = p.y * cosX - z1 * sinX;
    const zd = y1 * sinX + z1 * cosX;
    const s = fov / (fov + zd + 580);

    px[i] = x1 * s + cx;
    py[i] = y1 * s + cy;
    z2[i] = zd;
    scale[i] = s;
    bright[i] = p.bright;

    if (zd < zMin) zMin = zd;
    if (zd > zMax) zMax = zd;
  }

  const zSpan = zMax - zMin || 1;
  for (let i = 0; i < count; i++) {
    const bin = Math.min(
      DEPTH_BINS - 1,
      Math.max(0, Math.floor(((z2[i]! - zMin) / zSpan) * (DEPTH_BINS - 1))),
    );
    bins[bin]!.push(i);
  }

  ctx.fillStyle = "rgba(255,255,255,0.45)";
  for (let b = 0; b < DEPTH_BINS; b++) {
    const bin = bins[b]!;
    for (let k = 0; k < bin.length; k++) {
      const i = bin[k]!;
      const sx = px[i]!;
      const sy = py[i]!;
      if (sx < 0 || sx >= w || sy < 0 || sy >= h) continue;
      if (bright[i]) continue;
      ctx.fillRect(sx | 0, sy | 0, 1, 1);
    }
  }

  ctx.fillStyle = "rgba(235,245,255,0.9)";
  for (let b = 0; b < DEPTH_BINS; b++) {
    const bin = bins[b]!;
    for (let k = 0; k < bin.length; k++) {
      const i = bin[k]!;
      if (!bright[i]) continue;
      const sx = px[i]!;
      const sy = py[i]!;
      if (sx < 0 || sx >= w || sy < 0 || sy >= h) continue;
      ctx.fillRect((sx - 0.5) | 0, (sy - 0.5) | 0, 2, 2);
    }
  }

  drawWireBox(ctx, 1, cosY, sinY, cosX, sinX, cx, cy, 0.7);
  drawWireBox(ctx, 0.72, cosY, sinY, cosX, sinX, cx, cy, 0.28);
}

export function lerpMouse(current: MouseState, target: MouseState, t: number): MouseState {
  return {
    nx: current.nx + (target.nx - current.nx) * t,
    ny: current.ny + (target.ny - current.ny) * t,
    active: target.active,
  };
}

export const BASE_ROT_Y = 0.55;
export { BASE_ROT_X };
