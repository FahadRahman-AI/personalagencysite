'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';

const ITEMS = [
  'OPERATIONS INTELLIGENCE',
  'ZERO LEADS LOST',
  'SYSTEMS THAT WORK WHILE YOU SLEEP',
  'FREE FIRST CALL',
  'RESULTS IN 30 DAYS',
  'NO BUZZWORDS',
];

export default function MarqueeSection() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const w = track.scrollWidth / 2;
    const tween = gsap.to(track, {
      x: -w,
      duration: 24,
      ease: 'none',
      repeat: -1,
    });
    return () => { tween.kill(); };
  }, []);

  const repeated = [...ITEMS, ...ITEMS];

  return (
    <section style={{
      background: '#E8350A',
      overflow: 'hidden',
      padding: '18px 0',
    }}>
      <div ref={trackRef} style={{ display: 'flex', whiteSpace: 'nowrap', willChange: 'transform' }}>
        {repeated.map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: 'var(--font-anton-var), sans-serif',
              fontSize: 22,
              letterSpacing: '0.04em',
              color: '#fff',
              padding: '0 48px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 48,
            }}
          >
            {item}
            <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.5)', flexShrink: 0 }} />
          </span>
        ))}
      </div>
    </section>
  );
}
