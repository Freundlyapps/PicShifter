const createMDX = require('@next/mdx')

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

module.exports = withMDX(nextConfig)
