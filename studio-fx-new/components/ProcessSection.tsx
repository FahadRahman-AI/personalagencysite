'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { num: '01', title: 'FREE AUDIT CALL', body: 'We map every leak in your operations. No fluff, just specifics.' },
  { num: '02', title: 'SYSTEM DESIGN',   body: 'We design the exact automations and systems your business needs.' },
  { num: '03', title: 'BUILD & DEPLOY',  body: 'We build everything. You don\'t touch a line of code.' },
  { num: '04', title: 'YOU SCALE',       body: 'Your systems run 24/7. You focus on growing the business.' },
];

export default function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const items = section.querySelectorAll<HTMLElement>('.process-step');

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=400%',
        pin: true,
        scrub: 1.5,
      });

      items.forEach((item, i) => {
        gsap.fromTo(item,
          { opacity: 0, x: 60 },
          {
            opacity: 1, x: 0, duration: 1,
            scrollTrigger: {
              trigger: section,
              start: `top+=${i * 100}% top`,
              end:   `top+=${(i + 1) * 100}% top`,
              scrub: 1.5,
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{ position: 'relative', width: '100%', height: '100vh', background: '#080808', overflow: 'hidden' }}
    >
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center',
        padding: '0 80px', gap: 120,
      }}>
        {/* Left sticky label */}
        <div style={{ flexShrink: 0 }}>
          <p style={{
            fontFamily: 'var(--font-space-var), sans-serif',
            fontSize: 11, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.3)',
            textTransform: 'uppercase', marginBottom: 16,
          }}>How it works</p>
          <h2 style={{
            fontFamily: 'var(--font-anton-var), sans-serif',
            fontSize: 'clamp(40px, 5vw, 72px)',
            lineHeight: 0.92, color: '#fff',
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            transform: 'rotate(180deg)',
          }}>
            HOW IT WORKS
          </h2>
        </div>

        {/* Steps */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 48 }}>
          {steps.map((s, i) => (
            <div key={i} className="process-step" style={{ opacity: 0 }}>
              <span style={{
                fontFamily: 'var(--font-space-var), sans-serif',
                fontSize: 11, letterSpacing: '0.3em', color: '#E8350A',
                textTransform: 'uppercase', display: 'block', marginBottom: 12,
              }}>{s.num}</span>
              <h3 style={{
                fontFamily: 'var(--font-anton-var), sans-serif',
                fontSize: 'clamp(28px, 3vw, 44px)',
                letterSpacing: '-0.01em', color: '#fff',
                marginBottom: 12,
              }}>{s.title}</h3>
              <p style={{
                fontFamily: 'var(--font-space-var), sans-serif',
                fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.45)',
                lineHeight: 1.7, maxWidth: 380,
              }}>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
