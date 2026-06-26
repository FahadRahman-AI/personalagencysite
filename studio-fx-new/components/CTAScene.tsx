'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAppStore } from '@/lib/store';

const vertexShader = /* glsl */ `
  attribute float aPhase;
  attribute float aSpeed;
  uniform float uTime;
  uniform float uScrollVelocity;

  void main() {
    vec3 pos = position;
    pos.y += sin(pos.x * 0.06 + uTime * aSpeed + aPhase) * 2.4;
    pos.x += cos(pos.y * 0.04 + uTime * aSpeed * 0.7 + aPhase) * 1.2;
    pos.x += sin(uTime * 0.3) * uScrollVelocity * 0.5;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = (1.5 / -mv.z) * 120.0;
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = dot(uv, uv);
    if (d > 0.25) discard;
    float alpha = (1.0 - smoothstep(0.1, 0.25, d)) * 0.45;
    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
  }
`;

function CTAParticles({ count }: { count: number }) {
  const scrollVelocity = useAppStore((s) => s.scrollVelocity);

  const { positions, phases, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const phases    = new Float32Array(count);
    const speeds    = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 160;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
      phases[i]             = Math.random() * Math.PI * 2;
      speeds[i]             = 0.4 + Math.random() * 0.6;
    }
    return { positions, phases, speeds };
  }, [count]);

  const uniforms = useMemo(() => ({
    uTime:           { value: 0 },
    uScrollVelocity: { value: 0 },
  }), []);

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.getElapsedTime();
    uniforms.uScrollVelocity.value = THREE.MathUtils.lerp(
      uniforms.uScrollVelocity.value, scrollVelocity, 0.05
    );
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aPhase"   args={[phases, 1]} />
        <bufferAttribute attach="attributes-aSpeed"   args={[speeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function CTAScene({ count = 800 }: { count?: number }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 65], fov: 60 }}
      style={{ position: 'absolute', inset: 0 }}
      gl={{ antialias: false, alpha: true }}
      dpr={[1, 1.2]}
    >
      <CTAParticles count={count} />
    </Canvas>
  );
}
