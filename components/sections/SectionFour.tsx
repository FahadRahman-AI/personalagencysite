"use client";

import { useEffect, useState } from "react";
import WireframeSphere from "../WireframeSphere";
import styles from "./section-four.module.css";

interface SectionFourProps {
  isActive: boolean;
  spaceGroteskClass: string;
  antonClass: string;
}

const RIGHT_LINKS = ["INSTAGRAM", "LINKEDIN", "YOUTUBE"];
const PORTFOLIO_LINKS = ["PORTFOLIO", "BEHANCE"];

export default function SectionFour({
  isActive,
  spaceGroteskClass,
  antonClass,
}: SectionFourProps) {
  const [animated, setAnimated] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    if (isActive) {
      const t = setTimeout(() => setAnimated(true), 40);
      return () => clearTimeout(t);
    }
    setAnimated(false);
  }, [isActive]);

  useEffect(() => {
    const tick = () => {
      setTime(
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }),
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const dataFade = (delay: number) =>
    `${styles.dataItem} ${animated ? styles.dataVisible : ""}`;

  return (
    <section
      style={{
        background: "#282828",
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        className={`${spaceGroteskClass} ${dataFade(0)}`}
        style={{
          position: "absolute",
          top: 24,
          left: 32,
          fontSize: 10,
          color: "rgba(255,255,255,0.4)",
          lineHeight: 1.8,
          zIndex: 2,
          transitionDelay: "0s",
        }}
      >
        <div>HELLO@STUDIOFX.CO</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginTop: 4 }}>
          FOR ALL QUESTIONS
        </div>
        <div>BIRMINGHAM, UK · 2024</div>
      </div>

      <div
        className={`${spaceGroteskClass} ${dataFade(0.05)}`}
        style={{
          position: "absolute",
          top: 24,
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: 10,
          color: "rgba(255,255,255,0.3)",
          textTransform: "uppercase",
          letterSpacing: "0.2em",
          zIndex: 2,
        }}
      >
        {time}
      </div>

      <div
        className={`${spaceGroteskClass} ${dataFade(0.1)}`}
        style={{
          position: "absolute",
          top: 24,
          right: 32,
          fontSize: 10,
          color: "rgba(255,255,255,0.3)",
          textAlign: "right",
          lineHeight: 1.8,
          zIndex: 2,
        }}
      >
        <div>WEB</div>
        <div>AI</div>
        <div>FILM</div>
      </div>

      <div
        className={`${styles.floatCard} ${spaceGroteskClass}`}
        style={{
          position: "absolute",
          top: 80,
          right: 180,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 12,
          padding: "14px 18px",
          width: 180,
          zIndex: 2,
        }}
      >
        <div
          style={{
            width: "100%",
            height: 80,
            background: "rgba(255,255,255,0.05)",
            borderRadius: 6,
            marginBottom: 8,
          }}
        />
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>Latest project</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginTop: 4 }}>
          Curbside Coffee Co.
        </div>
      </div>

      <div className={`${styles.sphere} ${animated ? styles.sphereVisible : ""}`}>
        <WireframeSphere isActive={isActive} />
      </div>

      <span
        className={spaceGroteskClass}
        style={{
          position: "absolute",
          top: "38%",
          left: "42%",
          background: "#E8350A",
          color: "#fff",
          fontSize: 10,
          fontWeight: 700,
          textTransform: "uppercase",
          padding: "3px 10px",
          borderRadius: 100,
          zIndex: 3,
        }}
      >
        [ WEBSITES ]
      </span>
      <span
        className={spaceGroteskClass}
        style={{
          position: "absolute",
          top: "42%",
          right: "38%",
          background: "#E8350A",
          color: "#fff",
          fontSize: 10,
          fontWeight: 700,
          textTransform: "uppercase",
          padding: "3px 10px",
          borderRadius: 100,
          zIndex: 3,
        }}
      >
        AI ✦
      </span>

      <nav
        className={`${styles.rightNav} ${spaceGroteskClass}`}
        style={{
          position: "absolute",
          right: 48,
          top: "50%",
          transform: "translateY(-50%)",
          textAlign: "right",
          zIndex: 2,
        }}
      >
        {RIGHT_LINKS.map((link) => (
          <div
            key={link}
            className={styles.navLink}
            style={{
              fontSize: "clamp(20px, 2.5vw, 32px)",
              fontWeight: 500,
              color: "#fff",
              lineHeight: 1.4,
            }}
          >
            {link}
          </div>
        ))}
        <div style={{ height: 24 }} />
        {PORTFOLIO_LINKS.map((link) => (
          <div
            key={link}
            className={styles.navLink}
            style={{
              fontSize: "clamp(16px, 2vw, 24px)",
              fontWeight: 500,
              color: "rgba(255,255,255,0.7)",
              lineHeight: 1.4,
            }}
          >
            {link}
          </div>
        ))}
      </nav>

      <h1
        className={`${antonClass} ${styles.bottomText} ${animated ? styles.bottomVisible : ""}`}
        style={{
          position: "absolute",
          bottom: -20,
          left: -4,
          fontSize: "clamp(100px, 15vw, 200px)",
          color: "#fff",
          lineHeight: 0.85,
          whiteSpace: "nowrap",
          margin: 0,
          zIndex: 0,
          fontWeight: 400,
        }}
      >
        WHAT
        <br />
        ABOUT THIS?
      </h1>
    </section>
  );
}
