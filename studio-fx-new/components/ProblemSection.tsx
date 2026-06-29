'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const problems = [
  {
    num: '01',
    headline: 'YOUR INBOX IS YOUR\nBIGGEST LIABILITY.',
    body: 'Every unread message is money walking out the door. Leads go cold in 5 minutes. Your team responds in 5 hours.',
  },
  {
    num: '02',
    headline: 'YOUR TEAM WORKS\nHARD. ON THE WRONG THINGS.',
    body: 'Copy-pasting data. Chasing invoices. Sending the same email twenty times. We\'ve seen it at every company.',
  },
  {
    num: '03',
    headline: 'YOUR SYSTEMS DON\'T\nTALK TO EACH OTHER.',
    body: 'CRM, booking, email, invoicing — each living in its own world. The gaps between them are where revenue disappears.',
  },
];

export default function ProblemSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const panels = section.querySelectorAll<HTMLElement>('.problem-panel');

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=300%',
        pin: true,
        scrub: 1.5,
      });

      panels.forEach((panel, i) => {
        const start = i / panels.length;
        const end   = (i + 1) / panels.length;

        gsap.fromTo(panel,
          { clipPath: 'inset(100% 0 0 0)' },
          {
            clipPath: 'inset(0% 0 0 0)',
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: `top+=${start * 300}% top`,
              end:   `top+=${end * 300}% top`,
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
      id="problem"
      ref={sectionRef}
      style={{ position: 'relative', width: '100%', height: '100vh', background: '#080808', overflow: 'hidden' }}
    >
      {/* label */}
      <div style={{
        position: 'absolute', top: 48, left: 80, zIndex: 10,
        fontFamily: 'var(--font-space-var), sans-serif',
        fontSize: 11, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.3)',
        textTransform: 'uppercase',
      }}>
        The problem
      </div>

      {problems.map((p, i) => (
        <div
          key={i}
          className="problem-panel"
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'flex-start', justifyContent: 'center',
            padding: '0 80px',
            background: i === 0 ? '#0e0e0e' : i === 1 ? '#111' : '#080808',
            clipPath: i === 0 ? 'inset(0% 0 0 0)' : 'inset(100% 0 0 0)',
          }}
        >
          <span style={{
            fontFamily: 'var(--font-space-var), sans-serif',
            fontSize: 11, letterSpacing: '0.3em', color: '#E8350A',
            textTransform: 'uppercase', marginBottom: 32,
          }}>
            {p.num}
          </span>
          <h2 style={{
            fontFamily: 'var(--font-anton-var), sans-serif',
            fontSize: 'clamp(48px, 6vw, 96px)',
            lineHeight: 0.92, letterSpacing: '-0.01em', color: '#fff',
            whiteSpace: 'pre-line', marginBottom: 32,
          }}>
            {p.headline}
          </h2>
          <p style={{
            fontFamily: 'var(--font-space-var), sans-serif',
            fontSize: 16, fontWeight: 300, color: 'rgba(255,255,255,0.45)',
            maxWidth: 480, lineHeight: 1.7,
          }}>
            {p.body}
          </p>
        </div>
      ))}
    </section>
  );
}
