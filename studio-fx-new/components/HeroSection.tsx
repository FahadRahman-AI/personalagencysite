'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ─── Vertex shader ──────────────────────────────────────────────────────────
   Techniques from Bruno Simon / Three.js Journey galaxy generator.
   Key upgrade: added uMouseX/uMouseY parallax + per-particle color passed
   through to fragment via vColor varying. ──────────────────────────────────── */
const VERT = `
uniform float uTime;
uniform float uSize;
uniform float uScrollProgress;
uniform float uMouseX;
uniform float uMouseY;
attribute float aScale;
attribute vec3 aRandomness;
attribute vec3 aColor;
varying vec3 vColor;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // Galaxy spiral rotation
  float angle = atan(modelPosition.x, modelPosition.z);
  float distanceToCenter = length(modelPosition.xz);
  float angleOffset = (1.0 / distanceToCenter) * uTime * 0.15;
  angle += angleOffset;
  modelPosition.x = cos(angle) * distanceToCenter;
  modelPosition.z = sin(angle) * distanceToCenter;

  // Randomness drift over time
  modelPosition.x += aRandomness.x * sin(uTime * 0.3 + uScrollProgress * 2.0);
  modelPosition.y += aRandomness.y * cos(uTime * 0.2 + uScrollProgress * 2.0);
  modelPosition.z += aRandomness.z * sin(uTime * 0.25 + uScrollProgress * 2.0);

  // Mouse parallax — subtle scene tilt toward cursor
  modelPosition.x += uMouseX * distanceToCenter * 0.04;
  modelPosition.y += uMouseY * distanceToCenter * 0.04;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  gl_Position = projectedPosition;

  // Particle shrinks as scroll progresses (dissolve effect)
  float scrollFade = 1.0 - uScrollProgress * 0.6;
  gl_PointSize = uSize * aScale * scrollFade * (1.0 / -viewPosition.z);

  vColor = aColor;
}
`;

/* ─── Fragment shader ────────────────────────────────────────────────────────
   Key upgrade: smoothstep soft circle instead of raw division.
   Division (0.05/d - 0.1) creates harsh halos. Smoothstep gives a
   clean, perfectly soft gaussian-like glow. Also uses vColor for
   warm-to-cool temperature shift across the galaxy. ──────────────────────── */
const FRAG = `
varying vec3 vColor;

void main() {
  // Distance from center of point sprite (0=center, 0.5=edge)
  float d = distance(gl_PointCoord, vec2(0.5));

  // Smooth circle: 1 at center, 0 at edge, sharp cutoff at 0.5
  float circle = 1.0 - smoothstep(0.0, 0.5, d);

  // Soft glow falloff — gaussian-like
  float glow = exp(-d * 6.0) * 0.8;

  float alpha = max(circle * circle, glow);

  // Fade out at scroll
  gl_FragColor = vec4(vColor, alpha);
}
`;

function splitChars(el: HTMLElement) {
  const text = el.textContent || '';
  el.innerHTML = text
    .split('')
    .map(c =>
      c === ' '
        ? '<span style="display:inline-block;width:0.28em"> </span>'
        : `<span class="char-wrap"><span class="char" style="display:inline-block;will-change:transform">${c}</span></span>`
    )
    .join('');
  return el.querySelectorAll<HTMLElement>('.char');
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef  = useRef<HTMLDivElement>(null);
  const h1Ref      = useRef<HTMLHeadingElement>(null);
  const h2Ref      = useRef<HTMLHeadingElement>(null);
  const subRef     = useRef<HTMLParagraphElement>(null);
  const btnsRef    = useRef<HTMLDivElement>(null);
  const labelRef   = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const wrap    = canvasRef.current;
    if (!section || !wrap) return;

    const isMobile = window.innerWidth < 768;
    const COUNT    = isMobile ? 2000 : 8000;

    /* ── Three.js renderer ──────────────────────── */
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    Object.assign(renderer.domElement.style, {
      position: 'absolute', top: '0', left: '0',
      width: '100%', height: '100%',
    });
    wrap.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 3;

    /* ── Galaxy geometry ────────────────────────── */
    const geo    = new THREE.BufferGeometry();
    const pos    = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const scales = new Float32Array(COUNT);
    const rand   = new Float32Array(COUNT * 3);

    // Inner color: warm orange-red (#E8350A = 0.91, 0.21, 0.04)
    // Outer color: cool blue-white (#aac4ff = 0.67, 0.77, 1.0)
    const innerColor = new THREE.Color('#E8350A');
    const outerColor = new THREE.Color('#c4d4ff');
    const mixedColor = new THREE.Color();

    for (let i = 0; i < COUNT; i++) {
      const radius      = Math.random() * 2;
      const spinAngle   = radius * 5;
      const branchAngle = (i % 3) * ((Math.PI * 2) / 3);

      pos[i * 3]     = Math.cos(branchAngle + spinAngle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.4;
      pos[i * 3 + 2] = Math.sin(branchAngle + spinAngle) * radius;

      scales[i]        = Math.random() * 0.8 + 0.2;
      rand[i * 3]      = (Math.random() - 0.5) * 0.3;
      rand[i * 3 + 1]  = (Math.random() - 0.5) * 0.3;
      rand[i * 3 + 2]  = (Math.random() - 0.5) * 0.3;

      // Color based on radius: inner=orange, outer=blue-white
      mixedColor.lerpColors(innerColor, outerColor, radius / 2);
      colors[i * 3]     = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    geo.setAttribute('position',    new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aColor',      new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('aScale',      new THREE.BufferAttribute(scales, 1));
    geo.setAttribute('aRandomness', new THREE.BufferAttribute(rand, 3));

    /* ── Uniforms ───────────────────────────────── */
    const uniforms = {
      uTime:           { value: 0 },
      uSize:           { value: 32 * renderer.getPixelRatio() },
      uScrollProgress: { value: 0 },
      uMouseX:         { value: 0 },
      uMouseY:         { value: 0 },
    };

    const mat = new THREE.ShaderMaterial({
      vertexShader:   VERT,
      fragmentShader: FRAG,
      uniforms,
      transparent: true,
      depthWrite:  false,
      blending:    THREE.AdditiveBlending,
      vertexColors: true,
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    /* ── Mouse tracking ─────────────────────────── */
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
      targetMouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    /* ── GSAP ScrollTrigger ─────────────────────── */
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=200%',
        pin: true,
        scrub: 1.5,
        onUpdate(self) {
          uniforms.uScrollProgress.value = self.progress;
          // Camera pulls back and tilts as scroll advances
          camera.position.z = 3 + self.progress * 2.5;
          points.rotation.y = self.progress * 0.4;
        },
      });
    }, section);

    /* ── Character split intro ──────────────────── */
    const chars1 = h1Ref.current ? splitChars(h1Ref.current) : [];
    const chars2 = h2Ref.current ? splitChars(h2Ref.current) : [];

    gsap.set([...chars1, ...chars2], { yPercent: 115 });
    gsap.set([labelRef.current, subRef.current, btnsRef.current], { opacity: 0, y: 20 });

    // Staggered char reveal after preloader
    gsap.to(labelRef.current, {
      opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.2,
    });
    gsap.to([...chars1], {
      yPercent: 0, duration: 1.1, stagger: 0.025, ease: 'power4.out', delay: 0.4,
    });
    gsap.to([...chars2], {
      yPercent: 0, duration: 1.1, stagger: 0.025, ease: 'power4.out', delay: 0.55,
    });
    gsap.to([subRef.current, btnsRef.current], {
      opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power2.out', delay: 1.3,
    });

    /* ── RAF loop ───────────────────────────────── */
    let rafId: number;
    const clock = new THREE.Clock();
    const tick = () => {
      rafId = requestAnimationFrame(tick);
      uniforms.uTime.value = clock.getElapsedTime();

      // Lerp mouse toward target (smooth lag)
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;
      uniforms.uMouseX.value = currentMouseX;
      uniforms.uMouseY.value = currentMouseY;

      renderer.render(scene, camera);
    };
    tick();

    /* ── Resize ─────────────────────────────────── */
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      ctx.revert();
      renderer.dispose();
      geo.dispose();
      mat.dispose();
      if (wrap.contains(renderer.domElement)) wrap.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', background: '#080808' }}
    >
      {/* Three.js canvas mount */}
      <div ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />

      {/* Radial vignette — darkens edges, keeps centre bright */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 30%, rgba(8,8,8,0.7) 70%, rgba(8,8,8,0.97) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Content overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '0 24px',
      }}>

        {/* Eyebrow label */}
        <p
          ref={labelRef}
          style={{
            fontFamily: 'var(--font-space-var), sans-serif',
            fontSize: 11,
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.3)',
            marginBottom: 28,
            opacity: 0,
          }}
        >
          Studio FX — Operations Intelligence
        </p>

        {/* Headline line 1 */}
        <h1
          ref={h1Ref}
          style={{
            fontFamily: 'var(--font-anton-var), sans-serif',
            fontSize: 'clamp(60px, 10.5vw, 128px)',
            lineHeight: 0.9,
            letterSpacing: '-0.01em',
            color: '#fff',
            overflow: 'hidden',
          }}
        >
          STOP BLEEDING
        </h1>

        {/* Headline line 2 — outlined */}
        <h1
          ref={h2Ref}
          style={{
            fontFamily: 'var(--font-anton-var), sans-serif',
            fontSize: 'clamp(60px, 10.5vw, 128px)',
            lineHeight: 0.9,
            letterSpacing: '-0.01em',
            WebkitTextStroke: '1.5px rgba(255,255,255,0.75)',
            color: 'transparent',
            marginBottom: 44,
            overflow: 'hidden',
          }}
        >
          REVENUE.
        </h1>

        {/* Subline */}
        <p
          ref={subRef}
          style={{
            fontFamily: 'var(--font-space-var), sans-serif',
            fontSize: 15,
            fontWeight: 300,
            color: 'rgba(255,255,255,0.45)',
            maxWidth: 460,
            marginBottom: 48,
            lineHeight: 1.65,
            opacity: 0,
          }}
        >
          We find where your business bleeds time and money. Then we seal every gap — automatically.
        </p>

        {/* CTAs */}
        <div ref={btnsRef} style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', opacity: 0 }}>
          <a
            href="#cta"
            data-cursor
            style={{
              display: 'inline-block',
              background: '#E8350A',
              color: '#fff',
              fontFamily: 'var(--font-space-var), sans-serif',
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '15px 40px',
              borderRadius: 2,
              transition: 'filter 0.3s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.filter = 'brightness(1.2)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.filter = 'none'; }}
          >
            Book free call
          </a>
          <a
            href="#problem"
            data-cursor
            style={{
              display: 'inline-block',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.7)',
              fontFamily: 'var(--font-space-var), sans-serif',
              fontSize: 12,
              fontWeight: 400,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '15px 40px',
              borderRadius: 2,
              transition: 'border-color 0.3s, color 0.3s',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = 'rgba(255,255,255,0.4)';
              el.style.color = '#fff';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = 'rgba(255,255,255,0.15)';
              el.style.color = 'rgba(255,255,255,0.7)';
            }}
          >
            See how it works
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute', bottom: 36, left: '50%',
        transform: 'translateX(-50%)', zIndex: 2,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
      }}>
        <span style={{
          fontFamily: 'var(--font-space-var), sans-serif',
          fontSize: 9, letterSpacing: '0.25em', color: 'rgba(255,255,255,0.2)',
          textTransform: 'uppercase',
        }}>Scroll</span>
        <div style={{
          width: 1, height: 40,
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.15), transparent)',
        }} />
      </div>
    </section>
  );
}
