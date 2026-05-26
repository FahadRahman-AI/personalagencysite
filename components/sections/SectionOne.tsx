"use client";

import { useEffect, useState } from "react";
import styles from "./section-one.module.css";

interface SectionOneProps {
  isActive: boolean;
  antonClass: string;
  dmSansClass: string;
}

const LINKS = [
  "SEE THE WORK ↗",
  "HOW IT WORKS ↗",
  "BOOK A CALL ↗",
  "CONTACT ↗",
];

export default function SectionOne({
  isActive,
  antonClass,
  dmSansClass,
}: SectionOneProps) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (isActive) {
      const t = setTimeout(() => setAnimated(true), 40);
      return () => clearTimeout(t);
    }
    setAnimated(false);
  }, [isActive]);

  return (
    <section
      style={{
        background: "#f0eeec",
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        className={dmSansClass}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "space-between",
          padding: "24px 32px",
          zIndex: 3,
        }}
      >
        {["VISUAL ELEVATION STUDIO", "EST. 2024", "WORLDWIDE"].map((label) => (
          <span
            key={label}
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: "#888",
            }}
          >
            {label}
          </span>
        ))}
      </div>

      <div className={styles.blob} aria-hidden />

      <div
        className={antonClass}
        style={{
          position: "absolute",
          width: "100%",
          zIndex: 2,
          overflow: "hidden",
        }}
      >
        <h1
          className={`${styles.line1} ${animated ? styles.line1Visible : ""}`}
          style={{
            fontSize: "clamp(100px, 14vw, 200px)",
            color: "#0a0a0a",
            position: "absolute",
            top: "15%",
            left: -8,
            margin: 0,
            lineHeight: 0.9,
            whiteSpace: "nowrap",
            fontWeight: 400,
          }}
        >
          YOUR BUSINESS IS
        </h1>
        <h1
          className={`${styles.line2} ${animated ? styles.line2Visible : ""}`}
          style={{
            fontSize: "clamp(100px, 14vw, 200px)",
            color: "#0a0a0a",
            position: "absolute",
            top: "calc(15% + clamp(90px, 13vw, 185px))",
            left: 40,
            margin: 0,
            lineHeight: 0.9,
            whiteSpace: "nowrap",
            fontWeight: 400,
          }}
        >
          BETTER THAN THIS.
        </h1>
      </div>

      <p
        className={dmSansClass}
        style={{
          position: "absolute",
          bottom: 40,
          left: 32,
          maxWidth: 320,
          fontSize: 13,
          color: "rgba(0,0,0,0.5)",
          lineHeight: 1.7,
          margin: 0,
          zIndex: 3,
        }}
      >
        Most businesses are losing clients to competitors who look more credible online —
        despite being less capable. We fix that.
      </p>

      <nav
        className={`${styles.navLinks} ${dmSansClass}`}
        style={{
          position: "absolute",
          bottom: 40,
          right: 32,
          zIndex: 3,
          minWidth: 220,
        }}
      >
        {LINKS.map((link) => (
          <div
            key={link}
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 48,
              borderTop: "1px solid #ddd",
              padding: "12px 0",
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "#333",
              cursor: "pointer",
            }}
          >
            {link}
          </div>
        ))}
      </nav>
    </section>
  );
}
