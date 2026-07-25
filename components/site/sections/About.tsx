'use client';

/**
 * About — dark statement beat between hero and marquee. Words wash
 * in one by one as the section scrubs through the viewport.
 */

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CONTACT = 'mailto:fahadrahman9819@gmail.com?subject=About%20Studio%20FX';

const STATEMENT =
  'Studio FX is an independent AI studio crafting lead engines, workflow systems and intelligent websites through strategy, design, and technology.';

export default function About() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.aboutWord',
        { opacity: 0.14 },
        {
          opacity: 1,
          stagger: 0.06,
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top 74%',
            end: 'center 42%',
            scrub: true,
          },
        }
      );

      gsap.fromTo(
        '.aboutAside',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: { trigger: root, start: 'top 60%', once: true },
        }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="about" data-theme-section="dark">
      <p className="aboutKicker">ABOUT</p>

      <h2 className="aboutStatement">
        {STATEMENT.split(' ').map((w, i) => (
          <span key={i} className="aboutWord">
            {w}{' '}
          </span>
        ))}
      </h2>

      <div className="aboutFoot">
        <div className="aboutAside aboutCreed">
          WE BUILD FOR LONGEVITY
          <br />
          CLARITY FIRST, CRAFT ALWAYS,
          <br />
          BUILT TO SCALE.
        </div>
        <div className="aboutAside aboutMission">
          <p>
            Our mission is to make automation feel human by building systems
            that are intuitive, purposeful, and quietly relentless.
          </p>
          <a href={CONTACT} className="monoCta" data-hover>
            MORE ABOUT US <span className="monoCtaArrow">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
