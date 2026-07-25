/**
 * seo — single source of truth for site identity, canonical URL resolution,
 * and the brand tokens the generated OG/icon routes render with.
 *
 * The site URL resolves in priority order so it is correct in every
 * environment without hand-editing between deploys:
 *   1. NEXT_PUBLIC_SITE_URL   — explicit override (custom domain)
 *   2. VERCEL_PROJECT_PRODUCTION_URL — Vercel production domain
 *   3. VERCEL_URL             — Vercel preview/branch deployment
 *   4. localhost              — local dev
 */

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, '');

  const prod = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (prod) return `https://${prod}`;

  const preview = process.env.VERCEL_URL;
  if (preview) return `https://${preview}`;

  return 'http://localhost:3000';
}

export const SITE = {
  url: resolveSiteUrl(),
  name: 'Studio FX®',
  legalName: 'Studio FX',
  /** Used as the metadata title template suffix and OG site_name. */
  shortName: 'Studio FX',
  tagline: 'Built to never miss.',
  description:
    'Studio FX is an AI infrastructure studio building lead engines, workflow systems and intelligent websites — built for clarity, speed and scale.',
  email: 'fahadrahman9819@gmail.com',
  locale: 'en_GB',
  instagram: 'https://www.instagram.com/studiofxco',
  founded: '2024',
} as const;

/** Brand tokens mirrored from globals.css :root — kept in sync by hand. */
export const BRAND = {
  bg: '#040508',
  bgLift: '#0c0d12',
  ink: '#e9ecf3',
  inkDim: 'rgba(233, 236, 243, 0.60)',
  inkFaint: 'rgba(233, 236, 243, 0.34)',
  accent: '#ff5a26',
  hairline: 'rgba(233, 236, 243, 0.16)',
} as const;
