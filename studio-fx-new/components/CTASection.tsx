'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function CTASection() {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = canvasRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 768;
    const COUNT = isMobile ? 300 : 800;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x080808, 1);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 60;

    const positions = new Float32Array(COUNT * 3);
    const initialY = new Float32Array(COUNT);
    const phases = new Float32Array(COUNT);
    const spread = 120;

    for (let i = 0; i < COUNT; i++) {
      const x = (Math.random() - 0.5) * spread;
      const y = (Math.random() - 0.5) * (spread * 0.5);
      const z = (Math.random() - 0.5) * 30;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      initialY[i] = y;
      phases[i] = Math.random() * Math.PI * 2;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.1,
      transparent: true,
      opacity: 0.5,
    });

    scene.add(new THREE.Points(geo, mat));

    let time = 0;
    let rafId: number;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      time += 0.004;
      const pos = geo.attributes.position.array as Float32Array;
      for (let i = 0; i < COUNT; i++) {
        pos[i * 3 + 1] = initialY[i] + Math.sin(time + phases[i]) * 2;
      }
      geo.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <section
      id="cta"
      style={{
        position: 'relative',
        background: '#080808',
        padding: '200px 0',
        textAlign: 'center',
        overflow: 'hidden',
      }}
    >
      <div ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />

      <div
        className="fade-up"
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '900px',
          margin: '0 auto',
          padding: '0 24px',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-anton)',
            fontSize: 'clamp(60px, 9vw, 140px)',
            color: 'white',
            lineHeight: 0.85,
            marginBottom: '32px',
          }}
        >
          <span style={{ display: 'block' }}>READY TO STOP</span>
          <span style={{ display: 'block' }}>LOSING LEADS?</span>
        </h2>

        <p
          style={{
            fontFamily: 'var(--font-space-grotesk)',
            fontWeight: 300,
            fontSize: '14px',
            color: 'rgba(255,255,255,0.4)',
            marginBottom: '48px',
            maxWidth: '480px',
            margin: '0 auto 48px',
          }}
        >
          Book a free 30-minute call. We&#39;ll show you exactly what your business is losing and
          how to fix it.
        </p>

        <a
          href="mailto:hello@studiofx.co"
          style={{
            display: 'inline-block',
            background: '#E8350A',
            color: 'white',
            fontFamily: 'var(--font-space-grotesk)',
            fontWeight: 600,
            fontSize: '14px',
            textTransform: 'uppercase',
            padding: '20px 56px',
            borderRadius: '100px',
            letterSpacing: '0.08em',
            transition: 'opacity 0.2s ease',
            marginBottom: '32px',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = '0.85')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = '1')}
        >
          BOOK YOUR FREE CALL
        </a>

        <p
          style={{
            fontFamily: 'var(--font-space-grotesk)',
            fontSize: '11px',
            color: 'rgba(255,255,255,0.25)',
            display: 'block',
          }}
        >
          hello@studiofx.co · Birmingham, UK · Worldwide
        </p>
      </div>
    </section>
  );
}
