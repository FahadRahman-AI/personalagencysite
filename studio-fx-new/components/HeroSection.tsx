'use client';

import dynamic from 'next/dynamic';
import { useSpring, animated } from '@react-spring/web';
import { useEffect, useState } from 'react';

const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false });

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const textSpring = useSpring({
    from: { opacity: 0, y: 40 },
    to:   { opacity: mounted ? 1 : 0, y: mounted ? 0 : 40 },
    config: { mass: 1, tension: 140, friction: 40 },
    delay: 600,
  });

  const subtitleSpring = useSpring({
    from: { opacity: 0, y: 20 },
    to:   { opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 },
    config: { mass: 1, tension: 140, friction: 40 },
    delay: 1000,
  });

  const btnSpring = useSpring({
    from: { opacity: 0, y: 16 },
    to:   { opacity: mounted ? 1 : 0, y: mounted ? 0 : 16 },
    config: { mass: 1, tension: 140, friction: 40 },
    delay: 1300,
  });

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        height: '100svh',
        minHeight: '600px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <HeroScene count={isMobile ? 500 : 2000} />

      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(8,8,8,0.85) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 2,
        textAlign: 'center', padding: '0 24px',
        maxWidth: '1000px',
      }}>
        <animated.p style={{
          ...textSpring,
          fontFamily: 'var(--font-space-grotesk)',
          fontWeight: 300,
          fontStyle: 'italic',
          fontSize: '13px',
          color: 'rgba(255,255,255,0.4)',
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          marginBottom: '24px',
        }}>
          WELCOME.
        </animated.p>

        <animated.div style={textSpring}>
          <h1 style={{
            fontFamily: 'var(--font-anton)',
            fontSize: 'clamp(56px, 11vw, 120px)',
            color: '#ffffff',
            lineHeight: 0.88,
            display: 'block',
            letterSpacing: '-0.01em',
          }}>
            WE BUILD AI
          </h1>
          <h1 style={{
            fontFamily: 'var(--font-anton)',
            fontSize: 'clamp(56px, 11vw, 120px)',
            WebkitTextStroke: '1.5px rgba(255,255,255,0.9)',
            color: 'transparent',
            lineHeight: 0.88,
            display: 'block',
            marginBottom: '36px',
            letterSpacing: '-0.01em',
          }}>
            INFRASTRUCTURE
          </h1>
        </animated.div>

        <animated.p style={{
          ...subtitleSpring,
          fontFamily: 'var(--font-space-grotesk)',
          fontWeight: 300,
          fontSize: '14px',
          color: 'rgba(255,255,255,0.45)',
          marginBottom: '44px',
          letterSpacing: '0.02em',
        }}>
          For businesses that refuse to be left behind.
        </animated.p>

        <animated.div style={btnSpring}>
          <a
            href="#cta"
            data-magnetic
            style={{
              display: 'inline-block',
              border: '1px solid rgba(255,255,255,0.18)',
              color: 'white',
              fontFamily: 'var(--font-space-grotesk)',
              fontWeight: 400,
              fontSize: '13px',
              letterSpacing: '0.06em',
              padding: '16px 44px',
              borderRadius: '100px',
              transition: 'background 0.4s cubic-bezier(0.16,1,0.3,1), color 0.4s cubic-bezier(0.16,1,0.3,1), border-color 0.4s',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = 'white';
              el.style.color = '#080808';
              el.style.borderColor = 'white';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = 'transparent';
              el.style.color = 'white';
              el.style.borderColor = 'rgba(255,255,255,0.18)';
            }}
          >
            Book a free call
          </a>
        </animated.div>
      </div>

      {/* Scroll indicator */}
      <animated.div style={{
        ...btnSpring,
        position: 'absolute', bottom: '40px', left: '50%',
        transform: 'translateX(-50%)', zIndex: 2,
      }}>
        <div style={{
          width: '1px', height: '56px',
          background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.3))',
          margin: '0 auto',
        }} />
      </animated.div>
    </section>
  );
}
