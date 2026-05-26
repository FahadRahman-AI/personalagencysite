"use client";

import { useEffect, useRef } from "react";

interface WireframeSphereProps {
  isActive: boolean;
}

export default function WireframeSphere({ isActive }: WireframeSphereProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const angleRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 400;
    canvas.width = size;
    canvas.height = size;

    const pointCount = 200;
    const points: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < pointCount; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / pointCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      points.push({
        x: Math.sin(phi) * Math.cos(theta),
        y: Math.sin(phi) * Math.sin(theta),
        z: Math.cos(phi),
      });
    }

    const project = (x: number, y: number, z: number, rotY: number) => {
      const cos = Math.cos(rotY);
      const sin = Math.sin(rotY);
      const rx = x * cos - z * sin;
      const rz = x * sin + z * cos;
      const scale = 160 / (2.5 - rz);
      return {
        x: size / 2 + rx * scale,
        y: size / 2 + y * scale,
        z: rz,
      };
    };

    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      angleRef.current += 0.008;
      const rotY = angleRef.current;

      const projected = points.map((p) => project(p.x, p.y, p.z, rotY));

      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const a = projected[i];
          const b = projected[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dz = a.z - b.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (dist < 55) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255,255,255,${0.15 * (1 - dist / 55)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const p of projected) {
        ctx.beginPath();
        ctx.fillStyle = "rgba(255,255,255,0.6)";
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => cancelAnimationFrame(rafRef.current);
  }, [isActive]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: 400,
        height: 400,
        display: "block",
      }}
    />
  );
}
