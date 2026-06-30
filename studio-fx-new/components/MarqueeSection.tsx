'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';

/* ─── Items — doctrine compliant: no buzzwords, direct language ─── */
const ITEMS = [
  'OPERATIONS INTELLIGENCE',
  'ZERO LEADS LOST',
  'SYSTEMS THAT WORK WHILE YOU SLEEP',
  'FREE FIRST CALL',
  'RESULTS IN 30 DAYS',
  'NO FLUFF',
  'BUILT FOR YOUR BUSINESS',
  'SEAL EVERY GAP',
];

/* ─── Technique: velocity-responsive marquee.
   Base speed = 0.5px/frame via GSAP ticker.
   When scroll velocity is high, timeScale of the tween is boosted.
   This creates the "scroll to accelerate" effect from Locomotive & Webflow. ─── */

export default function MarqueeSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Wait one tick for layout to settle
    const id = requestAnimationFrame(() => {
      const w = track.scrollWidth / 2;
      if (w <= 0) return;

      tweenRef.current = gsap.to(track, {
        x: -w,
        duration: 28,
        ease: 'none',
        repeat: -1,
      });
    });

    // Velocity listener — scroll makes marquee speed up
    let lastY = window.scrollY;
    let velocity = 0;
    let velRaf = 0;

    const trackVelocity = () => {
      velRaf = requestAnimationFrame(trackVelocity);
      const currentY = window.scrollY;
      velocity = (currentY - lastY) * 0.05;
      lastY = currentY;

      if (tweenRef.current) {
        // timeScale: 1 at rest, up to 4 at high scroll speed
        const ts = 1 + Math.min(Math.abs(velocity), 3);
        tweenRef.current.timeScale(ts);
      }
    };
    velRaf = requestAnimationFrame(trackVelocity);

    return () => {
      cancelAnimationFrame(id);
      cancelAnimationFrame(velRaf);
      tweenRef.current?.kill();
    };
  }, []);

  const repeated = [...ITEMS, ...ITEMS, ...ITEMS];

  return (
    <section style={{
      background: '#E8350A',
      overflow: 'hidden',
      padding: '16px 0',
      position: 'relative',
      zIndex: 1,
    }}>
      <div
        ref={trackRef}
        style={{ display: 'flex', whiteSpace: 'nowrap', willChange: 'transform' }}
      >
        {repeated.map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: 'var(--font-anton-var), sans-serif',
              fontSize: 21,
              letterSpacing: '0.04em',
              color: '#fff',
              padding: '0 44px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 44,
              flexShrink: 0,
            }}
          >
            {item}
            <svg width="5" height="5" viewBox="0 0 5 5" style={{ flexShrink: 0, opacity: 0.5 }}>
              <circle cx="2.5" cy="2.5" r="2.5" fill="white" />
            </svg>
          </span>
        ))}
      </div>
    </section>
  );
}
