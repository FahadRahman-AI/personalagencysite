'use client';

/**
 * Client stories — light testimonial carousel. Client rail on the
 * left drives the active quote; arrows and a timer both advance it.
 * TODO(studio-fx): swap placeholder quotes for real client words.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

const CONTACT = 'mailto:hello@studiofx.co?subject=Start%20a%20project';

const STORIES = [
  {
    client: 'LEGAL FIRMS',
    quote:
      'Enquiries sit overnight and die there. A lead engine changes that — every message answered before anyone at the firm sees it, the calendar filling itself, no matter lost.',
    author: 'Lead engine + intake automation',
    firm: 'Legal firms',
  },
  {
    client: 'TRADES BUSINESSES',
    quote:
      'Losing quotes to slow replies is the most expensive thing a trades business does. An automated system chases, books and reminds — the crew just shows up.',
    author: 'Quote automation + follow-up',
    firm: 'Trades businesses',
  },
  {
    client: 'DESIGN STUDIOS',
    quote:
      'A site that talks to enquiries like your best consultant. Project briefs are qualified, calls are booked, follow-ups go out — at midnight, on weekends, without anyone lifting a finger.',
    author: 'Intelligent website + booking flow',
    firm: 'Design studios',
  },
  {
    client: 'MEDICAL PRACTICES',
    quote:
      'Recalls, reminders, follow-ups — running automatically. The front desk works on patients, not paperwork. Nothing falls through the gap.',
    author: 'Workflow automation + patient comms',
    firm: 'Medical practices',
  },
];

export default function Stories() {
  const [active, setActive] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback((next: number) => {
    setActive((next + STORIES.length) % STORIES.length);
  }, []);

  // Auto-advance, reset whenever the user drives it manually.
  useEffect(() => {
    timer.current = setInterval(() => setActive((a) => (a + 1) % STORIES.length), 6000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [active]);

  const story = STORIES[active];

  return (
    <section className="stories" data-theme-section="light" id="stories">
      <header className="sectionHead storiesHead">
        <h2 className="sectionTitle">The shift</h2>
        <p className="sectionSub">
          Here&rsquo;s exactly what changes
          <br />
          when the automation goes live.
        </p>
      </header>

      <div className="storiesTools">
        <div className="storiesArrows">
          <button onClick={() => go(active - 1)} data-hover aria-label="Previous story">
            ←
          </button>
          <button onClick={() => go(active + 1)} data-hover aria-label="Next story">
            →
          </button>
        </div>
        <a href={CONTACT} className="monoCta" data-hover>
          BE FIRST TO BUILD <span className="monoCtaArrow">→</span>
        </a>
      </div>

      <div className="storiesBody">
        <ul className="storiesRail" aria-label="Clients">
          {STORIES.map((s, i) => (
            <li key={s.client}>
              <button
                className={i === active ? 'storiesClient storiesClientOn' : 'storiesClient'}
                onClick={() => go(i)}
                data-hover
              >
                {s.client}
                {i === active && <span className="storiesClientArrow">→</span>}
              </button>
            </li>
          ))}
        </ul>

        <figure key={active} className="storiesQuote">
          <blockquote>{story.quote}</blockquote>
          <figcaption>
            <span className="storiesAvatar" aria-hidden>
              {story.firm[0]}
            </span>
            <span>
              {story.author}
              <em>{story.firm}</em>
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
