const createMDX = require('@next/mdx')

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  experimental: {
    mdxRs: true,
  },
  serverRuntimeConfig: {
    bodyParser: {
      sizeLimit: '10mb',
    },
    responseLimit: '12mb',
  },
  transpilePackages: ['canvas'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false
      };
    }
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
