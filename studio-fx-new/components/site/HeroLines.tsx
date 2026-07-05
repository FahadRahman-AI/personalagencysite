'use client';

/**
 * HeroLines — thin lines crossing the hero that behave like plucked
 * strings. Pointer proximity displaces them (spring + wave coupling),
 * plucks make sound, and holding the pointer down blasts every line.
 */

import { useEffect, useRef } from 'react';
import { pluck, blast } from '@/lib/site/audio';

interface Line {
  ax: number; ay: number; bx: number; by: number; // normalized endpoints
  o: Float32Array; // perpendicular offsets
  v: Float32Array; // velocities
  energy: number;
}

const N = 36; // points per line
const HOLD_MS = 480;

const LINE_DEFS: [number, number, number, number][] = [
  [-0.06, 0.16, 1.06, 0.62],
  [-0.06, 0.78, 1.06, 0.28],
  [0.12, -0.08, 0.88, 1.08],
  [-0.06, 0.48, 1.06, 0.92],
  [0.55, -0.08, 0.35, 1.08],
];

export default function HeroLines() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia('(pointer: coarse)').matches) return; // touch: decorative static lines via CSS instead
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const lines: Line[] = LINE_DEFS.map(([ax, ay, bx, by]) => ({
      ax, ay, bx, by,
      o: new Float32Array(N),
      v: new Float32Array(N),
      energy: 0,
    }));

    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let holdTimer: ReturnType<typeof setTimeout> | null = null;
    const mouse = { x: -1e4, y: -1e4, px: -1e4, py: -1e4 };

    const resize = () => {
      const r = canvas.parentElement!.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.px = mouse.x;
      mouse.py = mouse.y;
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };

    const doBlast = () => {
      for (const line of lines) {
        for (let i = 1; i < N - 1; i++) {
          line.v[i] += (Math.random() - 0.5) * 90;
        }
      }
      blast();
    };

    const onDown = () => {
      holdTimer = setTimeout(doBlast, HOLD_MS);
    };
    const onUp = () => {
      if (holdTimer) clearTimeout(holdTimer);
      holdTimer = null;
    };

    const step = () => {
      raf = requestAnimationFrame(step);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const mvx = mouse.x - mouse.px;
      const mvy = mouse.y - mouse.py;
      const mspeed = Math.min(40, Math.hypot(mvx, mvy));
      mouse.px = mouse.x;
      mouse.py = mouse.y;

      for (const line of lines) {
        const x0 = line.ax * w;
        const y0 = line.ay * h;
        const x1 = line.bx * w;
        const y1 = line.by * h;
        const len = Math.hypot(x1 - x0, y1 - y0);
        // Unit perpendicular
        const px = -(y1 - y0) / len;
        const py = (x1 - x0) / len;

        // Physics: pointer force + wave coupling + spring home
        let plucked = 0;
        for (let i = 1; i < N - 1; i++) {
          const bx = x0 + ((x1 - x0) * i) / (N - 1) + px * line.o[i];
          const by = y0 + ((y1 - y0) * i) / (N - 1) + py * line.o[i];
          const dx = mouse.x - bx;
          const dy = mouse.y - by;
          const dist = Math.hypot(dx, dy);
          if (dist < 90 && mspeed > 0.4) {
            const force = (1 - dist / 90) * mspeed * 0.55;
            const side = dx * px + dy * py > 0 ? -1 : 1;
            line.v[i] += side * force;
            plucked = Math.max(plucked, force);
          }
          const wave = (line.o[i - 1] + line.o[i + 1] - 2 * line.o[i]) * 0.32;
          line.v[i] += wave - line.o[i] * 0.045;
          line.v[i] *= 0.955;
        }
        for (let i = 1; i < N - 1; i++) line.o[i] += line.v[i];

        if (plucked > 5.5) pluck(Math.min(1.6, plucked / 12));

        // Energy → brightness
        let e = 0;
        for (let i = 0; i < N; i++) e += Math.abs(line.o[i]);
        line.energy += (Math.min(1, e / 260) - line.energy) * 0.1;

        ctx.beginPath();
        ctx.moveTo(x0, y0);
        for (let i = 1; i < N; i++) {
          const bx = x0 + ((x1 - x0) * i) / (N - 1) + px * line.o[i];
          const by = y0 + ((y1 - y0) * i) / (N - 1) + py * line.o[i];
          ctx.lineTo(bx, by);
        }
        ctx.strokeStyle = `rgba(226, 230, 240, ${(0.09 + line.energy * 0.3).toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove, { passive: true });
    canvas.parentElement!.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      if (holdTimer) clearTimeout(holdTimer);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      canvas.parentElement?.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
    };
  }, []);

  return <canvas ref={canvasRef} className="heroLines" aria-hidden />;
}
