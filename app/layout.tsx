import type { Metadata, Viewport } from "next";
import { Familjen_Grotesk, Martian_Mono } from "next/font/google";
import localFont from "next/font/local";
import { SITE } from "@/lib/site/seo";
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
  metadataBase: new URL(SITE.url),
  title: {
    default: "Studio FX® — AI Infrastructure Studio",
    template: "%s · Studio FX®",
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.legalName }],
  creator: SITE.legalName,
  publisher: SITE.legalName,
  category: "technology",
  keywords: [
    "AI infrastructure",
    "lead engine",
    "AI automation studio",
    "workflow systems",
    "intelligent websites",
    "AI product studio",
    "Studio FX",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: "Studio FX® — AI Infrastructure Studio",
    description: SITE.description,
    url: SITE.url,
    locale: SITE.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: "Studio FX® — AI Infrastructure Studio",
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#040508" },
    { media: "(prefers-color-scheme: light)", color: "#e8e6e1" },
  ],
  colorScheme: "dark light",
};

/**
 * Organization structured data — lets search + AI crawlers resolve the
 * studio as a real entity (name, service, contact, social) rather than
 * an anonymous page. Injected once at the document root.
 */
const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: SITE.name,
  legalName: SITE.legalName,
  description: SITE.description,
  url: SITE.url,
  email: SITE.email,
  foundingDate: SITE.founded,
  image: `${SITE.url}/opengraph-image`,
  logo: `${SITE.url}/icon`,
  sameAs: [SITE.instagram],
  areaServed: "Worldwide",
  knowsAbout: [
    "Artificial Intelligence",
    "Lead generation systems",
    "Workflow automation",
    "Web development",
  ],
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
      <body>
        <script
          type="application/ld+json"
          // Structured data is trusted, static, server-rendered — no user input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
