'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAppStore } from '@/lib/store';

const vertexShader = /* glsl */ `
  attribute float aPhase;
  uniform float uTime;
  uniform float uMouseX;
  uniform float uMouseY;
  uniform float uScrollVelocity;

  void main() {
    vec3 pos = position;

    // Sine wave breathing
    pos.y += sin(pos.x * 0.08 + uTime + aPhase) * 1.8;
    pos.y += cos(pos.z * 0.05 + uTime * 0.6 + aPhase) * 0.9;

    // Scroll velocity distortion
    pos.x += sin(pos.y * 0.1 + uTime) * uScrollVelocity * 0.8;

    // Mouse repel — world mouse coords mapped to scene
    float mxWorld = (uMouseX * 2.0 - 1.0) * 60.0;
    float myWorld = -(uMouseY * 2.0 - 1.0) * 35.0;
    float dx = pos.x - mxWorld;
    float dy = pos.y - myWorld;
    float dist = sqrt(dx * dx + dy * dy);
    float repel = smoothstep(12.0, 0.0, dist);
    pos.x += (dx / max(dist, 0.001)) * repel * 4.0;
    pos.y += (dy / max(dist, 0.001)) * repel * 4.0;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = (2.0 / -mvPosition.z) * 120.0;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = /* glsl */ `
  void main() {
    // Circular particle shape
    vec2 uv = gl_PointCoord - 0.5;
    float d = dot(uv, uv);
    if (d > 0.25) discard;
    float alpha = 1.0 - smoothstep(0.15, 0.25, d);
    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha * 0.75);
  }
`;

function Particles({ count }: { count: number }) {
  const meshRef = useRef<THREE.Points>(null!);
  const mouseX = useAppStore((s) => s.mouseX);
  const mouseY = useAppStore((s) => s.mouseY);
  const scrollVelocity = useAppStore((s) => s.scrollVelocity);

  const { positions, phases } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const phases    = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 120;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 25;
      phases[i]             = Math.random() * Math.PI * 2;
    }
    return { positions, phases };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime:           { value: 0 },
      uMouseX:         { value: 0.5 },
      uMouseY:         { value: 0.5 },
      uScrollVelocity: { value: 0 },
    }),
    []
  );

  useFrame(({ clock }) => {
    uniforms.uTime.value           = clock.getElapsedTime();
    uniforms.uMouseX.value         = mouseX;
    uniforms.uMouseY.value         = mouseY;
    uniforms.uScrollVelocity.value = THREE.MathUtils.lerp(
      uniforms.uScrollVelocity.value,
      scrollVelocity,
      0.08
    );
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-aPhase"
          args={[phases, 1]}
        />
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

interface HeroSceneProps {
  count?: number;
}

export default function HeroScene({ count = 2000 }: HeroSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 55], fov: 60 }}
      style={{ position: 'absolute', inset: 0, background: '#080808' }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 1.5]}
    >
      <Particles count={count} />
    </Canvas>
  );
}
