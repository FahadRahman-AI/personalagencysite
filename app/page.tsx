"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { Anton, DM_Sans, Space_Grotesk } from "next/font/google";
import gsap from "gsap";
import CustomCursor from "@/components/CustomCursor";
import WipeOverlay from "@/components/WipeOverlay";
import SectionOne from "@/components/sections/SectionOne";
import SectionTwo from "@/components/sections/SectionTwo";
import SectionThree from "@/components/sections/SectionThree";
import SectionFour from "@/components/sections/SectionFour";
import SectionFive from "@/components/sections/SectionFive";
import SectionSix from "@/components/sections/SectionSix";
import SectionSeven from "@/components/sections/SectionSeven";
import styles from "./page.module.css";

const anton = Anton({
  subsets: ["latin"],
  weight: ["400"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const SECTION_COUNT = 7;

const DOT_COLORS = [
  "#0a0a0a",
  "#ffffff",
  "#0a0a0a",
  "#ffffff",
  "#0a0a0a",
  "#ffffff",
  "#0a0a0a",
];

function triggerWipe(callback: () => void) {
  const tl = gsap.timeline();
  tl.to("#wipe", {
    scaleX: 1,
    duration: 0.4,
    ease: "power3.inOut",
    transformOrigin: "left center",
  })
    .call(() => callback())
    .to("#wipe", {
      scaleX: 0,
      duration: 0.4,
      ease: "power3.inOut",
      transformOrigin: "right center",
    });
}

export default function Home() {
  const [activeSection, setActiveSection] = useState(0);
  const currentSectionRef = useRef(0);
  const isTransitioning = useRef(false);

  useEffect(() => {
    const isTouch =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches;

    if (!isTouch) {
      document.documentElement.classList.add("custom-cursor-active");
    }

    const handleScroll = () => {
      const index = Math.min(
        Math.floor(window.scrollY / window.innerHeight),
        SECTION_COUNT - 1,
      );

      if (
        index !== currentSectionRef.current &&
        index >= 0 &&
        index <= SECTION_COUNT - 1 &&
        !isTransitioning.current
      ) {
        isTransitioning.current = true;
        currentSectionRef.current = index;
        triggerWipe(() => {
          setActiveSection(index);
          isTransitioning.current = false;
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, []);

  const sectionStyle = useCallback(
    (index: number): CSSProperties => ({
      position: "absolute",
      inset: 0,
      opacity: activeSection === index ? 1 : 0,
      pointerEvents: activeSection === index ? "auto" : "none",
      zIndex: activeSection === index ? 1 : 0,
    }),
    [activeSection],
  );

  const dotColor = DOT_COLORS[activeSection] ?? "#0a0a0a";

  return (
    <div style={{ position: "relative", minHeight: "700vh" }}>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 10,
          overflow: "hidden",
        }}
      >
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <div style={sectionStyle(0)}>
            <SectionOne
              isActive={activeSection === 0}
              antonClass={anton.className}
              dmSansClass={dmSans.className}
            />
          </div>
          <div style={sectionStyle(1)}>
            <SectionTwo
              isActive={activeSection === 1}
              spaceGroteskClass={spaceGrotesk.className}
            />
          </div>
          <div style={sectionStyle(2)}>
            <SectionThree
              isActive={activeSection === 2}
              dmSansClass={dmSans.className}
            />
          </div>
          <div style={sectionStyle(3)}>
            <SectionFour
              isActive={activeSection === 3}
              spaceGroteskClass={spaceGrotesk.className}
              antonClass={anton.className}
            />
          </div>
          <div style={sectionStyle(4)}>
            <SectionFive
              isActive={activeSection === 4}
              spaceGroteskClass={spaceGrotesk.className}
              antonClass={anton.className}
            />
          </div>
          <div style={sectionStyle(5)}>
            <SectionSix
              spaceGroteskClass={spaceGrotesk.className}
              dmSansClass={dmSans.className}
            />
          </div>
          <div style={sectionStyle(6)}>
            <SectionSeven
              isActive={activeSection === 6}
              antonClass={anton.className}
              fontClass={spaceGrotesk.className}
            />
          </div>
        </div>

        {/* Section dots */}
        <div
          style={{
            position: "fixed",
            right: 20,
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            flexDirection: "column",
            gap: 10,
            zIndex: 100,
            pointerEvents: "none",
          }}
        >
          {Array.from({ length: SECTION_COUNT }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                border: `1px solid ${dotColor}`,
                background: activeSection === i ? dotColor : "transparent",
                transition: "background 0.3s ease, border-color 0.35s ease",
              }}
            />
          ))}
        </div>

        {/* Section counter */}
        <div
          className={spaceGrotesk.className}
          style={{
            position: "fixed",
            bottom: 32,
            left: 48,
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            color:
              activeSection === 1 ||
              activeSection === 3 ||
              activeSection === 5
                ? "rgba(255,255,255,0.45)"
                : "rgba(0,0,0,0.4)",
            zIndex: 100,
            transition: "color 0.35s ease",
            fontWeight: 500,
          }}
        >
          {String(activeSection + 1).padStart(2, "0")} / 07
        </div>

        {/* Scroll hint */}
        {activeSection === 0 && (
          <div
            className={dmSans.className}
            style={{
              position: "fixed",
              bottom: 32,
              right: 48,
              zIndex: 100,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              pointerEvents: "none",
            }}
          >
            <span
              style={{
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: "rgba(0,0,0,0.35)",
              }}
            >
              SCROLL
            </span>
            <span className={styles.scrollHintArrow} style={{ fontSize: 14, color: "rgba(0,0,0,0.35)" }}>
              ↓
            </span>
          </div>
        )}
      </div>

      <CustomCursor activeSection={activeSection} />
      <WipeOverlay />
    </div>
  );
}
