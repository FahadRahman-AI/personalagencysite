'use client';

const stats = [
  { value: '60s', label: 'Average response time' },
  { value: '24/7', label: 'System uptime' },
  { value: '0', label: 'Leads lost' },
  { value: 'Free', label: 'First call' },
];

export default function StatsSection() {
  return (
    <section
      style={{
        background: '#080808',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div
        className="stats-grid fade-up"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '80px 40px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '40px',
          textAlign: 'center',
        }}
      >
        {stats.map((s) => (
          <div key={s.label}>
            <p
              style={{
                fontFamily: 'var(--font-anton)',
                fontSize: 'clamp(48px, 6vw, 80px)',
                color: 'white',
                lineHeight: 1,
                marginBottom: '12px',
              }}
            >
              {s.value}
            </p>
            <p
              style={{
                fontFamily: 'var(--font-space-grotesk)',
                fontSize: '10px',
                color: 'rgba(255,255,255,0.4)',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }}
            >
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}
