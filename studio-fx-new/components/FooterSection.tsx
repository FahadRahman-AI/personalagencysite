'use client';

export default function FooterSection() {
  return (
    <footer style={{
      background: '#080808',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      padding: '52px 48px',
    }}>
      <div
        className="footer-inner"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <span style={{
          fontFamily: 'var(--font-space-grotesk)',
          fontWeight: 700,
          fontSize: '15px',
          color: 'white',
          letterSpacing: '0.06em',
        }}>
          STUDIO FX
        </span>
        <span style={{
          fontFamily: 'var(--font-space-grotesk)',
          fontSize: '11px',
          color: 'rgba(255,255,255,0.25)',
          letterSpacing: '0.08em',
        }}>
          AI Infrastructure · Birmingham · Worldwide
        </span>
        <span style={{
          fontFamily: 'var(--font-space-grotesk)',
          fontSize: '11px',
          color: 'rgba(255,255,255,0.25)',
          letterSpacing: '0.06em',
        }}>
          © 2026 Studio FX
        </span>
      </div>
      <style>{`
        @media (max-width: 600px) {
          .footer-inner { flex-direction: column !important; text-align: center !important; }
        }
      `}</style>
    </footer>
  );
}
