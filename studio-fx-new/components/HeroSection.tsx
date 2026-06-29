'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const VERT = `
uniform float uTime;
uniform float uSize;
uniform float uScrollProgress;
attribute float aScale;
attribute vec3 aRandomness;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  float angle = atan(modelPosition.x, modelPosition.z);
  float distanceToCenter = length(modelPosition.xz);
  float angleOffset = (1.0 / distanceToCenter) * uTime * 0.15;
  angle += angleOffset;
  modelPosition.x = cos(angle) * distanceToCenter;
  modelPosition.z = sin(angle) * distanceToCenter;
  modelPosition.x += aRandomness.x * sin(uTime * 0.3 + uScrollProgress);
  modelPosition.y += aRandomness.y * cos(uTime * 0.2 + uScrollProgress);
  modelPosition.z += aRandomness.z * sin(uTime * 0.25 + uScrollProgress);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  gl_Position = projectedPosition;
  gl_PointSize = uSize * aScale * (1.0 / -viewPosition.z);
}
`;

const FRAG = `
void main() {
  float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
  float strength = 0.05 / distanceToCenter - 0.1;
  gl_FragColor = vec4(1.0, 0.95, 0.95, strength);
}
`;

function splitChars(el: HTMLElement) {
  const text = el.textContent || '';
  el.innerHTML = text
    .split('')
    .map(c =>
      c === ' '
        ? ' '
        : `<span class="char-wrap"><span class="char">${c}</span></span>`
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

  useEffect(() => {
    const section = sectionRef.current;
    const wrap    = canvasRef.current;
    if (!section || !wrap) return;

    const isMobile = window.innerWidth < 768;
    const COUNT    = isMobile ? 2000 : 8000;

    /* ── Three.js setup ─────────────────────────── */
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    wrap.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 3;

    /* geometry */
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(COUNT * 3);
    const scales = new Float32Array(COUNT);
    const rand  = new Float32Array(COUNT * 3);

    for (let i = 0; i < COUNT; i++) {
      const radius = Math.random() * 2;
      const spinAngle = radius * 5;
      const branchAngle = (i % 3) * ((Math.PI * 2) / 3);
      pos[i * 3]     = Math.cos(branchAngle + spinAngle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.4;
      pos[i * 3 + 2] = Math.sin(branchAngle + spinAngle) * radius;
      scales[i]       = Math.random();
      rand[i * 3]     = (Math.random() - 0.5) * 0.3;
      rand[i * 3 + 1] = (Math.random() - 0.5) * 0.3;
      rand[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
    }
    geo.setAttribute('position',   new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aScale',     new THREE.BufferAttribute(scales, 1));
    geo.setAttribute('aRandomness', new THREE.BufferAttribute(rand, 3));

    const uniforms = {
      uTime:           { value: 0 },
      uSize:           { value: 30 * renderer.getPixelRatio() },
      uScrollProgress: { value: 0 },
    };

    const mat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    /* ── GSAP ScrollTrigger pin ─────────────────── */
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=200%',
        pin: true,
        scrub: 1.5,
        onUpdate(self) {
          uniforms.uScrollProgress.value = self.progress;
          camera.position.z = 3 + self.progress * 2;
        },
      });
    }, section);

    /* ── Char split intro ───────────────────────── */
    const chars1 = h1Ref.current ? splitChars(h1Ref.current) : [];
    const chars2 = h2Ref.current ? splitChars(h2Ref.current) : [];

    gsap.set([...chars1, ...chars2], { yPercent: 110 });
    gsap.set([subRef.current, btnsRef.current], { opacity: 0, y: 24 });

    gsap.to([...chars1, ...chars2], {
      yPercent: 0,
      duration: 1,
      stagger: 0.03,
      ease: 'power3.out',
      delay: 0.3,
    });
    gsap.to([subRef.current, btnsRef.current], {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power2.out',
      delay: 1.2,
    });

    /* ── RAF loop ───────────────────────────────── */
    let rafId: number;
    const clock = new THREE.Clock();
    const tick = () => {
      rafId = requestAnimationFrame(tick);
      uniforms.uTime.value = clock.getElapsedTime();
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
      window.removeEventListener('resize', onResize);
      ctx.revert();
      renderer.dispose();
      geo.dispose();
      mat.dispose();
      wrap.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}
    >
      {/* Canvas */}
      <div
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, zIndex: 0 }}
      />

      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'radial-gradient(ellipse at center, transparent 35%, rgba(8,8,8,0.9) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '0 24px',
      }}>
        <h1
          ref={h1Ref}
          style={{
            fontFamily: 'var(--font-anton-var), sans-serif',
            fontSize: 'clamp(64px, 11vw, 128px)',
            lineHeight: 0.88,
            letterSpacing: '-0.01em',
            color: '#fff',
          }}
        >
          STOP BLEEDING
        </h1>
        <h1
          ref={h2Ref}
          style={{
            fontFamily: 'var(--font-anton-var), sans-serif',
            fontSize: 'clamp(64px, 11vw, 128px)',
            lineHeight: 0.88,
            letterSpacing: '-0.01em',
            WebkitTextStroke: '1.5px rgba(255,255,255,0.85)',
            color: 'transparent',
            marginBottom: 40,
          }}
        >
          REVENUE.
        </h1>

        <p
          ref={subRef}
          style={{
            fontFamily: 'var(--font-space-var), sans-serif',
            fontSize: 15,
            fontWeight: 300,
            color: 'rgba(255,255,255,0.5)',
            maxWidth: 480,
            marginBottom: 48,
            lineHeight: 1.6,
          }}
        >
          We find where your business bleeds time and money. Then we seal every gap — automatically.
        </p>

        <div ref={btnsRef} style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          <a
            href="#cta"
            data-cursor
            style={{
              display: 'inline-block',
              background: '#E8350A',
              color: '#fff',
              fontFamily: 'var(--font-space-var), sans-serif',
              fontSize: 13,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '16px 44px',
              borderRadius: 2,
            }}
          >
            Book a free call
          </a>
          <a
            href="#problem"
            data-cursor
            style={{
              display: 'inline-block',
              border: '1px solid rgba(255,255,255,0.18)',
              color: '#fff',
              fontFamily: 'var(--font-space-var), sans-serif',
              fontSize: 13,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '16px 44px',
              borderRadius: 2,
            }}
          >
            See how it works
          </a>
        </div>
      </div>

      {/* Scroll hint */}
      <div style={{
        position: 'absolute', bottom: 40, left: '50%',
        transform: 'translateX(-50%)', zIndex: 2,
      }}>
        <div style={{
          width: 1, height: 56,
          background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.25))',
        }} />
      </div>
    </section>
  );
}
