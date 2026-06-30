'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const NODE_DATA = [
  { label: 'INTAKE',   pos: [-3.5, 0.2, 0] as const },
  { label: 'CRM',      pos: [-1.6, 0.9, 0] as const },
  { label: 'AUTOMATE', pos: [0.1,  0,   0] as const },
  { label: 'NOTIFY',   pos: [1.8, -0.7, 0] as const },
  { label: 'CLOSED',   pos: [3.5,  0.5, 0] as const },
];

const EDGES = [[0,1],[1,2],[2,3],[3,4]] as const;

/* ─── Fragment shader for glowing nodes ────────────────────────── */
const NODE_VERT = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
const NODE_FRAG = `
uniform float uActive;
uniform float uTime;
varying vec2 vUv;
void main() {
  vec2 center = vUv - 0.5;
  float dist = length(center);
  float ring = smoothstep(0.48, 0.45, dist) * smoothstep(0.35, 0.38, dist);
  float glow = exp(-dist * 5.0) * 0.3 * uActive;
  float pulse = 0.8 + sin(uTime * 2.5) * 0.2;
  vec3 activeColor = vec3(0.91, 0.21, 0.04);
  vec3 dimColor    = vec3(0.15, 0.15, 0.15);
  vec3 color = mix(dimColor, activeColor, uActive);
  float alpha = max(ring, glow) * mix(0.4, pulse, uActive);
  gl_FragColor = vec4(color, alpha);
}
`;

export default function SolutionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef  = useRef<HTMLDivElement>(null);
  const headRef    = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const wrap    = canvasRef.current;
    if (!section || !wrap) return;

    /* ── Renderer ─────────────────────────────── */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(wrap.clientWidth, wrap.clientHeight);
    Object.assign(renderer.domElement.style, {
      position: 'absolute', top: '0', left: '0', width: '100%', height: '100%',
    });
    wrap.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, wrap.clientWidth / wrap.clientHeight, 0.1, 100);
    camera.position.set(0, 0.3, 8);

    /* ── Node meshes with shader ──────────────── */
    const planeGeo = new THREE.PlaneGeometry(0.7, 0.7);
    const nodeUniforms: { uActive: { value: number }, uTime: { value: number } }[] = [];
    const nodeMeshes: THREE.Mesh[] = [];

    NODE_DATA.forEach(({ pos }) => {
      const u = { uActive: { value: 0 }, uTime: { value: 0 } };
      nodeUniforms.push(u);
      const mat  = new THREE.ShaderMaterial({
        vertexShader:   NODE_VERT,
        fragmentShader: NODE_FRAG,
        uniforms: u,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const mesh = new THREE.Mesh(planeGeo, mat);
      mesh.position.set(pos[0], pos[1], pos[2]);
      scene.add(mesh);
      nodeMeshes.push(mesh);
    });

    /* ── Connection lines ────────────────────── */
    const lineMats: THREE.LineBasicMaterial[] = [];
    EDGES.forEach(([a, b]) => {
      const start = new THREE.Vector3(NODE_DATA[a].pos[0], NODE_DATA[a].pos[1], NODE_DATA[a].pos[2]);
      const end   = new THREE.Vector3(NODE_DATA[b].pos[0], NODE_DATA[b].pos[1], NODE_DATA[b].pos[2]);

      // Curved line via quadratic bezier points
      const mid = start.clone().lerp(end, 0.5);
      mid.y += 0.3;
      const curve  = new THREE.QuadraticBezierCurve3(start, mid, end);
      const pts    = curve.getPoints(40);
      const geo    = new THREE.BufferGeometry().setFromPoints(pts);
      const mat    = new THREE.LineBasicMaterial({ color: 0x222222, transparent: true, opacity: 0.5 });
      lineMats.push(mat);
      scene.add(new THREE.Line(geo, mat));
    });

    /* ── Travelling particles ────────────────── */
    type Traveller = { mesh: THREE.Mesh; edge: number; t: number; speed: number };
    const dotGeo = new THREE.SphereGeometry(0.05, 8, 8);
    const travellers: Traveller[] = [];

    EDGES.forEach((edge, edgeIdx) => {
      for (let i = 0; i < 4; i++) {
        const mat  = new THREE.MeshBasicMaterial({
          color: 0xe8350a, transparent: true, opacity: 0,
        });
        const mesh = new THREE.Mesh(dotGeo, mat);
        scene.add(mesh);
        travellers.push({ mesh, edge: edgeIdx, t: i / 4, speed: 0.003 + Math.random() * 0.003 });
      }
    });

    /* ── ScrollTrigger ───────────────────────── */
    const state = { progress: 0 };
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=200%',
        pin: true,
        scrub: 1.5,
        onUpdate(self) { state.progress = self.progress; },
      });
    }, section);

    /* ── Text entrance ───────────────────────── */
    if (headRef.current) {
      gsap.from(headRef.current, {
        opacity: 0, y: 32, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 75%' },
      });
    }

    /* ── RAF ─────────────────────────────────── */
    let rafId: number;
    const clock = new THREE.Clock();
    const curves = EDGES.map(([a, b]) => {
      const s = new THREE.Vector3(NODE_DATA[a].pos[0], NODE_DATA[a].pos[1], NODE_DATA[a].pos[2]);
      const e = new THREE.Vector3(NODE_DATA[b].pos[0], NODE_DATA[b].pos[1], NODE_DATA[b].pos[2]);
      const m = s.clone().lerp(e, 0.5); m.y += 0.3;
      return new THREE.QuadraticBezierCurve3(s, m, e);
    });

    const tick = () => {
      rafId = requestAnimationFrame(tick);
      const t    = clock.getElapsedTime();
      const prog = state.progress;

      // Activate nodes progressively
      NODE_DATA.forEach((_, i) => {
        const threshold = i / (NODE_DATA.length - 1);
        const active    = Math.max(0, Math.min(1, (prog - threshold + 0.1) * 10));
        nodeUniforms[i].uActive.value += (active - nodeUniforms[i].uActive.value) * 0.05;
        nodeUniforms[i].uTime.value    = t;

        // Active nodes' edge lines glow
        if (i < lineMats.length) {
          lineMats[i].color.lerp(
            new THREE.Color(nodeUniforms[i].uActive.value > 0.5 ? 0xe8350a : 0x222222),
            0.04
          );
        }
      });

      // Travellers
      travellers.forEach(p => {
        p.t = (p.t + p.speed) % 1;
        const pt  = curves[p.edge].getPoint(p.t);
        p.mesh.position.copy(pt);
        const srcActive = nodeUniforms[EDGES[p.edge][0]].uActive.value;
        (p.mesh.material as THREE.MeshBasicMaterial).opacity = srcActive * 0.8;
      });

      // Gentle scene sway
      scene.rotation.y = Math.sin(t * 0.06) * 0.08;
      scene.rotation.x = Math.sin(t * 0.04) * 0.02;

      renderer.render(scene, camera);
    };
    tick();

    const onResize = () => {
      camera.aspect = wrap.clientWidth / wrap.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(wrap.clientWidth, wrap.clientHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      ctx.revert();
      renderer.dispose();
      planeGeo.dispose();
      dotGeo.dispose();
      if (wrap.contains(renderer.domElement)) wrap.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative', width: '100%', height: '100vh',
        background: '#080808', overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{
        position: 'absolute', top: '50%', left: 64,
        transform: 'translateY(-160px)', zIndex: 2,
      }}>
        <p style={{
          fontFamily: 'var(--font-space-var), sans-serif',
          fontSize: 10, letterSpacing: '0.35em', color: '#E8350A',
          textTransform: 'uppercase', marginBottom: 16,
        }}>The solution</p>
        <h2
          ref={headRef}
          style={{
            fontFamily: 'var(--font-anton-var), sans-serif',
            fontSize: 'clamp(40px, 5vw, 72px)',
            lineHeight: 0.9, letterSpacing: '-0.01em', color: '#fff',
          }}
        >
          YOUR OPERATION<br />ON AUTOPILOT.
        </h2>
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, zIndex: 1 }}
      />

      {/* Node labels — positioned over canvas */}
      <div style={{
        position: 'absolute', bottom: '25%', left: 0, right: 0,
        zIndex: 3, display: 'flex', justifyContent: 'space-around',
        padding: '0 64px', pointerEvents: 'none',
      }}>
        {NODE_DATA.map(({ label }, i) => (
          <span key={i} style={{
            fontFamily: 'var(--font-space-var), sans-serif',
            fontSize: 9, letterSpacing: '0.25em',
            color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase',
          }}>
            {label}
          </span>
        ))}
      </div>

      {/* Subline */}
      <p style={{
        position: 'absolute', bottom: 56, left: '50%', transform: 'translateX(-50%)',
        zIndex: 3, fontFamily: 'var(--font-space-var), sans-serif',
        fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.3)',
        textAlign: 'center', maxWidth: 480, lineHeight: 1.7,
        whiteSpace: 'nowrap',
      }}>
        Scroll to watch the workflow activate.
      </p>
    </section>
  );
}
