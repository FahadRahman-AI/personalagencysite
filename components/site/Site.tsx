'use client';

/**
 * Site — client root. Owns:
 *  - Lenis smooth scroll wired into GSAP's ticker
 *  - the light/dark theme-wipe controller (CSS vars on <html>)
 *  - the preloader counter and the `sfx:intro` launch event
 */

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import Nav from './Nav';
import Cursor from './Cursor';
import Hero from './sections/Hero';
import About from './sections/About';
import Marquee from './sections/Marquee';
import Showreel from './sections/Showreel';
import KeyFacts from './sections/KeyFacts';
import Work from './sections/Work';
import Engine from './sections/Engine';
import Stories from './sections/Stories';
import Ribbon from './sections/Ribbon';
import Footer from './sections/Footer';

gsap.registerPlugin(ScrollTrigger);

export default function Site() {
  const [count, setCount] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  /* ---- Smooth scroll + theme wipes ---------------------------- */
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let lenis: Lenis | null = null;
    let tickerFn: ((t: number) => void) | null = null;

    if (!reduced) {
      lenis = new Lenis({ lerp: 0.105, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      tickerFn = (time: number) => lenis!.raf(time * 1000);
      gsap.ticker.add(tickerFn);
      gsap.ticker.lagSmoothing(0);
    }

    // Theme controller: each [data-theme-section] flips the CSS vars
    // as it crosses mid-viewport — the background crossfade IS the wipe.
    const triggers: ScrollTrigger[] = [];
    document.querySelectorAll<HTMLElement>('[data-theme-section]').forEach((el) => {
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: 'top 52%',
          end: 'bottom 52%',
          onToggle: (self) => {
            if (self.isActive) {
              document.documentElement.dataset.theme = el.dataset.themeSection;
            }
          },
        })
      );
    });

    return () => {
      triggers.forEach((t) => t.kill());
      if (tickerFn) gsap.ticker.remove(tickerFn);
      lenis?.destroy();
    };
  }, []);

  /* ---- Preloader ----------------------------------------------- */
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);

    let raf = 0;
    let done = false;
    const t0 = performance.now();
    const MIN_MS = 1400;

    let fontsReady = false;
    void document.fonts.ready.then(() => {
      fontsReady = true;
    });

    const step = (now: number) => {
      const elapsed = now - t0;
      // Ease toward 99 on the clock; 100 only when fonts are in.
      const target = Math.min(99, (elapsed / MIN_MS) * 100);
      if (fontsReady && elapsed >= MIN_MS) {
        done = true;
        setCount(100);
        setTimeout(() => {
          setLoaded(true);
          document.body.style.overflow = '';
          window.dispatchEvent(new Event('sfx:intro'));
          ScrollTrigger.refresh();
        }, 350);
        return;
      }
      setCount(Math.floor(target));
      if (!done) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div ref={rootRef} className={loaded ? 'site siteLoaded' : 'site'}>
      <Cursor />

      {/* Preloader */}
      <div className={loaded ? 'loader loaderDone' : 'loader'} aria-hidden={loaded}>
        <div className="loaderCount">
          {String(count).padStart(3, '0')}
          <span className="loaderPct">%</span>
        </div>
        <span className="loaderTag">STUDIO FX® — AI INFRASTRUCTURE</span>
        <span className="loaderPanel loaderPanelA" />
        <span className="loaderPanel loaderPanelB" />
      </div>

      <Nav />

      <main>
        <Hero />
        <About />
        <Marquee />
        <Showreel />
        <KeyFacts />
        <Work />
        <Engine />
        <Stories />
        <Ribbon />
        <Footer />
      </main>
    </div>
  );
}
