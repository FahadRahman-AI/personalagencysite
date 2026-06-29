# STUDIO FX — AGENT DOCTRINE

> Read this before touching a single file. Every rule here exists because we broke something by ignoring it.

---

## 1. PROJECT TOPOLOGY

```
personalagencysite/          ← ROOT (Next.js 16, main site)
├── app/                     ← App Router — Server Components by default
├── components/
│   ├── sections/            ← Full-screen page sections (SectionOne–SectionSeven)
│   ├── CustomCursor.tsx     ← Dual-speed lerp cursor (dot + ring)
│   ├── LenisProvider.tsx    ← Smooth scroll, writes to zustand store
│   ├── SpringText.tsx       ← Per-word/char spring reveal component
│   ├── WipeOverlay.tsx      ← GSAP wipe transition between sections
│   ├── WireframeSphere.tsx  ← Thin wrapper (dynamic import, ssr:false)
│   └── WireframeSphereR3F.tsx ← Actual R3F + GLSL implementation
├── lib/
│   └── store.ts             ← Zustand global state (scroll, mouse, activeSection)
└── studio-fx-new/           ← SEPARATE Next.js project — has its own package.json
```

**`studio-fx-new/` is a completely separate Next.js app.** Never import across the boundary. The root `tsconfig.json` excludes it. Run its dev server with `npm --prefix studio-fx-new run dev`, not from the root.

---

## 2. ANIMATION DOCTRINE (non-negotiable)

### What we use
| Purpose | Tool | Location |
|---|---|---|
| All UI motion | `@react-spring/web` | `useSpring`, `useTrail`, `animated.*` |
| Text reveals | `SpringText.tsx` or inline `useTrail` | Per-word default, per-char for short strings |
| Smooth scroll | `lenis` via `LenisProvider` | Wraps entire page |
| Section transitions | `gsap` wipe | `WipeOverlay` + `triggerWipe()` in page.tsx |
| WebGL / 3D | `@react-three/fiber` + `@react-three/drei` | R3F Canvas, ssr:false |
| Global state | `zustand` | `lib/store.ts` — scrollY, scrollVelocity, mouseX, mouseY |

### What we never do
- **No CSS `transition:` on animated content.** Springs only. CSS transitions fight spring physics and produce judder.
- **No CSS `@keyframes` for entrance animations.** Use `useSpring` / `useTrail` with `delay`.
- **No `framer-motion`.** Not installed, not needed.
- **No `GSAP` for text or UI motion.** GSAP is reserved exclusively for the wipe transition in `WipeOverlay`.
- **No raw `Three.js` scene setup.** Always go through R3F (`@react-three/fiber`).

### Spring config reference
```ts
// Standard entrance (headline words)
config: { mass: 1, tension: 200, friction: 36 }

// Soft entrance (body text, buttons)
config: { mass: 1, tension: 180, friction: 40 }

// Snappy (interactive feedback)
config: { mass: 1, tension: 300, friction: 28 }
```

### Spring text pattern
```tsx
// Correct — spring trail per word
const trail = useTrail(words.length, {
  y: active ? 0 : 110,
  opacity: active ? 1 : 0,
  config: { mass: 1, tension: 200, friction: 36 },
  delay: active ? 80 : 0,
});

// Correct — clip trick in CSS
// .char-wrap { overflow: hidden }  ← hides the travel distance
// .char { will-change: transform, opacity }
```

---

## 3. COMPONENT ARCHITECTURE

### Server-first
Default to Server Components. Add `"use client"` only at the lowest possible leaf that needs browser APIs, event handlers, or hooks.

### Section pattern
Every section receives `isActive: boolean` and derives its animation trigger from it:
```tsx
useEffect(() => {
  if (isActive) {
    const t = setTimeout(() => setTriggered(true), 60);
    return () => clearTimeout(t);
  }
  setTriggered(false);  // reset when section leaves — allows re-entry animation
}, [isActive]);
```
**Do not remove the reset.** The wipe transition replays sections, so resetting on exit is intentional.

### WebGL components
Always wrap R3F Canvases in a thin `dynamic(() => import('./...'), { ssr: false })` shell component. The shell is importable anywhere; the R3F code never runs on the server.

```tsx
// WireframeSphere.tsx (shell — importable from Server Components)
export default function WireframeSphere({ isActive }: Props) {
  const R3F = dynamic(() => import('./WireframeSphereR3F'), { ssr: false });
  return <R3F isActive={isActive} />;
}
```

### Zustand store
The store is the single wire between Lenis, the cursor, and WebGL uniforms. Never read `window.scrollY` directly in a component — read `useAppStore((s) => s.scrollY)`.

```ts
// Reading in R3F (inside useFrame)
const mouseX = useAppStore((s) => s.mouseX);  // ✓

// Reading outside R3F
const velocity = useAppStore.getState().scrollVelocity;  // ✓ (non-reactive, fine in rAF)
```

---

## 4. GLSL SHADER CONVENTIONS

Feed all runtime values as uniforms — never bake them in:

```glsl
uniform float uTime;           // clock.getElapsedTime()
uniform float uMouseX;         // 0–1, normalised viewport
uniform float uMouseY;         // 0–1, normalised viewport
uniform float uScrollVelocity; // from lenis, lerped in useFrame
```

Always lerp uniforms inside `useFrame` to prevent jitter:
```ts
uniforms.uMouseX.value = THREE.MathUtils.lerp(uniforms.uMouseX.value, mouseX, 0.05);
```

Use `THREE.AdditiveBlending` + `depthWrite: false` on all particle systems.

---

## 5. CURSOR

The cursor has **two elements** — never collapse them to one:

| Element | Lerp | Role |
|---|---|---|
| `#cursor-dot` (6px solid) | `0.22` — fast | Precise pointer |
| `#cursor-ring` (36px border) | `0.09` — slow | Trailing emphasis, hover state |

On hover (`a, button, [data-hover]`): ring scales to `1.8×`, applies `mix-blend-mode: difference`.

Colour is section-aware — see `DOT_COLORS` / `RING_COLORS` arrays in `CustomCursor.tsx`. Update those arrays if sections are added or reordered.

**Never use CSS `cursor: none` on individual elements.** It's set globally via `html.custom-cursor-active *` in `globals.css`.

---

## 6. FILM GRAIN

The grain is a `#grain` div in the DOM with a fixed inset of `-50%` / `200%` and `animation: grain-shift 0.45s steps(1) infinite`. It is placed in `page.tsx` above all content and sits at `z-index: 9990`.

- **Opacity is `0.04`.** Do not raise it — it becomes a readability issue on light sections.
- **Do not replace with a canvas grain.** The SVG `feTurbulence` approach has zero JS cost.
- The grain div is in `page.tsx`, not in `layout.tsx`, because light-section pages should still show grain without it affecting future routes that might have a different aesthetic.

---

## 7. SECTION NAVIGATION

The site renders all 7 sections as `position: absolute` overlays inside a `position: fixed` viewport container. Scroll position on the `700vh` tall page ghost determines which section is active. The GSAP wipe (`triggerWipe`) fires on every section change.

**Never convert this to a traditional scroll layout.** The fixed-overlay + wipe pattern is the core design decision. If you need scroll within a section, implement it inside that section's container with `overflow-y: auto`.

Section index order:
```
0 — SectionOne   (#f0eeec light)
1 — SectionTwo   (#E8350A red)
2 — SectionThree (#ffffff white)
3 — SectionFour  (#0a0a0a dark, WireframeSphere)
4 — SectionFive  (#0a0a0a dark, panel carousel)
5 — SectionSix   (#080808 dark, CTA)
6 — SectionSeven (#f0eeec light, contact + form)
```

DOT_COLORS and RING_COLORS in `CustomCursor.tsx` mirror this order. Keep them in sync.

---

## 8. TYPOGRAPHY

Three fonts loaded in `page.tsx` (not layout — kept close to usage):

| Variable | Font | Usage |
|---|---|---|
| `anton.className` | Anton 400 | Hero headlines, large display type |
| `spaceGrotesk.className` | Space Grotesk 300/400/500/700 | UI, nav, body copy |
| `dmSans.className` | DM Sans 400/500/600/700 | Secondary body, metadata |

All strings live in `components/sections/site-copy.ts`. **Never hardcode brand name, email, or CTA copy in component files.** Import from `site-copy.ts`.

---

## 9. CONTACT FORM

- **Endpoint:** `app/api/contact/route.ts`
- **Transport:** Gmail SMTP via nodemailer (env vars: `GMAIL_USER`, `GMAIL_APP_PASSWORD`)
- **Client:** `SectionSeven.tsx` posts `{ name, email, service, message }` to `/api/contact`
- The form renders via `createPortal` into `document.body` — this is intentional to escape the fixed viewport stacking context

Do not add client-side email validation beyond `required` and `type="email"`. The API validates server-side.

---

## 10. BUILD RULES

```bash
# Main site
npm run build          # must pass with zero errors before any commit

# studio-fx-new (separate project)
npm --prefix studio-fx-new run build
```

- TypeScript strict mode is on. No `any` types, no `@ts-ignore` unless the comment explains exactly why.
- `@ts-expect-error` is only acceptable when the error genuinely cannot be fixed (dynamic JSX tag typing). Add a comment.
- The root `tsconfig.json` excludes `studio-fx-new/`. Do not remove that exclusion.

---

## 11. GIT

Active development branch: `claude/peaceful-mccarthy-7jwihs`

Commit message format:
```
feat(scope): short imperative description

- Bullet explaining the why, not the what
- Second bullet if needed

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

Push after every meaningful change. This is a remote cloud environment — uncommitted work is lost when the session ends.
