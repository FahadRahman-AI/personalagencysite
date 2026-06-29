'use client';

import { useEffect, useRef, useState } from 'react';

const WORDS = ['STOP', 'LOSING', 'CLIENTS', 'TO', 'YOUR', 'INBOX.'];

export default function VideoHero() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef   = useRef<HTMLVideoElement>(null);
  const [revealed, setRevealed] = useState(false);

  /* reveal headline */
  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 400);
    return () => clearTimeout(t);
  }, []);

  /* scroll → video currentTime */
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const video   = videoRef.current;
    if (!wrapper || !video) return;

    const onScroll = () => {
      if (!video.duration) return;
      const top      = wrapper.offsetTop;
      const range    = wrapper.offsetHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, (window.scrollY - top) / range));
      video.currentTime = progress * video.duration;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div ref={wrapperRef} style={{ height: '500vh' }}>
      <div style={{
        position: 'sticky',
        top: 0,
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        background: '#000',
      }}>

        {/* VIDEO */}
        <video
          ref={videoRef}
          src="/hero-video.mp4"
          muted
          playsInline
          preload="auto"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />

        {/* OVERLAY */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.7) 100%)',
        }} />

        {/* HEADLINE */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 clamp(24px, 7vw, 120px)',
        }}>
          <h1 style={{ margin: 0, lineHeight: 0.9 }}>
            {WORDS.map((word, i) => (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  overflow: 'hidden',
                  verticalAlign: 'bottom',
                  marginRight: '0.2em',
                }}
              >
                <span style={{
                  display: 'inline-block',
                  fontFamily: 'var(--font-anton)',
                  fontSize: 'clamp(56px, 11vw, 160px)',
                  color: '#fff',
                  letterSpacing: '-0.01em',
                  transform: revealed ? 'translateY(0)' : 'translateY(110%)',
                  opacity: revealed ? 1 : 0,
                  transition: `transform 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 60}ms, opacity 0.7s ease ${i * 60}ms`,
                }}>
                  {word}
                </span>
              </span>
            ))}
          </h1>

          <p style={{
            fontFamily: 'var(--font-space-grotesk)',
            fontSize: 'clamp(14px, 1.4vw, 18px)',
            color: 'rgba(255,255,255,0.5)',
            marginTop: '28px',
            maxWidth: '460px',
            lineHeight: 1.65,
            fontWeight: 300,
            opacity: revealed ? 1 : 0,
            transform: revealed ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.8s ease 500ms, transform 0.8s ease 500ms',
          }}>
            Every missed enquiry is a client your competitor just answered.
            We fix that. Permanently.
          </p>

          <div style={{
            marginTop: '40px',
            opacity: revealed ? 1 : 0,
            transition: 'opacity 0.8s ease 700ms',
          }}>
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
                textDecoration: 'none',
              }}
            >
              Book a free call
            </a>
          </div>
        </div>

        {/* SCROLL HINT */}
        <div style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          opacity: revealed ? 1 : 0,
          transition: 'opacity 1s ease 1s',
        }}>
          <span style={{
            fontFamily: 'var(--font-space-grotesk)',
            fontSize: '10px',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.3)',
          }}>SCROLL</span>
          <div style={{
            width: '1px',
            height: '48px',
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.35), transparent)',
          }} />
        </div>

      </div>
    </div>
  );
}
