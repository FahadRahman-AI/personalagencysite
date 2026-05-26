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
        const offset = rect.top !== 0
          ? -rect.top
          : window.scrollY - SECTION_INDEX * window.innerHeight;

        const [l1, l2, l3, l4, l5, l6, l7, l8] = layerRefs.current;
        if (l1) l1.style.transform = `translateY(${offset * 0.03}px)`;
        if (l2) l2.style.transform = `translateY(${offset * 0.08}px)`;
        if (l3) l3.style.transform = `translateY(${offset * 0.14}px)`;
        if (l4) l4.style.transform = `translateY(${offset * 0.2}px)`;
        if (l5) l5.style.transform = `translateY(${offset * 0.28}px) rotate(${offset * 0.01}deg)`;
        if (l6) l6.style.transform = `translateY(${offset * 0.35}px)`;
        if (l7) l7.style.transform = `translateY(${offset * 0.18}px)`;
        if (l8) l8.style.transform = `translateY(${offset * 0.42}px)`;
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
      style={{
        width: "100%",
        height: "100%",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        background: "#060606",
      }}
    >
      {/* LAYER 1 — base background — barely moves */}
      <div
        ref={ref(0)}
        style={{
          position: "absolute",
          inset: "-10%",
          zIndex: 0,
          background: "radial-gradient(ellipse 140% 100% at 20% 80%, #1a0a02 0%, #0d0d0d 50%, #060606 100%)",
          willChange: "transform",
        }}
      />

      {/* LAYER 2 — large amber glow orb — slow */}
      <div
        ref={ref(1)}
        style={{
          position: "absolute",
          top: "10%",
          left: "-5%",
          width: "65%",
          height: "70%",
          zIndex: 1,
          borderRadius: "50%",
          background: "radial-gradient(circle at 50% 50%, rgba(180,70,10,0.22) 0%, rgba(120,40,5,0.12) 40%, transparent 70%)",
          filter: "blur(60px)",
          willChange: "transform",
          pointerEvents: "none",
        }}
      />

      {/* LAYER 3 — large dark rectangle card — mid speed */}
      <div
        ref={ref(2)}
        style={{
          position: "absolute",
          top: "8%",
          left: "12%",
          width: "50%",
          height: "55%",
          zIndex: 2,
          background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 4,
          willChange: "transform",
          pointerEvents: "none",
          boxShadow: "0 60px 140px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      />

      {/* LAYER 4 — second smaller card offset — faster */}
      <div
        ref={ref(3)}
        style={{
          position: "absolute",
          top: "25%",
          right: "8%",
          width: "28%",
          height: "40%",
          zIndex: 3,
          background: "linear-gradient(145deg, rgba(255,255,255,0.03) 0%, transparent 100%)",
          border: "1px solid rgba(255,255,255,0.05)",
          borderRadius: 4,
          willChange: "transform",
          pointerEvents: "none",
        }}
      />

      {/* LAYER 5 — rotating diamond — fastest geometric */}
      <div
        ref={ref(4)}
        style={{
          position: "absolute",
          top: "55%",
          left: "60%",
          width: 240,
          height: 240,
          zIndex: 3,
          border: "1px solid rgba(255,255,255,0.06)",
          transform: "rotate(45deg)",
          willChange: "transform",
          pointerEvents: "none",
        }}
      />

      {/* LAYER 6 — small bright accent dot — very fast */}
      <div
        ref={ref(5)}
        style={{
          position: "absolute",
          top: "35%",
          left: "72%",
          width: 6,
          height: 6,
          zIndex: 4,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.6)",
          boxShadow: "0 0 20px rgba(255,255,255,0.4), 0 0 60px rgba(200,140,60,0.3)",
          willChange: "transform",
          pointerEvents: "none",
        }}
      />

      {/* LAYER 7 — horizontal light streak */}
      <div
        ref={ref(6)}
        style={{
          position: "absolute",
          top: "48%",
          left: 0,
          width: "100%",
          height: 1,
          zIndex: 4,
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 30%, rgba(255,200,100,0.1) 50%, rgba(255,255,255,0.06) 70%, transparent 100%)",
          willChange: "transform",
          pointerEvents: "none",
        }}
      />

      {/* LAYER 8 — small second accent dot */}
      <div
        ref={ref(7)}
        style={{
          position: "absolute",
          top: "20%",
          left: "30%",
          width: 4,
          height: 4,
          zIndex: 4,
          borderRadius: "50%",
          background: "rgba(255,180,60,0.8)",
          boxShadow: "0 0 16px rgba(255,180,60,0.5)",
          willChange: "transform",
          pointerEvents: "none",
        }}
      />

      {/* FIXED vignette — no scroll */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 5,
          background: "linear-gradient(to bottom, rgba(6,6,6,0.4) 0%, transparent 25%, transparent 60%, rgba(6,6,6,0.95) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* CONTENT — z-index 10, above all layers */}
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

      {/* Centre label */}
      <div
        className={`${spaceGroteskClass} ${styles.caption} ${animated ? styles.captionVisible : ""}`}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 10,
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        <p style={{
          fontSize: 11,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.2)",
          margin: "0 0 20px 0",
        }}>
          Visual Elevation Studio
        </p>
        <p style={{
          fontSize: "clamp(13px, 1.6vw, 18px)",
          color: "rgba(255,255,255,0.5)",
          lineHeight: 1.7,
          maxWidth: 420,
          margin: 0,
          fontWeight: 300,
        }}>
          Every layer you see is moving at a different speed.<br />
          That&apos;s what we do to your brand.
        </p>
      </div>

      {/* Main headline — bottom bleeding */}
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

      {/* Scroll hint */}
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