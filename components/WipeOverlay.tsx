"use client";

export default function WipeOverlay() {
  return (
    <div
      id="wipe"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#080808",
        pointerEvents: "none",
        transform: "scaleX(0)",
        transformOrigin: "left center",
      }}
    />
  );
}
