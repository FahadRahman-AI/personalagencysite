'use client';

/**
 * The Engine — dark services beat. Stone monogram turning in fog,
 * metallic text stack revealing on scroll, hover-expanding rows.
 */

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MonogramScene } from '@/lib/site/MonogramScene';

gsap.registerPlugin(ScrollTrigger);

const STACK = ['A.I.', 'LEADS', 'WORKFLOWS', 'WEBSITES'];

const SERVICES = [
  {
    n: '01',
    name: 'AI & Intelligent Automation',
    desc: 'Assistants and agents that answer, qualify and act on your behalf — trained on how your business actually runs.',
  },
  {
    n: '02',
    name: 'Lead Engines',
    desc: 'Every enquiry captured, answered inside a minute, followed up until it books or says no.',
  },
  {
    n: '03',
    name: 'Workflow Systems',
    desc: 'Quotes, invoices, handoffs, reminders — the busywork wired to run end-to-end without you.',
  },
  {
    n: '04',
    name: 'Intelligent Websites',
    desc: 'Sites that behave like your best salesperson: they talk, route, book and learn every week.',
  },
  {
    n: '05',
    name: 'Integrations & Care',
    desc: 'Plugged into your CRM, calendar and phone stack. Monitored, tuned and expanded as you grow.',
  },
];

export default function Engine() {
  const rootRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const typoRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const typo = typoRef.current;
    if (!typo) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.typoStackLine').forEach((line, i) => {
        gsap.fromTo(
          line,
          { yPercent: 108 },
          {
            yPercent: 0,
            ease: 'power3.out',
            duration: 1,
            scrollTrigger: { trigger: typo, start: `top+=${i * 6}% 62%`, once: true },
          }
        );
      });
    }, typo);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    const scene = new MonogramScene(canvas, { variant: 'stone', withFog: true, scale: 0.82 });
    scene.intro();

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? scene.start() : scene.stop()),
      { threshold: 0.02 }
    );
    io.observe(root);

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.engineStackLine').forEach((line, i) => {
        gsap.fromTo(
          line,
          { yPercent: 108 },
          {
            yPercent: 0,
            ease: 'power3.out',
            duration: 1,
            scrollTrigger: { trigger: root, start: `top+=${i * 8}% 60%`, once: true },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>('.serviceRow').forEach((row) => {
        gsap.fromTo(
          row,
          { y: 44, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: row, start: 'top 90%', once: true },
          }
        );
      });
    }, root);

    return () => {
      ctx.revert();
      io.disconnect();
      scene.dispose();
    };
  }, []);

  return (
    <>
      <section ref={typoRef} className="servicesTypo" data-theme-section="light" id="services">
        <p className="typoKicker">OUR SERVICES</p>
        <h2 className="typoStack" aria-label="A.I. Leads Workflows Websites">
          {STACK.map((word) => (
            <span key={word} className="typoStackMask">
              <span className="typoStackLine">{word}</span>
            </span>
          ))}
        </h2>
        <div className="typoFoot">
          <p className="typoNote">
            <span className="engineNoteDot" /> BUILT WITH INTENT. WIRED TO WORK.
          </p>
          <a
            href="mailto:fahadrahman9819@gmail.com?subject=Services"
            className="monoCta typoLink"
            data-hover
          >
            VIEW SERVICES <span className="monoCtaArrow">→</span>
          </a>
        </div>
      </section>

      <section ref={rootRef} className="engine" data-theme-section="dark">
      <div className="engineSticky">
        <canvas ref={canvasRef} className="engineCanvas" aria-hidden />
        <div className="engineStack" aria-label="A.I. Leads Workflows Websites">
          {STACK.map((word) => (
            <span key={word} className="engineStackMask">
              <span className="engineStackLine">{word}</span>
            </span>
          ))}
        </div>
        <p className="engineNote">
          <span className="engineNoteDot" /> DIFFERENT DISCIPLINES. ONE STANDARD OF CRAFT.
        </p>
      </div>

      <div className="serviceList">
        {SERVICES.map((s) => (
          <div key={s.n} className="serviceRow" data-hover>
            <span className="serviceNum">{s.n}</span>
            <h3 className="serviceName">{s.name}</h3>
            <p className="serviceDesc">{s.desc}</p>
            <span className="serviceArrow">→</span>
          </div>
        ))}
      </div>
      </section>
    </>
  );
}
