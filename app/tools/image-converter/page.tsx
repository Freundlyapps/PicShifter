import { Metadata } from 'next';
import Script from 'next/script';
import Header from '@/app/components/Header';
import BulkImageConverter from './BulkImageConverter';

export const metadata: Metadata = {
  title: 'Free Bulk Image Converter Online | PicShifter',
  description: 'Convert multiple images at once to WebP, JPEG, PNG, and AVIF. Fast, free bulk image conversion with no signup required.',
  keywords: 'Bulk Image Converter, Multiple Image Converter, Batch Image Converter, Convert Images Online, WebP Converter, AVIF Converter, Image Format Converter',
  openGraph: {
    title: 'Free Bulk Image Converter | PicShifter',
    description: 'Convert multiple images at once to different formats. Free, no signup required.',
    type: 'website',
    url: 'https://picshifter.com/tools/image-converter/',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PicShifter Bulk Image Converter',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Bulk Image Converter | PicShifter',
    description: 'Convert multiple images at once to different formats. Free, no signup required.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://picshifter.com/tools/image-converter/'
  }
}

export default function ImageConverterPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6 text-center text-text dark:text-white">
          Free Bulk Image Converter - Convert Multiple Images at Once
        </h1>
        
        <div className="prose dark:prose-invert max-w-none mb-8">
          <p className="text-lg text-center mb-8">
            PicShifter&apos;s Free Bulk Image Converter lets you convert multiple images simultaneously to different formats.
            Perfect for batch processing, web optimization, and maintaining consistent image formats across your projects.
            Convert up to 10 images at once with just a few clicks.
          </p>
        </div>

        <BulkImageConverter />

        <section className="mt-12 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Why Choose PicShifter Bulk Image Converter?</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>Convert multiple images simultaneously</li>
            <li>Support for modern formats (WebP, AVIF) for better web performance</li>
            <li>Batch download options for convenience</li>
            <li>No signup required - completely free to use</li>
            <li>Preview all conversions before downloading</li>
            <li>Maintain original image quality during conversion</li>
          </ul>
        </section>

        <section className="mt-12 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Supported Image Formats</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-medium mb-2 text-gray-900 dark:text-white">Input Formats</h3>
              <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                <li>PNG - Perfect for images with transparency</li>
                <li>JPEG/JPG - Ideal for photographs</li>
                <li>WebP - Modern format with excellent compression</li>
                <li>AVIF - Next-generation image format</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2 text-gray-900 dark:text-white">Output Formats</h3>
              <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                <li>WebP - Best choice for web images</li>
                <li>AVIF - Superior compression with high quality</li>
                <li>PNG - Lossless quality with transparency</li>
                <li>JPEG - Universal compatibility</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-12 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">How to Use the Bulk Image Converter</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 rounded-lg bg-card">
              <h3 className="text-xl font-medium mb-2">1. Upload Images</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Drag and drop up to 10 images or use the file browser to select multiple files
              </p>
            </div>
            <div className="p-4 rounded-lg bg-card">
              <h3 className="text-xl font-medium mb-2">2. Choose Format</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Select your desired output format (WebP, JPEG, PNG, or AVIF)
              </p>
            </div>
            <div className="p-4 rounded-lg bg-card">
              <h3 className="text-xl font-medium mb-2">3. Download</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Download all converted images at once or individually
              </p>
            </div>
          </div>
        </section>

        <Script id="schema-markup" type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "PicShifter Bulk Image Converter",
              "applicationCategory": "MultimediaApplication",
              "operatingSystem": "Any",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "url": "https://picshifter.com/tools/image-converter/",
              "description": "Free online bulk image converter — convert multiple images between WebP, JPEG, PNG, and AVIF formats simultaneously.",
              "featureList": [
                "Bulk image conversion",
                "WebP, JPEG, PNG, AVIF support",
                "Batch download",
                "Preview before download",
                "No registration required"
              ],
              "browserRequirements": "Requires a modern web browser",
              "softwareVersion": "1.0"
            }
          `}
        </Script>
      </div>
    </div>
  );
}
