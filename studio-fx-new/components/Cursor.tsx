'use client';

import { useEffect } from 'react';

export default function Cursor() {
  useEffect(() => {
    const dot  = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    let mx = 0, my = 0;
    let rx = 0, ry = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    };

    const onOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('a, button, [data-cursor]')) {
        dot.classList.add('hovered');
        ring.classList.add('hovered');
      }
    };
    const onOut = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('a, button, [data-cursor]')) {
        dot.classList.remove('hovered');
        ring.classList.remove('hovered');
      }
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);

    let rafId: number;
    const tick = () => {
      rafId = requestAnimationFrame(tick);
      rx += (mx - rx) * 0.1;
      ry += (my - ry) * 0.1;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
    };
  }, []);

  return (
    <>
      <div id="cursor-dot"  aria-hidden="true" />
      <div id="cursor-ring" aria-hidden="true" />
    </>
  );
}
