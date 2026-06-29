import VideoScrollSection from '@/components/VideoScrollSection';
import MarqueeSection    from '@/components/MarqueeSection';
import WhatWeDoSection   from '@/components/WhatWeDoSection';
import ProofSection      from '@/components/ProofSection';
import StatsSection      from '@/components/StatsSection';
import CTASection        from '@/components/CTASection';
import FooterSection     from '@/components/FooterSection';
import LenisProvider     from '@/components/LenisProvider';
import Cursor            from '@/components/Cursor';

export default function Home() {
  return (
    <LenisProvider>
      <Cursor />
      <div id="grain" aria-hidden="true" />
      <main>
        <VideoScrollSection />
        <MarqueeSection />
        <WhatWeDoSection />
        <ProofSection />
        <StatsSection />
        <CTASection />
        <FooterSection />
      </main>
    </LenisProvider>
  );
}
