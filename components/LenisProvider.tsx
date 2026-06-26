'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { useAppStore } from '@/lib/store';

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const setScroll = useAppStore((s) => s.setScroll);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on('scroll', ({ scroll, velocity }: { scroll: number; velocity: number }) => {
      setScroll(scroll, velocity);
    });

    let rafId: number;
    const tick = (t: number) => { lenis.raf(t); rafId = requestAnimationFrame(tick); };
    rafId = requestAnimationFrame(tick);

    return () => { cancelAnimationFrame(rafId); lenis.destroy(); };
  }, [setScroll]);

  return <>{children}</>;
}
