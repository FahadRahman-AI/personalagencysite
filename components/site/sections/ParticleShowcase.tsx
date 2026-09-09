'use client';

/**
 * ParticleShowcase — two-panel feature showcase on a 300 vh pinned track.
 *
 * The FutureHeroShader particle ring fills the sticky background.
 * Two content panels scrub into view as the user scrolls through the track:
 *   001  Never Miss a Call  — lead engine / AI response
 *   002  Quotes on Autopilot — workflow automation
 *
 * Panel reveal is driven by GSAP ScrollTrigger on the individual panels,
 * while the particle ring's scroll progress is fed via psScrollProgressRef.
 */

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FutureHeroShader, { scrollProgressRef as psScrollProgressRef } from '../FutureHeroShader';

gsap.registerPlugin(ScrollTrigger);

const PANELS = [
  {
    index: '001',
    title: 'Never Miss\na Call.',
    sub: 'Every enquiry captured and answered inside 60 seconds — day or night, weekend or holiday.',
    bullets: [
      'AI assistant replies instantly in your voice',
      'Qualifies the lead before you see it',
      'Books directly into your calendar',
      'Escalates urgent jobs to your phone',
    ],
    cta: 'SEE HOW IT WORKS',
    href: 'mailto:fahadrahman9819@gmail.com?subject=Lead%20Engine%20Enquiry',
    tag: 'LEAD ENGINE',
  },
  {
    index: '002',
    title: 'Quotes on\nAutopilot.',
    sub: 'Scope confirmed, quote drafted, sent and chased — the entire conversion loop runs without you.',
    bullets: [
      'Pulls job details from the enquiry automatically',
      'Generates accurate quotes from your rate card',
      'Sends, follows up and marks won or lost',
      'Feeds every result back into the system',
    ],
    cta: 'BUILD THIS SYSTEM',
    href: 'mailto:fahadrahman9819@gmail.com?subject=Workflow%20Automation%20Enquiry',
    tag: 'WORKFLOW AUTOMATION',
  },
];

export default function ParticleShowcase() {
  const trackRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const sticky = stickyRef.current;
    if (!track || !sticky) return;

    // Feed scroll progress into the particle shader
    const st = ScrollTrigger.create({
      trigger: track,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      onUpdate(self) {
        psScrollProgressRef.current = self.progress;
      },
      onLeaveBack() {
        psScrollProgressRef.current = 0;
      },
    });

    // Panel reveal — each card scrubs up into view
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.psPanel').forEach((panel, i) => {
        // Number + tag line
        gsap.fromTo(
          panel.querySelector('.psMeta'),
          { opacity: 0, y: 24 },
          {
            opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: panel, start: 'top 72%', once: true },
          }
        );
        // Title
        gsap.fromTo(
          panel.querySelectorAll('.psTitleLine'),
          { yPercent: 110 },
          {
            yPercent: 0, duration: 1.1, ease: 'power3.out', stagger: 0.07,
            scrollTrigger: { trigger: panel, start: 'top 68%', once: true },
          }
        );
        // Bullets stagger
        gsap.fromTo(
          panel.querySelectorAll('.psBullet'),
          { x: -16, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.08,
            scrollTrigger: { trigger: panel, start: 'top 62%', once: true },
          }
        );
        // Card itself
        gsap.fromTo(
          panel,
          { opacity: 0, y: 48 },
          {
            opacity: 1, y: 0, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: panel, start: 'top 80%', once: true },
          }
        );
      });

      // Divider line draws across
      gsap.fromTo(
        '.psDivider',
        { scaleX: 0 },
        {
          scaleX: 1, duration: 1.4, ease: 'power3.inOut',
          scrollTrigger: { trigger: '.psGrid', start: 'top 70%', once: true },
        }
      );
    }, sticky);

    return () => {
      ctx.revert();
      st.kill();
    };
  }, []);

  return (
    <section
      ref={trackRef}
      className="psTrack"
      data-theme-section="dark"
      id="features"
    >
      <div ref={stickyRef} className="psSticky">

        {/* Particle ring background */}
        <div className="psCanvas" aria-hidden>
          <FutureHeroShader />
        </div>

        {/* Dark vignette so type is readable over the glow */}
        <div className="psVignette" aria-hidden />

        {/* Content */}
        <div className="psInner">

          {/* Section label */}
          <div className="psHeader">
            <span className="psKicker">CORE SYSTEMS</span>
            <span className="psSub">HOW THE ENGINE RUNS</span>
          </div>

          {/* Two feature panels */}
          <div className="psGrid">
            <div className="psDivider" aria-hidden />

            {PANELS.map((p) => (
              <article key={p.index} className="psPanel">
                <div className="psMeta">
                  <span className="psIndex">{p.index}</span>
                  <span className="psTag">{p.tag}</span>
                </div>

                <h2 className="psTitle" aria-label={p.title.replace('\n', ' ')}>
                  {p.title.split('\n').map((line, i) => (
                    <span key={i} className="psTitleMask">
                      <span className="psTitleLine">{line}</span>
                    </span>
                  ))}
                </h2>

                <p className="psSub2">{p.sub}</p>

                <ul className="psBullets" aria-label="Features">
                  {p.bullets.map((b, i) => (
                    <li key={i} className="psBullet">
                      <span className="psBulletDot" aria-hidden />
                      {b}
                    </li>
                  ))}
                </ul>

                <a href={p.href} className="monoCta psCta" data-hover>
                  {p.cta} <span className="monoCtaArrow">→</span>
                </a>
              </article>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
