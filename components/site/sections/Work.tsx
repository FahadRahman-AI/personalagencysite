'use client';

/**
 * Capability cards — light. Art-directed covers per service type.
 * Replace with real project imagery when case studies land.
 */

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CONTACT = 'mailto:fahadrahman9819@gmail.com?subject=Show%20me%20the%20case%20studies';

const CASES = [
  {
    id: 'lead',
    name: 'Lead Engine',
    desc: 'Every enquiry captured, answered inside a minute, followed up until it books or declines.',
    meta: 'LEAD CAPTURE — AVAILABLE NOW',
    initial: 'L',
    n: '001',
    t: '00:38',
  },
  {
    id: 'workflow',
    name: 'Workflow OS',
    desc: 'Quotes, reminders, handoffs — the entire admin stack wired to run end-to-end without you.',
    meta: 'AUTOMATION — AVAILABLE NOW',
    initial: 'W',
    n: '002',
    t: '00:52',
  },
  {
    id: 'site',
    name: 'Intelligent Site',
    desc: 'A website that qualifies visitors, books appointments and follows up — every hour, on its own.',
    meta: 'INTELLIGENT WEB — AVAILABLE NOW',
    initial: 'I',
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
    'AI AUTOMATION',
    'LEAD ENGINES',
    'INTELLIGENT WEBSITES',
    'WORKFLOW SYSTEMS',
    'AI INFRASTRUCTURE',
    'ONLINE BOOKING',
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
          What we
          <br />
          build
        </h2>
        <p className="sectionSub">
          Systems ready to deploy.
          <br />
          Enquiries in, customers out.
        </p>
      </header>

      <div className="workGrid">
        {CASES.map((c, i) => (
          <a
            key={c.id}
            href={CONTACT}
            className={`workCase workCase-${i}`}
            data-cursor-label="ENQUIRE"
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
                  ENQUIRE ABOUT THIS <span className="monoCtaArrow">→</span>
                </span>
              </div>
              <span className="workMeta">{c.meta}</span>
            </div>
          </a>
        ))}

        <div className="workMore">
          <p>
            Ready to be the first business
            <br />
            we build this engine for?
          </p>
          <a href={CONTACT} className="monoCta" data-hover>
            START A PROJECT <span className="monoCtaArrow">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
