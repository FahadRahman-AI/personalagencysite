'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const Preloader      = dynamic(() => import('@/components/Preloader'),      { ssr: false });
const Cursor         = dynamic(() => import('@/components/Cursor'),         { ssr: false });
const HeroSection    = dynamic(() => import('@/components/HeroSection'),    { ssr: false });
const MarqueeSection = dynamic(() => import('@/components/MarqueeSection'), { ssr: false });
const ProblemSection = dynamic(() => import('@/components/ProblemSection'), { ssr: false });
const StatsSection   = dynamic(() => import('@/components/StatsSection'),   { ssr: false });
const ProcessSection = dynamic(() => import('@/components/ProcessSection'), { ssr: false });
const CTASection     = dynamic(() => import('@/components/CTASection'),     { ssr: false });
const FooterSection  = dynamic(() => import('@/components/FooterSection'),  { ssr: false });

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let lenis: import('@studio-freight/lenis').default | null = null;

    import('@studio-freight/lenis').then(({ default: Lenis }) => {
      lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => { lenis!.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    });

    return () => {
      if (lenis) lenis.destroy();
      gsap.ticker.remove(() => {});
    };
  }, []);

  const handlePreloaderComplete = () => setReady(true);

  return (
    <>
      {/* Grain overlay */}
      <div id="grain" aria-hidden="true" />

      {/* Custom cursor */}
      <Cursor />

      {/* Preloader */}
      {!ready && <Preloader onComplete={handlePreloaderComplete} />}

      {/* Main content */}
      <main style={{ visibility: ready ? 'visible' : 'hidden' }}>
        <HeroSection />
        <MarqueeSection />
        <ProblemSection />
        <StatsSection />
        <ProcessSection />
        <CTASection />
        <FooterSection />
      </main>
    </>
  );
}
