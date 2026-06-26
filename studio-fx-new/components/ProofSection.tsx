'use client';

import { useEffect, useRef, useState } from 'react';
import { useSpring, animated } from '@react-spring/web';

interface WorkflowNode {
  x: number;
  y: number;
  label: string;
  glowProgress: number;
  glowing: boolean;
}

interface FlowParticle {
  progress: number;
  speed: number;
  segment: number;
}

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

export default function ProofSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { ref: sectionRef, inView } = useInView();

  const headerSpring = useSpring({
    opacity: inView ? 1 : 0,
    y: inView ? 0 : 40,
    config: { mass: 1, tension: 160, friction: 38 },
    delay: 100,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const w = container.clientWidth;
      const h = 480;
      canvas.width  = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width  = w + 'px';
      canvas.style.height = h + 'px';
    };
    resize();

    const ctx = canvas.getContext('2d')!;
    ctx.scale(dpr, dpr);

    const W = canvas.width / dpr;
    const H = canvas.height / dpr;

    const NODE_LABELS = ['ENQUIRY', 'AI QUALIFIES', 'EMAIL SENT', 'FOLLOW UP', 'CALL BOOKED'];
    const NW = 108, NH = 44;
    const pad = 56;
    const step = (W - pad * 2 - NW) / (NODE_LABELS.length - 1);

    const nodes: WorkflowNode[] = NODE_LABELS.map((label, i) => ({
      x: pad + i * step + NW / 2,
      y: H / 2,
      label,
      glowProgress: 1,
      glowing: false,
    }));

    const particles: FlowParticle[] = [];
    for (let seg = 0; seg < NODE_LABELS.length - 1; seg++) {
      for (let p = 0; p < 4; p++) {
        particles.push({ progress: Math.random(), speed: 0.0025 + Math.random() * 0.002, segment: seg });
      }
    }

    let pulseIdx = 0;
    let lastPulse = 0;
    let rafId: number;

    const roundRect = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    };

    const draw = (ts: number) => {
      rafId = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, W, H);

      // Trigger pulse every 3s
      if (ts - lastPulse > 3000) {
        lastPulse = ts;
        nodes[pulseIdx].glowing = true;
        nodes[pulseIdx].glowProgress = 0;
        pulseIdx = (pulseIdx + 1) % nodes.length;
      }

      // Advance glow
      nodes.forEach(n => { if (n.glowing) { n.glowProgress = Math.min(n.glowProgress + 0.012, 1); } });

      // Connector lines
      for (let i = 0; i < nodes.length - 1; i++) {
        const a = nodes[i], b = nodes[i + 1];
        ctx.beginPath();
        ctx.moveTo(a.x + NW / 2, a.y);
        ctx.lineTo(b.x - NW / 2, b.y);
        ctx.strokeStyle = 'rgba(255,255,255,0.06)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Flow particles
      particles.forEach(p => {
        p.progress += p.speed;
        if (p.progress >= 1) p.progress = 0;
        const a = nodes[p.segment], b = nodes[p.segment + 1];
        const x1 = a.x + NW / 2, y1 = a.y;
        const x2 = b.x - NW / 2, y2 = b.y;
        const px = x1 + (x2 - x1) * p.progress;
        const py = y1 + (y2 - y1) * p.progress;
        const alpha = Math.sin(p.progress * Math.PI);
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232, 53, 10, ${alpha * 0.9})`;
        ctx.fill();
      });

      // Nodes
      nodes.forEach(n => {
        const nx = n.x - NW / 2;
        const ny = n.y - NH / 2;
        const glowAlpha = n.glowing ? Math.sin(n.glowProgress * Math.PI) : 0;

        if (glowAlpha > 0.01) {
          ctx.shadowColor = '#E8350A';
          ctx.shadowBlur  = 24 * glowAlpha;
        }

        roundRect(nx, ny, NW, NH, 6);
        ctx.fillStyle   = `rgba(232,53,10,${glowAlpha * 0.08})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(255,255,255,${0.1 + glowAlpha * 0.5})`;
        ctx.lineWidth   = glowAlpha > 0.5 ? 1.5 : 1;
        ctx.stroke();
        ctx.shadowBlur  = 0;

        ctx.font        = '600 9px var(--font-space-grotesk, sans-serif)';
        ctx.fillStyle   = `rgba(255,255,255,${0.6 + glowAlpha * 0.4})`;
        ctx.textAlign   = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(n.label, n.x, n.y);
      });
    };

    rafId = requestAnimationFrame(draw);
    window.addEventListener('resize', () => { ctx.resetTransform(); resize(); ctx.scale(dpr, dpr); });
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <section style={{ background: '#080808', padding: '160px 0', textAlign: 'center' }}>
      <div ref={sectionRef} style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 48px' }}>
        <animated.div style={headerSpring}>
          <p style={{
            fontFamily: 'var(--font-space-grotesk)',
            fontSize: '11px',
            color: '#E8350A',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            marginBottom: '20px',
          }}>
            LIVE SYSTEM
          </p>
          <h2 style={{
            fontFamily: 'var(--font-anton)',
            fontSize: 'clamp(48px, 7vw, 88px)',
            color: 'white',
            lineHeight: 0.9,
            marginBottom: '16px',
            letterSpacing: '-0.01em',
          }}>
            THE SYSTEM
          </h2>
          <p style={{
            fontFamily: 'var(--font-space-grotesk)',
            fontWeight: 300,
            fontSize: '15px',
            color: 'rgba(255,255,255,0.35)',
            marginBottom: '72px',
          }}>
            Working in real time
          </p>
        </animated.div>

        <div ref={containerRef} style={{ width: '100%', overflowX: 'auto' }}>
          <canvas ref={canvasRef} style={{ display: 'block' }} />
        </div>
      </div>
    </section>
  );
}
