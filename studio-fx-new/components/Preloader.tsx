'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface Props { onComplete: () => void }

export default function Preloader({ onComplete }: Props) {
  const rootRef    = useRef<HTMLDivElement>(null);
  const lineRef    = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root    = rootRef.current;
    const line    = lineRef.current;
    const counter = counterRef.current;
    if (!root || !line || !counter) return;

    const obj = { val: 0 };

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(root, {
          clipPath: 'inset(0 0 100% 0)',
          duration: 0.8,
          ease: 'power4.inOut',
          onComplete,
        });
      },
    });

    tl.to(line, { scaleX: 1, duration: 1.5, ease: 'power3.inOut' })
      .to(obj, {
        val: 100,
        duration: 1.5,
        ease: 'power2.inOut',
        onUpdate() { counter.textContent = String(Math.round(obj.val)).padStart(3, '0'); },
      }, '<');

    return () => { tl.kill(); };
  }, [onComplete]);

  return (
    <div ref={rootRef} id="preloader">
      <span
        style={{
          fontFamily: 'var(--font-space-var), sans-serif',
          fontSize: 11,
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.25)',
        }}
      >
        STUDIO FX
      </span>

      {/* Progress line */}
      <div style={{ width: 200, height: 1, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
        <div
          ref={lineRef}
          style={{
            height: '100%',
            background: '#E8350A',
            transformOrigin: 'left center',
            transform: 'scaleX(0)',
          }}
        />
      </div>

      {/* Counter */}
      <span
        ref={counterRef}
        style={{
          fontFamily: 'var(--font-anton-var), sans-serif',
          fontSize: 64,
          color: 'rgba(255,255,255,0.06)',
          letterSpacing: '-0.02em',
          lineHeight: 1,
        }}
      >
        000
      </span>
    </div>
  );
}
