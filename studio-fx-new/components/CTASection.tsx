'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import { splitChars } from '@/lib/splitText';

gsap.registerPlugin(ScrollTrigger);

export default function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef  = useRef<HTMLDivElement>(null);
  const headRef    = useRef<HTMLHeadingElement>(null);
  const subRef     = useRef<HTMLParagraphElement>(null);
  const btnRef     = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const wrap    = canvasRef.current;
    if (!section || !wrap) return;

    /* mini particle cloud */
    const isMobile = window.innerWidth < 768;
    const COUNT = isMobile ? 1500 : 3000;
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(wrap.clientWidth, wrap.clientHeight);
    wrap.appendChild(renderer.domElement);
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, wrap.clientWidth / wrap.clientHeight, 0.1, 100);
    camera.position.z = 2.5;

    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 6;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 4;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ size: 0.012, color: 0xff5533, transparent: true, opacity: 0.6 });
    scene.add(new THREE.Points(geo, mat));

    let rafId: number;
    const clock = new THREE.Clock();
    const tick = () => {
      rafId = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();
      scene.rotation.y = t * 0.04;
      renderer.render(scene, camera);
    };
    tick();

    /* char split on headline */
    const chars = headRef.current ? splitChars(headRef.current) : [];
    gsap.set(chars, { yPercent: 110 });

    const ctx = gsap.context(() => {
      gsap.to(chars, {
        yPercent: 0,
        duration: 1,
        stagger: 0.022,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
        },
      });
      gsap.from([subRef.current, btnRef.current], {
        opacity: 0, y: 32, duration: 0.9, stagger: 0.12, ease: 'power2.out',
        scrollTrigger: { trigger: section, start: 'top 60%' },
      });
    }, section);

    return () => {
      cancelAnimationFrame(rafId);
      ctx.revert();
      renderer.dispose();
      geo.dispose();
      mat.dispose();
      wrap.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <section
      id="cta"
      ref={sectionRef}
      style={{
        position: 'relative',
        background: '#080808',
        padding: '200px 0',
        textAlign: 'center',
        overflow: 'hidden',
      }}
    >
      <div ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />

      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'radial-gradient(ellipse at center, rgba(8,8,8,0.4) 0%, rgba(8,8,8,0.95) 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
        <p style={{
          fontFamily: 'var(--font-space-var), sans-serif',
          fontSize: 11,
          color: '#E8350A',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          marginBottom: 24,
        }}>
          LET&apos;S TALK
        </p>

        <h2
          ref={headRef}
          style={{
            fontFamily: 'var(--font-anton-var), sans-serif',
            fontSize: 'clamp(56px, 9vw, 140px)',
            lineHeight: 0.85,
            letterSpacing: '-0.01em',
            color: '#fff',
            marginBottom: 36,
          }}
        >
          READY TO STOP<br />LOSING LEADS?
        </h2>

        <p
          ref={subRef}
          style={{
            fontFamily: 'var(--font-space-var), sans-serif',
            fontWeight: 300,
            fontSize: 14,
            color: 'rgba(255,255,255,0.38)',
            maxWidth: 440,
            margin: '0 auto 52px',
            lineHeight: 1.8,
          }}
        >
          Book a free 30-minute call. We&apos;ll show you exactly what your business is losing and how to fix it.
        </p>

        <a
          ref={btnRef}
          href="mailto:hello@studiofx.co"
          data-cursor
          style={{
            display: 'inline-block',
            background: '#E8350A',
            color: '#fff',
            fontFamily: 'var(--font-space-var), sans-serif',
            fontWeight: 600,
            fontSize: 13,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            padding: '20px 60px',
            borderRadius: 2,
          }}
        >
          BOOK YOUR FREE CALL
        </a>

        <p style={{
          fontFamily: 'var(--font-space-var), sans-serif',
          fontSize: 11,
          color: 'rgba(255,255,255,0.2)',
          marginTop: 40,
          letterSpacing: '0.06em',
        }}>
          hello@studiofx.co · Birmingham, UK · Worldwide
        </p>
      </div>
    </section>
  );
}
