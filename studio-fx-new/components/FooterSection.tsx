'use client';

export default function FooterSection() {
  return (
    <footer
      style={{
        background: '#080808',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '48px 40px',
      }}
    >
      <div
        className="footer-inner"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-space-grotesk)',
            fontWeight: 700,
            fontSize: '16px',
            color: 'white',
          }}
        >
          STUDIO FX
        </span>

        <span
          style={{
            fontFamily: 'var(--font-space-grotesk)',
            fontSize: '11px',
            color: 'rgba(255,255,255,0.3)',
          }}
        >
          AI Infrastructure · Birmingham · Worldwide
        </span>

        <span
          style={{
            fontFamily: 'var(--font-space-grotesk)',
            fontSize: '11px',
            color: 'rgba(255,255,255,0.3)',
          }}
        >
          © 2026 Studio FX
        </span>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .footer-inner {
            flex-direction: column !important;
            text-align: center !important;
          }
        }
      `}</style>
    </footer>
  );
}
