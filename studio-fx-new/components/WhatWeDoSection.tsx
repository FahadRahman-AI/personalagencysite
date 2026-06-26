'use client';

const services = [
  {
    num: '01',
    title: 'Lead Qualification Agent',
    body: 'Every enquiry your business receives gets an instant personalised response. Qualified. Followed up. Booked. Automatically.',
  },
  {
    num: '02',
    title: 'Workflow Automation',
    body: 'The admin that eats your week — invoicing, scheduling, follow-ups, reporting — runs itself while you focus on the work that actually makes money.',
  },
  {
    num: '03',
    title: 'AI-Powered Websites',
    body: 'Not just a website. A system that captures leads, qualifies them, and books calls without you touching anything.',
  },
];

export default function WhatWeDoSection() {
  return (
    <section
      style={{
        background: '#080808',
        padding: '160px 0',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 40px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '80px',
          alignItems: 'start',
        }}
        className="what-we-do-grid fade-up"
      >
        {/* Left headline */}
        <div>
          <h2
            style={{
              fontFamily: 'var(--font-anton)',
              fontSize: 'clamp(60px, 8vw, 120px)',
              lineHeight: 0.9,
              color: 'white',
            }}
          >
            <span style={{ display: 'block' }}>WE MAKE YOUR</span>
            <span style={{ display: 'block' }}>BUSINESS RUN</span>
            <span style={{ display: 'block', color: '#E8350A' }}>ITSELF.</span>
          </h2>
        </div>

        {/* Right services */}
        <div>
          {services.map((s) => (
            <div
              key={s.num}
              style={{
                borderTop: '1px solid rgba(255,255,255,0.08)',
                padding: '32px 0',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-anton)',
                  fontSize: '48px',
                  color: 'rgba(255,255,255,0.15)',
                  lineHeight: 1,
                  marginBottom: '12px',
                }}
              >
                {s.num}
              </p>
              <h3
                style={{
                  fontFamily: 'var(--font-space-grotesk)',
                  fontWeight: 600,
                  fontSize: '20px',
                  color: 'white',
                  marginBottom: '12px',
                }}
              >
                {s.title}
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-space-grotesk)',
                  fontWeight: 300,
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.5)',
                  lineHeight: 1.8,
                }}
              >
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .what-we-do-grid {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
            padding: 0 24px !important;
          }
        }
      `}</style>
    </section>
  );
}
