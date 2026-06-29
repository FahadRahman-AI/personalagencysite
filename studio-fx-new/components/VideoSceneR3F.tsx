'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useAppStore } from '@/lib/store';

const VERTEX = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const FRAGMENT = `
uniform sampler2D uTexture;
uniform float uVelocity;
uniform float uAspect;
varying vec2 vUv;

void main() {
  // object-fit: cover — maps 16:9 video to any screen aspect
  float videoAspect = 16.0 / 9.0;
  vec2 uv = vUv;
  if (uAspect > videoAspect) {
    float s = videoAspect / uAspect;
    uv.y = (uv.y - 0.5) * s + 0.5;
  } else {
    float s = uAspect / videoAspect;
    uv.x = (uv.x - 0.5) * s + 0.5;
  }

  // Chromatic aberration — intensity driven by scroll velocity
  float r = texture2D(uTexture, uv + vec2(uVelocity, 0.0)).r;
  float g = texture2D(uTexture, uv).g;
  float b = texture2D(uTexture, uv - vec2(uVelocity, 0.0)).b;

  // Radial vignette — darkens edges, draws eye to centre
  vec2 vig = vUv * 2.0 - 1.0;
  float vignette = 1.0 - dot(vig * 0.6, vig * 0.6);
  vignette = clamp(pow(vignette, 1.4), 0.0, 1.0);

  gl_FragColor = vec4(vec3(r, g, b) * vignette, 1.0);
}
`;

function VideoPlane({ videoEl }: { videoEl: HTMLVideoElement }) {
  const { viewport } = useThree();
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const texture = useMemo(() => {
    const t = new THREE.VideoTexture(videoEl);
    t.minFilter = THREE.LinearFilter;
    t.magFilter = THREE.LinearFilter;
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [videoEl]);

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uVelocity: { value: 0 },
      uAspect: { value: 1 },
    }),
    [texture],
  );

  useFrame(() => {
    if (!matRef.current) return;
    const vel = Math.abs(useAppStore.getState().scrollVelocity);
    matRef.current.uniforms.uVelocity.value = THREE.MathUtils.lerp(
      matRef.current.uniforms.uVelocity.value,
      vel * 0.0018,
      0.1,
    );
    matRef.current.uniforms.uAspect.value = viewport.width / viewport.height;
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
      />
    </mesh>
  );
}

export default function VideoSceneR3F({ videoEl }: { videoEl: HTMLVideoElement }) {
  return (
    <Canvas
      style={{ width: '100%', height: '100%' }}
      camera={{ position: [0, 0, 5], fov: 75 }}
      gl={{ antialias: false, powerPreference: 'high-performance' }}
    >
      <VideoPlane videoEl={videoEl} />
    </Canvas>
  );
}
