"use client";

import { useEffect, useState } from "react";
import styles from "./section-three.module.css";

interface SectionThreeProps {
  isActive: boolean;
  dmSansClass: string;
}

const HEADLINE_LINES = ["Or maybe", "something", "like this?"];

export default function SectionThree({
  isActive,
  dmSansClass,
}: SectionThreeProps) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (isActive) {
      const t = setTimeout(() => setAnimated(true), 40);
      return () => clearTimeout(t);
    }
    setAnimated(false);
  }, [isActive]);

  return (
    <section
      style={{
        background: "#ffffff",
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <nav
        className={dmSansClass}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 64,
          padding: "0 48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 2,
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 600, color: "#0a0a0a" }}>
          STUDIO FX
        </span>
        <div style={{ display: "flex", gap: 40 }}>
          {["Services", "Projects", "About"].map((link) => (
            <span key={link} style={{ fontSize: 14, color: "#444", cursor: "pointer" }}>
              {link}
            </span>
          ))}
        </div>
        <button
          type="button"
          style={{
            background: "#0a0a0a",
            color: "#fff",
            fontSize: 13,
            padding: "10px 24px",
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          Contact us
        </button>
      </nav>

      <div
        className={`${styles.hero} ${dmSansClass}`}
        style={{
          display: "flex",
          padding: "120px 48px 0",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div className={styles.leftCol} style={{ width: "55%" }}>
          <h1 style={{ margin: 0 }}>
            {HEADLINE_LINES.map((line, i) => (
              <span
                key={line}
                className={`${styles.line} ${animated ? styles.lineVisible : ""}`}
                style={{
                  display: "block",
                  fontSize: "clamp(36px, 4vw, 56px)",
                  fontWeight: 400,
                  color: "#0a0a0a",
                  lineHeight: 1.25,
                  transitionDelay: animated ? `${i * 0.1}s` : "0s",
                }}
              >
                {line}
              </span>
            ))}
          </h1>
        </div>

        <div
          className={styles.rightCol}
          style={{
            width: "45%",
            paddingLeft: 80,
            paddingTop: 40,
          }}
        >
          <p
            className={`${styles.line} ${animated ? styles.lineVisible : ""}`}
            style={{
              fontSize: 14,
              color: "#666",
              lineHeight: 1.7,
              maxWidth: 320,
              margin: 0,
              transitionDelay: animated ? "0.3s" : "0s",
            }}
          >
            Conversion-focused. Built to make your customers trust you in under
            three seconds. Clean enough to let your product do the talking.
          </p>
          <p
            className={`${styles.line} ${animated ? styles.lineVisible : ""}`}
            style={{
              fontSize: 11,
              color: "#999",
              marginTop: 16,
              marginBottom: 0,
              letterSpacing: "0.04em",
              transitionDelay: animated ? "0.35s" : "0s",
            }}
          >
            Clean · Professional · Converting
          </p>
          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 24,
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              style={{
                background: "#0a0a0a",
                color: "#fff",
                fontSize: 13,
                padding: "12px 28px",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
              }}
            >
              Contact us
            </button>
            <button
              type="button"
              style={{
                background: "transparent",
                border: "1px solid #ddd",
                color: "#0a0a0a",
                fontSize: 13,
                padding: "12px 28px",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              View projects
            </button>
          </div>
        </div>
      </div>

      <div
        className={`${styles.imageSection} ${animated ? styles.imageVisible : ""}`}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "45vh",
          background:
            "linear-gradient(135deg, #c8e6c9 0%, #b3d4b5 20%, #a8cc9e 40%, #d4e8a0 60%, #e8f0b0 80%, #f0f4c0 100%)",
          overflow: "hidden",
        }}
      >
        <div
          className={dmSansClass}
          style={{
            position: "absolute",
            bottom: 20,
            left: 48,
            fontSize: 11,
            color: "rgba(0,0,0,0.45)",
            letterSpacing: "0.04em",
          }}
        >
          Minimal · Editorial · Considered
        </div>
        <div
          className={dmSansClass}
          style={{
            position: "absolute",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "clamp(80px, 12vw, 160px)",
            fontWeight: 700,
            color: "rgba(255,255,255,0.5)",
            whiteSpace: "nowrap",
            lineHeight: 1,
            textAlign: "center",
          }}
        >
          SOMETHING
          <br />
          LIKE THIS?
        </div>
      </div>
    </section>
  );
}
