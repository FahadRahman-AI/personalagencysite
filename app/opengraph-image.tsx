import { ImageResponse } from "next/og";
import { SITE, BRAND } from "@/lib/site/seo";

export const alt = "Studio FX® — AI Infrastructure Studio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Load a Google font as raw TTF for satori. satori cannot parse woff2 (our
 * local brand faces), so we pull the TTF the css2 endpoint serves to a
 * default UA. Wrapped so a network failure degrades to satori's default
 * font instead of failing the render — the OG image must never 500.
 */
async function loadFont(
  family: string,
  weight: number,
  text: string
): Promise<ArrayBuffer | null> {
  try {
    const q = new URLSearchParams({
      family: `${family}:wght@${weight}`,
      text,
    });
    const cssRes = await fetch(
      `https://fonts.googleapis.com/css2?${q.toString()}`,
      { headers: { "User-Agent": "Mozilla/5.0" } }
    );
    if (!cssRes.ok) return null;
    const css = await cssRes.text();
    const url = css.match(/src:\s*url\((.+?)\)/)?.[1];
    if (!url) return null;
    const fontRes = await fetch(url);
    if (!fontRes.ok) return null;
    return await fontRes.arrayBuffer();
  } catch {
    return null;
  }
}

export default async function Image() {
  const displayText = "StudioFX®Builttonevermiss.";
  const monoText = "AIINFRASTRUCTURESTUDIO—EST.2024studiofx";

  const [display, mono] = await Promise.all([
    loadFont("Familjen+Grotesk", 600, displayText),
    loadFont("Martian+Mono", 400, monoText),
  ]);

  const fonts = [
    display && { name: "Display", data: display, weight: 600 as const, style: "normal" as const },
    mono && { name: "Mono", data: mono, weight: 400 as const, style: "normal" as const },
  ].filter(Boolean) as { name: string; data: ArrayBuffer; weight: 600 | 400; style: "normal" }[];

  const displayFamily = display ? "Display" : "sans-serif";
  const monoFamily = mono ? "Mono" : "monospace";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: BRAND.bg,
          position: "relative",
        }}
      >
        {/* Accent glow — off-canvas radial, the site's signature warmth */}
        <div
          style={{
            position: "absolute",
            top: -260,
            right: -180,
            width: 760,
            height: 760,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${BRAND.accent}59 0%, ${BRAND.accent}00 62%)`,
          }}
        />
        {/* Cool counter-glow, lower-left, for depth */}
        <div
          style={{
            position: "absolute",
            bottom: -320,
            left: -200,
            width: 720,
            height: 720,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(90,120,255,0.14) 0%, rgba(90,120,255,0) 60%)",
          }}
        />

        {/* Top row — wordmark + status dot */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontFamily: monoFamily,
              fontSize: 22,
              letterSpacing: 4,
              color: BRAND.inkDim,
            }}
          >
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: BRAND.accent }} />
            STUDIO FX®
          </div>
          <div
            style={{
              fontFamily: monoFamily,
              fontSize: 20,
              letterSpacing: 3,
              color: BRAND.inkFaint,
            }}
          >
            EST. 2024
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontFamily: displayFamily,
              fontSize: 132,
              lineHeight: 1.02,
              letterSpacing: -3,
              color: BRAND.ink,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Built to</span>
            <span>
              never <span style={{ color: BRAND.accent }}>miss.</span>
            </span>
          </div>
        </div>

        {/* Bottom meta row */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            fontFamily: monoFamily,
            fontSize: 22,
            letterSpacing: 3,
          }}
        >
          <div style={{ color: BRAND.inkDim, maxWidth: 720, lineHeight: 1.5 }}>
            AI INFRASTRUCTURE STUDIO — LEAD ENGINES, WORKFLOW SYSTEMS &amp; INTELLIGENT WEBSITES.
          </div>
          <div style={{ color: BRAND.ink }}>
            {SITE.url.replace(/^https?:\/\//, "")}
          </div>
        </div>
      </div>
    ),
    { ...size, ...(fonts.length > 0 ? { fonts } : {}) }
  );
}
