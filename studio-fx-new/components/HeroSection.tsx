'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function HeroSection() {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = canvasRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 768;
    const PARTICLE_COUNT = isMobile ? 500 : 2000;

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
    camera.position.z = 50;

    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const initialY = new Float32Array(PARTICLE_COUNT);
    const phases = new Float32Array(PARTICLE_COUNT);

    const spread = isMobile ? 60 : 100;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = (Math.random() - 0.5) * spread;
      const y = (Math.random() - 0.5) * (spread * 0.6);
      const z = (Math.random() - 0.5) * 20;
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
      size: isMobile ? 0.15 : 0.12,
      transparent: true,
      opacity: 0.8,
    });

    const particles = new THREE.Points(geo, mat);
    scene.add(particles);

    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);

    let time = 0;
    let rafId: number;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      time += 0.008;

      const pos = geo.attributes.position.array as Float32Array;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const ix = i * 3;
        const px = pos[ix];
        const py = pos[ix + 1];

        // Sine wave breathing
        pos[ix + 1] = initialY[i] + Math.sin(time + phases[i]) * 1.5;

        // Mouse repel
        const dx = px - mouseX * 50;
        const dy = py - mouseY * 30;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 8) {
          const force = (8 - dist) / 8;
          pos[ix] += (dx / dist) * force * 0.3;
          pos[ix + 1] += (dy / dist) * force * 0.3;
        }
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
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        background: '#080808',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Three.js canvas layer */}
      <div
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
        }}
      />

      {/* Text overlay */}
      <div
        className="fade-up"
        style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          padding: '0 24px',
          maxWidth: '900px',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-space-grotesk)',
            fontWeight: 300,
            fontStyle: 'italic',
            fontSize: '18px',
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}
        >
          WELCOME.
        </p>

        <h1
          style={{
            fontFamily: 'var(--font-anton)',
            fontSize: 'clamp(64px, 12vw, 120px)',
            color: '#ffffff',
            lineHeight: 0.9,
            display: 'block',
          }}
        >
          WE BUILD AI
        </h1>
        <h1
          style={{
            fontFamily: 'var(--font-anton)',
            fontSize: 'clamp(64px, 12vw, 120px)',
            WebkitTextStroke: '1px white',
            color: 'transparent',
            lineHeight: 0.9,
            display: 'block',
            marginBottom: '32px',
          }}
        >
          INFRASTRUCTURE
        </h1>

        <p
          style={{
            fontFamily: 'var(--font-space-grotesk)',
            fontWeight: 300,
            fontSize: '14px',
            color: 'rgba(255,255,255,0.5)',
            marginBottom: '40px',
          }}
        >
          For businesses that refuse to be left behind.
        </p>

        <a
          href="#cta"
          style={{
            display: 'inline-block',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'white',
            fontFamily: 'var(--font-space-grotesk)',
            fontSize: '13px',
            padding: '16px 40px',
            borderRadius: '100px',
            transition: 'background 0.3s ease, color 0.3s ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = 'white';
            (e.currentTarget as HTMLAnchorElement).style.color = 'black';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
            (e.currentTarget as HTMLAnchorElement).style.color = 'white';
          }}
        >
          Book a free call
        </a>
      </div>
    </section>
  );
}
