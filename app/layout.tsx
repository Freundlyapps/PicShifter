import './globals.css';
import ThemeProvider from './components/ThemeProvider';
import Script from 'next/script';

export const metadata = {
  metadataBase: new URL('https://picshifter.com'),
  title: 'Convert, Resize, and Optimize Images Online | PicShifter',
  description: 'Free online tool to convert, resize, grayscale, and blur your images instantly. No signup required, secure processing with no data storage.',
  keywords: 'image converter, image resize, online image optimization, PicShifter, image processing, free image tools',
  openGraph: {
    title: 'Convert, Resize, and Optimize Images Online | PicShifter',
    description: 'Free online tool to convert, resize, grayscale, and blur your images instantly. No signup required, secure processing with no data storage.',
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
    title: 'Convert, Resize, and Optimize Images Online | PicShifter',
    description: 'Free online tool to convert, resize, grayscale, and blur your images instantly. No signup required, secure processing with no data storage.',
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
