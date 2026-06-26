import type { Metadata } from "next";
import { Anton, Space_Grotesk } from "next/font/google";
import "./globals.css";

const anton = Anton({
  weight: "400",
  variable: "--font-anton",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  weight: ["300", "400", "600", "700"],
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Studio FX — AI Infrastructure",
  description:
    "Studio FX builds AI infrastructure for businesses that refuse to be left behind. Lead automation, workflow systems, and AI-powered websites.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${anton.variable} ${spaceGrotesk.variable}`}>
      <body>{children}</body>
    </html>
  );
}
