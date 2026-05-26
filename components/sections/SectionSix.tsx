"use client";

import { BRAND, CTA } from "./site-copy";
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
          LOOK LIKE YOU
          <br />
          RAISED SERIES A.
          <br />
          <span
            style={{
              WebkitTextStroke: "2px white",
              color: "transparent",
            }}
          >
            NOT BOOTSTRAP.
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
          Thirty minutes. You leave with scope, timeline, and a straight answer on
          whether we&apos;re the right studio — no deck, no pressure.
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
          {CTA.bookCall}
        </button>

        <p
          className={dmSansClass}
          style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.35)",
            marginTop: 24,
            letterSpacing: "0.06em",
          }}
        >
          {CTA.noObligation}
        </p>

        <p
          className={dmSansClass}
          style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.2)",
            marginTop: 16,
          }}
        >
          {BRAND.email}
        </p>
      </div>
    </section>
  );
}
