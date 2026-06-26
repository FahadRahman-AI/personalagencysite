'use client';

import { useRef, useEffect, useState } from 'react';
import { useSpring, useTrail, animated } from '@react-spring/web';

const services = [
  {
    num: '01',
    title: 'Lead Qualification Agent',
    body: 'Every enquiry your business receives gets an instant personalised response. Qualified. Followed up. Booked. Automatically.',
  },
  {
    num: '02',
    title: 'Workflow Automation',
    body: 'The admin that eats your week — invoicing, scheduling, follow-ups, reporting — runs itself while you focus on the work that actually makes money.',
  },
  {
    num: '03',
    title: 'AI-Powered Websites',
    body: 'Not just a website. A system that captures leads, qualifies them, and books calls without you touching anything.',
  },
];

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function ServiceBlock({ s, index }: { s: typeof services[0]; index: number }) {
  const { ref, inView } = useInView();

  const spring = useSpring({
    opacity: inView ? 1 : 0,
    y: inView ? 0 : 32,
    config: { mass: 1, tension: 200, friction: 38 },
    delay: index * 120,
  });

  return (
    <animated.div
      ref={ref}
      style={{
        ...spring,
        borderTop: '1px solid rgba(255,255,255,0.07)',
        padding: '36px 0',
      }}
    >
      <p style={{
        fontFamily: 'var(--font-anton)',
        fontSize: '52px',
        color: 'rgba(255,255,255,0.1)',
        lineHeight: 1,
        marginBottom: '14px',
        letterSpacing: '-0.02em',
      }}>{s.num}</p>
      <h3 style={{
        fontFamily: 'var(--font-space-grotesk)',
        fontWeight: 600,
        fontSize: '19px',
        color: 'white',
        marginBottom: '14px',
        letterSpacing: '0.01em',
      }}>{s.title}</h3>
      <p style={{
        fontFamily: 'var(--font-space-grotesk)',
        fontWeight: 300,
        fontSize: '14px',
        color: 'rgba(255,255,255,0.45)',
        lineHeight: 1.85,
      }}>{s.body}</p>
    </animated.div>
  );
}

export default function WhatWeDoSection() {
  const { ref: headRef, inView: headInView } = useInView(0.2);

  const words = ['WE MAKE YOUR', 'BUSINESS RUN', 'ITSELF.'];
  const trail = useTrail(words.length, {
    opacity: headInView ? 1 : 0,
    y: headInView ? 0 : 60,
    config: { mass: 1, tension: 180, friction: 38 },
    delay: 0,
  });

  return (
    <section style={{ background: '#080808', padding: '160px 0' }}>
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 48px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '96px',
          alignItems: 'start',
        }}
        className="wwds-grid"
      >
        {/* Headline */}
        <div ref={headRef}>
          <h2 style={{
            fontFamily: 'var(--font-anton)',
            fontSize: 'clamp(52px, 7vw, 112px)',
            lineHeight: 0.88,
            letterSpacing: '-0.01em',
          }}>
            {trail.map((spring, i) => (
              <animated.span
                key={i}
                style={{ ...spring, display: 'block', color: i === 2 ? '#E8350A' : 'white' }}
              >
                {words[i]}
              </animated.span>
            ))}
          </h2>
        </div>

        {/* Services */}
        <div>
          {services.map((s, i) => (
            <ServiceBlock key={s.num} s={s} index={i} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .wwds-grid {
            grid-template-columns: 1fr !important;
            gap: 56px !important;
            padding: 0 24px !important;
          }
        }
      `}</style>
    </section>
  );
}
