"use client";

import { useEffect, useRef } from "react";

export default function ScrollThread() {
  const lineRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId = 0;

    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = Math.min(scrollTop / docHeight, 1);

        // Thread line grows from the top based on scroll progress.
        if (lineRef.current) {
          lineRef.current.style.height = `${progress * 100}vh`;
        }

        // Dot follows the bottom edge of the line.
        if (dotRef.current) {
          dotRef.current.style.top = `${progress * 100}vh`;
        }

        // Label follows the dot exactly (same top value).
        if (labelRef.current) {
          labelRef.current.style.top = `${progress * 100}vh`;
        }

        if (labelRef.current) {
          const sectionIndex = Math.round(progress * 6);
          const sectionNames = [
            "01 — Entry",
            "02 — Direction",
            "03 — Editorial",
            "04 — Systems",
            "05 — Depth",
            "06 — Navigation",
            "07 — Contact",
          ];
          labelRef.current.textContent =
            sectionNames[Math.min(sectionIndex, 6)];
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* Track — full height ghost line */}
      <div
        style={{
          position: "fixed",
          left: 24,
          top: 0,
          width: 1,
          height: "100vh",
          background: "rgba(255,255,255,0.08)",
          zIndex: 9990,
          pointerEvents: "none",
          mixBlendMode: "difference",
        }}
      />

      {/* Active line — grows with scroll */}
      <div
        ref={lineRef}
        style={{
          position: "fixed",
          left: 24,
          top: 0,
          width: 1,
          height: 0,
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.4) 100%)",
          zIndex: 9991,
          pointerEvents: "none",
          mixBlendMode: "difference",
          transition: "height 0.05s linear",
          willChange: "height",
        }}
      />

      {/* Travelling dot at the bottom of the active line */}
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          left: 20,
          top: 0,
          width: 9,
          height: 9,
          borderRadius: "50%",
          background: "#ffffff",
          zIndex: 9992,
          pointerEvents: "none",
          mixBlendMode: "difference",
          transform: "translateY(-50%)",
          willChange: "top",
          boxShadow: "0 0 12px rgba(255,255,255,0.8)",
        }}
      />

      {/* Section label beside the dot */}
      <div
        ref={labelRef}
        style={{
          position: "fixed",
          left: 38,
          top: 0,
          fontSize: 9,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "#ffffff",
          zIndex: 9992,
          pointerEvents: "none",
          mixBlendMode: "difference",
          transform: "translateY(-50%)",
          willChange: "top",
          fontFamily: "Space Grotesk, var(--font-space-grotesk, sans-serif)",
          whiteSpace: "nowrap",
          opacity: 0.6,
        }}
      />
    </>
  );
}

