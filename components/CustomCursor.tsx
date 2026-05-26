"use client";

import { useEffect, useRef } from "react";

/** Black on light sections, white on dark sections */
const CURSOR_COLORS = ["#0a0a0a", "#ffffff", "#0a0a0a", "#ffffff", "#0a0a0a", "#ffffff", "#0a0a0a"];

interface CustomCursorProps {
  activeSection: number;
}

export default function CustomCursor({ activeSection }: CustomCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const rafId = useRef(0);

  useEffect(() => {
    const isTouch =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches;

    if (isTouch || !cursorRef.current) return;

    const cursor = cursorRef.current;
    cursor.style.display = "block";

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.12;
      pos.current.y += (target.current.y - pos.current.y) * 0.12;
      cursor.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%)`;
      rafId.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: CURSOR_COLORS[activeSection] ?? "#0a0a0a",
        zIndex: 9998,
        pointerEvents: "none",
        display: "none",
        transition: "background 0.35s ease",
      }}
    />
  );
}
