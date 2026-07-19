'use client';

/**
 * Client stories — light testimonial carousel. Client rail on the
 * left drives the active quote; arrows and a timer both advance it.
 * TODO(studio-fx): swap placeholder quotes for real client words.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

const CONTACT = 'mailto:hello@studiofx.co?subject=Become%20a%20client';

const STORIES = [
  {
    client: 'MERIDIAN LEGAL',
    quote:
      'Enquiries used to sit overnight and die there. Now every message is answered before I even see it, and the calendar fills itself.',
    author: 'Managing Partner',
    firm: 'Meridian Legal',
  },
  {
    client: 'NORTHGATE ROOFING',
    quote:
      'We stopped losing quotes to slow replies within the first week. The system chases, books and reminds — we just show up.',
    author: 'Director',
    firm: 'Northgate Roofing',
  },
  {
    client: 'KADO INTERIORS',
    quote:
      'The site talks to clients like our best consultant does. Bookings happen at midnight. It genuinely runs without us.',
    author: 'Founder',
    firm: 'Kado Interiors',
  },
  {
    client: 'ATLAS DENTAL',
    quote:
      'Recalls, reminders, follow-ups — all of it just happens now. The front desk finally works on patients, not paperwork.',
    author: 'Practice Manager',
    firm: 'Atlas Dental',
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
        <h2 className="sectionTitle">Client stories</h2>
        <p className="sectionSub">
          Great work is built through
          <br />
          partnership. Here&rsquo;s what our clients say.
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
          BECOME A CLIENT <span className="monoCtaArrow">→</span>
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
