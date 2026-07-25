# STUDIO FX — AGENT DOCTRINE

> Read this before touching a single file. Every rule here exists because we broke something by ignoring it.

---

## 1. PROJECT TOPOLOGY

```
personalagencysite/              ← REPO ROOT — this IS the Next.js app
├── app/                         ← App Router (Next.js 16, Turbopack)
│   ├── contact/page.tsx         ← /contact route (ContactPage component)
│   ├── opengraph-image.tsx      ← OG image generation (satori/ImageResponse)
│   ├── twitter-image.tsx        ← re-exports opengraph-image
│   ├── icon.tsx                 ← favicon generation (ImageResponse)
│   ├── layout.tsx               ← Root layout, font loading, SEO metadata
│   ├── globals.css              ← Design system — all CSS vars + section styles
│   └── page.tsx                 ← Home route → renders <Site />
├── components/
│   └── site/
│       ├── Site.tsx             ← Client root: Lenis, theme-wipe, preloader
│       ├── Nav.tsx              ← Fixed nav, scroll-aware
│       ├── Cursor.tsx           ← Dual-speed lerp cursor (dot + ring)
│       ├── HeroLines.tsx        ← Pluckable SVG lines on the hero
│       ├── ContactPage.tsx      ← /contact full-page form
│       └── sections/
│           ├── Hero.tsx         ← Dark, chrome monogram, cycling headline
│           ├── About.tsx        ← Dark, word-by-word scroll reveal
│           ├── Marquee.tsx      ← Light, scrolling text belt
│           ├── Showreel.tsx     ← Dark, 500vh sticky GLSL cinema section
│           ├── KeyFacts.tsx     ← Light, tilted parallax stat cards
│           ├── FoundingOffer.tsx ← Light, dimension.dev-style spec document
│           ├── Engine.tsx       ← Light→Dark, services typography + stone monogram
│           ├── Stories.tsx      ← Light, industry outcome carousel
│           ├── Ribbon.tsx       ← Dark, 3D curved poster gallery
│           └── Footer.tsx       ← Dark, animated wordmark + contact rail
├── lib/
│   └── site/
│       ├── seo.ts               ← SSOT for site identity, canonical URL, brand tokens
│       ├── MonogramScene.ts     ← Three.js chrome/stone FX monogram
│       ├── ReelScene.ts         ← GLSL3 five-chapter procedural cinema
│       ├── RibbonScene.ts       ← Three.js curved 3D poster gallery
│       └── audio.ts             ← Tick sound for footer interaction
└── public/                      ← Static assets (fonts served from app/fonts/)
```

**There is no `studio-fx-new/` subdirectory.** It was the project; it is now the root.

---

## 2. ANIMATION DOCTRINE (non-negotiable)

### What we use

| Purpose | Tool | Notes |
|---|---|---|
| All UI scroll animation | `gsap` + `ScrollTrigger` | `fromTo`, `scrub`, `once: true` |
| Smooth scroll | `lenis` wired into GSAP ticker | `lenis.on('scroll', ScrollTrigger.update)` |
| 3D / WebGL | Raw `three` (not R3F) | Direct renderer, rAF loop, IntersectionObserver lifecycle |
| GLSL shaders | GLSL3 via `THREE.ShaderMaterial` | `glslVersion: THREE.GLSL3`, `out vec4 fragColor` |
| Preloader counter | `requestAnimationFrame` in `Site.tsx` | Fires `sfx:intro` event when done |
| CSS entrance | Keyframes only for the loader panels | No keyframes on content |

### What we never do

- **No `@react-spring/web`.** Not installed.
- **No `framer-motion`.** Not installed.
- **No `zustand`.** Not installed. Scroll/mouse state lives in the Three.js uniform pipeline, not a store.
- **No `@react-three/fiber`.** Three.js is used directly.
- **No `r3f` Canvases.** All WebGL is a raw `<canvas>` owned by a TypeScript class.
- **No CSS `transition:` on animated content** — springs/GSAP only prevents judder.
- **No `gl_FragColor`** in shaders — we use GLSL3, so output is `out vec4 fragColor`.

### GLSL3 conventions

```glsl
precision highp float;
out vec4 fragColor;              /* NOT gl_FragColor */
uniform float uTime;
uniform float uProgress;
uniform vec2  uRes;              /* drawing-buffer pixels — NOT CSS layout pixels */
uniform vec3  uAccent;

/* 1px AA line at d==0 */
float crisp(float d) { float w = fwidth(d) * 1.2; return smoothstep(w, 0.0, abs(d)); }
```

`uRes` must be set via `renderer.getDrawingBufferSize()` — never `canvas.width/height`.

---

## 3. COMPONENT ARCHITECTURE

### Client boundary

`'use client'` goes on the lowest leaf that needs browser APIs or hooks. All section
components are client because they use GSAP + `useRef`. `layout.tsx`, `page.tsx`, and
`app/contact/page.tsx` are Server Components.

### Three.js scene lifecycle pattern

Every scene lives in a class (`MonogramScene`, `ReelScene`, `RibbonScene`) with:
- `start()` / `stop()` driven by `IntersectionObserver` — never runs off-screen
- `dispose()` called on component unmount (geometry, material, renderer)
- `resize()` wired to `window.resize` inside the class, removed in `dispose()`

### Theme wipe system

`data-theme-section="dark|light"` on each `<section>`. `Site.tsx` creates a
`ScrollTrigger` per section that toggles `document.documentElement.dataset.theme`
as the section crosses 52% of the viewport. The `body` CSS transition handles the
background/color crossfade. No JS color interpolation needed.

---

## 4. SEO & METADATA

Single source of truth: `lib/site/seo.ts` exports `SITE` (identity tokens) and `BRAND`
(design tokens mirrored from `:root` CSS vars).

- URL resolution: `NEXT_PUBLIC_SITE_URL` → `VERCEL_PROJECT_PRODUCTION_URL` → `VERCEL_URL` → localhost
- OG/twitter images: `app/opengraph-image.tsx` (satori `ImageResponse`). Font loading is
  network-optional — if Google Fonts fetch fails, satori renders with system font rather
  than crashing. The `fonts` option is only passed when at least one font loaded.
- Structured data: `Organization` JSON-LD injected in `layout.tsx` body.

---

## 5. CONTACT

- **Form:** `components/site/ContactPage.tsx` — client-side only for now. No backend wired.
- **Email:** `fahadrahman9819@gmail.com` is the live contact address. No `hello@studiofx.co` anywhere.
- **CTA links:** All `mailto:` hrefs across sections point to `fahadrahman9819@gmail.com`.

---

## 6. DESIGN SYSTEM

Defined entirely in `app/globals.css`. Key tokens:

```css
:root {
  --accent:    #ff5a26;
  --bg:        #040508;       /* dark default */
  --ink:       #e9ecf3;
  --ink-dim:   rgba(233,236,243,0.6);
  --ink-faint: rgba(233,236,243,0.34);
  --hairline:  rgba(233,236,243,0.16);
  --card:      #0c0d12;
}
html[data-theme='light'] {
  --bg:        #e8e6e1;
  --ink:       #0b0c10;
  --ink-dim:   rgba(11,12,16,0.62);
  --ink-faint: rgba(11,12,16,0.38);
  --hairline:  rgba(11,12,16,0.16);
  --card:      #f4f2ee;
}
```

Fonts (CSS variables set by `next/font`):
- `--font-display` → Familjen Grotesk (Google)
- `--font-mono`    → Martian Mono (Google)
- `--font-body`    → Switzer (local, Fontshare)
- `--font-serif`   → Zodiak italic (local, Fontshare)

---

## 7. CURSOR

Two elements — never collapse:

| Element | Lerp | Role |
|---|---|---|
| `.cursorDot` (6px) | 0.22 — fast | Precise pointer |
| `.cursorRing` (36px border) | 0.09 — slow | Trailing emphasis |

On `[data-hover]` elements: ring scales to `1.8×`, applies `mix-blend-mode: difference`.
`data-cursor-label="TEXT"` on links renders a text label inside the ring.
`html.hasCursor` class activates `cursor: none` globally via CSS.

---

## 8. BUILD RULES

```bash
npm run build          # must pass with zero TS errors before any commit
npm run dev            # Turbopack dev server — fast HMR
```

- TypeScript strict mode. No `any`. No `@ts-ignore` without an explanation comment.
- Zero TODO/FIXME comments in committed code. If something is deferred, track it
  outside the codebase (this document, or a separate brief).
- OG image font loading is network-optional by design — never call `process.exit` or
  throw from a route segment.

---

## 9. GIT

Working branch for active development: `fix-vercel-root` (tracks `main`).

```
feat(scope): short imperative description

- Why, not what
- Second bullet if needed

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

Push after every meaningful change. Remote is the source of truth.
