'use client';

/**
 * Hero — dark. Chrome FX monogram, pluckable lines, split-char
 * headline with chromatic blur settle, mono CTA, corner data card.
 */

import { useEffect, useRef, useState } from 'react';
import { MonogramScene } from '@/lib/site/MonogramScene';
import HeroLines from '../HeroLines';

const CONTACT = 'mailto:fahadrahman9819@gmail.com?subject=Project%20enquiry';

/** The serif word cycles like Trionn's "Designed to mean …" */
const CYCLE = ['miss.', 'sleep.', 'stall.', 'blink.'];

/** Pre-split headline chars so CSS can stagger + blur them. */
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
  const rootRef = useRef<HTMLElement>(null);
  const [word, setWord] = useState(0);
  const [cycling, setCycling] = useState(false);

  // Start cycling once the intro has landed the headline.
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

  useEffect(() => {
    const canvas = canvasRef.current;
    const root = rootRef.current;
    if (!canvas || !root) return;

    const scene = new MonogramScene(canvas, { variant: 'chrome', scale: 0.74 });

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? scene.start() : scene.stop()),
      { threshold: 0.02 }
    );
    io.observe(root);

    const onIntro = () => {
      scene.intro();
      root.classList.add('in');
    };
    window.addEventListener('sfx:intro', onIntro);

    return () => {
      window.removeEventListener('sfx:intro', onIntro);
      io.disconnect();
      scene.dispose();
    };
  }, []);

  return (
    <section ref={rootRef} className="hero" data-theme-section="dark" id="top">
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
    </section>
  );
}
