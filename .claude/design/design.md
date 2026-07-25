# Studio FX — Complete Design System
# This file is the single source of truth for all visual decisions.
# Claude Code must read this file before touching any component, page, or style.

---

## 1. BRAND IDENTITY

**Studio Name:** Studio FX
**Positioning:** Visual Elevation Studio
**Tagline:** "We make your business look like it raised a Series A."
**Location:** Birmingham, UK
**Reach:** Worldwide
**Email:** hello@studiofx.co
**Year:** Est. 2024

---

## 2. COLOUR SYSTEM

### Primary Palette
--color-black:        #080808   /* True black — page background for dark sections */
--color-off-black:    #0a0a0a   /* Slightly lifted black — cards, overlays */
--color-cream:        #f0eeec   /* Warm cream — light section backgrounds */
--color-white:        #f5f2ee   /* Warm off-white — text on dark backgrounds */
--color-pure-white:   #ffffff   /* Pure white — light section backgrounds */

### Accent Palette
--color-red:          #E8350A   /* Studio FX red — primary accent, CTAs, Flabbergast section */
--color-red-hover:    #c42d08   /* Red hover state */
--color-amber:        #E8520a   /* Warm amber — blob gradient start, "never heard of us?" text */
--color-gold:         #c8a030   /* Coffee gold — blob gradient mid, rim lighting */
--color-orange:       #ff8c20   /* Orange — blob gradient end */
--color-electric:     #4AF0A4   /* Electric green — tech section accents, submit button hover */
--color-blue-accent:  #6496ff   /* Blue — particle system, wireframe lines */

### Text Colours
--color-text-primary:    #0a0a0a              /* Dark sections: #f5f2ee */
--color-text-secondary:  rgba(0,0,0,0.5)      /* Dark sections: rgba(255,255,255,0.4) */
--color-text-muted:      rgba(0,0,0,0.3)      /* Dark sections: rgba(255,255,255,0.25) */
--color-text-label:      rgba(0,0,0,0.35)     /* Small uppercase labels */

### Border Colours
--color-border-light:    #ebebeb              /* Light section borders */
--color-border-dark:     rgba(255,255,255,0.06) /* Dark section borders */
--color-border-mid:      rgba(255,255,255,0.12) /* Form field borders */

---

## 3. TYPOGRAPHY SYSTEM

### Font Stack
Display/Hero:    Anton (Google Fonts) — weight 400 only
                 Used for: massive bleeding headlines, section numbers
Primary UI:      Space Grotesk (Google Fonts) — weights 300, 400, 500, 600, 700
                 Used for: all body text, labels, navigation, buttons, UI elements
Accent Italic:   Space Grotesk 300 italic
                 Used for: "never heard of us?" and similar understated accent lines

### Type Scale
/* Display — bleeds off screen edges */
--type-display:     clamp(96px, 13vw, 190px)   /* Hero bleeding headlines */
--type-hero:        clamp(80px, 11vw, 170px)    /* Section hero headlines */
--type-xl:          clamp(64px, 9vw, 140px)     /* Large section headlines */
--type-2xl:         clamp(48px, 7vw, 100px)     /* Medium display */
/* Content */
--type-heading-1:   clamp(32px, 5vw, 72px)     /* Opening gate headline */
--type-heading-2:   clamp(28px, 4vw, 52px)     /* Section content headlines */
--type-heading-3:   clamp(22px, 3vw, 36px)     /* Sub-section headings */
/* Body */
--type-body-lg:     18px                        /* Large body text */
--type-body:        15px                        /* Standard body */
--type-body-sm:     13px                        /* Small body, button text */
--type-label:       11px                        /* All uppercase labels */
--type-micro:       10px                        /* Meta information, data labels */
--type-tiny:        9px                         /* Scroll hints, smallest labels */

### Typography Rules
- All display headlines: Anton, uppercase, line-height 0.85–0.95
- All labels: Space Grotesk, uppercase, letter-spacing 0.15–0.2em
- Body text: Space Grotesk 400, line-height 1.7–1.9
- Button text: Space Grotesk 600, uppercase, letter-spacing 0.1–0.15em
- Never mix Anton and Bebas Neue — Anton only
- Italic accent text: Space Grotesk 300 italic, mixed case
- Headlines that bleed: left: -4px to -8px, white-space: nowrap
- Second headline line always offset right by 40–80px from first line

---

## 4. SPACING SYSTEM
--space-xs:    8px
--space-sm:    16px
--space-md:    24px
--space-lg:    32px
--space-xl:    48px
--space-2xl:   64px
--space-3xl:   80px
--space-4xl:   120px
--space-5xl:   160px
--space-6xl:   200px

/* Section padding */
Desktop sections:  160px vertical, 48px horizontal
Mobile sections:   80px vertical, 24px horizontal
Top bars:          24px vertical, 32px horizontal

---

## 5. COMPONENT LIBRARY

### Buttons
/* Primary — filled */
background: #0a0a0a
color: #f5f2ee
font: Space Grotesk 600 13px uppercase letter-spacing 0.1em
padding: 18px 48px
border-radius: 100px
hover: background #222222
transition: all 200ms ease

/* Primary Red */
background: #E8350A
color: #ffffff
Same sizing as above
hover: background #c42d08
hover box-shadow: 0 0 20px rgba(232,53,10,0.4)

/* Ghost — outlined dark */
background: transparent
border: 1px solid rgba(0,0,0,0.2)
color: #0a0a0a
Same sizing
hover: background #0a0a0a, color #f5f2ee

/* Ghost — outlined light (on dark backgrounds) */
background: transparent
border: 1px solid rgba(255,255,255,0.2)
color: #ffffff
hover: background #ffffff, color #080808

/* Text link */
color: #0a0a0a
border-bottom: 1px solid #0a0a0a
padding-bottom: 2px
No border-radius, no background
hover: opacity 0.6

### Form Fields
background: transparent
border: none
border-bottom: 1px solid rgba(255,255,255,0.12)  /* light sections: rgba(0,0,0,0.12) */
outline: none
padding: 20px 0
font: Space Grotesk 15px
color: inherit
caret-color: currentColor
placeholder: rgba(255,255,255,0.3)  /* light: rgba(0,0,0,0.3) */
focus border-bottom: rgba(255,255,255,0.6)  /* light: rgba(0,0,0,0.6) */
transition: border-color 200ms ease

### Labels / Tags
font: Space Grotesk 10–11px uppercase letter-spacing 0.15–0.2em
color: rgba(0,0,0,0.35) on light  /  rgba(255,255,255,0.35) on dark
No background, no border
Always positioned with consistent left alignment

### Pill Tags (red accent)
background: #E8350A
color: #ffffff
font: Space Grotesk 700 10px uppercase
padding: 3px 10px
border-radius: 100px
Used sparingly — maximum 2 per section

### Cards
background: rgba(255,255,255,0.03)  /* on dark */
border: 1px solid rgba(255,255,255,0.08)
border-radius: 12px
padding: 16px 20px
hover border: rgba(255,255,255,0.15)
transition: border-color 200ms ease

### Dividers
Horizontal: height 1px, background rgba(0,0,0,0.08) on light / rgba(255,255,255,0.06) on dark
Gradient divider: linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)
Never use solid opaque dividers

---

## 6. ANIMATION SYSTEM

### Easing Curves
--ease-smooth:    cubic-bezier(0.76, 0, 0.24, 1)   /* Section wipe transitions */
--ease-spring:    cubic-bezier(0.34, 1.56, 0.64, 1) /* Scale/hover with overshoot */
--ease-out:       cubic-bezier(0.33, 1, 0.68, 1)    /* Content reveals */
--ease-in-out:    cubic-bezier(0.65, 0, 0.35, 1)    /* Morphing animations */

### Duration Standards
--dur-instant:    100ms    /* Colour/opacity micro-transitions */
--dur-fast:       200ms    /* Button hovers, border changes */
--dur-standard:   400ms    /* Content reveals, image hovers */
--dur-slow:       600ms    /* Section entries, overlay opens */
--dur-cinematic:  800ms    /* Page transitions, wipe effects */
--dur-dramatic:   1000ms   /* Hero reveals, dramatic entrances */

### Standard Entry Animation
```css
/* All content enters with this pattern */
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
duration: 600–800ms
easing: cubic-bezier(0.33, 1, 0.68, 1)
stagger between elements: 80–120ms
trigger: IntersectionObserver at 20% visibility
```

### Headline Entry Animation
```css
/* Bleeding headlines slide in from edges */
Line 1: translateX(-80px) opacity 0 → translateX(0) opacity 1
Line 2: translateX(80px) opacity 0 → translateX(0) opacity 1
Duration: 700ms
Easing: --ease-out
Delay between lines: 100ms
```

### Section Wipe Transition
```css
/* Between sections — black panel sweeps across */
Overlay: position fixed, inset 0, background #080808, z-index 9999
Forward: scaleX 0→1 (0.45s ease-in, transform-origin left)
         then scaleX 1→0 (0.45s ease-out, transform-origin right)
Total: 0.9s
```

### Blob Animation
```css
@keyframes blobMorph {
  0%   { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40% }
  25%  { border-radius: 40% 60% 50% 50% / 30% 60% 40% 70% }
  50%  { border-radius: 30% 70% 60% 40% / 50% 40% 60% 30% }
  75%  { border-radius: 50% 50% 40% 60% / 40% 50% 50% 60% }
  100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40% }
}
duration: 8s ease-in-out infinite

@keyframes blobRotate {
  from { transform: rotate(0deg) }
  to   { transform: rotate(360deg) }
}
duration: 25s linear infinite
```

### Marquee Animation
```css
@keyframes marquee {
  from { transform: translateX(0) }
  to   { transform: translateX(-50%) }
}
duration: 20–30s linear infinite
Content duplicated for seamless loop
```

---

## 7. SECTION ARCHITECTURE

### Page Structure
Total sections: 7 (0-indexed)
Navigation: scroll-hijacked, one section at a time
Transition: black wipe between sections
Progress: ScrollThread component — left edge vertical line
Section indicators: right edge dots

Section 0: Opening Gate (full screen pre-loader question)
Section 1: Hero — cream background, orange blob, "never heard of us?"
Section 2: Flabbergast — red #E8350A, grid overlay, "STUDIO FX"
Section 3: Blob/Latchezar — cream #f0eeec, iridescent blob, bleeding type
Section 4: Synqro/Lightweight — white, horizontal sliding panels
Section 5: AVA SRG/Dark — #282828, particle system, wireframe
Section 6: San Rita/Map — #d8dde0 blue-grey, cartographic
Section 7: Contact — cream #f0eeec, orange blob, "GET IN / TOUCH."

### Fixed Elements (visible across all sections)
ScrollThread:     left: 24px, z-index 9990, mix-blend-mode difference
Section dots:     right: 24px, z-index 9990
Custom cursor:    8px circle, z-index 9998, mix-blend-mode difference
                  expands to 24px on hoverable elements
                  lerp factor: 0.12
Section counter:  bottom left, "0{n} / 07" Space Grotesk 11px

---

## 8. LAYOUT GRID
Max content width:  1440px
Page padding:       48px desktop, 24px mobile

Breakpoints:
  Mobile:   < 768px
  Tablet:   768px – 1024px
  Desktop:  > 1024px

Common layouts:
  Two column:       55% / 45% or 45% / 55%
  Three column:     1.2fr / 0.8fr / 1fr (asymmetric)
  Top bar:          full width, space-between, 48px height
  Bottom corners:   absolute bottom-left + bottom-right content

---

## 9. SECTION-SPECIFIC RULES

### Section 1 — Hero (cream + orange blob)
Background: #f0eeec
Blob: radial gradient amber/orange, 580px, morphing + rotating
Text "never heard of us?": Space Grotesk 300 italic, ~44px
  gradient: #E8520a → #c8a030 → #ff8c20
  webkit-background-clip: text
Top bar: "STUDIO FX" left, "EST. 2024" centre, "WORLDWIDE" right
Bottom left: body text, 3 lines max
Bottom right: nav links "PROOF ↗" "PROCESS ↗" "BOOK A CALL ↗" "BRIEF ↗"

### Section 2 — Flabbergast (red grid)
Background: #E8350A
Grid: 8 columns × 3 rows, thin white lines rgba(255,255,255,0.25)
Centre: "STUDIO FX" Space Grotesk 900 white, clamp(60px,9vw,130px)
Scattered text: Space Grotesk 12px white uppercase, various cells
Cursor rectangles: 3px × 14px white, blinking 1s infinite

### Section 3 — Latchezar (cream + iridescent blob)
Background: #f0eeec
Blob: iridescent orange/amber, 580px, mouse-tracking movement
Headlines: Anton clamp(96px,13vw,190px) #0a0a0a
  Line 1: "SOMETHING" left: -6px
  Line 2: "LIKE THIS?" left: 60px (offset)
Bottom left: body text rgba(0,0,0,0.4)
Bottom right: nav links stack with border-top dividers

### Section 4 — Lightweight (white + horizontal panels)
Background: #ffffff
Top bar: 48px height, border-bottom #ebebeb
Horizontal panels: 3 panels, 280% wide inner div
  slides translateX 0 to -66.66% on scroll
Panels: dark (#0a0a0a), red (#E8350A), navy (#0a0a2e)
Content: two column, stats grid 2×2

### Section 5 — AVA SRG (dark + particles)
Background: #282828
Particle system: 1200 particles, Canvas 2D
Wireframe box: perspective projection, rgba(100,160,255,0.4) lines
Bottom bleeding: Anton "WHAT / ABOUT THIS?" white
Top left: data cluster, monospace style
Right nav: large links white

### Section 6 — San Rita (blue-grey + map)
Background: #d8dde0
Map area: 65% width, aerial gradient terrain
Left sidebar: icon nav, legend
Bottom left: Anton headline "A VISUAL / ELEVATION / STUDIO."
Bottom bar: data labels full width
Crosshair lines: rgba(0,0,0,0.15) horizontal + vertical

### Section 7 — Contact (cream + orange blob)
Background: #f0eeec
Same blob as Section 1 but with mouse tracking
Headlines: "GET IN" left: -6px, "TOUCH." left: 60px
Bottom right: "BOOK A FREE CALL ↗" primary link
Form overlay: slides up from bottom, #0a0a0a background

---

## 10. PERFORMANCE RULES

- willChange: transform on all animated elements
- requestAnimationFrame for all scroll-driven animations
- passive: true on all scroll event listeners
- Cancel all RAF and remove all listeners on component unmount
- Pixel ratio cap: Math.min(window.devicePixelRatio, 2)
- Canvas elements: always cleanup context on unmount
- No animation libraries except GSAP (already installed)
- Prefer CSS transitions over JS for simple hover states
- IntersectionObserver for scroll reveals — never scroll listener for simple reveals

---

## 11. COPY RULES (SUMMARY)
Primary CTA:      "Book a free elevation call"
Secondary CTA:    "See what's possible"
Post-CTA note:    "30 minutes. No commitment. Just vision."

Never say:        "AI", "artificial intelligence", "synergy",
                  "optimize", "transform", "innovative"
Always say:       "smart systems", "automated workflows",
                  "visual elevation", "brand elevation",
                  "Series A level", "worldwide"

Voice:            Confident, direct, human, premium
Person:           Always "you" — speak to one person
Length:           Headlines under 8 words
                  Body under 40 words per paragraph
                  Labels always uppercase

---

## 12. CLAUDE CODE INSTRUCTIONS

When building any component for Studio FX:

1. Read this entire file before writing a single line
2. Use only the fonts defined in section 3
3. Use only the colours defined in section 2
4. Use only the animations defined in section 6
5. Every section must have a top bar with 3 labels
6. Every section must have bottom-left body text and bottom-right navigation
7. All headlines use Anton, all UI uses Space Grotesk
8. Never add generic placeholder content — use real Studio FX copy
9. Never add social media links that aren't INSTAGRAM and LINKEDIN
10. All buttons follow the button spec in section 5 exactly
11. Mobile breakpoint at 768px — all sections collapse to single column
12. Test every component against the section architecture in section 7
13. If a design decision isn't covered in this file, ask before guessing
