'use client';

/**
 * Cursor — core dot + trailing ring. Grows over [data-hover]; shows a
 * label over [data-cursor-label] elements (e.g. VIEW on work cards).
 */

import { useEffect, useRef } from 'react';

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    document.documentElement.classList.add('hasCursor');

    const m = { x: -100, y: -100 };
    const d = { x: -100, y: -100 };
    const r = { x: -100, y: -100 };
    let mode: 'idle' | 'hover' | 'label' = 'idle';
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      m.x = e.clientX;
      m.y = e.clientY;
      const t = e.target as Element | null;
      const labelled = t?.closest?.('[data-cursor-label]') as HTMLElement | null;
      if (labelled) {
        mode = 'label';
        label.textContent = labelled.dataset.cursorLabel || 'VIEW';
      } else if (t?.closest?.('[data-hover]')) {
        mode = 'hover';
      } else {
        mode = 'idle';
      }
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      d.x += (m.x - d.x) * 0.42;
      d.y += (m.y - d.y) * 0.42;
      r.x += (m.x - r.x) * 0.14;
      r.y += (m.y - r.y) * 0.14;
      dot.style.transform = `translate3d(${d.x}px, ${d.y}px, 0) translate(-50%, -50%) scale(${
        mode === 'label' ? 0 : 1
      })`;
      const ringScale = mode === 'label' ? 2.6 : mode === 'hover' ? 1.8 : 1;
      ring.style.transform = `translate3d(${r.x}px, ${r.y}px, 0) translate(-50%, -50%) scale(${ringScale})`;
      ring.classList.toggle('cursorRingSolid', mode === 'label');
      label.style.transform = `translate3d(${r.x}px, ${r.y}px, 0) translate(-50%, -50%)`;
      label.style.opacity = mode === 'label' ? '1' : '0';
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove('hasCursor');
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursorDot" aria-hidden />
      <div ref={ringRef} className="cursorRing" aria-hidden />
      <div ref={labelRef} className="cursorLabel" aria-hidden />
    </>
  );
}
