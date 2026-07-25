'use client';

/**
 * Systems in motion — light. 3D curved poster ribbon scrubbed by
 * scroll, headline split around it.
 */

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RibbonScene } from '@/lib/site/RibbonScene';

gsap.registerPlugin(ScrollTrigger);

export default function Ribbon() {
  const rootRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    let scene: RibbonScene | null = null;
    let trigger: ScrollTrigger | null = null;

    // Posters draw with the site's webfonts — wait for them.
    let cancelled = false;
    void document.fonts.ready.then(() => {
      if (cancelled) return;
      scene = new RibbonScene(canvas);

      trigger = ScrollTrigger.create({
        trigger: root,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => scene?.setProgress(self.progress),
      });
    });

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? scene?.start() : scene?.stop()),
      { threshold: 0.02 }
    );
    io.observe(root);

    return () => {
      cancelled = true;
      trigger?.kill();
      io.disconnect();
      scene?.dispose();
    };
  }, []);

  return (
    <section ref={rootRef} className="ribbon" data-theme-section="light">
      <div className="ribbonSticky">
        <h2 className="ribbonTitle" aria-label="Systems in motion">
          <span className="ribbonTitleTop">SYSTEMS IN</span>
          <span className="ribbonTitleBottom">MOTION</span>
        </h2>
        <p className="ribbonSub">
          INTERFACES, FLOWS AND CONSOLES
          <br />
          FROM INSIDE THE MACHINE.
        </p>
        <canvas ref={canvasRef} className="ribbonCanvas" aria-hidden />

        <p className="ribbonAside">
          Concepts, consoles and interface
          <br />
          experiments shared openly as part
          <br />
          of our build practice.
        </p>
        <a
          href="mailto:fahadrahman9819@gmail.com?subject=Show%20me%20more"
          className="monoCta ribbonLink"
          data-hover
        >
          VIEW THE FEED <span className="monoCtaArrow">→</span>
        </a>
      </div>
    </section>
  );
}
