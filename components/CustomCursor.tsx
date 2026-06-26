"use client";

import { useEffect, useRef } from "react";
import { useAppStore } from "@/lib/store";

/** Dot fills with section colour; ring inverts via mix-blend-mode */
const DOT_COLORS   = ["#0a0a0a", "#ffffff", "#0a0a0a", "#ffffff", "#0a0a0a", "#ffffff", "#f0eeec"];
const RING_COLORS  = ["rgba(10,10,10,0.5)", "rgba(255,255,255,0.4)", "rgba(10,10,10,0.5)", "rgba(255,255,255,0.4)", "rgba(10,10,10,0.5)", "rgba(255,255,255,0.4)", "rgba(10,10,10,0.45)"];

interface CustomCursorProps {
  activeSection: number;
}

export default function CustomCursor({ activeSection }: CustomCursorProps) {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mx = useRef(0), my = useRef(0);
  const dx = useRef(0), dy = useRef(0);  // dot (fast)
  const rx = useRef(0), ry = useRef(0);  // ring (slow)
  const rafId = useRef(0);
  const setMouse = useAppStore((s) => s.setMouse);

  useEffect(() => {
    const isTouch =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;
    dot.style.display  = "block";
    ring.style.display = "block";

    const onMove = (e: MouseEvent) => {
      mx.current = e.clientX;
      my.current = e.clientY;
      setMouse(e.clientX / window.innerWidth, e.clientY / window.innerHeight);
    };

    const onOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a, button, [data-hover]")) {
        ring.style.transform = "translate(-50%, -50%) scale(1.8)";
        ring.style.borderColor = "currentColor";
        ring.style.mixBlendMode = "difference";
      }
    };
    const onOut = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a, button, [data-hover]")) {
        ring.style.transform = "translate(-50%, -50%) scale(1)";
        ring.style.mixBlendMode = "normal";
      }
    };

    const lerp = (a: number, b: number, n: number) => a + (b - a) * n;

    const tick = () => {
      // dot: fast lerp (0.22)
      dx.current = lerp(dx.current, mx.current, 0.22);
      dy.current = lerp(dy.current, my.current, 0.22);
      dot.style.left = dx.current + "px";
      dot.style.top  = dy.current + "px";

      // ring: slow lerp (0.09) — textura signature lag
      rx.current = lerp(rx.current, mx.current, 0.09);
      ry.current = lerp(ry.current, my.current, 0.09);
      ring.style.left = rx.current + "px";
      ring.style.top  = ry.current + "px";

      rafId.current = requestAnimationFrame(tick);
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout",  onOut);
    rafId.current = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout",  onOut);
      cancelAnimationFrame(rafId.current);
    };
  }, [setMouse]);

  const dotColor  = DOT_COLORS[activeSection]  ?? "#0a0a0a";
  const ringColor = RING_COLORS[activeSection] ?? "rgba(10,10,10,0.5)";

  return (
    <>
      {/* Inner dot — fast lerp */}
      <div
        ref={dotRef}
        style={{
          position: "fixed", top: 0, left: 0,
          width: 6, height: 6,
          borderRadius: "50%",
          background: dotColor,
          zIndex: 9999,
          pointerEvents: "none",
          display: "none",
          transform: "translate(-50%, -50%)",
          transition: "background 0.35s ease",
        }}
      />
      {/* Outer ring — slow lerp, mix-blend-mode on hover */}
      <div
        ref={ringRef}
        style={{
          position: "fixed", top: 0, left: 0,
          width: 36, height: 36,
          borderRadius: "50%",
          border: `1px solid ${ringColor}`,
          background: "transparent",
          zIndex: 9998,
          pointerEvents: "none",
          display: "none",
          transform: "translate(-50%, -50%) scale(1)",
          transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1), border-color 0.35s, background 0.35s, mix-blend-mode 0s",
        }}
      />
    </>
  );
}
