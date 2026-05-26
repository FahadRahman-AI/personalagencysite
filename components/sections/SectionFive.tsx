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

/** Parallax multipliers — back (slow) → front (fast) */
const PARALLAX = {
  base: 0.03,
  glow: 0.08,
  cardA: 0.14,
  cardB: 0.22,
  streak: 0.3,
  dotA: 0.38,
  dotB: 0.45,
} as const;

export default function SectionFive({
  isActive,
  spaceGroteskClass,
  antonClass,
}: SectionFiveProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (isActive) {
      const t = setTimeout(() => setAnimated(true), 80);
      return () => clearTimeout(t);
    }
    setAnimated(false);
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;
    let rafId = 0;

    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        const section = sectionRef.current;
        if (!section) return;

        const rect = section.getBoundingClientRect();
        const offset =
          rect.top !== 0
            ? -rect.top
            : window.scrollY - SECTION_INDEX * window.innerHeight;

        const [base, glow, cardA, cardB, streak, dotA, dotB] = layerRefs.current;
        if (base) base.style.transform = `translateY(${offset * PARALLAX.base}px)`;
        if (glow) glow.style.transform = `translateY(${offset * PARALLAX.glow}px)`;
        if (cardA) cardA.style.transform = `translateY(${offset * PARALLAX.cardA}px)`;
        if (cardB) cardB.style.transform = `translateY(${offset * PARALLAX.cardB}px)`;
        if (streak) streak.style.transform = `translateY(${offset * PARALLAX.streak}px)`;
        if (dotA) dotA.style.transform = `translateY(${offset * PARALLAX.dotA}px)`;
        if (dotB) dotB.style.transform = `translateY(${offset * PARALLAX.dotB}px)`;
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [isActive]);

  const ref = (i: number) => (el: HTMLDivElement | null) => {
    layerRefs.current[i] = el;
  };

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-label="Visual elevation"
    >
      {/* LAYER 0 — warm cream gradient base (slowest) */}
      <div
        ref={ref(0)}
        className={styles.layer}
        style={{
          inset: "-12%",
          zIndex: 0,
          background:
            "radial-gradient(ellipse 130% 90% at 30% 70%, #faf8f6 0%, #f0eeec 45%, #e8e4e0 100%)",
        }}
      />

      {/* LAYER 1 — soft radial glow, centre */}
      <div
        ref={ref(1)}
        className={styles.layer}
        style={{
          top: "18%",
          left: "50%",
          width: "min(72vw, 720px)",
          height: "min(72vw, 720px)",
          marginLeft: "min(-36vw, -360px)",
          zIndex: 1,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 50% 50%, rgba(255, 210, 170, 0.55) 0%, rgba(255, 190, 140, 0.2) 35%, transparent 68%)",
          filter: "blur(48px)",
          pointerEvents: "none",
        }}
      />

      {/* LAYER 2 — large floating card (mid-back) */}
      <div
        ref={ref(2)}
        className={styles.layer}
        style={{
          top: "10%",
          left: "8%",
          width: "48%",
          height: "52%",
          zIndex: 2,
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.28) 100%)",
          border: "1px solid rgba(0,0,0,0.06)",
          borderRadius: 6,
          boxShadow:
            "0 40px 100px rgba(120, 90, 70, 0.12), inset 0 1px 0 rgba(255,255,255,0.9)",
          pointerEvents: "none",
        }}
      />

      {/* LAYER 3 — second card, offset (mid-front) */}
      <div
        ref={ref(3)}
        className={styles.layer}
        style={{
          top: "28%",
          right: "6%",
          width: "32%",
          height: "38%",
          zIndex: 3,
          background:
            "linear-gradient(160deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.15) 100%)",
          border: "1px solid rgba(0,0,0,0.05)",
          borderRadius: 6,
          boxShadow: "0 24px 60px rgba(100, 80, 60, 0.08)",
          pointerEvents: "none",
        }}
      />

      {/* LAYER 4 — horizontal light streak */}
      <div
        ref={ref(4)}
        className={styles.layer}
        style={{
          top: "50%",
          left: 0,
          width: "100%",
          height: 1,
          zIndex: 4,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 25%, rgba(255, 220, 180, 0.65) 50%, rgba(255,255,255,0.5) 75%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

      {/* LAYER 5 — accent dot (fast) */}
      <div
        ref={ref(5)}
        className={styles.layer}
        style={{
          top: "32%",
          left: "68%",
          width: 7,
          height: 7,
          zIndex: 5,
          borderRadius: "50%",
          background: "rgba(180, 110, 60, 0.85)",
          boxShadow:
            "0 0 12px rgba(200, 140, 80, 0.5), 0 0 32px rgba(255, 200, 140, 0.35)",
          pointerEvents: "none",
        }}
      />

      {/* LAYER 6 — second accent dot (fastest) */}
      <div
        ref={ref(6)}
        className={styles.layer}
        style={{
          top: "22%",
          left: "34%",
          width: 5,
          height: 5,
          zIndex: 5,
          borderRadius: "50%",
          background: "rgba(40, 32, 28, 0.55)",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.08)",
          pointerEvents: "none",
        }}
      />

      {/* Atmospheric wisps — subtle, mid-speed feel via CSS only */}
      <div className={styles.atmosphere} aria-hidden />

      {/* FIXED vignette — does not scroll */}
      <div
        className={styles.vignette}
        style={{
          background:
            "linear-gradient(to bottom, rgba(240,238,236,0.55) 0%, transparent 22%, transparent 58%, rgba(232,228,224,0.92) 100%)",
        }}
      />

      {/* Content */}
      <div
        className={`${spaceGroteskClass} ${styles.meta} ${animated ? styles.metaVisible : ""}`}
      >
        <span>{BRAND.name}</span>
        <span>Direction 03 — Systems</span>
        <span>{BRAND.worldwide}</span>
      </div>

      <div
        className={`${spaceGroteskClass} ${styles.caption} ${animated ? styles.captionVisible : ""}`}
      >
        <p className={styles.captionLabel}>Visual Elevation Studio</p>
        <p className={styles.captionBody}>
          Every layer you see is moving at a different speed.
          <br />
          That&apos;s what we do to your brand.
        </p>
      </div>

      <h1
        className={`${antonClass} ${styles.headline} ${animated ? styles.headlineVisible : ""}`}
      >
        WHAT
        <br />
        ABOUT THIS?
      </h1>

      <div
        className={`${spaceGroteskClass} ${styles.scrollHint} ${animated ? styles.scrollHintVisible : ""}`}
      >
        Keep scrolling ↓
      </div>
    </section>
  );
}
