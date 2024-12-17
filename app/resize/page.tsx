import { Metadata } from 'next'
import ImageResizer from '../components/ImageResizer'
import Script from 'next/script'
import Header from '../components/Header'

export const metadata: Metadata = {
  title: 'Free Online Image Resizer | Resize Images in Bulk or Custom Sizes - PicShifter',
  description: 'Easily resize single or multiple images online with PicShifter. Use preset dimensions or custom sizes for social media, web, or print. Fast, free, and no signup required.',
  keywords: 'Image Resizer, Bulk Image Resizer, Free Image Resize Tool, Resize Images Online, Resize PNG, Resize JPEG, Social Media Image Resizer',
  openGraph: {
    title: 'Free Online Image Resizer | PicShifter',
    description: 'Resize single or multiple images online instantly. Free, no signup required.',
    type: 'website',
    url: 'https://picshifter.com/resize',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PicShifter Image Resizer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online Image Resizer | PicShifter',
    description: 'Resize single or multiple images online instantly. Free, no signup required.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://picshifter.com/resize'
  }
}

export default function ResizePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6 text-center text-text dark:text-white">
          Free Online Image Resizer - Single & Bulk Resizing
        </h1>
        
        <div className="prose dark:prose-invert max-w-none mb-8">
          <p className="text-lg text-center mb-8">
            PicShifter&apos;s Free Online Image Resizer allows you to resize images quickly and easily. 
            Choose from preset sizes for social media (Facebook Cover, Instagram Post) or enter custom dimensions. 
            Resize bulk images without losing quality and download them in PNG, JPEG, WebP, or AVIF formats.
          </p>
        </div>

        <ImageResizer />

        <section className="mt-12 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Why Use PicShifter Image Resizer?</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>Resize single or multiple images (bulk resizing) at once</li>
            <li>Choose from popular preset dimensions or set custom sizes</li>
            <li>Support for modern formats: PNG, JPEG, WebP, and AVIF</li>
            <li>No signup required - completely free to use</li>
            <li>Maintain image quality while reducing dimensions</li>
            <li>Perfect for social media, web, and print requirements</li>
          </ul>
        </section>

        <section className="mt-12 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Supported Image Formats</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-medium mb-2 text-gray-900 dark:text-white">Input Formats</h3>
              <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                <li>PNG - Lossless compression with transparency</li>
                <li>JPEG/JPG - Common format for photographs</li>
                <li>WebP - Modern format with excellent compression</li>
                <li>GIF - Animated and static images</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2 text-gray-900 dark:text-white">Output Formats</h3>
              <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                <li>PNG - Best for images needing transparency</li>
                <li>JPEG - Optimized for photographs</li>
                <li>WebP - Efficient modern format</li>
                <li>AVIF - Next-generation image format</li>
              </ul>
            </div>
          </div>
        </section>

        <Script id="schema-markup" type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "PicShifter Image Resizer",
              "applicationCategory": "MultimediaApplication",
              "operatingSystem": "Any",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "description": "Free online tool to resize single or multiple images with custom dimensions and various output formats.",
              "featureList": [
                "Bulk image resizing",
                "Custom dimensions",
                "Multiple output formats",
                "Social media presets",
                "No registration required"
              ],
              "browserRequirements": "Requires a modern web browser",
              "softwareVersion": "1.0",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "156"
              }
            }
          `}
        </Script>
      </div>
    </div>
  )
}
