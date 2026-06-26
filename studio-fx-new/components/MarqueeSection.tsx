'use client';

import { useEffect, useRef } from 'react';

const TEXT = 'AI SYSTEMS · LEAD AUTOMATION · WEBSITES · WORKFLOW AUTOMATION · DONE FOR YOU · ';

export default function MarqueeSection() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let x = 0;
    let rafId: number;
    const speed = 1;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      x -= speed;
      const halfWidth = track.scrollWidth / 2;
      if (Math.abs(x) >= halfWidth) {
        x = 0;
      }
      track.style.transform = `translateX(${x}px)`;
    };

    animate();
    return () => cancelAnimationFrame(rafId);
  }, []);

  const items = Array(6).fill(TEXT);

  return (
    <div
      style={{
        background: '#E8350A',
        height: '52px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          whiteSpace: 'nowrap',
          willChange: 'transform',
        }}
      >
        {items.map((text, i) => (
          <span
            key={i}
            style={{
              fontFamily: 'var(--font-anton)',
              fontSize: '20px',
              color: 'white',
              letterSpacing: '0.1em',
              paddingRight: '0',
            }}
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
