"use client";

import { useEffect, useState } from "react";
import { useSpring, useTrail, animated } from "@react-spring/web";
import { BRAND, CTA } from "./site-copy";
import styles from "./section-six.module.css";

interface SectionSixProps {
  isActive?: boolean;
  spaceGroteskClass: string;
  dmSansClass: string;
}

const HEADLINE_LINES = ["LOOK LIKE YOU", "RAISED SERIES A."];

export default function SectionSix({ isActive = false, spaceGroteskClass, dmSansClass }: SectionSixProps) {
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    if (isActive) {
      const t = setTimeout(() => setTriggered(true), 60);
      return () => clearTimeout(t);
    }
    setTriggered(false);
  }, [isActive]);

  const headlineTrail = useTrail(HEADLINE_LINES.length, {
    y: triggered ? 0 : 100,
    opacity: triggered ? 1 : 0,
    config: { mass: 1, tension: 200, friction: 36 },
    delay: 60,
  });

  const outlineSpring = useSpring({
    y: triggered ? 0 : 100,
    opacity: triggered ? 1 : 0,
    config: { mass: 1, tension: 200, friction: 36 },
    delay: triggered ? 200 : 0,
  });

  const subSpring = useSpring({
    opacity: triggered ? 1 : 0,
    y: triggered ? 0 : 24,
    config: { mass: 1, tension: 180, friction: 40 },
    delay: triggered ? 360 : 0,
  });

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
        {/* Spring headline — word trail */}
        <h2
          className={spaceGroteskClass}
          style={{ fontSize: "clamp(80px, 12vw, 160px)", lineHeight: 0.85, margin: 0, fontWeight: 800, overflow: "hidden" }}
          aria-label={[...HEADLINE_LINES, "NOT BOOTSTRAP."].join(" ")}
        >
          {headlineTrail.map((spring, i) => (
            <animated.span
              key={i}
              aria-hidden="true"
              style={{ ...spring, display: "block", color: "#fff" }}
            >
              {HEADLINE_LINES[i]}
            </animated.span>
          ))}
          <span style={{ display: "block", overflow: "hidden" }}>
            <animated.span
              aria-hidden="true"
              style={{
                ...outlineSpring,
                display: "block",
                WebkitTextStroke: "2px white",
                color: "transparent",
              }}
            >
              NOT BOOTSTRAP.
            </animated.span>
          </span>
        </h2>

        <animated.p
          className={dmSansClass}
          style={{
            ...subSpring,
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
        </animated.p>

        <animated.div style={subSpring}>
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

          <p className={dmSansClass} style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 24, letterSpacing: "0.06em" }}>
            {CTA.noObligation}
          </p>
          <p className={dmSansClass} style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", marginTop: 16 }}>
            {BRAND.email}
          </p>
        </animated.div>
      </div>
    </section>
  );
}
