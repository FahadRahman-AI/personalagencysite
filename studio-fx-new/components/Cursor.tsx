'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';

export default function Cursor() {
  const setMouse = useAppStore((s) => s.setMouse);

  useEffect(() => {
    const dot  = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    let mx = 0, my = 0;
    let dx = 0, dy = 0;
    let rx = 0, ry = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      setMouse(mx / window.innerWidth, my / window.innerHeight);
    };
    document.addEventListener('mousemove', onMove);

    // Magnetic pull toward interactive elements
    const onOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('a, button, [data-magnetic]')) {
        ring.classList.add('active');
      }
    };
    const onOut = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('a, button, [data-magnetic]')) {
        ring.classList.remove('active');
      }
    };
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);

    let rafId: number;
    const lerp = (a: number, b: number, n: number) => a + (b - a) * n;

    const tick = () => {
      rafId = requestAnimationFrame(tick);

      // dot: fast lerp
      dx = lerp(dx, mx, 0.28);
      dy = lerp(dy, my, 0.28);
      dot.style.left = dx + 'px';
      dot.style.top  = dy + 'px';

      // ring: slow lerp
      rx = lerp(rx, mx, 0.1);
      ry = lerp(ry, my, 0.1);
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
    };
  }, [setMouse]);

  return (
    <>
      <div id="cursor-dot"  aria-hidden="true" />
      <div id="cursor-ring" aria-hidden="true" />
    </>
  );
}
