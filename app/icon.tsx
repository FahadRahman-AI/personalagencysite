import { ImageResponse } from "next/og";
import { BRAND } from "@/lib/site/seo";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/**
 * Generated favicon — accent tile with the studio's "FX" mark, legible
 * down to 16px. Uses satori's default face (no network fetch) so the
 * icon is instant and can never fail a build.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: BRAND.bg,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(circle at 30% 20%, ${BRAND.accent}88 0%, ${BRAND.accent}00 70%)`,
          }}
        />
        <div
          style={{
            fontSize: 34,
            fontWeight: 700,
            letterSpacing: -2,
            color: BRAND.ink,
            display: "flex",
          }}
        >
          F<span style={{ color: BRAND.accent }}>X</span>
        </div>
      </div>
    ),
    size
  );
}
