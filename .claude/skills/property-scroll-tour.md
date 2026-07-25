---
name: property-scroll-tour
description: Design and build a full-viewport scroll-tour site for property/interior photography. One pinned chapter per image, GSAP ScrollTrigger scrub, Ken Burns zoom, split-char room labels in Fraunces, restraint-first design (no WebGL, no particles, one accent colour). Triggers when building a property showcase, real-estate site, interior photography portfolio, or any image-driven scroll narrative.
---

# Skill: Property Scroll Tour

## THE PRINCIPLE — RESTRAINT OVER DECORATION
Before adding any visual element ask: does this need to exist?
- No decorative shapes with no purpose
- No gradients unless they represent real light or atmosphere visible in the photos
- Only one accent colour visible at a time
- Every animation triggers on scroll, nothing loops aimlessly

## THE SCROLL TOUR MECHANIC
One full-viewport chapter per room/space found in `public/images/`.
Total page height scales with however many images exist (number of images × 100vh). Each chapter pinned for 100vh of scroll using GSAP ScrollTrigger with `scrub: 1.2`.

For each chapter:
- The room image fills the screen, `object-fit: cover`
- Subtle Ken Burns zoom across the pin duration: scale 1.0 → 1.08, driven by scrub
- On entry: a thin horizontal line draws left to right (`scaleX` 0 → 1, accent colour, 1px) above the room label
- Room label reveals in Fraunces, large, split into characters, each rising from `translateY(40px)` opacity 0, stagger 0.02s
- One short line of description fades in beneath, Inter, muted tone
- On exit: cross-fades to the next chapter via opacity over the final 15% of that chapter's scroll range

Top left of every chapter: small location label, Inter 10px uppercase tracking-widest, muted tone (ask what location text to use if not obvious from context).
Top right: chapter counter, e.g. `01 / 06` depending on actual image count.
Bottom right: thin progress bar in the accent colour, filling across the entire scroll journey, not just the current chapter.

## ROOM LABELS
Name each chapter based on what the image actually shows (exterior, entrance, living room, kitchen, bedroom, bathroom, garden, etc.) — infer from the images themselves rather than assuming a fixed list.

## GLOBAL
- Lenis smooth scroll, duration 1.3
- Custom cursor: small filled dot in the ink colour, lerp 0.12
- No preloader needed — loads instantly since it's images, not WebGL
- Final chapter ends with a simple enquiry CTA button in the accent colour, generous padding, `border-radius: 100px`

## WHAT NOT TO DO
- No particle systems, no WebGL — restraint is the entire brand here
- No more than one accent colour anywhere on the site
- No competing fonts beyond Fraunces and Inter
- Never place text directly on a busy part of an image — use a subtle gradient scrim only where legibility genuinely requires it

## THE TEST
Would this sit comfortably next to Linear, Fey, or Resend in terms of restraint and confidence? If it looks busy or decorative anywhere, strip it back further.
