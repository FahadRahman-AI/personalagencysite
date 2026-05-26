"use client";

import styles from "./section-six.module.css";

interface SectionSixProps {
  spaceGroteskClass: string;
  dmSansClass: string;
}

export default function SectionSix({
  spaceGroteskClass,
  dmSansClass,
}: SectionSixProps) {
  return (
    <section
      style={{
        background: "radial-gradient(ellipse at center, #1a0a02 0%, #080808 70%)",
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ textAlign: "center", padding: "0 24px" }}>
        <h2
          className={spaceGroteskClass}
          style={{
            fontSize: "clamp(80px, 12vw, 160px)",
            color: "#fff",
            lineHeight: 0.85,
            margin: 0,
            fontWeight: 800,
          }}
        >
          LET&apos;S BUILD
          <br />
          <span
            style={{
              WebkitTextStroke: "2px white",
              color: "transparent",
            }}
          >
            YOURS.
          </span>
        </h2>

        <p
          className={dmSansClass}
          style={{
            fontSize: 14,
            color: "rgba(255,255,255,0.5)",
            marginTop: 16,
            maxWidth: 480,
            marginLeft: "auto",
            marginRight: "auto",
            lineHeight: 1.6,
          }}
        >
          You&apos;ve seen what&apos;s possible. Now let&apos;s build something made
          for you.
        </p>

        <p
          className={dmSansClass}
          style={{
            fontSize: 13,
            color: "rgba(255,255,255,0.35)",
            marginTop: 32,
            textTransform: "uppercase",
            letterSpacing: "0.15em",
          }}
        >
          STUDIO FX · WEBSITES · AI · CONTENT · BIRMINGHAM
        </p>

        <button
          type="button"
          className={`${styles.ctaButton} ${dmSansClass}`}
          style={{
            background: "#fff",
            color: "#080808",
            fontSize: 14,
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            padding: "20px 56px",
            borderRadius: 100,
            border: "none",
            marginTop: 48,
            cursor: "pointer",
            fontWeight: 600,
            transition: "background 300ms, color 300ms, box-shadow 300ms",
          }}
        >
          START A PROJECT
        </button>

        <p
          className={dmSansClass}
          style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.2)",
            marginTop: 24,
          }}
        >
          hello@studiofx.co
        </p>
      </div>
    </section>
  );
}
