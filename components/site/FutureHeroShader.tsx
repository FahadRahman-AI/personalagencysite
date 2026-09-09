'use client';

/**
 * FutureHeroShader — 18 K-particle toroidal ring with cursor repulsion.
 *
 * Integration contract
 * --------------------
 * • `scrollProgressRef.current` (0–1): written by the parent GSAP ScrollTrigger
 *   every frame. Modulates wave amplitude + ring rotation speed — zero re-renders.
 * • Component is a pure canvas layer. All Studio FX typography/HUD live in Hero.tsx.
 */

import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/** Shared mutable ref — GSAP writes, useFrame reads. No React state. */
export const scrollProgressRef = { current: 0 };

/* ------------------------------------------------------------------ */
/*  GLSL                                                                */
/* ------------------------------------------------------------------ */

const VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uScroll;    // 0–1 scroll progress from GSAP
  uniform vec2  uMouse;     // world-space cursor coords (lerped)

  void main() {
    vec3 pos = position;

    // ── Cursor repulsion ──────────────────────────────────────────
    float distToMouse = distance(pos.xy, uMouse);
    float maxDist = 1.2;
    if (distToMouse < maxDist) {
      float force = 1.0 - distToMouse / maxDist;   // 1 at centre → 0 at edge
      vec2  dir   = normalize(pos.xy - uMouse);     // away from cursor
      pos.xy += dir   * force * 0.45;               // XY repel
      pos.z  += force * 0.8;                        // lift toward camera
    }

    // ── Ambient wave (scroll amplifies depth + frequency) ────────
    float amp  = 0.15 + uScroll * 0.28;
    float freq = 1.5  + uScroll * 0.6;
    float angle = atan(pos.y, pos.x);
    float wave  = sin(angle * 4.0 + uTime * freq) * amp;
    pos.z += wave + sin(pos.x * 3.0 + uTime) * (0.1 + uScroll * 0.12);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = 10.0 / -mv.z;    // perspective attenuation
    gl_Position  = projectionMatrix * mv;
  }
`;

const FRAGMENT = /* glsl */ `
  uniform vec3  uColor;
  uniform float uScroll;

  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;

    float alpha = smoothstep(0.5, 0.0, d) * (0.72 + uScroll * 0.22);
    gl_FragColor = vec4(uColor, alpha * 0.9);
  }
`;

/* ------------------------------------------------------------------ */
/*  Particle ring                                                       */
/* ------------------------------------------------------------------ */

const COUNT = 18000;

/**
 * Window-level pointer tracker — mirrors MonogramScene's approach.
 * Lives outside the component so it survives across renders and is
 * shared by all instances (only one ring is ever mounted at a time).
 */
const windowPointer = { ndcX: 0, ndcY: 0 };
if (typeof window !== 'undefined') {
  window.addEventListener(
    'pointermove',
    (e: PointerEvent) => {
      windowPointer.ndcX = (e.clientX / window.innerWidth)  * 2 - 1;
      windowPointer.ndcY = -(e.clientY / window.innerHeight) * 2 + 1;
    },
    { passive: true }
  );
}

function InteractiveParticleRing() {
  const pointsRef = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const radius = 1.8 + (Math.random() - 0.5) * 0.8;
      const angle  = Math.random() * Math.PI * 2;
      arr[i * 3]     = Math.cos(angle) * radius;
      arr[i * 3 + 1] = Math.sin(angle) * radius;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
    }
    return arr;
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime:   { value: 0 },
      uScroll: { value: 0 },
      uMouse:  { value: new THREE.Vector2(0, 0) },
      uColor:  { value: new THREE.Color('#d946ef') },
    }),
    []
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const s = scrollProgressRef.current;

    // Convert window NDC → world units via camera frustum at z=0 plane
    const cam = state.camera as THREE.PerspectiveCamera;
    const fovRad  = (cam.fov * Math.PI) / 180;
    const halfH   = Math.tan(fovRad / 2) * cam.position.z;
    const halfW   = halfH * cam.aspect;
    const targetX = windowPointer.ndcX * halfW;
    const targetY = windowPointer.ndcY * halfH;

    // Lerp for smooth trailing physics (factor 0.1)
    uniforms.uMouse.value.x += (targetX - uniforms.uMouse.value.x) * 0.1;
    uniforms.uMouse.value.y += (targetY - uniforms.uMouse.value.y) * 0.1;

    uniforms.uTime.value   = t;
    uniforms.uScroll.value = s;

    if (pointsRef.current) {
      // Scroll accelerates rotation for the cinematic scrub feel
      pointsRef.current.rotation.z = t * 0.12 + s * Math.PI * 1.4;
      pointsRef.current.rotation.x = Math.sin(t * 0.22) * 0.08 + s * 0.4;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ------------------------------------------------------------------ */
/*  Exported canvas layer (no typography — handled by Hero.tsx)        */
/* ------------------------------------------------------------------ */

export default function FutureHeroShader() {
  return (
    <>
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 60 }}
        gl={{ antialias: false, alpha: false }}
        style={{ background: 'transparent' }}
        dpr={[1, 1.5]}
      >
        <InteractiveParticleRing />
      </Canvas>

      {/* CRT dither dot-grid — retro pixel texture over the glow */}
      <div
        aria-hidden
        style={{
          position:        'absolute',
          inset:           0,
          zIndex:          1,
          pointerEvents:   'none',
          opacity:         0.18,
          backgroundImage: 'radial-gradient(rgba(217,70,239,0.85) 1px, transparent 0)',
          backgroundSize:  '4px 4px',
        }}
      />
    </>
  );
}
