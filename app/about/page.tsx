import { Metadata } from 'next';
import MDXLayout from '../components/MDXLayout';
import About from '../content/about.mdx';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'About PicShifter: Free AI Image Tools for Designers',
  description: 'PicShifter: Fast SVG converter, image resizer & optimizer. Built for devs/designers in Vienna. No signup needed.',
  alternates: {
    canonical: 'https://picshifter.com/about/',
  },
  openGraph: {
    title: 'About PicShifter: Free AI Image Tools for Designers',
    description: 'PicShifter: Fast SVG converter, image resizer & optimizer. Built for devs/designers in Vienna. No signup needed.',
    type: 'website',
    url: 'https://picshifter.com/about/',
  },
};

export default function AboutPage() {
  return (
    <>
      <Script id="about-schema" type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "PicShifter",
            "url": "https://picshifter.com",
            "description": "Free online image tools: SVG converter, bulk image resizer, image optimizer, and format converter.",
            "sameAs": []
          }
        `}
      </Script>
      <MDXLayout>
        <About />
      </MDXLayout>
    </>
  );
}
