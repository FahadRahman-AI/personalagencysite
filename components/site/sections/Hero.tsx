'use client';

/**
 * Hero — 400 vh pinned canvas track.
 * Canvas stays sticky at top-0; the extra scroll distance drives the monogram
 * through a full rotation via GSAP ScrollTrigger (the frame-scrubber pattern).
 * Text and UI overlay the sticky viewport layer.
 */

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MonogramScene } from '@/lib/site/MonogramScene';
import HeroLines from '../HeroLines';

gsap.registerPlugin(ScrollTrigger);

const CONTACT = 'mailto:fahadrahman9819@gmail.com?subject=Project%20enquiry';

const CYCLE = ['miss.', 'sleep.', 'stall.', 'blink.'];

function Chars({ text, serif = false, from = 0 }: { text: string; serif?: boolean; from?: number }) {
  return (
    <>
      {text.split('').map((ch, i) =>
        ch === ' ' ? (
          <span key={i} className="chSpace">
            &nbsp;
          </span>
        ) : (
          <span
            key={i}
            className={serif ? 'ch chSerif' : 'ch'}
            style={{ ['--i' as string]: from + i }}
          >
            {ch}
          </span>
        )
      )}
    </>
  );
}

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trackRef = useRef<HTMLElement>(null);   // 400vh outer — ScrollTrigger anchor
  const stickyRef = useRef<HTMLDivElement>(null); // sticky viewport frame
  const [word, setWord] = useState(0);
  const [cycling, setCycling] = useState(false);

  useEffect(() => {
    const onIntro = () => setTimeout(() => setCycling(true), 2200);
    window.addEventListener('sfx:intro', onIntro);
    return () => window.removeEventListener('sfx:intro', onIntro);
  }, []);

  useEffect(() => {
    if (!cycling) return;
    const id = setInterval(() => setWord((w) => (w + 1) % CYCLE.length), 2600);
    return () => clearInterval(id);
  }, [cycling]);

  /* ---- WebGL scene + GSAP frame scrubber ---- */
  useEffect(() => {
    const canvas = canvasRef.current;
    const track = trackRef.current;
    const sticky = stickyRef.current;
    if (!canvas || !track || !sticky) return;

    const scene = new MonogramScene(canvas, { variant: 'chrome', scale: 0.74 });

    // Intersection observer: pause render when section is off-screen.
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? scene.start() : scene.stop()),
      { threshold: 0.01 }
    );
    io.observe(track);

    // Intro settle on preloader clear.
    const onIntro = () => {
      scene.intro();
      sticky.classList.add('in');
    };
    window.addEventListener('sfx:intro', onIntro);

    // GSAP frame scrubber — ties monogram rotation to scroll progress
    // across the full 400 vh track (scrub: 0.5 = 500 ms smoothing).
    const progressFill = sticky.querySelector<HTMLElement>('.heroProgressFill');
    const st = ScrollTrigger.create({
      trigger: track,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5,
      onUpdate(self) {
        scene.setScrollOverride(self.progress);
        if (progressFill) progressFill.style.width = `${self.progress * 100}%`;
      },
      onLeaveBack() {
        scene.setScrollOverride(null);
        if (progressFill) progressFill.style.width = '0%';
      },
    });

    return () => {
      window.removeEventListener('sfx:intro', onIntro);
      io.disconnect();
      st.kill();
      scene.dispose();
    };
  }, []);

  return (
    /* 400 vh outer track — ScrollTrigger pins against this */
    <section ref={trackRef} className="heroTrack" data-theme-section="dark" id="top">

      {/* Layer 0 — sticky canvas + all overlaid UI */}
      <div ref={stickyRef} className="heroSticky">
        <div className="heroCanvasWrap" aria-hidden>
          <canvas ref={canvasRef} className="heroCanvas" />
        </div>
        <HeroLines />

        <div className="heroInner">
          <h1 className="heroTitle">
            <span className="heroLine">
              <Chars text="Built to" />
            </span>
            <span className="heroLine">
              <Chars text="never" from={8} />
              <span className="chSpace">&nbsp;</span>
              {cycling ? (
                <span key={word} className="heroCycle chSerif">
                  {CYCLE[word]}
                </span>
              ) : (
                <Chars text="miss." serif from={13} />
              )}
            </span>
          </h1>

          <a href={CONTACT} className="monoCta heroCta" data-hover>
            START A PROJECT <span className="monoCtaArrow">→</span>
          </a>
        </div>

        <aside className="heroFacts" aria-label="Studio facts">
          <div className="heroFactsCell">
            <svg viewBox="0 0 24 24" className="heroGlobe" aria-hidden>
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" />
              <ellipse cx="12" cy="12" rx="4.5" ry="10" fill="none" stroke="currentColor" />
              <path d="M2 12h20M3.5 6.5h17M3.5 17.5h17" fill="none" stroke="currentColor" />
            </svg>
            <span>EST. 2024</span>
          </div>
          <div className="heroFactsCell heroFactsCopy">
            AI SYSTEMS SHAPING
            <br />
            HOW BUSINESS RESPONDS.
          </div>
        </aside>

        <p className="heroBlurb">
          Lead engines, AI products and intelligent websites built for clarity,
          speed and scale.
        </p>

        <div className="heroHints" aria-hidden>
          <span>
            GO ON <em>⚡</em> TOUCH THE LINES.
          </span>
          <span>
            HOLD <em>✺</em> TO BLAST.
          </span>
        </div>

        <div className="heroScroll" aria-hidden>
          <span>↓</span>
        </div>

        {/* Scroll progress bar — fades in after intro */}
        <div className="heroProgressBar" aria-hidden>
          <div className="heroProgressFill" />
        </div>
      </div>
    </section>
  );
}
