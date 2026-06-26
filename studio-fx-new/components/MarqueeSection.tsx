'use client';

import { useRef, useEffect } from 'react';
import { useAppStore } from '@/lib/store';

const ITEMS = ['AI SYSTEMS', 'LEAD AUTOMATION', 'WEBSITES', 'WORKFLOW AUTOMATION', 'DONE FOR YOU'];

export default function MarqueeSection() {
  const track1 = useRef<HTMLDivElement>(null);
  const track2 = useRef<HTMLDivElement>(null);
  const xRef    = useRef(0);
  const rafRef  = useRef<number>(0);

  useEffect(() => {
    const t1 = track1.current;
    const t2 = track2.current;
    if (!t1 || !t2) return;

    const baseSpeed = 0.8;

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);

      const velocity = useAppStore.getState().scrollVelocity;
      const speed = baseSpeed + Math.abs(velocity) * 0.06;

      xRef.current -= speed;
      const w = t1.scrollWidth;
      if (Math.abs(xRef.current) >= w) xRef.current = 0;

      t1.style.transform = `translateX(${xRef.current}px)`;
      t2.style.transform = `translateX(${xRef.current}px)`;
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const content = [...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS].map((item, i) => (
    <span
      key={i}
      style={{
        fontFamily: 'var(--font-anton)',
        fontSize: '18px',
        color: 'white',
        letterSpacing: '0.12em',
        whiteSpace: 'nowrap',
        paddingRight: '0',
      }}
    >
      {item}
      <span style={{ display: 'inline-block', width: '48px', opacity: 0.5, textAlign: 'center' }}>·</span>
    </span>
  ));

  return (
    <div style={{
      background: '#E8350A',
      height: '52px',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
    }}>
      {/* Two duplicate tracks for seamless loop */}
      <div ref={track1} style={{ display: 'flex', position: 'absolute', willChange: 'transform' }}>
        {content}
      </div>
      <div ref={track2} style={{ display: 'flex', position: 'absolute', willChange: 'transform', left: '100%' }}>
        {content}
      </div>
    </div>
  );
}
