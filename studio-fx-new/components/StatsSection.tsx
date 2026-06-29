'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: '60s',  label: 'Average response time' },
  { value: '24/7', label: 'System uptime' },
  { value: '0',    label: 'Leads lost' },
  { value: 'Free', label: 'First call' },
];

export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const items = section.querySelectorAll<HTMLElement>('.stat-item');
    const ctx = gsap.context(() => {
      gsap.from(items, {
        opacity: 0,
        y: 32,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
        },
      });
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} style={{
      background: '#080808',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
    }}>
      <div
        className="stats-inner"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '88px 48px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
        }}
      >
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="stat-item"
            style={{
              textAlign: 'center',
              padding: '0 24px',
              borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
            }}
          >
            <p style={{
              fontFamily: 'var(--font-anton-var), sans-serif',
              fontSize: 'clamp(44px, 5.5vw, 80px)',
              color: '#fff',
              lineHeight: 1,
              marginBottom: 10,
              letterSpacing: '-0.02em',
            }}>{s.value}</p>
            <p style={{
              fontFamily: 'var(--font-space-var), sans-serif',
              fontSize: 10,
              color: 'rgba(255,255,255,0.35)',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
            }}>{s.label}</p>
          </div>
        ))}
      </div>
      <style>{`
        @media (max-width: 700px) {
          .stats-inner { grid-template-columns: repeat(2, 1fr) !important; gap: 48px 0 !important; }
        }
      `}</style>
    </section>
  );
}
