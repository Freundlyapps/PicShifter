import { Metadata } from 'next'
import SVGConverterPage from './SVGConverterPage'
import Script from 'next/script'
import Header from '../../components/Header'

export const metadata: Metadata = {
  title: 'Free SVG Converter - Convert Images to SVG Online | PicShifter',
  description: 'Convert JPG, PNG, and other image formats to SVG vector graphics online. Free, fast, and secure image to SVG conversion tool. No signup required, instant downloads.',
  keywords: 'SVG converter, image to SVG, JPG to SVG, PNG to SVG, vector graphics converter, online SVG converter, free SVG converter, vector image converter',
  openGraph: {
    title: 'Free SVG Converter - Convert Images to SVG Online | PicShifter',
    description: 'Convert JPG, PNG, and other image formats to SVG vector graphics online. Free, fast, and secure conversion.',
    type: 'website',
    url: 'https://picshifter.com/tools/svg-converter',
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
    title: 'Free SVG Converter - Convert Images to SVG Online | PicShifter',
    description: 'Convert JPG, PNG, and other image formats to SVG vector graphics online. Free, fast, and secure conversion.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://picshifter.com/tools/svg-converter'
  }
}

export default function Page() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6 text-center text-text dark:text-white">
          Free Online SVG Converter - Image to Vector Graphics
        </h1>
        
        <div className="prose dark:prose-invert max-w-none mb-8">
          <p className="text-lg text-center mb-8">
            Transform your raster images into scalable vector graphics (SVG) with PicShifter&apos;s free online converter. 
            Perfect for logos, icons, and illustrations that need to look crisp at any size.
          </p>
        </div>

        <SVGConverterPage />

        <section className="mt-12 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Why Choose PicShifter SVG Converter?</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>High-quality vector conversion with path optimization</li>
            <li>Preserve image details while creating scalable graphics</li>
            <li>Adjustable conversion settings for best results</li>
            <li>No signup required - completely free to use</li>
            <li>Instant preview of converted SVG</li>
            <li>Perfect for creating logos and scalable graphics</li>
          </ul>
        </section>

        <section className="mt-12 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Supported Formats</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-medium mb-2 text-gray-900 dark:text-white">Input Formats</h3>
              <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                <li>PNG - Best for logos and graphics with transparency</li>
                <li>JPEG/JPG - Common format for photographs</li>
                <li>WebP - Modern format with excellent quality</li>
                <li>BMP - Standard bitmap format</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2 text-gray-900 dark:text-white">Output Format</h3>
              <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                <li>SVG - Scalable Vector Graphics</li>
                <li>Optimized path data for smaller file sizes</li>
                <li>Editable in vector graphics software</li>
                <li>Perfect for responsive web design</li>
              </ul>
            </div>
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
              "description": "Free online tool to convert raster images to scalable vector graphics (SVG) format, perfect for logos and illustrations.",
              "featureList": [
                "Image to SVG conversion",
                "Path optimization",
                "Quality control",
                "Preview functionality",
                "No registration required"
              ],
              "browserRequirements": "Requires a modern web browser",
              "softwareVersion": "1.0",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.7",
                "ratingCount": "98"
              }
            }
          `}
        </Script>
      </div>
    </div>
  )
}
