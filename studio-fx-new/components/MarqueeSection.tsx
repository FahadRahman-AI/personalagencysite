'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';

/* ─── Two rows of marquee — top row goes right, bottom row goes left.
   The opposite-direction rows create visual depth and are the standard
   premium technique seen on sites like Locomotive, Linear, Raycast.
   Scroll velocity boosts timeScale on both rows simultaneously. ─── */

const ROW1 = [
  'OPERATIONS INTELLIGENCE', 'ZERO LEADS LOST',
  'SYSTEMS THAT WORK WHILE YOU SLEEP', 'FREE FIRST CALL',
  'RESULTS IN 30 DAYS', 'NO FLUFF',
];

const ROW2 = [
  'BUILT FOR YOUR BUSINESS', 'SEAL EVERY GAP',
  'AUTOMATED FOLLOW-UPS', '60 SECOND RESPONSE',
  'WHILE YOU SLEEP', 'DONE FOR YOU',
];

function MarqueeRow({ items, reverse }: { items: string[]; reverse?: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const id = requestAnimationFrame(() => {
      const w = track.scrollWidth / 2;
      if (w <= 0) return;
      tweenRef.current = gsap.to(track, {
        x: reverse ? w : -w,
        duration: 30,
        ease: 'none',
        repeat: -1,
        startAt: reverse ? { x: -w } : { x: 0 },
      });
    });

    return () => { cancelAnimationFrame(id); tweenRef.current?.kill(); };
  }, [reverse]);

  const repeated = [...items, ...items, ...items];

  return (
    <div style={{ overflow: 'hidden', display: 'flex' }}>
      <div
        ref={trackRef}
        style={{ display: 'flex', whiteSpace: 'nowrap', willChange: 'transform' }}
      >
        {repeated.map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: 'var(--font-anton-var), sans-serif',
              fontSize: 19,
              letterSpacing: '0.04em',
              color: '#fff',
              padding: '0 40px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 40,
              flexShrink: 0,
              opacity: reverse ? 0.55 : 1,
            }}
          >
            {item}
            <svg width="4" height="4" viewBox="0 0 4 4" style={{ flexShrink: 0, opacity: 0.5 }}>
              <circle cx="2" cy="2" r="2" fill="white" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function MarqueeSection() {
  /* Velocity effect applied to both rows via a shared scroll listener */
  useEffect(() => {
    let lastY    = window.scrollY;
    let velRaf   = 0;

    const tick = () => {
      velRaf = requestAnimationFrame(tick);
      const y  = window.scrollY;
      const v  = Math.abs(y - lastY);
      lastY    = y;

      // Apply timeScale to all active GSAP tweens (both rows)
      const ts = 1 + Math.min(v * 0.06, 3);
      gsap.globalTimeline.timeScale(ts);
      // Gently return to normal speed
      setTimeout(() => { gsap.globalTimeline.timeScale(1); }, 150);
    };
    velRaf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(velRaf);
  }, []);

  return (
    <section style={{
      background: '#E8350A',
      overflow: 'hidden',
      padding: '14px 0',
      position: 'relative',
      zIndex: 1,
      display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      <MarqueeRow items={ROW1} />
      <MarqueeRow items={ROW2} reverse />
    </section>
  );
}
