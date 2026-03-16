import './globals.css';
import ThemeProvider from './components/ThemeProvider';
import Script from 'next/script';

export const metadata = {
  metadataBase: new URL('https://picshifter.com'),
  title: 'PicShifter: Free Image Tools — Convert, Resize, Optimize',
  alternates: {
    canonical: 'https://picshifter.com',
  },
  description: 'Free online image tools: SVG converter, bulk resizer, optimizer. Convert, resize, and compress images instantly. No signup, no data stored.',
  keywords: 'image converter, SVG converter, image resizer, image optimizer, free image tools, PicShifter, convert image to SVG, bulk image resizer',
  openGraph: {
    title: 'PicShifter: Free Image Tools — Convert, Resize, Optimize',
    description: 'Free online image tools: SVG converter, bulk resizer, optimizer. Convert, resize, and compress images instantly. No signup, no data stored.',
    type: 'website',
    url: 'https://picshifter.com',
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
    title: 'PicShifter: Free Image Tools — Convert, Resize, Optimize',
    description: 'Free online image tools: SVG converter, bulk resizer, optimizer. No signup, no data stored.',
    images: ['/twitter-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#5bbad5'
      }
    ]
  },
  manifest: '/site.webmanifest'
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
              "url": "https://picshifter.com",
              "description": "Free online image tools: SVG converter, bulk image resizer, image optimizer, and format converter. No signup required.",
              "applicationCategory": "MultimediaApplication",
              "operatingSystem": "Any",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "featureList": [
                "SVG conversion (JPG/PNG to SVG)",
                "Bulk image resizing",
                "Image compression and optimization",
                "Format conversion (WebP, AVIF, PNG, JPEG)",
                "No registration required",
                "Privacy-first — no data storage"
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
