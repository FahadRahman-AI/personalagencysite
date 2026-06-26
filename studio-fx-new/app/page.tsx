import HeroSection from '@/components/HeroSection';
import MarqueeSection from '@/components/MarqueeSection';
import WhatWeDoSection from '@/components/WhatWeDoSection';
import ProofSection from '@/components/ProofSection';
import StatsSection from '@/components/StatsSection';
import CTASection from '@/components/CTASection';
import FooterSection from '@/components/FooterSection';
import CustomCursor from '@/components/CustomCursor';
import ScrollObserver from '@/components/ScrollObserver';

export default function Home() {
  return (
    <>
      <CustomCursor />
      <ScrollObserver />
      <main>
        <HeroSection />
        <MarqueeSection />
        <WhatWeDoSection />
        <ProofSection />
        <StatsSection />
        <CTASection />
        <FooterSection />
      </main>
    </>
  );
}
