'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAppStore } from '@/lib/store';

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uMouseX;
  uniform float uMouseY;

  varying float vElevation;
  varying float vDepth;

  void main() {
    vec3 pos = position;

    // Subtle noise displacement driven by mouse
    float displacement = sin(pos.x * 2.0 + uTime * 0.8) *
                         cos(pos.y * 2.0 + uTime * 0.6) * 0.04;
    displacement += sin(pos.z * 1.5 + uTime * 0.5 + uMouseX * 2.0) *
                    cos(pos.x * 1.5 + uMouseY * 2.0) * 0.06;
    pos += normal * displacement;

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    vDepth = (-mvPos.z - 1.5) / 3.0;
    vElevation = displacement;

    gl_Position = projectionMatrix * mvPos;
    gl_PointSize = (2.5 + displacement * 8.0) * (300.0 / -mvPos.z);
  }
`;

const fragmentShader = /* glsl */ `
  varying float vElevation;
  varying float vDepth;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = dot(uv, uv);
    if (d > 0.25) discard;

    float alpha = (1.0 - smoothstep(0.1, 0.25, d))
                * (0.3 + vDepth * 0.5)
                * (0.7 + vElevation * 4.0);
    alpha = clamp(alpha, 0.0, 0.9);

    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
  }
`;

function Sphere() {
  const meshRef = useRef<THREE.Points>(null!);
  const mouseX = useAppStore((s) => s.mouseX);
  const mouseY = useAppStore((s) => s.mouseY);

  const geo = useMemo(() => {
    const g = new THREE.IcosahedronGeometry(1.5, 32);
    return g;
  }, []);

  const uniforms = useMemo(() => ({
    uTime:   { value: 0 },
    uMouseX: { value: 0.5 },
    uMouseY: { value: 0.5 },
  }), []);

  useFrame(({ clock }) => {
    uniforms.uTime.value   = clock.getElapsedTime();
    uniforms.uMouseX.value = THREE.MathUtils.lerp(uniforms.uMouseX.value, mouseX, 0.04);
    uniforms.uMouseY.value = THREE.MathUtils.lerp(uniforms.uMouseY.value, mouseY, 0.04);
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.004;
      meshRef.current.rotation.x += 0.001;
    }
  });

  return (
    <points ref={meshRef} geometry={geo}>
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

export default function WireframeSphereR3F({ isActive }: { isActive: boolean }) {
  if (!isActive) return null;

  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 50 }}
      style={{ width: 400, height: 400, background: 'transparent' }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
    >
      <Sphere />
    </Canvas>
  );
}
