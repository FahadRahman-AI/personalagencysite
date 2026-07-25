'use client';

/**
 * Contact — the "Let's Talk" flow. Same chrome as the landing page
 * (Nav, cursor, theme tokens); the SYSTEMS IN MOTION wordmark sits
 * faded behind a card-05-style dark form panel.
 */

import { FormEvent, useEffect, useState } from 'react';
import Nav from './Nav';
import Cursor from './Cursor';

const OBJECTIVES = ['Stop missing calls', 'Get more customers', 'Automate the busywork'];

export default function ContactPage() {
  const [objective, setObjective] = useState(OBJECTIVES[0]);
  const [sent, setSent] = useState(false);

  // This page lives in the light act; pin the theme while mounted.
  useEffect(() => {
    document.documentElement.dataset.theme = 'light';
  }, []);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sent) return;
    setSent(true);
    setTimeout(() => setSent(false), 3200);
  };

  return (
    <div className="site siteLoaded contactPage">
      <Cursor />
      <Nav />

      {/* Faded landing-page wordmark keeps the scene continuous */}
      <div className="contactBackdrop" aria-hidden>
        <span>SYSTEMS IN</span>
        <span className="contactBackdropB">MOTION</span>
      </div>

      <main className="contactMain">
        <header className="contactHead">
          <p className="contactKicker">LET&rsquo;S TALK</p>
          <h1 className="contactTitle">
            What&rsquo;s slipping
            <br />
            through the cracks?
          </h1>
        </header>

        <form className="contactPanel" onSubmit={onSubmit}>
          <div className="contactMeta" aria-hidden>
            <span>SFX—CONTACT</span>
            <span>2026</span>
          </div>

          <label className="contactField">
            <span className="contactLabel">NAME</span>
            <input type="text" name="name" required autoComplete="name" placeholder="Your name" />
          </label>

          <label className="contactField">
            <span className="contactLabel">BUSINESS EMAIL</span>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="name@company.com"
            />
          </label>

          <fieldset className="contactField contactChoice">
            <legend className="contactLabel">AGENCY OBJECTIVE</legend>
            <div className="contactChips">
              {OBJECTIVES.map((o) => (
                <button
                  key={o}
                  type="button"
                  className={o === objective ? 'contactChip contactChipOn' : 'contactChip'}
                  onClick={() => setObjective(o)}
                  data-hover
                >
                  {o}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="contactField">
            <span className="contactLabel">PROJECT BRIEF</span>
            <textarea
              name="brief"
              rows={5}
              required
              placeholder="Missed calls? Slow quotes? Tell us what eats your week."
            />
          </label>

          <div className="contactActions">
            <button type="submit" className={sent ? 'contactSubmit contactSubmitDone' : 'contactSubmit'} data-hover>
              {sent ? 'SUCCESS!' : 'GET MY AUTOMATION PLAN'}
            </button>
            <p className={sent ? 'contactConfirm contactConfirmOn' : 'contactConfirm'} role="status">
              Brief received. We&rsquo;ll reply within one working day.
            </p>
          </div>
        </form>
      </main>

      <footer className="contactFoot">
        <span>©STUDIO FX® — 2026</span>
      </footer>
    </div>
  );
}
