'use client';

/**
 * Selected work — light. Art-directed placeholder covers built in
 * pure CSS until real case imagery lands.
 * TODO(studio-fx): replace CASES with real projects + screenshots.
 */

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CONTACT = 'mailto:hello@studiofx.co?subject=Show%20me%20the%20case%20studies';

const CASES = [
  {
    id: 'meridian',
    name: 'Meridian Legal',
    desc: 'Enquiry engine & client intake automation.',
    meta: 'LEAD ENGINE — 2026',
    initial: 'M',
    n: '001',
    t: '00:38',
  },
  {
    id: 'northgate',
    name: 'Northgate Roofing',
    desc: '24/7 lead capture that never lets a quote request die.',
    meta: 'AUTOMATION — 2026',
    initial: 'N',
    n: '002',
    t: '00:52',
  },
  {
    id: 'kado',
    name: 'Kado Interiors',
    desc: 'Intelligent website with live booking and follow-up flows.',
    meta: 'INTELLIGENT WEB — 2025',
    initial: 'K',
    n: '003',
    t: '01:14',
  },
];

export default function Work() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.workCase').forEach((el) => {
        gsap.fromTo(
          el,
          { y: 70, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 86%', once: true },
          }
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  const CLIENTS = [
    'MERIDIAN LEGAL',
    'NORTHGATE ROOFING',
    'KADO INTERIORS',
    'ATLAS DENTAL',
    'FERN STUDIO',
    'HALE & CO',
  ];

  return (
    <section ref={rootRef} className="work" data-theme-section="light" id="work">
      <div className="workClients" aria-label="Clients">
        <div className="workClientsTrack">
          {[...CLIENTS, ...CLIENTS].map((c, i) => (
            <span key={i} className="workClient">
              {c}
            </span>
          ))}
        </div>
      </div>

      <header className="sectionHead workHead">
        <h2 className="sectionTitle">
          Selected work
          <br />
          &amp; explorations
        </h2>
        <p className="sectionSub">
          Systems shipped for businesses that
          <br />
          were done losing to their own inbox.
        </p>
      </header>

      <div className="workGrid">
        {CASES.map((c, i) => (
          <a
            key={c.id}
            href={CONTACT}
            className={`workCase workCase-${i}`}
            data-cursor-label="VIEW"
          >
            <div className={`workCover workCover-${c.id}`}>
              <span className="workInitial">{c.initial}</span>
              <span className="workCoverRows" aria-hidden />
              <span className="workCoverChip" aria-hidden />
              <span className="workCoverHud" aria-hidden>
                {c.n} · {c.t}
              </span>
            </div>
            <div className="workMetaRow">
              <div>
                <h3 className="workName">{c.name}</h3>
                <p className="workDesc">{c.desc}</p>
                <span className="monoCta workExplore">
                  EXPLORE PROJECT <span className="monoCtaArrow">→</span>
                </span>
              </div>
              <span className="workMeta">{c.meta}</span>
            </div>
          </a>
        ))}

        <div className="workMore">
          <p>
            Discover our complete collection
            <br />
            of engines, systems, and platforms.
          </p>
          <a href={CONTACT} className="monoCta" data-hover>
            VIEW ALL PROJECTS <span className="monoCtaArrow">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
