'use client';

import dynamic from 'next/dynamic';

const WireframeSphereR3F = dynamic(() => import('./WireframeSphereR3F'), { ssr: false });

interface WireframeSphereProps {
  isActive: boolean;
}

export default function WireframeSphere({ isActive }: WireframeSphereProps) {
  return <WireframeSphereR3F isActive={isActive} />;
}
