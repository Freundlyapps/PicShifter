const createMDX = require('@next/mdx')

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  images: {
    unoptimized: true,
    domains: ['picshifter.com', 'pdftoimage.picshifter.com', 'www.picshifter.com'],
  },
  trailingSlash: true,
  experimental: {
    mdxRs: true,
    serverComponentsExternalPackages: ['potrace'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          }
        ],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/',
        has: [
          {
            type: 'host',
            value: 'www.picshifter.com',
          },
        ],
        destination: 'https://picshifter.com',
        permanent: true,
      },
      {
        source: '/how-to-use',
        destination: '/faq',
        permanent: true,
      },
      {
        source: '/convert-to-svg',
        destination: '/tools/svg-converter',
        permanent: true,
      },
      {
        source: '/resize-image',
        destination: '/tools/image-resizer',
        permanent: true,
      },
      {
        source: '/pdf-to-image',
        destination: 'https://pdftoimage.picshifter.com',
        permanent: true,
      },
      {
        source: '/tools/pdf-to-image',
        destination: 'https://pdftoimage.picshifter.com',
        permanent: true,
      },
      {
        source: '/tools/pdf-to-image/',
        destination: 'https://pdftoimage.picshifter.com',
        permanent: true,
      }
    ]
  },
  webpack: (config, { isServer }) => {
    // Correctly handle the canvas module
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        encoding: false,
      };
    }
    
    // Add rule for .node files
    config.module.rules.push({
      test: /\.node$/,
      use: 'node-loader',
      type: 'javascript/auto',
    });

    return config;
  }
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

module.exports = withMDX(nextConfig)
