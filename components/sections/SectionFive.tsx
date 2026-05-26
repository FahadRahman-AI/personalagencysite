"use client";

import { useEffect, useState } from "react";
import styles from "./section-five.module.css";

interface SectionFiveProps {
  isActive: boolean;
  spaceGroteskClass: string;
  antonClass: string;
}

const NAV_ITEMS = [
  "🌐 WEBSITES",
  "🤖 AI SYSTEMS",
  "🎬 CONTENT",
  "📊 PROJECTS",
  "👤 ABOUT",
  "📸 INSTAGRAM",
  "💼 LINKEDIN",
  "📧 CONTACT",
];

const VERTICAL_TEXT = [
  "DESIGN & DEVELOPMENT PURVEYORS",
  "DIGITAL DESIGN REFUGE HAND-CRAFTED",
  "WEBSITES · AI · CONTENT",
];

export default function SectionFive({
  isActive,
  spaceGroteskClass,
  antonClass,
}: SectionFiveProps) {
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
      const now = new Date();
      const h = String(now.getUTCHours()).padStart(2, "0");
      const m = String(now.getUTCMinutes()).padStart(2, "0");
      const s = String(now.getUTCSeconds()).padStart(2, "0");
      setTime(`${h}:${m}:${s} GMT`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      style={{
        background: "#d8dde0",
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 380,
          top: 0,
          bottom: 0,
          borderLeft: "1px solid rgba(0,0,0,0.15)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 200,
          top: 0,
          bottom: 0,
          borderLeft: "1px solid rgba(0,0,0,0.15)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 48,
          left: 0,
          right: 0,
          borderTop: "1px solid rgba(0,0,0,0.15)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 48,
          left: 0,
          right: 0,
          borderTop: "1px solid rgba(0,0,0,0.15)",
          pointerEvents: "none",
        }}
      />

      <div
        className={spaceGroteskClass}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          color: "rgba(0,0,0,0.5)",
          zIndex: 3,
        }}
      >
        <span>STUDIO FX DIGITAL</span>
        <span>{time}</span>
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
          <line x1="8" y1="0" x2="8" y2="16" stroke="rgba(0,0,0,0.4)" strokeWidth="1" />
          <line x1="0" y1="8" x2="16" y2="8" stroke="rgba(0,0,0,0.4)" strokeWidth="1" />
        </svg>
        <span>EST.2024</span>
        <span style={{ fontSize: 14 }}>◎</span>
      </div>

      <aside
        className={`${styles.sidebar} ${spaceGroteskClass} ${animated ? styles.sidebarVisible : ""}`}
        style={{
          position: "absolute",
          left: 0,
          top: 48,
          bottom: 48,
          width: 380,
          padding: "32px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          zIndex: 2,
        }}
      >
        {NAV_ITEMS.map((item) => (
          <div
            key={item}
            className={styles.navItem}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 8px",
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "#1a1a1a",
              cursor: "pointer",
            }}
          >
            {item}
          </div>
        ))}
        <div
          style={{
            marginTop: 24,
            fontSize: 10,
            color: "rgba(0,0,0,0.4)",
            lineHeight: 2,
          }}
        >
          <div>—— Website build</div>
          <div>- - - AI workflow</div>
          <div>⚙ Automation</div>
          <div>◎ Brand identity</div>
        </div>
      </aside>

      <div
        className={`${styles.mapArea} ${animated ? styles.mapVisible : ""}`}
        style={{
          position: "absolute",
          left: 380,
          right: 200,
          top: 48,
          bottom: 48,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(160deg, #8B6914 0%, #A0522D 15%, #6B8E23 30%, #228B22 45%, #1a5c1a 55%, #2d4a1e 65%, #8B6914 75%, #A0522D 85%, #6B4226 100%)",
            filter: "saturate(0.7) contrast(1.1)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gridTemplateRows: "repeat(3, 1fr)",
            pointerEvents: "none",
          }}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} style={{ border: "1px solid rgba(255,255,255,0.08)" }} />
          ))}
        </div>
        <svg
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          viewBox="0 0 400 600"
          preserveAspectRatio="none"
        >
          <path
            d="M 200 20 Q 280 120 220 200 T 180 350 Q 160 450 200 580"
            fill="none"
            stroke="rgba(200,255,100,0.8)"
            strokeWidth="2"
            strokeDasharray="6 4"
          />
        </svg>
        {[
          { top: "25%", left: "60%" },
          { top: "55%", left: "45%" },
          { top: "75%", left: "50%" },
        ].map((pos, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: pos.top,
              left: pos.left,
              width: 8,
              height: 8,
              background: "#0a0a0a",
              border: "2px solid white",
              borderRadius: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
        <div
          className={spaceGroteskClass}
          style={{
            position: "absolute",
            top: 24,
            left: 24,
            fontSize: "clamp(20px, 3vw, 36px)",
            fontWeight: 700,
            fontStyle: "italic",
            color: "rgba(150,255,100,0.9)",
          }}
        >
          STUDIO FX
        </div>
      </div>

      <aside
        className={`${styles.rightBar} ${spaceGroteskClass}`}
        style={{
          position: "absolute",
          right: 0,
          top: 48,
          bottom: 48,
          width: 200,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 48,
          zIndex: 2,
        }}
      >
        {VERTICAL_TEXT.map((text) => (
          <span
            key={text}
            style={{
              writingMode: "vertical-rl",
              textOrientation: "mixed",
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "rgba(0,0,0,0.4)",
            }}
          >
            {text}
          </span>
        ))}
      </aside>

      <div
        className={`${styles.bottomHeadline} ${antonClass} ${styles.headline} ${animated ? styles.headlineVisible : ""}`}
        style={{
          position: "absolute",
          bottom: 48,
          left: 0,
          width: 380,
          padding: "0 24px 24px",
          fontSize: "clamp(28px, 4vw, 52px)",
          color: "#0a0a0a",
          lineHeight: 0.9,
          textTransform: "uppercase",
          zIndex: 2,
        }}
      >
        A CREATIVE STUDIO
        <br />
        WHERE BRANDS AND
        <br />
        STORIES GET BUILT
      </div>

      <div
        className={spaceGroteskClass}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 48,
          borderTop: "1px solid rgba(0,0,0,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "rgba(0,0,0,0.4)",
          zIndex: 3,
        }}
      >
        <span>72PX | 54PT</span>
        <span>GOLD IDEAS SEEKERS</span>
        <span>REPUBLIC OF COLLABORATIVE MINDS</span>
        <span>16.1KM | 10MI</span>
      </div>

      <div
        className={spaceGroteskClass}
        style={{
          position: "absolute",
          bottom: 80,
          right: 24,
          width: 220,
          background: "#1a1a1a",
          borderRadius: 12,
          padding: 16,
          zIndex: 4,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 10,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.4)",
          }}
        >
          VIEW MORE
          <span>↻</span>
        </div>
        <div
          style={{
            fontSize: 9,
            color: "rgba(255,255,255,0.3)",
            marginTop: 12,
            textTransform: "uppercase",
          }}
        >
          LATEST PROJECT
        </div>
        <div style={{ fontSize: 28, fontWeight: 700, color: "#fff", marginTop: 4 }}>
          CURBSIDE
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 8,
            right: 8,
            width: 60,
            height: 60,
            background: "#333",
            borderRadius: "50%",
          }}
        />
      </div>
    </section>
  );
}
