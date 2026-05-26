"use client";

import { useEffect, useRef, useState } from "react";
import { BRAND } from "./site-copy";
import styles from "./section-five.module.css";

interface SectionFiveProps {
  isActive: boolean;
  spaceGroteskClass: string;
  antonClass: string;
}

/** Fifth section in page scroll (0-based index 4) */
const SECTION_INDEX = 4;

const PARALLAX_SPEEDS = {
  layer1: 0.04,
  layer2: 0.1,
  layer3: 0.16,
  layer4: 0.24,
  layer5: 0.2,
  layer6: 0.28,
  layer7: 0.14,
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
      const t = setTimeout(() => setAnimated(true), 40);
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
        const scrollOffset =
          rect.top !== 0 ? -rect.top : window.scrollY - SECTION_INDEX * window.innerHeight;

        const [l1, l2, l3, l4, l5, l6, l7] = layerRefs.current;

        if (l1) l1.style.transform = `translateY(${scrollOffset * PARALLAX_SPEEDS.layer1}px)`;
        if (l2) l2.style.transform = `translateY(${scrollOffset * PARALLAX_SPEEDS.layer2}px)`;
        if (l3) l3.style.transform = `translateY(${scrollOffset * PARALLAX_SPEEDS.layer3}px) scale(1.02)`;
        if (l4) {
          l4.style.transform = `translateY(${scrollOffset * PARALLAX_SPEEDS.layer4}px) translateX(${scrollOffset * 0.02}px)`;
        }
        if (l5) {
          l5.style.transform = `translateY(${scrollOffset * PARALLAX_SPEEDS.layer5}px) rotate(${12 + scrollOffset * 0.015}deg)`;
        }
        if (l6) {
          l6.style.transform = `translateY(${scrollOffset * PARALLAX_SPEEDS.layer6}px) scale(${1 + scrollOffset * 0.0003})`;
        }
        if (l7) {
          l7.style.transform = `translateY(${scrollOffset * PARALLAX_SPEEDS.layer7}px)`;
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

  const setLayerRef = (index: number) => (el: HTMLDivElement | null) => {
    layerRefs.current[index] = el;
  };

  return (
    <section
      ref={sectionRef}
      style={{
        width: "100%",
        height: "100%",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        transition: "opacity 0.6s cubic-bezier(0.76, 0, 0.24, 1)",
      }}
    >
      {/* Layer 1 — deepest void */}
      <div
        ref={setLayerRef(0)}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          background:
            "radial-gradient(ellipse 120% 80% at 25% 70%, rgba(35,18,8,1) 0%, #141414 45%, #060606 100%)",
          willChange: "transform",
        }}
      />

      {/* Layer 2 — distant warm horizon */}
      <div
        ref={setLayerRef(1)}
        style={{
          position: "absolute",
          top: "-15%",
          left: "-15%",
          width: "130%",
          height: "130%",
          zIndex: 1,
          background:
            "radial-gradient(ellipse 70% 50% at 55% 35%, rgba(120,45,15,0.35) 0%, transparent 55%)",
          willChange: "transform",
          pointerEvents: "none",
        }}
      />

      {/* Layer 3 — cool atmospheric bloom (FIND sky depth) */}
      <div
        ref={setLayerRef(2)}
        style={{
          position: "absolute",
          top: "5%",
          right: "-20%",
          width: "80%",
          height: "70%",
          zIndex: 2,
          background:
            "radial-gradient(ellipse at 40% 30%, rgba(60,80,120,0.12) 0%, transparent 65%)",
          filter: "blur(40px)",
          willChange: "transform",
          pointerEvents: "none",
        }}
      />

      {/* Layer 4 — mid-depth architectural slab */}
      <div
        ref={setLayerRef(3)}
        style={{
          position: "absolute",
          top: "18%",
          left: "8%",
          width: "55%",
          height: "clamp(280px, 42vh, 520px)",
          zIndex: 3,
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.008) 100%)",
          border: "1px solid rgba(255,255,255,0.05)",
          borderRadius: 2,
          boxShadow: "0 40px 120px rgba(0,0,0,0.5)",
          willChange: "transform",
          pointerEvents: "none",
        }}
      />

      {/* Layer 5 — floating rotated frame */}
      <div
        ref={setLayerRef(4)}
        style={{
          position: "absolute",
          top: "48%",
          right: "12%",
          width: "clamp(200px, 28vw, 380px)",
          height: "clamp(200px, 28vw, 380px)",
          zIndex: 3,
          background: "transparent",
          border: "1px solid rgba(255,255,255,0.04)",
          transform: "rotate(12deg)",
          willChange: "transform",
          pointerEvents: "none",
        }}
      />

      {/* Layer 6 — foreground mist band (FIND cloud layer analogue) */}
      <div
        ref={setLayerRef(5)}
        style={{
          position: "absolute",
          bottom: "-5%",
          left: "-10%",
          width: "120%",
          height: "55%",
          zIndex: 4,
          background:
            "linear-gradient(to top, rgba(12,12,12,0.95) 0%, rgba(20,20,20,0.4) 40%, transparent 100%)",
          filter: "blur(2px)",
          willChange: "transform",
          pointerEvents: "none",
        }}
      />

      {/* Layer 7 — soft light streak */}
      <div
        ref={setLayerRef(6)}
        style={{
          position: "absolute",
          top: "30%",
          left: "35%",
          width: "40%",
          height: 1,
          zIndex: 4,
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
          willChange: "transform",
          pointerEvents: "none",
        }}
      />

      {/* Layer 8 — fixed vignette (no scroll) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 5,
          background:
            "linear-gradient(to bottom, rgba(6,6,6,0.2) 0%, transparent 35%, rgba(6,6,6,0.5) 70%, rgba(6,6,6,0.92) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Content — above all parallax */}
      <div
        className={`${spaceGroteskClass} ${styles.meta} ${animated ? styles.metaVisible : ""}`}
        style={{
          position: "absolute",
          top: 28,
          left: 32,
          right: 32,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 10,
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: "0.2em",
          color: "rgba(255,255,255,0.35)",
        }}
      >
        <span>{BRAND.name}</span>
        <span>Direction 03 — Systems</span>
        <span>{BRAND.worldwide}</span>
      </div>

      <p
        className={`${spaceGroteskClass} ${styles.caption} ${animated ? styles.captionVisible : ""}`}
        style={{
          position: "absolute",
          top: "42%",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          fontSize: 12,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.25)",
          margin: 0,
          textAlign: "center",
          maxWidth: 360,
          lineHeight: 1.6,
        }}
      >
        Scroll through the stack — each layer moves at its own speed
      </p>

      <h1
        className={`${antonClass} ${styles.headline} ${animated ? styles.headlineVisible : ""}`}
        style={{
          position: "absolute",
          bottom: -20,
          left: -4,
          fontSize: "clamp(100px, 15vw, 200px)",
          color: "#fff",
          lineHeight: 0.85,
          whiteSpace: "nowrap",
          margin: 0,
          zIndex: 10,
          fontWeight: 400,
        }}
      >
        WHAT
        <br />
        ABOUT THIS?
      </h1>

      <div
        className={`${spaceGroteskClass} ${styles.scrollHint} ${animated ? styles.scrollHintVisible : ""}`}
        style={{
          position: "absolute",
          bottom: 32,
          right: 32,
          zIndex: 10,
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          color: "rgba(255,255,255,0.3)",
        }}
      >
        Keep scrolling ↓
      </div>
    </section>
  );
}
