'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitWords } from '@/lib/splitText';

gsap.registerPlugin(ScrollTrigger);

const problems = [
  {
    num: '01',
    headline: 'YOUR INBOX IS YOUR BIGGEST LIABILITY.',
    body: 'Every unread message is money walking out the door. Leads go cold in 5 minutes. Your team responds in 5 hours.',
  },
  {
    num: '02',
    headline: 'YOUR TEAM WORKS HARD. ON THE WRONG THINGS.',
    body: 'Copy-pasting data. Chasing invoices. Sending the same email twenty times. Every company has this. Most pretend they don\'t.',
  },
  {
    num: '03',
    headline: 'YOUR SYSTEMS DON\'T TALK TO EACH OTHER.',
    body: 'CRM, booking, email, invoicing — each living in its own world. The gaps between them are where revenue disappears.',
  },
];

/* ─── Technique: layered panels, each slides in from below via clip-path.
   Panel 0 is always visible. Panel 1 overlays at 33% scroll, panel 2 at 66%.
   Each new panel also word-reveals its headline as it enters. ─── */

export default function ProblemSection() {
  const sectionRef  = useRef<HTMLElement>(null);
  const panelRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const headingRefs = useRef<(HTMLHeadingElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      /* ── Pin the section for 300vh of scroll ──── */
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end:   '+=300%',
        pin:   true,
        scrub: 1.5,
        anticipatePin: 1,
      });

      /* ── Panel 1 slides up at 33–66% of total scroll */
      const panel1 = panelRefs.current[1];
      if (panel1) {
        gsap.fromTo(panel1,
          { clipPath: 'inset(100% 0 0% 0)' },
          {
            clipPath: 'inset(0% 0 0% 0)',
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top+=100% top',
              end:   'top+=200% top',
              scrub: 1.5,
            },
          }
        );
      }

      /* ── Panel 2 slides up at 66–100% */
      const panel2 = panelRefs.current[2];
      if (panel2) {
        gsap.fromTo(panel2,
          { clipPath: 'inset(100% 0 0% 0)' },
          {
            clipPath: 'inset(0% 0 0% 0)',
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top+=200% top',
              end:   'top+=300% top',
              scrub: 1.5,
            },
          }
        );
      }

      /* ── Word-split reveals on each headline ──── */
      headingRefs.current.forEach((el, i) => {
        if (!el) return;
        const words = splitWords(el);
        gsap.set(words, { yPercent: 110 });

        const startPct = i === 0 ? 'top 70%' : `top+=${i * 100}% top`;
        gsap.to(words, {
          yPercent: 0,
          duration: 0.8,
          stagger: 0.05,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: i === 0 ? section : section,
            start: startPct,
            // Don't scrub the word reveal — fire it once
          },
        });
      });

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="problem"
      ref={sectionRef}
      style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}
    >
      {/* Section label — always on top */}
      <div style={{
        position: 'absolute', top: 48, left: 64, zIndex: 20,
        fontFamily: 'var(--font-space-var), sans-serif',
        fontSize: 10, letterSpacing: '0.35em', color: 'rgba(255,255,255,0.25)',
        textTransform: 'uppercase',
      }}>
        The problem
      </div>

      {problems.map((p, i) => (
        <div
          key={i}
          ref={el => { panelRefs.current[i] = el; }}
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'flex-start', justifyContent: 'center',
            padding: '80px 80px 80px 64px',
            background: i === 0 ? '#0c0c0c' : i === 1 ? '#0f0f0f' : '#080808',
            clipPath: i === 0 ? 'inset(0% 0 0% 0)' : 'inset(100% 0 0% 0)',
            zIndex: i,
          }}
        >
          {/* Red counter */}
          <span style={{
            fontFamily: 'var(--font-space-var), sans-serif',
            fontSize: 10, letterSpacing: '0.35em', color: '#E8350A',
            textTransform: 'uppercase', marginBottom: 40, display: 'block',
          }}>
            {p.num} / 03
          </span>

          {/* Headline with word-split overflow reveal */}
          <h2
            ref={el => { headingRefs.current[i] = el; }}
            style={{
              fontFamily: 'var(--font-anton-var), sans-serif',
              fontSize: 'clamp(44px, 5.5vw, 88px)',
              lineHeight: 0.95, letterSpacing: '-0.01em', color: '#fff',
              maxWidth: 900, marginBottom: 40,
            }}
          >
            {p.headline}
          </h2>

          {/* Body copy */}
          <p style={{
            fontFamily: 'var(--font-space-var), sans-serif',
            fontSize: 16, fontWeight: 300, color: 'rgba(255,255,255,0.4)',
            maxWidth: 520, lineHeight: 1.75,
          }}>
            {p.body}
          </p>

          {/* Red accent line */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0,
            width: `${(i + 1) / 3 * 100}%`, height: 1,
            background: '#E8350A', opacity: 0.3,
            transition: 'width 0.5s',
          }} />
        </div>
      ))}
    </section>
  );
}
