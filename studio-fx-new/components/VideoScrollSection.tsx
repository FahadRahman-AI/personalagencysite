'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { useTrail, useSpring, animated } from '@react-spring/web';
import { useAppStore } from '@/lib/store';

const VideoSceneR3F = dynamic(() => import('./VideoSceneR3F'), { ssr: false });

const HEADLINE_WORDS = ['STOP', 'LOSING', 'CLIENTS', 'TO', 'YOUR', 'INBOX.'];

export default function VideoScrollSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [mounted, setMounted] = useState(false);
  const revealedRef = useRef(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setMounted(true);
    const video = videoRef.current;
    if (!video) return;
    setVideoEl(video);
    const onReady = () => setVideoReady(true);
    video.addEventListener('loadedmetadata', onReady);
    return () => video.removeEventListener('loadedmetadata', onReady);
  }, []);

  // Trigger headline reveal on mount (hero = first thing visible)
  useEffect(() => {
    if (!mounted) return;
    const t = setTimeout(() => {
      if (!revealedRef.current) {
        revealedRef.current = true;
        setRevealed(true);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [mounted]);

  // Scroll → video scrub — zero re-renders, direct zustand subscription
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    return useAppStore.subscribe((state) => {
      const video = videoRef.current;
      if (!video || !videoReady || !video.duration) return;
      const sectionTop = wrapper.offsetTop;
      const scrollRange = wrapper.offsetHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, (state.scrollY - sectionTop) / scrollRange));
      video.currentTime = progress * video.duration;
    });
  }, [videoReady]);

  const trail = useTrail(HEADLINE_WORDS.length, {
    y: revealed ? 0 : 120,
    opacity: revealed ? 1 : 0,
    config: { mass: 1, tension: 200, friction: 36 },
    delay: revealed ? 80 : 0,
  });

  const subSpring = useSpring({
    opacity: revealed ? 1 : 0,
    y: revealed ? 0 : 24,
    config: { mass: 1, tension: 180, friction: 40 },
    delay: revealed ? 700 : 0,
  });

  const scrollHintSpring = useSpring({
    opacity: revealed ? 1 : 0,
    config: { mass: 1, tension: 180, friction: 40 },
    delay: revealed ? 1200 : 0,
  });

  return (
    <div ref={wrapperRef} style={{ position: 'relative', height: '400svh' }}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100svh',
          overflow: 'hidden',
          background: '#050505',
        }}
      >
        {/* Hidden video — feeds Three.js VideoTexture */}
        <video
          ref={videoRef}
          src="/hero-video.mp4"
          muted
          playsInline
          preload="auto"
          style={{ display: 'none' }}
        />

        {/* Three.js video scene — covers full viewport */}
        {videoEl && videoReady && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <VideoSceneR3F videoEl={videoEl} />
          </div>
        )}

        {/* Dark overlay — readable without video, cinematic with it */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            background: videoReady
              ? 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.7) 100%)'
              : 'radial-gradient(ellipse at 60% 40%, #1a0505 0%, #050505 70%)',
            transition: 'background 1s ease',
            pointerEvents: 'none',
          }}
        />

        {/* Headline */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: '0 clamp(24px, 6vw, 96px)',
            pointerEvents: 'none',
          }}
        >
          <h1
            style={{ margin: 0 }}
            aria-label={HEADLINE_WORDS.join(' ')}
          >
            {trail.map((spring, i) => (
              <span
                key={i}
                aria-hidden="true"
                style={{ display: 'inline-block', overflow: 'hidden', marginRight: '0.22em', verticalAlign: 'bottom' }}
              >
                <animated.span
                  style={{
                    ...spring,
                    display: 'inline-block',
                    fontFamily: 'var(--font-anton)',
                    fontSize: 'clamp(52px, 10vw, 140px)',
                    color: '#ffffff',
                    lineHeight: 0.88,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {HEADLINE_WORDS[i]}
                </animated.span>
              </span>
            ))}
          </h1>

          <animated.p
            style={{
              ...subSpring,
              fontFamily: 'var(--font-space-grotesk)',
              fontSize: 'clamp(14px, 1.5vw, 18px)',
              color: 'rgba(255,255,255,0.5)',
              marginTop: '32px',
              maxWidth: '480px',
              lineHeight: 1.6,
              fontWeight: 300,
            }}
          >
            Every missed enquiry is a client your competitor just answered.
            We fix that. Permanently.
          </animated.p>

          <animated.a
            href="#cta"
            data-magnetic
            style={{
              ...subSpring,
              display: 'inline-block',
              marginTop: '40px',
              border: '1px solid rgba(255,255,255,0.25)',
              color: '#ffffff',
              fontFamily: 'var(--font-space-grotesk)',
              fontWeight: 500,
              fontSize: '13px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '16px 44px',
              borderRadius: '100px',
              pointerEvents: 'auto',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = 'white';
              el.style.color = '#080808';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = 'transparent';
              el.style.color = 'white';
            }}
          >
            Book a free call
          </animated.a>
        </div>

        {/* Scroll indicator bottom-right */}
        <animated.div
          style={{
            ...scrollHintSpring,
            position: 'absolute',
            bottom: '40px',
            right: 'clamp(24px, 6vw, 96px)',
            zIndex: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            pointerEvents: 'none',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-space-grotesk)',
              fontSize: '10px',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.3)',
            }}
          >
            SCROLL
          </span>
          <div
            style={{
              width: '1px',
              height: '48px',
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)',
            }}
          />
        </animated.div>

        {/* Scroll progress bar */}
        <ScrollProgressBar wrapperRef={wrapperRef} />
      </div>
    </div>
  );
}

function ScrollProgressBar({
  wrapperRef,
}: {
  wrapperRef: React.RefObject<HTMLDivElement | null>;
}) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    return useAppStore.subscribe((state) => {
      const bar = barRef.current;
      if (!bar) return;
      const sectionTop = wrapper.offsetTop;
      const scrollRange = wrapper.offsetHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, (state.scrollY - sectionTop) / scrollRange));
      bar.style.transform = `scaleX(${progress})`;
    });
  }, [wrapperRef]);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: 'rgba(255,255,255,0.08)',
        zIndex: 3,
      }}
    >
      <div
        ref={barRef}
        style={{
          height: '100%',
          background: 'rgba(255,255,255,0.4)',
          transformOrigin: 'left center',
          transform: 'scaleX(0)',
        }}
      />
    </div>
  );
}
