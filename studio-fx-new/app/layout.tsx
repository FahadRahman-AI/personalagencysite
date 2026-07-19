import type { Metadata, Viewport } from "next";
import { Familjen_Grotesk, Martian_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

/* Display — warm grotesk for headlines (Trionn's actual H1 face, open source) */
const familjen = Familjen_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

/* Mono — technical labels, CTAs, data (also Trionn's actual mono, open source) */
const martian = Martian_Mono({
  weight: ["300", "400"],
  variable: "--font-mono",
  subsets: ["latin"],
});

/* Body — Switzer, the Neue Haas Display role (Fontshare, free license) */
const switzer = localFont({
  variable: "--font-body",
  src: [
    { path: "./fonts/Switzer-Light.woff2", weight: "300", style: "normal" },
    { path: "./fonts/Switzer-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Switzer-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Switzer-Semibold.woff2", weight: "600", style: "normal" },
  ],
});

/* Serif accent — Zodiak italic, the PP Editorial New role (Fontshare, free) */
const zodiak = localFont({
  variable: "--font-serif",
  src: [
    { path: "./fonts/Zodiak-LightItalic.woff2", weight: "300", style: "italic" },
    { path: "./fonts/Zodiak-Italic.woff2", weight: "400", style: "italic" },
  ],
});

export const metadata: Metadata = {
  title: "Studio FX® — AI Infrastructure Studio",
  description:
    "Studio FX is an AI infrastructure studio building lead engines, workflow systems and intelligent websites — built for clarity, speed and scale.",
};

export const viewport: Viewport = {
  themeColor: "#040508",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${familjen.variable} ${martian.variable} ${switzer.variable} ${zodiak.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
