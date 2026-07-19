'use client';

/**
 * Nav — fixed chrome: wordmark, sound toggle, LET'S TALK pill and a
 * MENU pill opening the full-screen overlay. Adapts to the active
 * theme via CSS vars.
 */

import { useEffect, useState } from 'react';
import { setSoundEnabled } from '@/lib/site/audio';

const CONTACT = '/contact';

const LINKS = [
  { n: '01', label: 'Work', href: '/#work' },
  { n: '02', label: 'Services', href: '/#services' },
  { n: '03', label: 'Client stories', href: '/#stories' },
  { n: '04', label: 'Contact', href: CONTACT },
];

export default function Nav() {
  const [sound, setSound] = useState(true);
  const [open, setOpen] = useState(false);

  const toggleSound = () => {
    const next = !sound;
    setSound(next);
    setSoundEnabled(next);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <header className="nav">
        <a href="/" className="navBrand" data-hover aria-label="Studio FX home">
          <svg viewBox="0 0 26 26" className="navMark" aria-hidden>
            <path d="M3 23 L13 3 L16.5 10 L10 23 Z" fill="currentColor" />
            <path d="M14 23 L20.5 10 L23 15 L19 23 Z" fill="currentColor" opacity="0.72" />
          </svg>
          STUDIO&nbsp;FX<sup>®</sup>
        </a>
        <div className="navRight">
          <button
            className={sound ? 'navSound navSoundOn' : 'navSound'}
            onClick={toggleSound}
            data-hover
            aria-label={sound ? 'Mute sound' : 'Enable sound'}
          >
            <span />
            <span />
            <span />
            <span />
          </button>
          <a href={CONTACT} className="navTalk" data-hover>
            LET&rsquo;S TALK
          </a>
          <button
            className="navMenu"
            onClick={() => setOpen(true)}
            data-hover
            aria-label="Open menu"
            aria-expanded={open}
          >
            MENU
            <span className="navMenuIcon" aria-hidden>
              <span />
              <span />
            </span>
          </button>
        </div>
      </header>

      <div className={open ? 'menuOverlay menuOverlayOpen' : 'menuOverlay'} aria-hidden={!open}>
        <button className="menuClose" onClick={() => setOpen(false)} data-hover aria-label="Close menu">
          CLOSE ✕
        </button>
        <nav className="menuLinks" aria-label="Site">
          {LINKS.map((l) => (
            <a key={l.n} href={l.href} className="menuLink" data-hover onClick={() => setOpen(false)}>
              <span className="menuLinkNum">{l.n}</span>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="menuFoot">
          <span>hello@studiofx.co</span>
          <span>BIRMINGHAM, UK</span>
        </div>
      </div>
    </>
  );
}
