'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ─── 5-node workflow graph ─────────────────────────────────────────────────
   Nodes laid out in a horizontal flow: Intake → CRM → Automation → Notify → Close
   Travelling particles flow along bezier-interpolated paths between connected nodes.
   Each node pulses on a sin wave — nodes fire in sequence as scroll advances. ─── */

const NODE_LABELS = ['INTAKE', 'CRM', 'AUTOMATE', 'NOTIFY', 'CLOSED'];
const NODE_POSITIONS: [number, number, number][] = [
  [-3.2, 0, 0],
  [-1.6, 0.8, 0],
  [0,    0,   0],
  [1.6, -0.6, 0],
  [3.2,  0.4, 0],
];
const EDGES = [[0,1],[1,2],[2,3],[3,4]];

export default function SolutionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef  = useRef<HTMLDivElement>(null);
  const headRef    = useRef<HTMLHeadingElement>(null);
  const subRef     = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const wrap    = canvasRef.current;
    if (!section || !wrap) return;

    /* ── Renderer ───────────────────────────────── */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(wrap.clientWidth, wrap.clientHeight);
    Object.assign(renderer.domElement.style, {
      position: 'absolute', top: '0', left: '0',
      width: '100%', height: '100%',
    });
    wrap.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, wrap.clientWidth / wrap.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 7);

    /* ── Node meshes ────────────────────────────── */
    const nodes: THREE.Mesh[] = [];
    const nodeGeo = new THREE.SphereGeometry(0.15, 32, 32);

    NODE_POSITIONS.forEach((pos) => {
      const mat  = new THREE.MeshBasicMaterial({ color: 0x222222 });
      const mesh = new THREE.Mesh(nodeGeo, mat);
      mesh.position.set(...pos);
      scene.add(mesh);
      nodes.push(mesh);

      // Outer ring
      const ringGeo = new THREE.RingGeometry(0.2, 0.24, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xE8350A, side: THREE.DoubleSide, transparent: true, opacity: 0.5,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(...pos);
      scene.add(ring);
    });

    /* ── Edge lines ─────────────────────────────── */
    EDGES.forEach(([a, b]) => {
      const start = new THREE.Vector3(...NODE_POSITIONS[a]);
      const end   = new THREE.Vector3(...NODE_POSITIONS[b]);
      const geo   = new THREE.BufferGeometry().setFromPoints([start, end]);
      const mat   = new THREE.LineBasicMaterial({ color: 0x333333 });
      scene.add(new THREE.Line(geo, mat));
    });

    /* ── Travelling particles on each edge ──────── */
    type TravelParticle = {
      mesh: THREE.Mesh;
      edgeIdx: number;
      t: number;
      speed: number;
    };

    const particleGeo = new THREE.SphereGeometry(0.04, 8, 8);
    const travelParticles: TravelParticle[] = [];

    EDGES.forEach((edge, edgeIdx) => {
      for (let i = 0; i < 3; i++) {
        const mat  = new THREE.MeshBasicMaterial({ color: 0xE8350A });
        const mesh = new THREE.Mesh(particleGeo, mat);
        scene.add(mesh);
        travelParticles.push({
          mesh,
          edgeIdx,
          t: i / 3,
          speed: 0.004 + Math.random() * 0.003,
        });
      }
    });

    /* ── GSAP ScrollTrigger — 2-screen pin ──────── */
    const scrollState = { progress: 0 };
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=200%',
        pin: true,
        scrub: 1.5,
        onUpdate(self) { scrollState.progress = self.progress; },
      });
    }, section);

    /* ── RAF loop ───────────────────────────────── */
    let rafId: number;
    const clock = new THREE.Clock();

    const tick = () => {
      rafId = requestAnimationFrame(tick);
      const t    = clock.getElapsedTime();
      const prog = scrollState.progress;

      // Node pulse: each node activates as scroll crosses its threshold
      nodes.forEach((node, i) => {
        const threshold = i / (nodes.length - 1);
        const active    = prog >= threshold - 0.05;
        const mat       = node.material as THREE.MeshBasicMaterial;
        const targetCol = active ? 0xe8350a : 0x1a1a1a;
        mat.color.lerp(new THREE.Color(targetCol), 0.06);

        // Subtle pulse
        const pulse = 1 + Math.sin(t * 2 + i * 1.2) * 0.04;
        node.scale.setScalar(pulse);
      });

      // Travelling particles
      travelParticles.forEach(p => {
        p.t = (p.t + p.speed) % 1;
        const [a, b] = EDGES[p.edgeIdx];
        const start  = new THREE.Vector3(...NODE_POSITIONS[a]);
        const end    = new THREE.Vector3(...NODE_POSITIONS[b]);
        p.mesh.position.lerpVectors(start, end, p.t);

        // Fade when that edge's source node isn't active yet
        const threshold   = a / (nodes.length - 1);
        const edgeMat     = p.mesh.material as THREE.MeshBasicMaterial;
        const edgeActive  = prog >= threshold - 0.05;
        edgeMat.color.set(edgeActive ? 0xe8350a : 0x333333);
      });

      // Scene slow rotation
      scene.rotation.y = Math.sin(t * 0.08) * 0.12;

      renderer.render(scene, camera);
    };
    tick();

    /* ── Resize ─────────────────────────────────── */
    const onResize = () => {
      camera.aspect = wrap.clientWidth / wrap.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(wrap.clientWidth, wrap.clientHeight);
    };
    window.addEventListener('resize', onResize);

    /* ── Text entrance ──────────────────────────── */
    gsap.from([headRef.current, subRef.current], {
      opacity: 0, y: 30, duration: 1, stagger: 0.15, ease: 'power3.out',
      scrollTrigger: { trigger: section, start: 'top 70%' },
    });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      ctx.revert();
      renderer.dispose();
      nodeGeo.dispose();
      particleGeo.dispose();
      if (wrap.contains(renderer.domElement)) wrap.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative', width: '100%', height: '100vh',
        background: '#080808', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}
    >
      {/* Header */}
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 24px', marginBottom: 40 }}>
        <p style={{
          fontFamily: 'var(--font-space-var), sans-serif',
          fontSize: 11, letterSpacing: '0.35em', color: '#E8350A',
          textTransform: 'uppercase', marginBottom: 20,
        }}>The solution</p>
        <h2
          ref={headRef}
          style={{
            fontFamily: 'var(--font-anton-var), sans-serif',
            fontSize: 'clamp(44px, 6vw, 88px)',
            lineHeight: 0.9, letterSpacing: '-0.01em', color: '#fff',
          }}
        >
          YOUR ENTIRE OPERATION<br />ON AUTOPILOT.
        </h2>
      </div>

      {/* Three.js workflow canvas */}
      <div
        ref={canvasRef}
        style={{ position: 'relative', width: '100%', height: '40vh', zIndex: 1 }}
      />

      {/* Node labels */}
      <div style={{
        position: 'relative', zIndex: 2,
        display: 'flex', gap: '6vw', justifyContent: 'center',
        padding: '0 24px', marginTop: 24,
      }}>
        {NODE_LABELS.map((label, i) => (
          <span
            key={i}
            style={{
              fontFamily: 'var(--font-space-var), sans-serif',
              fontSize: 10, letterSpacing: '0.2em',
              color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase',
            }}
          >
            {label}
          </span>
        ))}
      </div>

      {/* Subline */}
      <p
        ref={subRef}
        style={{
          fontFamily: 'var(--font-space-var), sans-serif',
          fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.4)',
          maxWidth: 480, textAlign: 'center', lineHeight: 1.7,
          padding: '0 24px', marginTop: 32, position: 'relative', zIndex: 2,
        }}
      >
        Leads captured. Replies sent. Invoices chased. Every gap sealed — while you sleep.
      </p>
    </section>
  );
}
