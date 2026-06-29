import type { Metadata } from 'next';
import { Anton, Space_Grotesk } from 'next/font/google';
import './globals.css';

const anton = Anton({
  weight: '400',
  variable: '--font-anton-var',
  subsets: ['latin'],
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space-var',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Studio FX — Operations Intelligence',
  description:
    'We find where your business bleeds time and money. Then we seal every gap — automatically.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${anton.variable} ${spaceGrotesk.variable}`}>
      <body>{children}</body>
    </html>
  );
}
