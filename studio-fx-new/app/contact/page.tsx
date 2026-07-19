import type { Metadata } from 'next';
import ContactPage from '@/components/site/ContactPage';

export const metadata: Metadata = {
  title: "Let's Talk — Studio FX®",
  description:
    'Start a project with Studio FX. Tell us where the errors live and get a reduced-error report.',
};

export default function Contact() {
  return <ContactPage />;
}
