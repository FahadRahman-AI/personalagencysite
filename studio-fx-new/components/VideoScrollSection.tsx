'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { useTrail, animated } from '@react-spring/web';
import { useAppStore } from '@/lib/store';

const VideoSceneR3F = dynamic(() => import('./VideoSceneR3F'), { ssr: false });

const HEADLINE = ['WHILE YOU WERE', 'BUSY — THEY BOOKED.'];

export default function VideoScrollSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null);
  const [revealed, setRevealed] = useState(false);
  const revealedRef = useRef(false);

  // Capture video element after mount
  useEffect(() => {
    if (videoRef.current) setVideoEl(videoRef.current);
  }, []);

  // Subscribe to scroll outside React render — zero re-renders on scroll
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    return useAppStore.subscribe((state) => {
      const { scrollY } = state;
      const sectionTop = wrapper.offsetTop;
      const scrollRange = wrapper.offsetHeight - window.innerHeight;

      // Reveal headline when section crests the viewport
      if (!revealedRef.current && scrollY >= sectionTop - window.innerHeight * 0.6) {
        revealedRef.current = true;
        setRevealed(true);
      }

      // Scrub video currentTime by scroll progress
      const video = videoRef.current;
      if (!video || video.readyState < 2 || !video.duration) return;
      const progress = Math.max(0, Math.min(1, (scrollY - sectionTop) / scrollRange));
      video.currentTime = progress * video.duration;
    });
  }, []);

  const trail = useTrail(HEADLINE.length, {
    y: revealed ? 0 : 80,
    opacity: revealed ? 1 : 0,
    config: { mass: 1, tension: 200, friction: 36 },
    delay: revealed ? 80 : 0,
  });

  const subSpring = {
    opacity: trail[1]?.opacity ?? (0 as unknown as number),
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative', height: '300svh' }}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100svh',
          overflow: 'hidden',
          background: '#050505',
        }}
      >
        {/* Hidden video — source for VideoTexture; display:none still feeds WebGL */}
        <video
          ref={videoRef}
          src="/hero-video.mp4"
          muted
          playsInline
          preload="auto"
          style={{ display: 'none' }}
        />

        {/* Three.js scene — full-screen video texture with GLSL effects */}
        {videoEl && (
          <div style={{ position: 'absolute', inset: 0 }}>
            <VideoSceneR3F videoEl={videoEl} />
          </div>
        )}

        {/* Headline + sub-label overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <h2
            style={{ textAlign: 'center', padding: '0 24px' }}
            aria-label={HEADLINE.join(' ')}
          >
            {trail.map((spring, i) => (
              <span
                key={i}
                aria-hidden="true"
                style={{ display: 'block', overflow: 'hidden' }}
              >
                <animated.span
                  style={{
                    ...spring,
                    display: 'block',
                    fontFamily: 'var(--font-anton)',
                    fontSize: 'clamp(52px, 9vw, 130px)',
                    color: '#ffffff',
                    lineHeight: 0.9,
                    letterSpacing: '-0.01em',
                    textShadow: '0 2px 40px rgba(0,0,0,0.6)',
                  }}
                >
                  {HEADLINE[i]}
                </animated.span>
              </span>
            ))}
          </h2>

          <animated.p
            style={{
              ...subSpring,
              fontFamily: 'var(--font-space-grotesk)',
              fontSize: '11px',
              color: 'rgba(255,255,255,0.35)',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              marginTop: '36px',
            }}
          >
            SCROLL TO SEE HOW IT WORKS
          </animated.p>
        </div>

        {/* Thin scroll progress bar at bottom */}
        <ScrollProgressBar wrapperRef={wrapperRef} />
      </div>
    </div>
  );
}

// Isolated component so the progress bar re-renders independently
function ScrollProgressBar({ wrapperRef }: { wrapperRef: React.RefObject<HTMLDivElement | null> }) {
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
        height: '2px',
        background: 'rgba(255,255,255,0.06)',
        zIndex: 3,
      }}
    >
      <div
        ref={barRef}
        style={{
          height: '100%',
          background: 'rgba(255,255,255,0.5)',
          transformOrigin: 'left center',
          transform: 'scaleX(0)',
        }}
      />
    </div>
  );
}
