"use client";

import { useEffect, useState } from "react";
import styles from "./section-two.module.css";

interface SectionTwoProps {
  isActive: boolean;
  spaceGroteskClass: string;
}

type CellContent = {
  col: number;
  row: number;
  text?: string;
  cursor?: boolean;
  cursorWide?: boolean;
};

const CELL_CONTENT: CellContent[] = [
  { col: 1, row: 1, text: "WEBSITES\nAND" },
  { col: 3, row: 1, text: "AI" },
  { col: 8, row: 1, text: "BUILT\nFOR\nRESULTS" },
  { col: 2, row: 2, text: "YOUR\nCLIENTS" },
  { col: 5, row: 1, text: "EVER WANTED\nYOUR SITE TO\nLOOK A CERTAIN\nWAY?" },
  { col: 6, row: 2, text: "WHO" },
  { col: 3, row: 2, cursor: true },
  { col: 7, row: 1, cursor: true },
  { col: 8, row: 2, cursorWide: true },
  { col: 1, row: 3, text: "GOOD IS\nNOT WHERE\nWE STOP." },
  { col: 6, row: 3, text: "WILL" },
  { col: 8, row: 3, text: "LOVE" },
];

function getCellContent(col: number, row: number) {
  return CELL_CONTENT.find((c) => c.col === col && c.row === row);
}

export default function SectionTwo({
  isActive,
  spaceGroteskClass,
}: SectionTwoProps) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (isActive) {
      const t = setTimeout(() => setAnimated(true), 40);
      return () => clearTimeout(t);
    }
    setAnimated(false);
  }, [isActive]);

  const cells = [];
  for (let row = 1; row <= 3; row++) {
    for (let col = 1; col <= 8; col++) {
      cells.push({ col, row });
    }
  }

  return (
    <section
      style={{
        background: "#E8350A",
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        className={`${styles.grid} ${spaceGroteskClass} ${animated ? styles.gridVisible : ""}`}
      >
        {cells.map(({ col, row }, i) => {
          const content = getCellContent(col, row);
          return (
            <div
              key={`${col}-${row}`}
              className={`${styles.cell} ${content && animated ? styles.cellVisible : ""}`}
              style={{
                transitionDelay: content && animated ? `${0.05 * i}s` : "0s",
              }}
            >
              {content?.text?.split("\n").map((line, j, arr) => (
                <span key={j}>
                  {line}
                  {j < arr.length - 1 && <br />}
                </span>
              ))}
              {content?.cursor && <div className={styles.cursor} />}
              {content?.cursorWide && (
                <div className={styles.cursor} style={{ width: 4, height: 14 }} />
              )}
            </div>
          );
        })}
      </div>

      <div
        className={`${styles.brandWrap} ${spaceGroteskClass} ${styles.brand} ${animated ? styles.brandVisible : ""}`}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "clamp(60px, 9vw, 130px)",
          fontWeight: 700,
          color: "#fff",
          letterSpacing: "-0.02em",
          whiteSpace: "nowrap",
          zIndex: 2,
          display: "flex",
          alignItems: "center",
        }}
      >
        STUDIO FX
        <span className={styles.cursorLarge} />
      </div>
    </section>
  );
}
