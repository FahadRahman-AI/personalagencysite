"use client";

import { useEffect, useState } from "react";
import { useSpring, useTrail, animated } from "@react-spring/web";
import { BRAND, CTA } from "./site-copy";
import styles from "./section-one.module.css";

interface SectionOneProps {
  isActive: boolean;
  antonClass: string;
  dmSansClass: string;
}

const LINKS = ["PROOF ↗", "PROCESS ↗", CTA.bookCallShort, "BRIEF ↗"];
const HEADLINE_WORDS = ["YOU'RE LOSING DEALS", "ON APPEARANCE."];

export default function SectionOne({ isActive, antonClass, dmSansClass }: SectionOneProps) {
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    if (isActive) {
      const t = setTimeout(() => setTriggered(true), 60);
      return () => clearTimeout(t);
    }
    setTriggered(false);
  }, [isActive]);

  // Spring trail — each headline word slides up from clip
  const headlineTrail = useTrail(HEADLINE_WORDS.length, {
    y: triggered ? 0 : 120,
    opacity: triggered ? 1 : 0,
    config: { mass: 1, tension: 200, friction: 36 },
    delay: 80,
  });

  // Spring for sub-content (tag line + nav)
  const subSpring = useSpring({
    opacity: triggered ? 1 : 0,
    y: triggered ? 0 : 28,
    config: { mass: 1, tension: 180, friction: 38 },
    delay: triggered ? 380 : 0,
  });

  // The small centred line uses its own spring
  const centreSpring = useSpring({
    opacity: triggered ? 1 : 0,
    y: triggered ? 0 : 20,
    config: { mass: 1, tension: 200, friction: 40 },
    delay: triggered ? 200 : 0,
  });

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
      {/* Top bar */}
      <animated.div
        className={dmSansClass}
        style={{
          ...subSpring,
          position: "absolute",
          top: 0, left: 0, right: 0,
          display: "flex",
          justifyContent: "space-between",
          padding: "24px 32px",
          zIndex: 3,
        }}
      >
        {[BRAND.name, BRAND.est, BRAND.worldwide].map((label) => (
          <span key={label} style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.2em", color: "#888" }}>
            {label}
          </span>
        ))}
      </animated.div>

      <div className={styles.blob} aria-hidden />

      {/* Centre subhead */}
      <animated.h2
        className={antonClass}
        style={{
          ...centreSpring,
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 10, margin: 0,
          fontSize: "clamp(48px, 7vw, 100px)",
          fontWeight: 400, lineHeight: 1,
          textAlign: "center", whiteSpace: "nowrap",
          background: "linear-gradient(135deg, #E8520a 0%, #c8a030 50%, #ff8c20 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        never heard of us?
      </animated.h2>

      {/* Main headline — spring physics word reveal */}
      <div
        className={antonClass}
        style={{ position: "absolute", width: "100%", zIndex: 2 }}
        aria-label={HEADLINE_WORDS.join(" ")}
      >
        {headlineTrail.map((spring, i) => (
          <animated.h1
            key={i}
            aria-hidden="true"
            style={{
              ...spring,
              fontSize: "clamp(100px, 14vw, 200px)",
              color: "#0a0a0a",
              position: "absolute",
              top: i === 0 ? "15%" : "calc(15% + clamp(90px, 13vw, 185px))",
              left: i === 0 ? -8 : 40,
              margin: 0,
              lineHeight: 0.9,
              whiteSpace: "nowrap",
              fontWeight: 400,
            }}
          >
            {HEADLINE_WORDS[i]}
          </animated.h1>
        ))}
      </div>

      {/* Bottom left body */}
      <animated.p
        className={dmSansClass}
        style={{
          ...subSpring,
          position: "absolute",
          bottom: 40, left: 32,
          maxWidth: 320,
          fontSize: 13,
          color: "rgba(0,0,0,0.5)",
          lineHeight: 1.7,
          margin: 0,
          zIndex: 3,
        }}
      >
        Prospects decide in seconds. We rebuild your site, systems, and content so the
        business that&apos;s actually better — finally looks it.
      </animated.p>

      {/* Bottom right nav */}
      <animated.nav
        className={`${styles.navLinks} ${dmSansClass}`}
        style={{
          ...subSpring,
          position: "absolute",
          bottom: 40, right: 32,
          zIndex: 3, minWidth: 220,
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
      </animated.nav>
    </section>
  );
}
