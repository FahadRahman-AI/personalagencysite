'use client';

/**
 * Showreel — subdivision.work-style full-screen project viewer.
 * Five procedural film chapters (ReelScene) switched by scroll;
 * HUD: index on the left edge, year on the right, small centered
 * title, running per-chapter timecode, archival system index.
 */

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ReelScene } from '@/lib/site/ReelScene';

gsap.registerPlugin(ScrollTrigger);

const CHAPTERS = [
  { n: '001', name: 'Never miss a call', dur: 38 },
  { n: '002', name: 'Quotes on autopilot', dur: 52 },
  { n: '003', name: 'Business on rails', dur: 74 },
  { n: '004', name: 'Sites that sell', dur: 47 },
  { n: '005', name: 'AI infrastructure', dur: 62 },
];

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
}

export default function Showreel() {
  const rootRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const sceneRef = useRef<ReelScene | null>(null);
  const hoverRef = useRef(false);
  const [active, setActive] = useState(0);
  const [code, setCode] = useState('00:00');

  /* Hovering a row summons its chapter; the next scroll takes over again */
  const hoverTo = (i: number) => {
    hoverRef.current = true;
    setActive(i);
    sceneRef.current?.setProgress((i + 0.5) / CHAPTERS.length);
    if (barRef.current) barRef.current.style.transform = 'scaleX(0.5)';
  };

  /* Scene + scroll scrub */
  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    const scene = new ReelScene(canvas);
    sceneRef.current = scene;

    const trigger = ScrollTrigger.create({
      trigger: root,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        hoverRef.current = false;
        scene.setProgress(self.progress);
        const idx = Math.min(CHAPTERS.length - 1, Math.floor(self.progress * CHAPTERS.length));
        setActive(idx);
        if (barRef.current) {
          const local = (self.progress * CHAPTERS.length) % 1;
          barRef.current.style.transform = `scaleX(${local})`;
        }
      },
    });

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? scene.start() : scene.stop()),
      { threshold: 0.02 }
    );
    io.observe(root);

    return () => {
      trigger.kill();
      io.disconnect();
      scene.dispose();
      sceneRef.current = null;
    };
  }, []);

  /* Per-chapter timecode: resets on switch, loops on its runtime */
  useEffect(() => {
    const dur = CHAPTERS[active].dur;
    const t0 = performance.now();
    setCode('00:00');
    const id = setInterval(() => {
      setCode(fmt(((performance.now() - t0) / 1000) % dur));
    }, 250);
    return () => clearInterval(id);
  }, [active]);

  const ch = CHAPTERS[active];

  return (
    <section ref={rootRef} className="reel" data-theme-section="dark" aria-label="Showreel">
      <div className="reelSticky">
        <canvas ref={canvasRef} className="reelCanvas" aria-hidden />

        {/* Edge HUD — index left, year right, both vertically centered */}
        <span className="reelHud reelEdgeIndex">{ch.n}</span>
        <span className="reelHud reelEdgeYear">2026</span>

        {/* Small centered title, re-keyed for the crossfade */}
        <p key={active} className="reelTitle">
          {ch.name}
        </p>

        {/* Chapter progress under the title */}
        <span className="reelBar" aria-hidden>
          <span ref={barRef} className="reelBarFill" />
        </span>

        {/* Corners */}
        <span className="reelHud reelRec">
          <span className="reelDot" /> SYSTEMS IN SERVICE
        </span>
        <span className="reelHud reelCode">
          {code} / {fmt(ch.dur)}
        </span>

        {/* Chapter ticks — five frames on the strip, hoverable */}
        <span className="reelTicks">
          {CHAPTERS.map((c, i) => (
            <span
              key={c.n}
              className={i === active ? 'reelTick reelTickOn' : 'reelTick'}
              onMouseEnter={() => hoverTo(i)}
              data-hover
            />
          ))}
        </span>

        {/* Archival index — hover a row to summon its chapter */}
        <ul className="reelList" aria-label="System index">
          {CHAPTERS.map((it, i) => (
            <li
              key={it.n}
              className={i === active ? 'reelRowOn' : undefined}
              onMouseEnter={() => hoverTo(i)}
              data-hover
            >
              <span>{it.n}</span>
              <span className="reelListName">{it.name.toUpperCase()}</span>
              <span>{fmt(it.dur)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
