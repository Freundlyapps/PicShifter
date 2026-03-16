import { Metadata } from 'next'
import ImageResizer from '../../components/ImageResizer'
import Script from 'next/script'
import Header from '../../components/Header'

export const metadata: Metadata = {
  title: 'Free Bulk Image Resizer Online | PicShifter',
  description: 'Resize images in bulk free online — no quality loss. Presets for web and social media. Supports JPG, PNG, WebP, AVIF. Fast and easy.',
  keywords: 'image resizer, bulk image resizer, resize images online, free image resize, resize JPG, resize PNG, social media image resizer',
  openGraph: {
    title: 'Free Bulk Image Resizer Online | PicShifter',
    description: 'Resize images in bulk free online — no quality loss. Presets for web and social media.',
    type: 'website',
    url: 'https://picshifter.com/tools/image-resizer/',
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
    title: 'Free Bulk Image Resizer Online | PicShifter',
    description: 'Resize images in bulk free online — no quality loss. Presets for web and social media.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://picshifter.com/tools/image-resizer/'
  }
}

export default function ResizePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6 text-center text-text dark:text-white">
          Free Bulk Image Resizer: Resize JPG/PNG/WebP Online
        </h1>

        <div className="prose dark:prose-invert max-w-none mb-8">
          <p className="text-lg text-center mb-8">
            Resize single or multiple images online instantly with PicShifter&apos;s free bulk image resizer.
            Choose from social media presets (Facebook Cover, Instagram Post, Twitter Header) or enter custom dimensions.
            Download resized images in PNG, JPEG, WebP, or AVIF — no signup, no quality loss.
          </p>
        </div>

        <ImageResizer />

        <section className="mt-12 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">How to Resize Images in Bulk</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <h3 className="text-xl font-medium mb-2 text-gray-900 dark:text-white">1. Upload Images</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Drag and drop multiple images or click to browse. Supports JPG, PNG, WebP, and GIF files.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <h3 className="text-xl font-medium mb-2 text-gray-900 dark:text-white">2. Set Dimensions</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Pick a social media preset or enter custom width and height. Aspect ratio is preserved automatically.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <h3 className="text-xl font-medium mb-2 text-gray-900 dark:text-white">3. Download</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Resized images are bundled into a ZIP file for easy download. Choose your preferred output format.
              </p>
            </div>
          </div>
        </section>

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
              "url": "https://picshifter.com/tools/image-resizer/",
              "description": "Free online bulk image resizer — resize single or multiple images with custom dimensions and social media presets.",
              "featureList": [
                "Bulk image resizing",
                "Custom dimensions",
                "Social media presets",
                "PNG, JPEG, WebP, AVIF output",
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
