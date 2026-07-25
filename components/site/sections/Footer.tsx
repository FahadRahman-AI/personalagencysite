'use client';

/**
 * Footer — dark close. Big ask, contact rails, live UK clock, and
 * the striped STUDIO FX wordmark whose letters sing on hover.
 */

import { useEffect, useState } from 'react';
import { tick } from '@/lib/site/audio';

const CONTACT = 'mailto:fahadrahman9819@gmail.com?subject=Collaboration';
const LETTERS = ['S', 'T', 'U', 'D', 'I', 'O', ' ', 'F', 'X'];

export default function Footer() {
  const [time, setTime] = useState('--:--');

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/London',
    });
    const update = () => setTime(fmt.format(new Date()));
    update();
    const id = setInterval(update, 15000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer className="footer" data-theme-section="dark">
      <div className="footerTop">
        <span className="footerMonoLine">LET&rsquo;S BUILD WORK THAT RUNS ITSELF.</span>
        <span className="footerMonoLine">BHX → {time}</span>
      </div>

      <div className="footerAsk">
        <h2 className="footerTitle">
          Ready to build
          <br />
          something bold?
        </h2>
        <a href={CONTACT} className="monoCta" data-hover>
          START A COLLABORATION <span className="monoCtaArrow">→</span>
        </a>
      </div>

      <div className="footerRails">
        <span className="footerCopyright">©STUDIO FX® {new Date().getFullYear()} — BIRMINGHAM, UK</span>
        <div className="footerRail">
          <span className="footerRailLabel">BUSINESS ENQUIRY</span>
          <a href="mailto:fahadrahman9819@gmail.com" data-hover>
            E.&nbsp;&nbsp;fahadrahman9819@gmail.com
          </a>
        </div>
        <div className="footerRail">
          <span className="footerRailLabel">SOCIAL</span>
          <a href="#" data-hover>
            LinkedIn
          </a>
          <a href="https://www.instagram.com/studiofxco?igsh=cG15cXRzaXB6NjR2&utm_source=qr" target="_blank" rel="noopener noreferrer" data-hover>
            Instagram
          </a>
        </div>
      </div>

      <p className="footerSoundHint">
        SOUND ON <span className="footerNote">♪</span> HOVER THE LETTERS.
      </p>

      <div className="stripeWord" aria-label="Studio FX">
        {LETTERS.map((ch, i) => (
          <span
            key={i}
            className="stripeLetter"
            onPointerEnter={() => tick(i / LETTERS.length)}
          >
            {ch}
          </span>
        ))}
      </div>
    </footer>
  );
}
