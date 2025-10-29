/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'], // Add your image domains here
    formats: ['image/avif', 'image/webp'],
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  // Enable response compression
  experimental: {
    optimizeCss: true,
    // turbo: true,
  }
}

module.exports = nextConfig
