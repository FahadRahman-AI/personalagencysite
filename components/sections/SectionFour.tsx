"use client";

import { useEffect, useRef, useState } from "react";
import WireframeSphere from "../WireframeSphere";
import { BRAND } from "./site-copy";
import styles from "./section-four.module.css";

interface SectionFourProps {
  isActive: boolean;
  spaceGroteskClass: string;
  antonClass: string;
}

const RIGHT_LINKS = ["INSTAGRAM", "LINKEDIN", "YOUTUBE"];
const PORTFOLIO_LINKS = ["PORTFOLIO", "BEHANCE"];

/** Index in page.tsx scroll sequence — used for parallax offset */
const SECTION_INDEX = 3;

export default function SectionFour({
  isActive,
  spaceGroteskClass,
  antonClass,
}: SectionFourProps) {
  const sectionRef = useRef<HTMLElement>(null);
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

  useEffect(() => {
    if (!isActive) return;

    const layer1 = document.getElementById("avaSrgLayer1");
    const layer2 = document.getElementById("avaSrgLayer2");
    const layer3 = document.getElementById("avaSrgLayer3");
    const layer4 = document.getElementById("avaSrgLayer4");

    let rafId = 0;

    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        const section = sectionRef.current;
        if (!section) return;

        // Fixed viewport sections: derive offset from page scroll position
        const rect = section.getBoundingClientRect();
        const scrollOffset =
          rect.top !== 0 ? -rect.top : window.scrollY - SECTION_INDEX * window.innerHeight;

        if (layer1) layer1.style.transform = `translateY(${scrollOffset * 0.05}px)`;
        if (layer2) layer2.style.transform = `translateY(${scrollOffset * 0.12}px)`;
        if (layer3) layer3.style.transform = `translateY(${scrollOffset * 0.22}px)`;
        if (layer4) {
          layer4.style.transform = `translateY(${scrollOffset * 0.18}px) rotate(${45 + scrollOffset * 0.02}deg)`;
        }
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [isActive]);

  const dataFade = (delay: number) =>
    `${styles.dataItem} ${animated ? styles.dataVisible : ""}`;

  return (
    <section
      ref={sectionRef}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        transition: "opacity 0.6s cubic-bezier(0.76, 0, 0.24, 1)",
      }}
    >
      {/* Parallax layer 1 — base */}
      <div
        id="avaSrgLayer1"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          background:
            "radial-gradient(ellipse at 30% 60%, rgba(40,20,10,1) 0%, #181818 40%, #0a0a0a 100%)",
          willChange: "transform",
        }}
      />

      {/* Parallax layer 2 — warm glow */}
      <div
        id="avaSrgLayer2"
        style={{
          position: "absolute",
          top: "-10%",
          left: "-10%",
          width: "120%",
          height: "120%",
          zIndex: 1,
          background:
            "radial-gradient(ellipse at 60% 40%, rgba(80,30,10,0.4) 0%, transparent 60%)",
          willChange: "transform",
          pointerEvents: "none",
        }}
      />

      {/* Parallax layer 3 — floating rectangle */}
      <div
        id="avaSrgLayer3"
        style={{
          position: "absolute",
          top: "20%",
          left: "15%",
          width: 600,
          height: 400,
          zIndex: 2,
          background: "rgba(255,255,255,0.018)",
          border: "1px solid rgba(255,255,255,0.04)",
          willChange: "transform",
          pointerEvents: "none",
        }}
      />

      {/* Parallax layer 4 — floating rotated square */}
      <div
        id="avaSrgLayer4"
        style={{
          position: "absolute",
          top: "55%",
          right: "20%",
          width: 300,
          height: 300,
          zIndex: 2,
          background: "transparent",
          border: "1px solid rgba(255,255,255,0.03)",
          transform: "rotate(45deg)",
          willChange: "transform",
          pointerEvents: "none",
        }}
      />

      {/* Parallax layer 5 — foreground vignette — does not move */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 3,
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(8,8,8,0.3) 50%, rgba(8,8,8,0.8) 100%)",
          pointerEvents: "none",
        }}
      />

      <div
        className={`${spaceGroteskClass} ${dataFade(0)}`}
        style={{
          position: "absolute",
          top: 24,
          left: 32,
          fontSize: 10,
          color: "rgba(255,255,255,0.4)",
          lineHeight: 1.8,
          zIndex: 4,
          transitionDelay: "0s",
        }}
      >
        <div>{BRAND.email.toUpperCase()}</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginTop: 4 }}>
          SYSTEMS & AUTOMATION
        </div>
        <div>{BRAND.location} · {BRAND.worldwide}</div>
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
          zIndex: 4,
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
          zIndex: 4,
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
          zIndex: 4,
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
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>Live workflow</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginTop: 4 }}>
          Client onboarding · 90% automated
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
          zIndex: 5,
        }}
      >
        [ SITES ]
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
          zIndex: 5,
        }}
      >
        FLOWS ✦
      </span>

      <nav
        className={`${styles.rightNav} ${spaceGroteskClass}`}
        style={{
          position: "absolute",
          right: 48,
          top: "50%",
          transform: "translateY(-50%)",
          textAlign: "right",
          zIndex: 4,
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
          zIndex: 4,
          fontWeight: 400,
        }}
      >
        BACKEND
        <br />
        THAT SHIPS.
      </h1>
    </section>
  );
}
