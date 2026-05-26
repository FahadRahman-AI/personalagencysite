"use client";

import { useEffect, useRef, useState } from "react";
import { BRAND } from "./site-copy";
import styles from "./section-five.module.css";

interface SectionFiveProps {
  isActive: boolean;
  spaceGroteskClass: string;
  antonClass: string;
}

const SECTION_INDEX = 4;

const PANELS = [
  { label: "WEBSITES", background: "#0a0a0a", color: "rgba(255,255,255,0.12)" },
  { label: "AI SYSTEMS", background: "#E8350A", color: "rgba(255,255,255,0.15)" },
  { label: "CONTENT", background: "#0a0a2e", color: "rgba(255,255,255,0.12)" },
] as const;

const STATS = [
  { label: "DELIVERY", value: "48hrs" },
  { label: "FIRST CALL", value: "Free" },
  { label: "REVISIONS", value: "Unlimited" },
  { label: "REACH", value: "Worldwide" },
] as const;

export default function SectionFive({
  isActive,
  spaceGroteskClass,
  antonClass,
}: SectionFiveProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const panelInnerRef = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setAnimated(isActive);
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;
    let rafId = 0;

    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        const inner = panelInnerRef.current;
        if (!inner) return;

        const vh = window.innerHeight;
        const progress = Math.min(
          1,
          Math.max(0, (window.scrollY - SECTION_INDEX * vh) / vh),
        );

        inner.style.transform = `translateX(-${progress * 66.66}%)`;
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [isActive]);

  useEffect(() => {
    if (!isActive && panelInnerRef.current) {
      panelInnerRef.current.style.transform = "translateX(0%)";
    }
  }, [isActive]);

  return (
    <section ref={sectionRef} className={styles.section} aria-label="Systems">
      <header
        className={`${spaceGroteskClass} ${styles.topBar} ${animated ? styles.enterVisible : styles.enterHidden}`}
        style={{ transitionDelay: "0ms" }}
      >
        <span>03 / SYSTEMS</span>
        <span>
          {BRAND.name} · {BRAND.worldwide}
        </span>
      </header>

      <div
        className={`${styles.panelTrack} ${animated ? styles.enterVisible : styles.enterHidden}`}
        style={{ transitionDelay: "100ms" }}
      >
        <div ref={panelInnerRef} className={styles.panelInner}>
          {PANELS.map((panel) => (
            <div
              key={panel.label}
              className={styles.panel}
              style={{ background: panel.background }}
            >
              <span
                className={antonClass}
                style={{ color: panel.color, fontSize: 72, fontWeight: 400 }}
              >
                {panel.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        className={`${styles.contentZone} ${animated ? styles.enterVisible : styles.enterHidden}`}
        style={{ transitionDelay: "200ms" }}
      >
        <div className={`${spaceGroteskClass} ${styles.contentLeft}`}>
          <p className={styles.label}>SYSTEMS & AUTOMATION</p>
          <h2 className={styles.headline}>
            Or maybe
            <br />
            something
            <br />
            like this?
          </h2>
          <p className={styles.body}>
            Conversion-focused. Built to make your customers trust you in under
            three seconds. Clean enough to let your product do the talking.
          </p>
          <button type="button" className={styles.link}>
            Book a free call →
          </button>
        </div>

        <div className={`${spaceGroteskClass} ${styles.contentRight}`}>
          <div className={styles.statsGrid}>
            {STATS.map((stat) => (
              <div key={stat.label} className={styles.statBox}>
                <p className={styles.statLabel}>{stat.label}</p>
                <p className={styles.statValue}>{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
