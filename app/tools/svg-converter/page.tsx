import { Metadata } from 'next'
import SVGConverterPage from './SVGConverterPage'
import Script from 'next/script'
import Header from '../../components/Header'

export const metadata: Metadata = {
  title: 'Free SVG Converter: JPG/PNG to SVG Online | PicShifter',
  description: 'Convert JPG, PNG to SVG free online. High-quality editable vectors instantly with no signup. Perfect for designers and developers.',
  keywords: 'SVG converter, image to SVG, JPG to SVG, PNG to SVG, convert image to SVG, free SVG converter, online SVG converter, vector converter',
  openGraph: {
    title: 'Free SVG Converter: JPG/PNG to SVG Online | PicShifter',
    description: 'Convert JPG, PNG to SVG free online. High-quality editable vectors instantly with no signup.',
    type: 'website',
    url: 'https://picshifter.com/tools/svg-converter/',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PicShifter SVG Converter',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free SVG Converter: JPG/PNG to SVG Online | PicShifter',
    description: 'Convert JPG, PNG to SVG free online. High-quality editable vectors instantly with no signup.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://picshifter.com/tools/svg-converter/'
  }
}

export default function Page() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6 text-center text-text dark:text-white">
          Free Online SVG Converter: JPG/PNG to Editable SVG
        </h1>

        <div className="prose dark:prose-invert max-w-none mb-8">
          <p className="text-lg text-center mb-8">
            Convert your JPG, PNG, and other raster images into scalable vector graphics (SVG) instantly with PicShifter&apos;s free online SVG converter.
            Perfect for logos, icons, and illustrations that need to look crisp at any size. No signup, no watermarks — just clean, editable vectors.
          </p>
        </div>

        <SVGConverterPage />

        <section className="mt-12 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">How to Convert Images to SVG</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <h3 className="text-xl font-medium mb-2 text-gray-900 dark:text-white">1. Upload Your Image</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Drag and drop your JPG, PNG, WebP, or BMP file into the converter above, or click to browse your files.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <h3 className="text-xl font-medium mb-2 text-gray-900 dark:text-white">2. Adjust Settings</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Fine-tune the conversion with threshold, color, and detail settings to get the exact vector output you need.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <h3 className="text-xl font-medium mb-2 text-gray-900 dark:text-white">3. Download SVG</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Preview your converted SVG in real-time, then download the editable vector file instantly — no email required.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-12 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Why Choose PicShifter SVG Converter?</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li><strong>Free JPG/PNG to SVG conversion</strong> — no subscriptions, no limits, accessible from any device</li>
            <li><strong>High-quality vector output</strong> — advanced path optimization preserves crisp lines and detail</li>
            <li><strong>No watermarks</strong> — download clean, ready-to-use SVG files instantly</li>
            <li><strong>Fully editable vectors</strong> — open in Illustrator, Figma, Inkscape, or embed directly in your website code</li>
            <li><strong>Adjustable conversion settings</strong> — control threshold, smoothing, and detail for precise results</li>
            <li><strong>Privacy-first</strong> — your images are processed on-the-fly and never stored on our servers</li>
          </ul>
        </section>

        <section className="mt-12 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Supported Formats</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-medium mb-2 text-gray-900 dark:text-white">Input Formats</h3>
              <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                <li>PNG — best for logos and graphics with transparency</li>
                <li>JPEG/JPG — common format for photographs</li>
                <li>WebP — modern format with excellent quality</li>
                <li>BMP — standard bitmap format</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2 text-gray-900 dark:text-white">Output Format</h3>
              <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                <li>SVG — Scalable Vector Graphics, resolution-independent</li>
                <li>Optimized path data for smaller file sizes</li>
                <li>Editable in any vector graphics software</li>
                <li>Ideal for responsive web design and retina displays</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-12 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">When to Use SVG Files</h2>
          <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
            <p>
              SVG (Scalable Vector Graphics) files are the preferred format when you need graphics that scale perfectly across all screen sizes — from mobile phones to 4K monitors.
              Unlike raster formats like JPG or PNG, SVGs use mathematical paths instead of pixels, meaning they never lose quality when resized.
            </p>
            <p className="mt-4">
              Common use cases for SVG files include: website logos and icons, app UI elements, infographics and data visualizations, print-ready illustrations, and animated web graphics.
              Designers use SVG converters to quickly trace raster sketches and turn them into production-ready vector assets without redrawing from scratch.
            </p>
          </div>
        </section>

        <Script id="schema-markup" type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "PicShifter SVG Converter",
              "applicationCategory": "MultimediaApplication",
              "operatingSystem": "Any",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "url": "https://picshifter.com/tools/svg-converter/",
              "description": "Free online SVG converter — convert JPG, PNG to editable SVG vector graphics instantly. No signup required.",
              "featureList": [
                "JPG to SVG conversion",
                "PNG to SVG conversion",
                "Path optimization",
                "Adjustable conversion settings",
                "Instant preview",
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
