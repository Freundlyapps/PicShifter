import { Metadata } from 'next'
import ImageOptimizer from '../../components/ImageOptimizer'
import Script from 'next/script'
import Header from '../../components/Header'

export const metadata: Metadata = {
  title: 'Free Image Optimizer: Compress Online | PicShifter',
  description: 'Compress and optimize images online without losing quality. Convert to WebP, AVIF for faster websites. Free, no signup required.',
  keywords: 'image optimizer, compress images online, image compression, free image optimizer, WebP converter, AVIF converter, optimize images for web',
  openGraph: {
    title: 'Free Image Optimizer: Compress Online | PicShifter',
    description: 'Compress and optimize images online without losing quality. Convert to WebP, AVIF for faster websites.',
    type: 'website',
    url: 'https://picshifter.com/tools/image-optimizer/',
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
    title: 'Free Image Optimizer: Compress Online | PicShifter',
    description: 'Compress and optimize images online without losing quality. Convert to WebP, AVIF for faster websites.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://picshifter.com/tools/image-optimizer/'
  }
}

export default function OptimizePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6 text-center text-text dark:text-white">
          Free Image Optimizer: Compress Without Quality Loss
        </h1>

        <div className="prose dark:prose-invert max-w-none mb-8">
          <p className="text-lg text-center mb-8">
            Compress and optimize your images online with PicShifter&apos;s free image optimizer. Reduce file sizes by up to 80% while maintaining visual quality.
            Convert to modern formats like WebP and AVIF for faster-loading websites. No signup required — process your images instantly.
          </p>
        </div>

        <ImageOptimizer />

        <section className="mt-12 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">How to Optimize Images Online</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <h3 className="text-xl font-medium mb-2 text-gray-900 dark:text-white">1. Upload Image</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Drop your PNG, JPG, WebP, or AVIF image into the optimizer above, or click to browse.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <h3 className="text-xl font-medium mb-2 text-gray-900 dark:text-white">2. Adjust Quality</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Use the quality slider to balance file size and visual quality. Choose an output format like WebP or AVIF for best compression.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <h3 className="text-xl font-medium mb-2 text-gray-900 dark:text-white">3. Download</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Preview the optimized result with before/after comparison, then download your compressed image instantly.
              </p>
            </div>
          </div>
        </section>

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
              "url": "https://picshifter.com/tools/image-optimizer/",
              "description": "Free online image optimizer — compress images without losing quality. Convert to WebP and AVIF for faster websites.",
              "featureList": [
                "Smart image compression",
                "WebP and AVIF conversion",
                "Adjustable quality slider",
                "Before/after preview",
                "No registration required"
              ],
              "browserRequirements": "Requires a modern web browser",
              "softwareVersion": "1.0"
            }
          `}
        </Script>
      </div>
    </div>
  )
}
