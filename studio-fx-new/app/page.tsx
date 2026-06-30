'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const Preloader       = dynamic(() => import('@/components/Preloader'),       { ssr: false });
const Nav             = dynamic(() => import('@/components/Nav'),             { ssr: false });
const Cursor          = dynamic(() => import('@/components/Cursor'),          { ssr: false });
const HeroSection     = dynamic(() => import('@/components/HeroSection'),     { ssr: false });
const MarqueeSection  = dynamic(() => import('@/components/MarqueeSection'),  { ssr: false });
const ProblemSection  = dynamic(() => import('@/components/ProblemSection'),  { ssr: false });
const SolutionSection = dynamic(() => import('@/components/SolutionSection'), { ssr: false });
const StatsSection    = dynamic(() => import('@/components/StatsSection'),    { ssr: false });
const ProcessSection  = dynamic(() => import('@/components/ProcessSection'),  { ssr: false });
const CTASection      = dynamic(() => import('@/components/CTASection'),      { ssr: false });
const FooterSection   = dynamic(() => import('@/components/FooterSection'),   { ssr: false });

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [ready, setReady] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let lenisRaf: ((time: number) => void) | null = null;
    let lenisInstance: { raf: (t: number) => void; on: (e: string, cb: () => void) => void; destroy: () => void } | null = null;

    import('@studio-freight/lenis').then(({ default: Lenis }) => {
      const lenis = new Lenis({
        lerp: 0.1,
        smoothWheel: true,
      });

      lenisInstance = lenis;
      lenis.on('scroll', ScrollTrigger.update);

      // Store raf reference so we can remove it on cleanup
      lenisRaf = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(lenisRaf);
      gsap.ticker.lagSmoothing(0);
    });

    return () => {
      if (lenisRaf) gsap.ticker.remove(lenisRaf);
      if (lenisInstance) lenisInstance.destroy();
    };
  }, []);

  const handlePreloaderComplete = () => {
    setReady(true);
    // Smooth fade-in of main content after preloader exits
    if (mainRef.current) {
      gsap.fromTo(mainRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.1 }
      );
    }
  };

  return (
    <>
      {/* Film grain overlay */}
      <div id="grain" aria-hidden="true" />

      {/* Navigation */}
      <Nav />

      {/* Custom cursor (no-op on touch) */}
      <Cursor />

      {/* Preloader — unmounts itself after animation */}
      {!ready && <Preloader onComplete={handlePreloaderComplete} />}

      {/* Main page — hidden until preloader complete */}
      <main
        ref={mainRef}
        style={{ opacity: 0, willChange: 'opacity' }}
      >
        <HeroSection />
        <MarqueeSection />
        <ProblemSection />
        <SolutionSection />
        <StatsSection />
        <ProcessSection />
        <CTASection />
        <FooterSection />
      </main>
    </>
  );
}
