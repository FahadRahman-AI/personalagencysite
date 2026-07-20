'use client';

/**
 * Key facts — first light beat. Tilted panels drifting on parallax,
 * numerals counting up when they enter.
 * TODO(studio-fx): swap placeholder metrics for real client numbers.
 */

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Fact {
  variant: 'dark' | 'paper' | 'accent';
  label: string;
  tilt: number;
  from: number;
  to: number;
  format: (v: number) => string;
  caption: string;
}

const FACTS: Fact[] = [
  {
    variant: 'dark',
    label: 'ENQUIRIES ANSWERED',
    tilt: -5,
    from: 0,
    to: 100,
    format: (v) => `${Math.round(v)}%`,
    caption: 'Nights, weekends, bank holidays. Nothing goes quiet.',
  },
  {
    variant: 'paper',
    label: 'MEDIAN RESPONSE',
    tilt: 3.5,
    from: 3600,
    to: 60,
    format: (v) => `${Math.round(v)}s`,
    caption: 'From first message to booked call — an hour becomes a minute.',
  },
  {
    variant: 'accent',
    label: 'HOURS RETURNED WEEKLY',
    tilt: -2.5,
    from: 0,
    to: 12,
    format: (v) => `${Math.round(v)}+`,
    caption: 'Admin runs itself. Evenings come back.',
  },
];

export default function KeyFacts() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.factCard');

      cards.forEach((card, i) => {
        // Parallax drift, each card on its own rate.
        gsap.fromTo(
          card,
          { y: 90 + i * 46 },
          {
            y: -40 - i * 22,
            ease: 'none',
            scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true },
          }
        );

        // Count-up on first entry.
        const value = card.querySelector<HTMLElement>('.factValue');
        const fact = FACTS[i];
        if (value) {
          const state = { v: fact.from };
          gsap.to(state, {
            v: fact.to,
            duration: 1.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 82%', once: true },
            onUpdate: () => {
              value.textContent = fact.format(state.v);
            },
          });
        }
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="keyFacts" data-theme-section="light">
      <header className="sectionHead">
        <h2 className="sectionTitle">What to expect</h2>
        <p className="sectionSub">
          Outcomes the system is designed
          <br />
          to deliver from day one.
        </p>
      </header>

      <div className="factRow">
        {FACTS.map((fact) => (
          <article
            key={fact.label}
            className={`factCard factCard-${fact.variant}`}
            style={{ ['--tilt' as string]: `${fact.tilt}deg` }}
          >
            <span className="factLabel">{fact.label}</span>
            <span className="factValue">{fact.format(fact.from)}</span>
            <p className="factCaption">{fact.caption}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
