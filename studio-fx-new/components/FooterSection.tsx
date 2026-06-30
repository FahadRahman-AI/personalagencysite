'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const links = [
  { label: 'Book a free call',   href: '#cta' },
  { label: 'See how it works',   href: '#problem' },
  { label: 'hello@studiofx.co', href: 'mailto:hello@studiofx.co' },
];

export default function FooterSection() {
  const footerRef = useRef<HTMLElement>(null);
  const bigRef    = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;
    const ctx = gsap.context(() => {
      gsap.from(footer.querySelectorAll('.footer-col'), {
        opacity: 0, y: 24, duration: 0.8, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: footer, start: 'top 85%' },
      });
      if (bigRef.current) {
        gsap.from(bigRef.current, {
          opacity: 0, scale: 0.96, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: footer, start: 'top 90%' },
        });
      }
    }, footer);
    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      style={{
        background: '#080808',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* Large STUDIO FX wordmark */}
      <div style={{
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        padding: '80px 64px 72px',
        overflow: 'hidden',
      }}>
        <p
          ref={bigRef}
          style={{
            fontFamily: 'var(--font-anton-var), sans-serif',
            fontSize: 'clamp(56px, 10vw, 160px)',
            lineHeight: 0.88,
            letterSpacing: '-0.01em',
            color: 'rgba(255,255,255,0.04)',
            userSelect: 'none',
          }}
        >
          STUDIO FX
        </p>
      </div>

      {/* 3-column grid */}
      <div
        className="footer-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '48px',
          maxWidth: 1400,
          margin: '0 auto',
          padding: '64px 64px',
        }}
      >
        {/* Col 1 — identity */}
        <div className="footer-col">
          <p style={{
            fontFamily: 'var(--font-space-var), sans-serif',
            fontSize: 12, fontWeight: 600,
            letterSpacing: '0.1em', color: '#fff',
            textTransform: 'uppercase', marginBottom: 20,
          }}>
            Studio FX
          </p>
          <p style={{
            fontFamily: 'var(--font-space-var), sans-serif',
            fontSize: 13, fontWeight: 300,
            color: 'rgba(255,255,255,0.3)', lineHeight: 1.7,
            maxWidth: 280,
          }}>
            Operations intelligence for businesses that refuse to be left behind.
          </p>
        </div>

        {/* Col 2 — links */}
        <div className="footer-col">
          <p style={{
            fontFamily: 'var(--font-space-var), sans-serif',
            fontSize: 10, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.2)',
            textTransform: 'uppercase', marginBottom: 20,
          }}>
            Navigation
          </p>
          <ul style={{ listStyle: 'none' }}>
            {links.map(l => (
              <li key={l.label} style={{ marginBottom: 12 }}>
                <a
                  href={l.href}
                  data-cursor
                  style={{
                    fontFamily: 'var(--font-space-var), sans-serif',
                    fontSize: 13, fontWeight: 300,
                    color: 'rgba(255,255,255,0.35)',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)'; }}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 — location + copyright */}
        <div className="footer-col">
          <p style={{
            fontFamily: 'var(--font-space-var), sans-serif',
            fontSize: 10, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.2)',
            textTransform: 'uppercase', marginBottom: 20,
          }}>
            Contact
          </p>
          <p style={{
            fontFamily: 'var(--font-space-var), sans-serif',
            fontSize: 13, fontWeight: 300,
            color: 'rgba(255,255,255,0.3)', lineHeight: 1.8,
          }}>
            Birmingham, UK<br />
            Worldwide<br />
            <a
              href="mailto:hello@studiofx.co"
              data-cursor
              style={{ color: 'rgba(255,255,255,0.35)', transition: 'color 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)'; }}
            >
              hello@studiofx.co
            </a>
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.04)',
        padding: '24px 64px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 12,
      }}>
        <span style={{
          fontFamily: 'var(--font-space-var), sans-serif',
          fontSize: 10, color: 'rgba(255,255,255,0.15)', letterSpacing: '0.08em',
        }}>
          © 2026 Studio FX. All rights reserved.
        </span>
        <span style={{
          fontFamily: 'var(--font-space-var), sans-serif',
          fontSize: 10, color: 'rgba(255,255,255,0.1)', letterSpacing: '0.06em',
        }}>
          Operations Intelligence
        </span>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr !important; padding: 48px 32px !important; }
        }
      `}</style>
    </footer>
  );
}
