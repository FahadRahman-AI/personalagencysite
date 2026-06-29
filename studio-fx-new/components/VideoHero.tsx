'use client';

import { useEffect, useRef, useState } from 'react';
import { useTrail, animated } from '@react-spring/web';
import { useAppStore } from '@/lib/store';

const WORDS = ['STOP', 'LOSING', 'CLIENTS', 'TO', 'YOUR', 'INBOX.'];

export default function VideoHero() {
  const wrapperRef  = useRef<HTMLDivElement>(null);
  const videoRef    = useRef<HTMLVideoElement>(null);
  const [ready, setReady]     = useState(false);
  const [revealed, setRevealed] = useState(false);

  /* reveal headline after mount */
  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 400);
    return () => clearTimeout(t);
  }, []);

  /* mark video ready once metadata is loaded */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.readyState >= 1) { setReady(true); return; }
    const fn = () => setReady(true);
    v.addEventListener('loadedmetadata', fn);
    return () => v.removeEventListener('loadedmetadata', fn);
  }, []);

  /* scroll → currentTime — zero React re-renders */
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    return useAppStore.subscribe(({ scrollY }) => {
      const video = videoRef.current;
      if (!video || !ready || !video.duration) return;

      const top   = wrapper.offsetTop;
      const range = wrapper.offsetHeight - window.innerHeight;
      const pct   = Math.max(0, Math.min(1, (scrollY - top) / range));

      video.currentTime = pct * video.duration;
    });
  }, [ready]);

  const trail = useTrail(WORDS.length, {
    y:       revealed ? 0   : 100,
    opacity: revealed ? 1   : 0,
    config:  { mass: 1, tension: 200, friction: 36 },
    delay:   revealed ? 60  : 0,
  });

  return (
    /* Tall wrapper — scroll distance = scroll range for video */
    <div ref={wrapperRef} style={{ height: '500vh' }}>

      {/* Sticky full-screen panel */}
      <div style={{
        position: 'sticky', top: 0,
        width: '100%', height: '100vh',
        overflow: 'hidden', background: '#000',
      }}>

        {/* VIDEO — fills the entire viewport */}
        <video
          ref={videoRef}
          src="/hero-video.mp4"
          muted playsInline preload="auto"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            opacity: ready ? 1 : 0,
            transition: 'opacity 0.8s ease',
          }}
        />

        {/* Dark overlay so headline is always readable */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.7) 100%)',
        }} />

        {/* HEADLINE */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 clamp(24px, 7vw, 120px)',
        }}>
          <h1 style={{ margin: 0, lineHeight: 0.88 }}>
            {trail.map((spring, i) => (
              <span
                key={i}
                style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', marginRight: '0.2em' }}
              >
                <animated.span style={{
                  ...spring,
                  display: 'inline-block',
                  fontFamily: 'var(--font-anton)',
                  fontSize: 'clamp(56px, 11vw, 160px)',
                  color: '#fff',
                  letterSpacing: '-0.01em',
                }}>
                  {WORDS[i]}
                </animated.span>
              </span>
            ))}
          </h1>

          <animated.p style={{
            opacity: trail[3]?.opacity ?? 0,
            fontFamily: 'var(--font-space-grotesk)',
            fontSize: 'clamp(14px, 1.4vw, 18px)',
            color: 'rgba(255,255,255,0.5)',
            marginTop: '28px',
            maxWidth: '460px',
            lineHeight: 1.65,
            fontWeight: 300,
          }}>
            Every missed enquiry is a client your competitor just answered.
            We fix that. Permanently.
          </animated.p>

          <animated.div style={{ opacity: trail[5]?.opacity ?? 0, marginTop: '40px' }}>
            <a
              href="#contact"
              style={{
                display: 'inline-block',
                border: '1px solid rgba(255,255,255,0.3)',
                color: '#fff',
                fontFamily: 'var(--font-space-grotesk)',
                fontSize: '13px',
                fontWeight: 500,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: '16px 48px',
                borderRadius: '100px',
                cursor: 'pointer',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = '#fff';
                (e.currentTarget as HTMLElement).style.color = '#000';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'transparent';
                (e.currentTarget as HTMLElement).style.color = '#fff';
              }}
            >
              Book a free call
            </a>
          </animated.div>
        </div>

        {/* SCROLL HINT */}
        <animated.div style={{
          opacity: trail[5]?.opacity ?? 0,
          position: 'absolute', bottom: '40px', left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
        }}>
          <span style={{
            fontFamily: 'var(--font-space-grotesk)',
            fontSize: '10px', letterSpacing: '0.3em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)',
          }}>SCROLL</span>
          <div style={{
            width: '1px', height: '48px',
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.35), transparent)',
          }} />
        </animated.div>

        {/* PROGRESS BAR */}
        <ProgressBar wrapperRef={wrapperRef} />
      </div>
    </div>
  );
}

function ProgressBar({ wrapperRef }: { wrapperRef: React.RefObject<HTMLDivElement | null> }) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    return useAppStore.subscribe(({ scrollY }) => {
      const bar = barRef.current;
      if (!bar) return;
      const top   = wrapper.offsetTop;
      const range = wrapper.offsetHeight - window.innerHeight;
      const pct   = Math.max(0, Math.min(1, (scrollY - top) / range));
      bar.style.transform = `scaleX(${pct})`;
    });
  }, [wrapperRef]);

  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      height: '2px', background: 'rgba(255,255,255,0.07)',
    }}>
      <div ref={barRef} style={{
        height: '100%',
        background: 'rgba(255,255,255,0.5)',
        transformOrigin: 'left center',
        transform: 'scaleX(0)',
      }} />
    </div>
  );
}
