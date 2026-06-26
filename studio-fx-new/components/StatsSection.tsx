'use client';

import { useEffect, useRef, useState } from 'react';
import { useSpring, animated } from '@react-spring/web';

const stats = [
  { value: '60s',  label: 'Average response time' },
  { value: '24/7', label: 'System uptime' },
  { value: '0',    label: 'Leads lost' },
  { value: 'Free', label: 'First call' },
];

function useInView() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, inView };
}

function StatItem({ stat, index }: { stat: typeof stats[0]; index: number }) {
  const { ref, inView } = useInView();
  const spring = useSpring({
    opacity: inView ? 1 : 0,
    y: inView ? 0 : 28,
    config: { mass: 1, tension: 200, friction: 38 },
    delay: index * 100,
  });

  return (
    <animated.div
      ref={ref}
      style={{
        ...spring,
        textAlign: 'center',
        padding: '0 24px',
        borderRight: index < stats.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
      }}
    >
      <p style={{
        fontFamily: 'var(--font-anton)',
        fontSize: 'clamp(44px, 5.5vw, 80px)',
        color: 'white',
        lineHeight: 1,
        marginBottom: '10px',
        letterSpacing: '-0.02em',
      }}>
        {stat.value}
      </p>
      <p style={{
        fontFamily: 'var(--font-space-grotesk)',
        fontSize: '10px',
        color: 'rgba(255,255,255,0.35)',
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
      }}>
        {stat.label}
      </p>
    </animated.div>
  );
}

export default function StatsSection() {
  return (
    <section style={{
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
        {stats.map((s, i) => <StatItem key={s.label} stat={s} index={i} />)}
      </div>
      <style>{`
        @media (max-width: 700px) {
          .stats-inner { grid-template-columns: repeat(2, 1fr) !important; gap: 48px 0 !important; }
        }
      `}</style>
    </section>
  );
}
