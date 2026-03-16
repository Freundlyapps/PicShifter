import { Metadata } from 'next';
import MDXLayout from '../components/MDXLayout';
import FAQ from '../content/faq.mdx';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'PicShifter FAQ: SVG Converter & Image Tools Questions',
  description: 'Answers to common questions on free SVG conversion, resizing, optimization. JPG/PNG to SVG instantly.',
  alternates: {
    canonical: 'https://picshifter.com/faq/',
  },
  openGraph: {
    title: 'PicShifter FAQ: SVG Converter & Image Tools Questions',
    description: 'Answers to common questions on free SVG conversion, resizing, optimization. JPG/PNG to SVG instantly.',
    type: 'website',
    url: 'https://picshifter.com/faq/',
  },
};

export default function FAQPage() {
  return (
    <>
      <Script id="faq-schema" type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What image formats does PicShifter support?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "PicShifter supports JPEG/JPG, PNG, WebP, AVIF, TIFF, and SVG formats."
                }
              },
              {
                "@type": "Question",
                "name": "Are my images stored on PicShifter servers?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No. All processing happens in your browser. Images are never uploaded to or stored on our servers."
                }
              },
              {
                "@type": "Question",
                "name": "Is PicShifter free to use?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, PicShifter is completely free with no hidden costs, premium features, or signup required."
                }
              },
              {
                "@type": "Question",
                "name": "What is the maximum file size?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Generally files up to 10MB can be processed without issues, depending on your browser's memory."
                }
              },
              {
                "@type": "Question",
                "name": "Can I convert JPG or PNG to SVG?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. PicShifter's SVG converter traces raster images (JPG, PNG, WebP, BMP) into editable SVG vector graphics instantly."
                }
              },
              {
                "@type": "Question",
                "name": "Can I resize images to custom dimensions?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, enter custom width and height or choose from social media presets. PicShifter adjusts your image while preserving quality."
                }
              }
            ]
          }
        `}
      </Script>
      <MDXLayout>
        <FAQ />
      </MDXLayout>
    </>
  );
}
