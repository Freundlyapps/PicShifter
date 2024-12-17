import { Metadata } from 'next'
import ImageOptimizer from '../components/ImageOptimizer'
import Script from 'next/script'
import Header from '../components/Header'

export const metadata: Metadata = {
  title: 'Free Online Image Optimizer | Compress Images Without Losing Quality - PicShifter',
  description: 'Optimize and compress your images online without losing quality. Convert to modern formats like WebP and AVIF. Fast, free, and no signup required.',
  keywords: 'Image Optimizer, Image Compression, Free Image Optimizer, Compress Images Online, WebP Converter, AVIF Converter, Image Quality Optimizer',
  openGraph: {
    title: 'Free Online Image Optimizer | PicShifter',
    description: 'Optimize and compress your images online without losing quality. Free, no signup required.',
    type: 'website',
    url: 'https://picshifter.com/optimize',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PicShifter Image Optimizer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online Image Optimizer | PicShifter',
    description: 'Optimize and compress your images online without losing quality. Free, no signup required.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://picshifter.com/optimize'
  }
}

export default function OptimizePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6 text-center text-text dark:text-white">
          Free Online Image Optimizer - Smart Compression
        </h1>
        
        <div className="prose dark:prose-invert max-w-none mb-8">
          <p className="text-lg text-center mb-8">
            PicShifter&apos;s Free Online Image Optimizer helps you compress images intelligently while maintaining quality. 
            optimize images with customizable quality settings. 
            Perfect for web images, email attachments, and social media uploads.
            
          </p>
        </div>

        <ImageOptimizer />

        <section className="mt-12 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Why Choose PicShifter Image Optimizer?</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>Smart compression that maintains visual quality</li>
            <li>Convert to modern formats (WebP, AVIF) for better compression</li>
            <li>Adjustable quality settings for precise control</li>
            <li>No signup required - completely free to use</li>
            <li>Instant preview to compare before and after</li>
            <li>Perfect for web optimization and faster loading times</li>
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
                <li>AVIF - Next-generation image format</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2 text-gray-900 dark:text-white">Output Formats</h3>
              <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                <li>WebP - Efficient modern format with wide support</li>
                <li>AVIF - Best compression with high quality</li>
                <li>PNG - Optimized lossless compression</li>
                <li>JPEG - Optimized lossy compression</li>
              </ul>
            </div>
          </div>
        </section>

        <Script id="schema-markup" type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "PicShifter Image Optimizer",
              "applicationCategory": "MultimediaApplication",
              "operatingSystem": "Any",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "description": "Free online tool to optimize and compress images while maintaining quality, with support for modern formats like WebP and AVIF.",
              "featureList": [
                "Smart image compression",
                "Modern format conversion",
                "Quality control",
                "Before/after preview",
                "No registration required"
              ],
              "browserRequirements": "Requires a modern web browser",
              "softwareVersion": "1.0",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "142"
              }
            }
          `}
        </Script>
      </div>
    </div>
  )
}
