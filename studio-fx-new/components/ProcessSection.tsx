'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitChars } from '@/lib/splitText';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    num:   '01',
    title: 'FREE AUDIT CALL',
    body:  'We map every leak in your operations. Pricing, response time, follow-up sequences, internal handoffs. No fluff. Just specifics.',
    tag:   '30 minutes',
  },
  {
    num:   '02',
    title: 'SYSTEM DESIGN',
    body:  'We design the exact automations your business needs. You see a blueprint before a single line of code is written.',
    tag:   '48 hours',
  },
  {
    num:   '03',
    title: 'BUILD & DEPLOY',
    body:  'We build, test, and deploy everything. You don\'t touch a line of code. You just log in and it\'s already working.',
    tag:   '1–2 weeks',
  },
  {
    num:   '04',
    title: 'YOU SCALE',
    body:  'Your systems run around the clock. Every lead followed up. Every invoice chased. You focus on the work only you can do.',
    tag:   'Ongoing',
  },
];

/* ─── Technique: horizontal scroll within a pinned vertical section.
   The inner track translates X from 0 to -(totalWidth - viewport) as
   scroll progresses. Each card also has its own entrance animation.
   This is the technique used by Locomotive Scroll and Webflow's agency site. ─── */

export default function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef   = useRef<HTMLDivElement>(null);
  const titleRef   = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track   = trackRef.current;
    if (!section || !track) return;

    const chars = titleRef.current ? splitChars(titleRef.current) : [];
    gsap.set(chars, { yPercent: 110 });

    const ctx = gsap.context(() => {

      /* ── Char reveal on scroll-into-view ──────── */
      gsap.to(chars, {
        yPercent: 0, duration: 1, stagger: 0.03, ease: 'power4.out',
        scrollTrigger: { trigger: section, start: 'top 80%' },
      });

      /* ── Pin section for 400vh ───────────────── */
      ScrollTrigger.create({
        trigger: section,
        start:   'top top',
        end:     '+=400%',
        pin:     true,
        scrub:   1.5,
        anticipatePin: 1,
        onUpdate(self) {
          // Horizontal translate: track moves left as scroll advances
          const maxTranslate = track.scrollWidth - window.innerWidth + 160;
          gsap.set(track, { x: -self.progress * maxTranslate });
        },
      });

      /* ── Card entrance: fade in at start ────────── */
      const cards = track.querySelectorAll<HTMLElement>('.process-card');
      gsap.set(cards, { opacity: 0.2, scale: 0.95 });
      ScrollTrigger.create({
        trigger: section,
        start: 'top+=50% top',
        end:   'top+=100% top',
        scrub: 1.5,
        onUpdate(self) {
          cards.forEach((card, i) => {
            const delay = i * 0.15;
            const p = Math.max(0, Math.min(1, (self.progress - delay) / (1 - delay)));
            (card as HTMLElement).style.opacity = String(0.2 + p * 0.8);
            (card as HTMLElement).style.transform = `scale(${0.95 + p * 0.05})`;
          });
        },
      });

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative', width: '100%', height: '100vh',
        background: '#080808', overflow: 'hidden',
      }}
    >
      {/* Top label */}
      <div style={{
        position: 'absolute', top: 48, left: 64, zIndex: 10,
        fontFamily: 'var(--font-space-var), sans-serif',
        fontSize: 10, letterSpacing: '0.35em', color: 'rgba(255,255,255,0.25)',
        textTransform: 'uppercase',
      }}>
        Process
      </div>

      {/* Static section title */}
      <div style={{
        position: 'absolute', top: '50%', left: 64,
        transform: 'translateY(-50%)', zIndex: 5,
        pointerEvents: 'none',
      }}>
        <h2
          ref={titleRef}
          style={{
            fontFamily: 'var(--font-anton-var), sans-serif',
            fontSize: 'clamp(12px, 1.6vw, 22px)',
            letterSpacing: '0.35em',
            color: 'rgba(255,255,255,0.12)',
            textTransform: 'uppercase',
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            transform: 'rotate(180deg)',
          }}
        >
          HOW IT WORKS
        </h2>
      </div>

      {/* Horizontal scrolling track */}
      <div
        ref={trackRef}
        style={{
          position: 'absolute', top: '50%',
          left: 0, transform: 'translateY(-50%)',
          display: 'flex', alignItems: 'center',
          gap: 32, padding: '0 140px 0 160px',
          willChange: 'transform',
        }}
      >
        {steps.map((s, i) => (
          <div
            key={i}
            className="process-card"
            style={{
              flexShrink: 0, width: 380,
              border: '1px solid rgba(255,255,255,0.06)',
              padding: '48px 40px',
              background: 'rgba(255,255,255,0.02)',
              position: 'relative',
              backdropFilter: 'blur(4px)',
            }}
          >
            {/* Step number */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 48 }}>
              <span style={{
                fontFamily: 'var(--font-anton-var), sans-serif',
                fontSize: 64, color: 'rgba(255,255,255,0.04)',
                lineHeight: 1, letterSpacing: '-0.02em',
              }}>{s.num}</span>
              <span style={{
                fontFamily: 'var(--font-space-var), sans-serif',
                fontSize: 10, color: '#E8350A', letterSpacing: '0.2em',
                textTransform: 'uppercase', paddingTop: 8,
              }}>{s.tag}</span>
            </div>

            {/* Title */}
            <h3 style={{
              fontFamily: 'var(--font-anton-var), sans-serif',
              fontSize: 28, letterSpacing: '-0.01em', color: '#fff',
              marginBottom: 20, lineHeight: 1.05,
            }}>{s.title}</h3>

            {/* Body */}
            <p style={{
              fontFamily: 'var(--font-space-var), sans-serif',
              fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.4)',
              lineHeight: 1.75,
            }}>{s.body}</p>

            {/* Bottom red bar — width increases with step */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0,
              width: `${(i + 1) / steps.length * 100}%`, height: 1,
              background: '#E8350A',
            }} />
          </div>
        ))}
      </div>
    </section>
  );
}
