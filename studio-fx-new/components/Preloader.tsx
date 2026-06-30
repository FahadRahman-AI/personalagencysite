'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface Props { onComplete: () => void }

/* ─── Premium preloader pattern (used by Locomotive, Aristide Benoist):
   1. Counter counts 000 → 100 while red line fills left-to-right
   2. Counter fades and line snaps to full
   3. Entire screen wipes up via clipPath inset(0 0 100% 0)
   4. onComplete fires — main content fades in
   Timing is precise: the exit wipe takes 0.9s, onComplete fires after that. ─── */

export default function Preloader({ onComplete }: Props) {
  const rootRef      = useRef<HTMLDivElement>(null);
  const lineRef      = useRef<HTMLDivElement>(null);
  const counterRef   = useRef<HTMLSpanElement>(null);
  const labelRef     = useRef<HTMLSpanElement>(null);
  const percentRef   = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root    = rootRef.current;
    const line    = lineRef.current;
    const counter = counterRef.current;
    const label   = labelRef.current;
    const percent = percentRef.current;
    if (!root || !line || !counter || !label || !percent) return;

    const obj = { val: 0 };

    const tl = gsap.timeline();

    // Phase 1: line fills + counter counts
    tl.to(line, { scaleX: 1, duration: 1.6, ease: 'power3.inOut' })
      .to(obj, {
        val: 100,
        duration: 1.6,
        ease: 'power2.inOut',
        onUpdate() {
          const v = Math.round(obj.val);
          counter.textContent = String(v).padStart(3, '0');
          percent.textContent = `${v}%`;
        },
      }, '<');

    // Phase 2: brief pause at 100
    tl.to({}, { duration: 0.2 });

    // Phase 3: fade label + counter
    tl.to([label, counter, percent], { opacity: 0, duration: 0.3, ease: 'power1.in' });

    // Phase 4: full-screen wipe upward
    tl.to(root, {
      clipPath: 'inset(0 0 100% 0)',
      duration: 0.9,
      ease: 'power4.inOut',
      onComplete,
    });

    return () => { tl.kill(); };
  }, [onComplete]);

  return (
    <div
      ref={rootRef}
      id="preloader"
      style={{
        position: 'fixed', inset: 0,
        background: '#080808',
        zIndex: 9990,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 32,
        clipPath: 'inset(0 0 0% 0)',
      }}
    >
      {/* Brand label */}
      <span
        ref={labelRef}
        style={{
          fontFamily: 'var(--font-space-var), sans-serif',
          fontSize: 11,
          letterSpacing: '0.45em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.2)',
        }}
      >
        Studio FX
      </span>

      {/* Progress bar track */}
      <div style={{ position: 'relative', width: 240, height: 1, background: 'rgba(255,255,255,0.06)' }}>
        <div
          ref={lineRef}
          style={{
            position: 'absolute', top: 0, left: 0,
            width: '100%', height: '100%',
            background: '#E8350A',
            transformOrigin: 'left center',
            transform: 'scaleX(0)',
          }}
        />
      </div>

      {/* Large counter */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span
          ref={counterRef}
          style={{
            fontFamily: 'var(--font-anton-var), sans-serif',
            fontSize: 80,
            color: 'rgba(255,255,255,0.07)',
            letterSpacing: '-0.03em',
            lineHeight: 1,
          }}
        >
          000
        </span>
        <span
          ref={percentRef}
          style={{
            fontFamily: 'var(--font-space-var), sans-serif',
            fontSize: 11,
            color: 'rgba(255,255,255,0.15)',
            letterSpacing: '0.1em',
            alignSelf: 'flex-end',
            paddingBottom: 8,
          }}
        >
          0%
        </span>
      </div>
    </div>
  );
}
