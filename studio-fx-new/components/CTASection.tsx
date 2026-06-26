'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { useSpring, useTrail, animated } from '@react-spring/web';

const CTAScene = dynamic(() => import('./CTAScene'), { ssr: false });

function useInView(threshold = 0.2) {
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

export default function CTASection() {
  const { ref: sectionRef, inView } = useInView();

  const lines = ['READY TO STOP', 'LOSING LEADS?'];
  const trail = useTrail(lines.length, {
    opacity: inView ? 1 : 0,
    y: inView ? 0 : 60,
    config: { mass: 1, tension: 160, friction: 36 },
    delay: 100,
  });

  const subSpring = useSpring({
    opacity: inView ? 1 : 0,
    y: inView ? 0 : 24,
    config: { mass: 1, tension: 180, friction: 38 },
    delay: 400,
  });

  const btnSpring = useSpring({
    opacity: inView ? 1 : 0,
    y: inView ? 0 : 20,
    config: { mass: 1, tension: 180, friction: 38 },
    delay: 600,
  });

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <section
      id="cta"
      style={{
        position: 'relative',
        background: '#080808',
        padding: '200px 0',
        textAlign: 'center',
        overflow: 'hidden',
      }}
    >
      <CTAScene count={isMobile ? 300 : 800} />

      {/* Vignette so text is legible */}
      <div ref={sectionRef} style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'radial-gradient(ellipse at center, rgba(8,8,8,0.5) 0%, rgba(8,8,8,0.92) 80%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 2, maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
        <animated.p style={{
          ...subSpring,
          fontFamily: 'var(--font-space-grotesk)',
          fontSize: '11px',
          color: '#E8350A',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          marginBottom: '24px',
        }}>
          LET&#39;S TALK
        </animated.p>

        <h2 style={{
          fontFamily: 'var(--font-anton)',
          fontSize: 'clamp(56px, 9vw, 140px)',
          lineHeight: 0.85,
          letterSpacing: '-0.01em',
          marginBottom: '36px',
          overflow: 'hidden',
        }}>
          {trail.map((spring, i) => (
            <animated.span key={i} style={{ ...spring, display: 'block', color: 'white' }}>
              {lines[i]}
            </animated.span>
          ))}
        </h2>

        <animated.p style={{
          ...subSpring,
          fontFamily: 'var(--font-space-grotesk)',
          fontWeight: 300,
          fontSize: '14px',
          color: 'rgba(255,255,255,0.38)',
          marginBottom: '52px',
          maxWidth: '440px',
          margin: '0 auto 52px',
          lineHeight: 1.8,
          letterSpacing: '0.01em',
        }}>
          Book a free 30-minute call. We&#39;ll show you exactly what your business is losing and how to fix it.
        </animated.p>

        <animated.div style={btnSpring}>
          <a
            href="mailto:hello@studiofx.co"
            data-magnetic
            style={{
              display: 'inline-block',
              background: '#E8350A',
              color: 'white',
              fontFamily: 'var(--font-space-grotesk)',
              fontWeight: 600,
              fontSize: '13px',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              padding: '20px 60px',
              borderRadius: '100px',
              transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1), opacity 0.2s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.04)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
          >
            BOOK YOUR FREE CALL
          </a>
        </animated.div>

        <animated.p style={{
          ...btnSpring,
          fontFamily: 'var(--font-space-grotesk)',
          fontSize: '11px',
          color: 'rgba(255,255,255,0.2)',
          marginTop: '40px',
          letterSpacing: '0.06em',
        }}>
          hello@studiofx.co · Birmingham, UK · Worldwide
        </animated.p>
      </div>
    </section>
  );
}
