import './globals.css';
import ThemeProvider from './components/ThemeProvider';
import Script from 'next/script';

export const metadata = {
  title: 'Convert, Resize, and Optimize Images Online | PicShifter',
  description: 'Free online tool to convert, resize, grayscale, and blur your images instantly. No signup required, secure processing with no data storage.',
  keywords: 'image converter, image resize, online image optimization, PicShifter, image processing, free image tools',
  openGraph: {
    title: 'Convert, Resize, and Optimize Images Online | PicShifter',
    description: 'Free online tool to convert, resize, grayscale, and blur your images instantly. No signup required, secure processing with no data storage.',
    type: 'website',
    url: 'https://picshifter.vercel.app',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PicShifter - Free Online Image Processing',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Convert, Resize, and Optimize Images Online | PicShifter',
    description: 'Free online tool to convert, resize, grayscale, and blur your images instantly. No signup required, secure processing with no data storage.',
    images: ['/twitter-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script id="json-ld" type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "PicShifter",
              "url": "https://picshifter.vercel.app",
              "description": "Convert, resize, grayscale, and blur your images online for free with PicShifter.",
              "applicationCategory": "Image Processing Tool",
              "operatingSystem": "Any",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "category": "Free"
              },
              "featureList": [
                "Image format conversion",
                "Image resizing",
                "Grayscale conversion",
                "Blur effect",
                "No registration required",
                "No data storage"
              ]
            }
          `}
        </Script>
      </head>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
