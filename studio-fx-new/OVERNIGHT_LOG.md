# OVERNIGHT CONSTRUCTION LOG — Studio FX
# Started: 2026-06-30

---

## CYCLE 1 — Hero Shader Upgrade + Mouse Parallax

### Research
Sites studied: textura.agency, lusion.co (403 blocked — techniques applied from deep knowledge)
Key technique extracted: **Mouse parallax via uniform injection** — pass normalised cursor coords as `uMouseX/uMouseY` uniforms into vertex shader. Each particle's displacement scales by `distanceToCenter` so outer particles move more than inner ones, creating convincing parallax depth.
Why it works: The human visual system interprets differential movement as depth (parallax). When outer particles shift more than inner ones on mouse move, the brain reads this as 3D space — the same trick used by Bruno Simon's portfolio and every premium WebGL site.

### Gap identified
Section: Hero — Three.js particle system
Issue: Fragment shader used raw division (`0.05/d - 0.1`) which creates harsh halos; no mouse interaction; all particles identical cream colour with no spatial colour coding
Impact: Massive — the hero is the first thing visitors see. Flat particles with no interaction feel like a template, not a premium experience.

### What was built
1. **Mouse parallax uniforms** — `uMouseX` and `uMouseY` lerped at 0.05 per frame. Each particle displaced by `uMouseX * distanceToCenter * 0.04` — outer particles move 2× more than inner creating real parallax depth.
2. **Fragment shader upgrade** — replaced `0.05/d - 0.1` with `smoothstep(0.0, 0.5, d)` circle mask plus `exp(-d * 6.0)` gaussian glow. Result: clean soft circles with natural falloff, no harsh rings.
3. **Per-particle colour gradient** — added `aColor` BufferAttribute. Inner particles = `#E8350A` (brand orange-red), outer particles = `#c4d4ff` (cool blue-white). `THREE.Color.lerpColors()` interpolates by radius. The orange-to-blue temperature shift is the same technique used in astrophysics visualisations — hot stars near centre, cool dust at edges.
4. **Scroll-driven rotation** — `points.rotation.y = progress * 0.4` so galaxy tilts as user scrolls, revealing it's a 3D disc not a flat plane.
5. **Particle dissolve** — `scrollFade = 1.0 - uScrollProgress * 0.6` in vertex shader shrinks particle size as scroll progresses.
6. **Eyebrow label** — added "Studio FX — Operations Intelligence" above headline for brand positioning.
7. **Improved char split** — spaces now rendered as inline spans with `0.28em` width instead of raw text nodes that collapse.

Files modified: `studio-fx-new/components/HeroSection.tsx`
Packages installed: none

### Technical explanation
**Smoothstep vs division for glow:** `0.05/distance` creates a mathematical singularity at d=0 (infinite brightness) and harsh gradient. `smoothstep(0,0.5,d)` is clamped, smooth, and GPU-cheap. `exp(-d*6)` adds a second term for the soft halo that fades naturally — this is how Inigo Quilez (shadertoy master) renders particles.

**Vertex colour:** Three.js `vertexColors: true` on ShaderMaterial tells the renderer to expect a `color` attribute. We use `aColor` (not the reserved `color`) to avoid conflicts. The `varying vec3 vColor` passes the colour from vertex stage to fragment stage — this is the standard GLSL pipeline.

**Mouse lerp in RAF vs in event handler:** We store `targetMouseX` (updated on event) and lerp `currentMouseX` toward it each frame at `0.05`. This prevents jitter and gives the characteristic "lagging behind" feel that reads as physical weight.

### Before vs after
Before: All-white particles, flat, no response to mouse, basic glowing halos
After: Orange-to-blue colour gradient, mouse tilt parallax, clean gaussian glow, galaxy rotates on scroll

### Quality check
Console errors: Zero
Build errors: Zero
Visual improvement: Massive — hero now has depth, temperature, and interaction

