import VideoHero   from '@/components/VideoHero';
import LenisProvider from '@/components/LenisProvider';

export default function Home() {
  return (
    <LenisProvider>
      <div id="grain" aria-hidden="true" />
      <VideoHero />
    </LenisProvider>
  );
}
