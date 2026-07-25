# Studio FX — Agent Brief

> Read this file first. It tells you where the project is, what needs doing, and how to work here without breaking things.

---

## What This Project Is

A premium agency portfolio site for **Studio FX** — a Visual Elevation Studio based in Birmingham, UK. The site's sole job is to make business owners want to book a free call. It is built in Next.js 16 / React 19, deployed as a static site. There is no CMS, no auth, no database. One page. Seven sections. One scroll journey.

**Owner:** Fahad Rahman (FahadRahman-AI on GitHub)
**Contact:** hello@studiofx.co
**Live URL:** not yet deployed

---

## Where Things Live

```
app/
  page.tsx              ← Master orchestrator. Scroll logic, wipe transition,
                          section mounting, dot navigation, section counter.
                          Touch this carefully — it controls everything.
  layout.tsx            ← Root layout, title/meta, Geist font vars
  globals.css           ← Reset, grain overlay, scrollbar hide, selection colour

components/
  CustomCursor.tsx      ← Framer Motion spring cursor (dot + trailing ring).
                          Expands on interactive elements. Only shows on non-touch.
  WipeOverlay.tsx       ← The #wipe div. GSAP animates it in page.tsx.
  ScrollThread.tsx      ← Left-edge scroll progress line + travelling dot + label.

  sections/
    site-copy.ts        ← ONLY place for BRAND + CTA strings. Never hardcode copy.
    section-entry.css   ← CSS timing variables (--section-entry-ease etc.)
    SectionOne.tsx      ← Hero: cream, blob, particle field, Anton headlines
    SectionTwo.tsx      ← Flabbergast: red, 8×3 grid, 3D tilt
    SectionThree.tsx    ← Services: dark interactive rows (AUDIT: wrong vs DS)
    SectionFour.tsx     ← Systems: dark, 3D particle sphere, data cluster
    SectionFive.tsx     ← Offer: dark panels + stats (AUDIT: should be white)
    SectionSix.tsx      ← CTA: dark, embers, pulse rings (AUDIT: should be San Rita map)
    SectionSeven.tsx    ← Contact: dark, physics particles, form (AUDIT: should be cream)
    nfiniteParticleCanvas.ts ← 3D particle sphere engine for SectionFour

.claude/
  agent-brief.md        ← This file
  design/design.md      ← Full design system. Read before touching any component.
  skills/copywriting.md ← Copy voice, rules, CTAs, banned words

.agents/skills/
  ux-designer/          ← Installed via npx skills add szilu/ux-designer-skill
  frontend-design/      ← Installed via npx -y skills add anthropics/skills
```

---

## Tech Stack

| Package | Version | Role |
|---|---|---|
| Next.js | 16.2.6 | Framework (App Router) |
| React | 19.2.4 | UI |
| GSAP | latest | Wipe transition between sections |
| Framer Motion | 12.41.0 | Cursor springs, nav hover, form overlay, CTA magnetic |
| Tailwind CSS | v4 | Utility classes (used minimally) |
| Resend | latest | Email delivery for contact form (`/api/contact`) |
| TypeScript | strict | Full type checking |

**Important:** The design system (`design.md`) says "No animation libraries except GSAP." Framer Motion was added in a later session despite this rule. This conflict is documented in the audit. Do not add more animation libraries.

---

## How The Site Works

### Scroll architecture
- The `<body>` is `700vh` tall (7 sections × 100vh)
- All 7 sections are mounted simultaneously in a fixed container
- `window.scrollY / window.innerHeight` → `activeSection` (0–6 integer)
- Only the active section has `opacity: 1` and `pointerEvents: auto`
- Section changes trigger a GSAP wipe: black div scaleX `0→1→0`, ~0.56s total
- `isTransitioning` ref prevents rapid section skipping

### Section entry pattern (consistent across all sections)
```tsx
const [animated, setAnimated] = useState(false);
useEffect(() => {
  if (isActive) {
    const t = setTimeout(() => setAnimated(true), 80); // 80ms after wipe clears
    return () => clearTimeout(t);
  }
  setAnimated(false); // instant reset — wipe covers it
}, [isActive]);
```

### Fonts (loaded in page.tsx, passed as className props)
- `antonClass` — Anton 400. Display/hero headlines only.
- `spaceGroteskClass` — Space Grotesk 300/400/500/700. All UI text.
- `dmSansClass` — DM Sans 400/500/600/700. **LEGACY — not in design system. Being phased out.**

### Shared strings
**Never hardcode copy.** All brand/CTA strings live in `site-copy.ts`:
```ts
BRAND.name, BRAND.est, BRAND.email, BRAND.location, BRAND.worldwide
CTA.bookCall         // "BOOK YOUR FREE ELEVATION CALL →"
CTA.bookCallShort    // "ELEVATION CALL ↗"
CTA.noObligation     // "30 minutes. No commitment. Just vision."
CTA.sendBrief        // "Send a brief →"
```

---

## Current State vs Design System

A full audit was run comparing all sections against `.claude/design/design.md`. Summary of gaps:

| Section | Status | Key Issue |
|---|---|---|
| SectionOne (Hero) | Minor gaps | DM Sans → Space Grotesk; blob 520px → 580px; italic on "never heard of us?" |
| SectionTwo (Flabbergast) | Missing layout | No top bar, no bottom-left/right content per DS rules |
| SectionThree (Services) | Wrong section | Should be cream + blob + Anton headlines "SOMETHING / LIKE THIS?", not dark service cards |
| SectionFour (Dark/Particles) | Partial | Wrong BG (#282828 not radial), wrong copy ("BACKEND THAT SHIPS" → "WHAT / ABOUT THIS?"), YOUTUBE/BEHANCE links violate social rule |
| SectionFive (Panels) | Background wrong | Should be white (#ffffff), was flipped to dark in error. Stats/colours need inversion. |
| SectionSix (CTA) | Wrong section | Should be San Rita/Map (#d8dde0, cartographic, Anton "A VISUAL / ELEVATION / STUDIO.") |
| SectionSeven (Contact) | Wrong colour + font | Should be cream (#f0eeec) + blob + Anton "GET IN / TOUCH.", not dark with Space Grotesk |

**Full audit report** is in the conversation history of June 2026.

---

## Known Violations (do not introduce more)

1. **DM Sans** — not in design system font stack (Anton + Space Grotesk only). Loaded in page.tsx, passed to S1/S6/S7. Replace with `spaceGroteskClass` when touching those components.

2. **Framer Motion** — DS §10 says GSAP only. FM is used in: `CustomCursor`, `SectionOne` (nav hover), `SectionThree` (AnimatePresence), `SectionSix` (magnetic button), `SectionSeven` (form overlay). Flag before adding more FM usage.

3. **YOUTUBE, BEHANCE, PORTFOLIO links in SectionFour** — DS §12 rule 9: only INSTAGRAM and LINKEDIN allowed. Remove when touching S4.

4. **Section 0 (Opening Gate) missing** — DS defines a pre-loader question screen as Section 0. Not built.

5. **Cursor spec drift** — DS says 8px, mix-blend-mode difference, expands to 24px. Current is 7px dot + 32px trailing ring, expands to 58px, no blend mode.

---

## Rules For Working Here

### Before writing any code
1. Read `.claude/design/design.md` in full — it overrides all defaults
2. Check `site-copy.ts` before writing any user-facing string
3. Check `.claude/skills/copywriting.md` before writing any copy
4. Never introduce a new colour not in the palette
5. Never introduce a new font

### Font usage
```tsx
// CORRECT
<h1 className={antonClass}>HEADLINE</h1>
<p className={spaceGroteskClass}>Body text and UI</p>

// WRONG — DM Sans is not in the design system
<p className={dmSansClass}>...</p>
```

### Copy rules (quick reference)
- Primary CTA: "Book a free elevation call" / "BOOK YOUR FREE ELEVATION CALL →"
- Never say "AI" — say "smart systems" or "automated workflows"
- Never say "synergy", "optimize", "transform", "innovative"
- Headlines under 8 words. Body under 40 words per paragraph. Labels always uppercase.

### Section layout requirements (every section)
Every section must have:
- A **top bar** with exactly **3 labels** (brand info, section label, location/reach)
- **Bottom-left** body text
- **Bottom-right** navigation links

### Canvas / animation performance
- Always cap DPR: `Math.min(window.devicePixelRatio, 2)`
- Always cancel RAF and remove listeners on unmount
- `passive: true` on all scroll listeners
- `willChange: transform` on all animated elements

### Social links
Only **INSTAGRAM** and **LINKEDIN** are permitted. No YouTube, TikTok, Twitter, Behance, etc.

---

## Running The Project

```bash
npm run dev        # Start dev server (localhost:3000)
npm run build      # Production build — always check this passes
npx tsc --noEmit   # Type check only
```

The build must pass before committing. TypeScript is strict.

---

## Installed Skills

| Skill | Trigger |
|---|---|
| `/copywriting` | `.claude/skills/copywriting.md` — copy audit and rewrites |
| `/ux-designer` | `.agents/skills/ux-designer/` — UX/accessibility review |
| `/frontend-design` | `.claude/skills/frontend-design/` — component design |

---

## Priority Work Queue

In order of impact for the site's conversion goal (getting business owners to book a call):

1. **Rebuild SectionThree** — must match DS spec: cream + blob + Anton bleeding headlines + bottom layout
2. **Rebuild SectionSix** — must match DS spec: San Rita/Map (#d8dde0, cartographic aesthetic)
3. **Rebuild SectionSeven** — cream background, blob, Anton "GET IN / TOUCH.", correct particles
4. **Fix SectionFive** — revert to white background, fix all colour tokens
5. **Add top bar + bottom layout to SectionTwo** — missing required layout elements
6. **Fix SectionFour** — background to #282828, remove banned social links, update copy
7. **Fix SectionOne** — replace DM Sans with Space Grotesk, add italic to "never heard of us?"
8. **Build Section 0** — Opening Gate pre-loader (lowest priority, no conversion impact yet)
9. **Cursor spec alignment** — bring in line with DS (8px, mix-blend-mode, 24px expand)

---

## What Not To Touch Without Asking

- `app/page.tsx` scroll/wipe logic — it's fragile. Change props passing or colours; don't rewrite the scroll mechanism.
- `nfiniteParticleCanvas.ts` — complex 3D engine, leave alone unless specifically tasked.
- `components/ScrollThread.tsx` — works perfectly, no changes needed.
- `components/WipeOverlay.tsx` — tiny, correct, leave it.
- `/api/contact` route — live email sending via Resend. Don't break the payload shape.
