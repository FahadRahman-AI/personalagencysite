'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { useAppStore } from '@/lib/store';

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const setScroll = useAppStore((s) => s.setScroll);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    lenis.on('scroll', ({ scroll, velocity }: { scroll: number; velocity: number }) => {
      setScroll(scroll, velocity);
    });

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [setScroll]);

  return <>{children}</>;
}
