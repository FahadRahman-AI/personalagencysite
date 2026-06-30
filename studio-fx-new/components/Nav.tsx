'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ─── Minimal fixed nav — hides on scroll down, reappears on scroll up.
   This "smart nav" is ubiquitous on premium sites (Locomotive, Webflow, Linear).
   The technique: track lastScroll, compare each frame — show/hide via Y transform. ─── */

export default function Nav() {
  const navRef  = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    let lastY  = 0;
    let hidden = false;

    // Entrance: slide down after preloader (approx 2.5s)
    gsap.fromTo(nav,
      { y: -64, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 2.6 }
    );

    const onScroll = () => {
      const y = window.scrollY;
      if (y < 80) {
        // Always show near top
        if (hidden) { gsap.to(nav, { y: 0, duration: 0.4, ease: 'power2.out' }); hidden = false; }
      } else if (y > lastY + 4 && !hidden) {
        // Scrolling down — hide
        gsap.to(nav, { y: -64, duration: 0.3, ease: 'power2.in' });
        hidden = true;
      } else if (y < lastY - 4 && hidden) {
        // Scrolling up — show
        gsap.to(nav, { y: 0, duration: 0.4, ease: 'power2.out' });
        hidden = false;
      }
      lastY = y;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 900,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 64px',
        height: 64,
        background: 'rgba(8,8,8,0)',
        backdropFilter: 'blur(0px)',
        transform: 'translateY(-64px)',
        opacity: 0,
        willChange: 'transform, opacity',
      }}
    >
      {/* Wordmark */}
      <a
        href="#"
        style={{
          fontFamily: 'var(--font-space-var), sans-serif',
          fontSize: 12, fontWeight: 600,
          letterSpacing: '0.18em',
          color: '#fff',
          textTransform: 'uppercase',
        }}
      >
        Studio FX
      </a>

      {/* Divider line */}
      <div style={{
        position: 'absolute', bottom: 0, left: 64, right: 64,
        height: 1, background: 'rgba(255,255,255,0.04)',
      }} />

      {/* CTA */}
      <a
        href="#cta"
        data-cursor
        style={{
          fontFamily: 'var(--font-space-var), sans-serif',
          fontSize: 11, fontWeight: 500,
          letterSpacing: '0.12em',
          color: 'rgba(255,255,255,0.5)',
          textTransform: 'uppercase',
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'; }}
      >
        Free call →
      </a>
    </nav>
  );
}
