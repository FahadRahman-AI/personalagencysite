import type { Metadata } from 'next';
import ContactPage from '@/components/site/ContactPage';

const description =
  'Start a project with Studio FX. Tell us where the errors live and get a reduced-error report.';

export const metadata: Metadata = {
  title: "Let's Talk",
  description,
  alternates: { canonical: '/contact' },
  openGraph: {
    title: "Let's Talk — Studio FX®",
    description,
    url: '/contact',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Let's Talk — Studio FX®",
    description,
  },
};

export default function Contact() {
  return <ContactPage />;
}
