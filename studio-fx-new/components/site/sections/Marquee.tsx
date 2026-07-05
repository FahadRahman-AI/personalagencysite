'use client';

/**
 * Marquee — giant word train riding across the dark act, scrub-nudged
 * by scroll like Trionn's INSPIRE · INNOVATE · IMPACT belt.
 */

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const WORDS = ['CAPTURE', 'CONVERT', 'COMPOUND'];

export default function Marquee() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;

    const ctx = gsap.context(() => {
      // Constant drift + scroll scrub layered on top.
      gsap.to(track, { xPercent: -50, ease: 'none', duration: 26, repeat: -1 });
      gsap.fromTo(
        root.querySelector('.marqueeWindow'),
        { x: 0 },
        {
          x: -140,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true },
        }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  const belt = [...WORDS, ...WORDS];

  return (
    <section ref={rootRef} className="marquee" data-theme-section="dark">
      <p className="marqueeKicker">
        FOCUSED SYSTEMS.
        <br />
        MEASURED EXECUTION.
      </p>

      <div className="marqueeWindow">
        <div ref={trackRef} className="marqueeTrack" aria-label="Capture, convert, compound">
          {belt.map((w, i) => (
            <span key={i} className="marqueeWord">
              {w}
              <span className="marqueePlus" aria-hidden>
                ✚
              </span>
            </span>
          ))}
        </div>
      </div>

      <p className="marqueeTag">
        <span className="marqueeStar">✦</span> FROM ENQUIRY TO OUTCOME.
      </p>
    </section>
  );
}
