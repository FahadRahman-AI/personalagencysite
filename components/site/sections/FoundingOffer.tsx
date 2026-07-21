'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CONTACT = 'mailto:hello@studiofx.co?subject=Founding%20Build%20Application';

const RECEIVE = [
  '24/7 lead engine — every enquiry captured and answered inside a minute',
  'Workflow automation — quotes, reminders and handoffs running end-to-end',
  'Intelligent website — qualifies, books and follows up around the clock',
  '30 days of monitoring and refinement after launch',
];

const NEED = [
  'A live business with real enquiries coming in',
  'Two hours for a structured discovery session',
  'Candid feedback throughout the build',
];

export default function FoundingOffer() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      /* Document frame draws in */
      gsap.fromTo(
        '.foFrame',
        { opacity: 0, y: 48 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: root, start: 'top 78%', once: true },
        }
      );

      /* Headline words reveal upward through a clip mask */
      gsap.fromTo(
        '.foWord',
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.055,
          scrollTrigger: { trigger: '.foTitle', start: 'top 82%', once: true },
        }
      );

      /* Grid columns appear with slight stagger */
      gsap.fromTo(
        '.foCol',
        { y: 32, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: { trigger: '.foGrid', start: 'top 84%', once: true },
        }
      );

      /* List items stagger in */
      gsap.fromTo(
        '.foItem',
        { x: -12, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.07,
          scrollTrigger: { trigger: '.foGrid', start: 'top 76%', once: true },
        }
      );

      /* Footer line */
      gsap.fromTo(
        '.foFoot',
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: { trigger: '.foFoot', start: 'top 90%', once: true },
        }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  const TITLE_WORDS = ['The', 'first', 'business', 'we', 'build', 'for', 'pays', 'nothing.'];

  return (
    <section ref={rootRef} className="foundingOffer" data-theme-section="light" id="founding">
      <div className="foWrap">
        <div className="foFrame">

          {/* ── Top bar ──────────────────────────────────── */}
          <div className="foTopBar">
            <span className="foEyebrow">FOUNDING OFFER — REF&nbsp;001</span>
            <span className="foStatus">
              <span className="foDot" aria-hidden />
              STATUS: OPEN
            </span>
          </div>

          {/* ── Headline ─────────────────────────────────── */}
          <div className="foTitleWrap">
            <h2 className="foTitle" aria-label="The first business we build for pays nothing.">
              {TITLE_WORDS.map((w, i) => (
                <span key={i} className="foWordMask">
                  <span className="foWord">{w}</span>
                  {i < TITLE_WORDS.length - 1 && <span className="foWordSpace">&nbsp;</span>}
                </span>
              ))}
            </h2>

            <p className="foSub">
              One founding client. A complete, fully operational AI system — built at no cost, in exchange for candid feedback on what we ship.
            </p>
          </div>

          {/* ── Two-column spec grid ─────────────────────── */}
          <div className="foGrid">
            <div className="foCol">
              <p className="foColLabel">WHAT YOU RECEIVE</p>
              <ul className="foList" aria-label="Included in the founding build">
                {RECEIVE.map((item, i) => (
                  <li key={i} className="foItem" data-hover>
                    <span className="foItemBar" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="foCol foColRight">
              <p className="foColLabel">WHAT WE NEED FROM YOU</p>
              <ul className="foList" aria-label="Requirements">
                {NEED.map((item, i) => (
                  <li key={i} className="foItem" data-hover>
                    <span className="foItemBar" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>

              <p className="foConditions">
                No invoice. No equity. No retainer. No catch.
              </p>
            </div>
          </div>

          {/* ── Footer CTA ───────────────────────────────── */}
          <div className="foFoot">
            <a href={CONTACT} className="monoCta foCta" data-hover>
              APPLY FOR THE FOUNDING SPOT <span className="monoCtaArrow">→</span>
            </a>
            <span className="foRef">STUDIO FX® · 2026 · REF-001</span>
          </div>

        </div>
      </div>
    </section>
  );
}
