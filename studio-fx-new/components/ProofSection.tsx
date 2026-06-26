'use client';

import { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  label: string;
  glowTimer: number;
}

interface Particle {
  x: number;
  y: number;
  progress: number;
  speed: number;
  fromNode: number;
}

export default function ProofSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    const setSize = () => {
      const w = canvas.parentElement?.clientWidth || 800;
      canvas.width = w * dpr;
      canvas.height = 500 * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = '500px';
      ctx.scale(dpr, dpr);
    };
    setSize();

    const nodeLabels = ['ENQUIRY', 'AI QUALIFIES', 'EMAIL SENT', 'FOLLOW UP', 'CALL BOOKED'];
    const W = canvas.width / dpr;
    const H = canvas.height / dpr;
    const padding = 60;
    const nodeW = 110;
    const nodeH = 48;
    const nodeSpacing = (W - padding * 2 - nodeW) / (nodeLabels.length - 1);

    const nodes: Node[] = nodeLabels.map((label, i) => ({
      x: padding + i * nodeSpacing + nodeW / 2,
      y: H / 2,
      label,
      glowTimer: 0,
    }));

    const flowParticles: Particle[] = [];
    for (let seg = 0; seg < nodeLabels.length - 1; seg++) {
      for (let p = 0; p < 3; p++) {
        flowParticles.push({
          x: 0,
          y: 0,
          progress: Math.random(),
          speed: 0.003 + Math.random() * 0.002,
          fromNode: seg,
        });
      }
    }

    let pulseNode = 0;
    let lastPulse = Date.now();
    let rafId: number;

    const draw = () => {
      rafId = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, W, H);

      // Pulse every 3 seconds
      const now = Date.now();
      if (now - lastPulse > 3000) {
        lastPulse = now;
        nodes[pulseNode].glowTimer = 0;
        pulseNode = (pulseNode + 1) % nodes.length;
      }

      // Draw connecting lines
      for (let i = 0; i < nodes.length - 1; i++) {
        const from = nodes[i];
        const to = nodes[i + 1];
        ctx.beginPath();
        ctx.moveTo(from.x + nodeW / 2, from.y);
        ctx.lineTo(to.x - nodeW / 2, to.y);
        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw flow particles along lines
      for (const p of flowParticles) {
        p.progress += p.speed;
        if (p.progress >= 1) p.progress = 0;

        const from = nodes[p.fromNode];
        const to = nodes[p.fromNode + 1];
        const x1 = from.x + nodeW / 2;
        const y1 = from.y;
        const x2 = to.x - nodeW / 2;
        const y2 = to.y;

        p.x = x1 + (x2 - x1) * p.progress;
        p.y = y1 + (y2 - y1) * p.progress;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#E8350A';
        ctx.fill();
      }

      // Draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const nx = n.x - nodeW / 2;
        const ny = n.y - nodeH / 2;

        const glowing = n.glowTimer < 1;
        if (glowing) {
          n.glowTimer += 0.015;
          const alpha = Math.sin(n.glowTimer * Math.PI) * 0.8;
          ctx.shadowColor = '#E8350A';
          ctx.shadowBlur = 30 * alpha;
        } else {
          ctx.shadowBlur = 0;
        }

        // Rounded rect
        ctx.beginPath();
        const r = 8;
        ctx.moveTo(nx + r, ny);
        ctx.lineTo(nx + nodeW - r, ny);
        ctx.quadraticCurveTo(nx + nodeW, ny, nx + nodeW, ny + r);
        ctx.lineTo(nx + nodeW, ny + nodeH - r);
        ctx.quadraticCurveTo(nx + nodeW, ny + nodeH, nx + nodeW - r, ny + nodeH);
        ctx.lineTo(nx + r, ny + nodeH);
        ctx.quadraticCurveTo(nx, ny + nodeH, nx, ny + nodeH - r);
        ctx.lineTo(nx, ny + r);
        ctx.quadraticCurveTo(nx, ny, nx + r, ny);
        ctx.closePath();

        const borderAlpha = glowing ? 0.15 + Math.sin(n.glowTimer * Math.PI) * 0.4 : 0.15;
        ctx.strokeStyle = `rgba(255,255,255,${borderAlpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,0.03)';
        ctx.fill();

        ctx.shadowBlur = 0;

        // Label
        ctx.font = '10px var(--font-space-grotesk, sans-serif)';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(n.label, n.x, n.y);
      }
    };

    draw();

    const onResize = () => {
      ctx.resetTransform();
      setSize();
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <section
      style={{
        background: '#080808',
        padding: '160px 0',
        textAlign: 'center',
      }}
    >
      <div className="fade-up" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
        <h2
          style={{
            fontFamily: 'var(--font-anton)',
            fontSize: 'clamp(48px, 8vw, 80px)',
            color: 'white',
            marginBottom: '16px',
          }}
        >
          THE SYSTEM
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-space-grotesk)',
            fontWeight: 300,
            fontSize: '16px',
            color: 'rgba(255,255,255,0.4)',
            marginBottom: '64px',
          }}
        >
          Working in real time
        </p>

        <div style={{ width: '100%', overflowX: 'auto' }}>
          <canvas
            ref={canvasRef}
            style={{ display: 'block' }}
          />
        </div>
      </div>
    </section>
  );
}
