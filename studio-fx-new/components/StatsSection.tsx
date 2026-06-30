'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ─── Stats with count-up numbers and bold typographic layout.
   Numeric stats count up via GSAP {val} object. Non-numeric stats
   (Free, 24/7) get a clip-path reveal instead.
   Layout: full-bleed dark section, numbers enormous, labels small. ─── */

const stats = [
  { raw: 60,     suffix: 's',   prefix: '',    label: 'Avg. response time',   isNum: true },
  { raw: 0,      suffix: '',    prefix: '',    label: 'Leads lost',            isNum: true },
  { raw: null,   suffix: '',    prefix: '',    label: 'System uptime',         display: '24/7', isNum: false },
  { raw: null,   suffix: '',    prefix: '',    label: 'First call',            display: 'FREE', isNum: false },
];

export default function StatsSection() {
  const sectionRef  = useRef<HTMLElement>(null);
  const valueRefs   = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      stats.forEach((stat, i) => {
        const el = valueRefs.current[i];
        if (!el) return;

        if (stat.isNum && stat.raw !== null) {
          /* Count-up animation */
          const obj = { val: 0 };
          gsap.to(obj, {
            val: stat.raw,
            duration: 1.8,
            ease: 'power2.out',
            onUpdate() {
              el.textContent = `${stat.prefix}${Math.round(obj.val)}${stat.suffix}`;
            },
            scrollTrigger: {
              trigger: section,
              start: 'top 70%',
              once: true,
            },
          });
        } else {
          /* Non-numeric: clip-path reveal */
          gsap.fromTo(el,
            { clipPath: 'inset(0 100% 0 0)' },
            {
              clipPath: 'inset(0 0% 0 0)',
              duration: 1.2,
              ease: 'power3.inOut',
              scrollTrigger: {
                trigger: section,
                start: 'top 70%',
                once: true,
              },
            }
          );
        }
      });

      /* Staggered item entrance */
      gsap.from('.stat-item', {
        opacity: 0, y: 40, duration: 0.8, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: section, start: 'top 75%', once: true },
      });

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        background: '#080808',
        borderTop:    '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        padding: '0 0',
      }}
    >
      <div
        className="stats-inner"
        style={{
          maxWidth: 1400,
          margin: '0 auto',
          padding: '96px 64px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 0,
        }}
      >
        {stats.map((s, i) => (
          <div
            key={i}
            className="stat-item"
            style={{
              textAlign: 'center',
              padding: '0 32px 0 32px',
              borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              position: 'relative',
            }}
          >
            {/* Giant value */}
            <p style={{
              fontFamily: 'var(--font-anton-var), sans-serif',
              fontSize: 'clamp(48px, 6vw, 96px)',
              color: '#fff',
              lineHeight: 1,
              marginBottom: 16,
              letterSpacing: '-0.02em',
            }}>
              <span
                ref={el => { valueRefs.current[i] = el; }}
              >
                {s.isNum ? `${s.prefix}${s.raw}${s.suffix}` : s.display}
              </span>
            </p>

            {/* Label */}
            <p style={{
              fontFamily: 'var(--font-space-var), sans-serif',
              fontSize: 10,
              color: 'rgba(255,255,255,0.3)',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
            }}>{s.label}</p>

            {/* Red dot accent on first item */}
            {i === 0 && (
              <div style={{
                width: 4, height: 4, borderRadius: '50%',
                background: '#E8350A',
                margin: '20px auto 0',
              }} />
            )}
          </div>
        ))}
      </div>
      <style>{`
        @media (max-width: 700px) {
          .stats-inner { grid-template-columns: repeat(2, 1fr) !important; gap: 48px 0 !important; padding: 64px 32px !important; }
        }
      `}</style>
    </section>
  );
}
