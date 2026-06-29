'use client';

import { useEffect, useRef, useState } from 'react';

const WORDS = ['STOP', 'LOSING', 'CLIENTS', 'TO', 'YOUR', 'INBOX.'];

export default function VideoHero() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef   = useRef<HTMLVideoElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [loaded,   setLoaded]   = useState(false);

  /* headline reveal */
  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const video   = videoRef.current;
    const canvas  = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!video || !canvas || !wrapper) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let targetTime = 0;
    let rafId: number;

    /* size canvas to viewport */
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    /* scroll → target time only (no seek here) */
    const onScroll = () => {
      if (!video.duration) return;
      const top      = wrapper.offsetTop;
      const range    = wrapper.offsetHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, (window.scrollY - top) / range));
      targetTime = progress * video.duration;
    };

    /* rAF loop — seek once per frame, paint frame to canvas immediately */
    const tick = () => {
      const diff = targetTime - video.currentTime;

      if (Math.abs(diff) > 0.018) {
        // fastSeek is approximate but ~3× faster than currentTime on Chrome
        if ('fastSeek' in video) {
          (video as HTMLVideoElement & { fastSeek: (t: number) => void }).fastSeek(targetTime);
        } else {
          (video as HTMLVideoElement).currentTime = targetTime;
        }
      }

      /* paint whatever frame is decoded right now — canvas never goes black */
      if (video.readyState >= 2) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }

      rafId = requestAnimationFrame(tick);
    };

    const onLoaded = () => {
      setLoaded(true);
      /* draw frame 0 the moment metadata is ready */
      video.currentTime = 0;
    };

    /* draw frame once it's seeked to 0 */
    const onSeeked = () => {
      if (video.readyState >= 2) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }
    };

    video.addEventListener('loadeddata',   onLoaded);
    video.addEventListener('seeked',       onSeeked);
    window.addEventListener('scroll',      onScroll, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll',  onScroll);
      window.removeEventListener('resize',  resize);
      video.removeEventListener('loadeddata', onLoaded);
      video.removeEventListener('seeked',     onSeeked);
    };
  }, []);

  return (
    /* tall wrapper — 500vh = full scroll range for video */
    <div ref={wrapperRef} style={{ height: '500vh' }}>

      <div style={{
        position: 'sticky', top: 0,
        width: '100%', height: '100vh',
        overflow: 'hidden', background: '#000',
      }}>

        {/* hidden video — decoder only, never visible */}
        <video
          ref={videoRef}
          src="/hero-video.mp4"
          muted playsInline preload="auto"
          style={{ display: 'none' }}
        />

        {/* canvas — the actual display surface */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.6s ease',
          }}
        />

        {/* cinematic gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: [
            'linear-gradient(to bottom,',
            '  rgba(0,0,0,0.55) 0%,',
            '  rgba(0,0,0,0.15) 40%,',
            '  rgba(0,0,0,0.15) 60%,',
            '  rgba(0,0,0,0.75) 100%)',
          ].join(''),
        }} />

        {/* headline block */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 clamp(24px, 7vw, 120px)',
        }}>

          <h1 style={{ margin: 0, lineHeight: 0.88 }}>
            {WORDS.map((word, i) => (
              <span key={i} style={{
                display: 'inline-block',
                overflow: 'hidden',
                verticalAlign: 'bottom',
                marginRight: '0.22em',
              }}>
                <span style={{
                  display: 'inline-block',
                  fontFamily: 'var(--font-anton)',
                  fontSize: 'clamp(52px, 10.5vw, 150px)',
                  color: '#fff',
                  letterSpacing: '-0.01em',
                  transform:  revealed ? 'translateY(0)'    : 'translateY(110%)',
                  opacity:    revealed ? 1                  : 0,
                  transition: [
                    `transform 0.8s cubic-bezier(0.16,1,0.3,1) ${i * 55}ms`,
                    `opacity   0.8s ease                        ${i * 55}ms`,
                  ].join(', '),
                }}>
                  {word}
                </span>
              </span>
            ))}
          </h1>

          <p style={{
            fontFamily: 'var(--font-space-grotesk)',
            fontSize: 'clamp(14px, 1.35vw, 18px)',
            color: 'rgba(255,255,255,0.5)',
            marginTop: '28px',
            maxWidth: '440px',
            lineHeight: 1.7,
            fontWeight: 300,
            opacity:   revealed ? 1            : 0,
            transform: revealed ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.9s ease 480ms, transform 0.9s ease 480ms',
          }}>
            Every missed enquiry is a client your competitor just answered.
            We fix that. Permanently.
          </p>

          <div style={{
            marginTop: '40px',
            opacity:   revealed ? 1 : 0,
            transition: 'opacity 0.9s ease 680ms',
          }}>
            <a
              href="#contact"
              style={{
                display: 'inline-block',
                border: '1px solid rgba(255,255,255,0.28)',
                color: '#fff',
                fontFamily: 'var(--font-space-grotesk)',
                fontSize: '12px',
                fontWeight: 500,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                padding: '15px 48px',
                borderRadius: '100px',
                cursor: 'pointer',
                textDecoration: 'none',
                transition: 'background 0.3s ease, color 0.3s ease',
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
          </div>
        </div>

        {/* scroll indicator */}
        <div style={{
          position: 'absolute', bottom: '36px', left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: '8px',
          opacity:   revealed ? 1 : 0,
          transition: 'opacity 1s ease 1.1s',
        }}>
          <span style={{
            fontFamily: 'var(--font-space-grotesk)',
            fontSize: '9px', letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.28)',
          }}>SCROLL</span>
          <div style={{
            width: '1px', height: '44px',
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)',
          }} />
        </div>

        {/* progress bar */}
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

    let rafId: number;
    const tick = () => {
      const bar = barRef.current;
      if (bar) {
        const top      = wrapper.offsetTop;
        const range    = wrapper.offsetHeight - window.innerHeight;
        const progress = Math.max(0, Math.min(1, (window.scrollY - top) / range));
        bar.style.transform = `scaleX(${progress})`;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
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
