/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google OAuth profile images
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com', // GitHub OAuth profile images
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  // Production optimizations
  // swcMinify is default in Next.js 15
  // Reduce bundle size by transforming imports
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{member}}',
    },
    'react-icons/fi': {
        transform: 'react-icons/fi/{{member}}',
    },
    'react-icons/fa': {
        transform: 'react-icons/fa/{{member}}',
    },
    // Add other icon sets if used
  },
  // Add optimizePackageImports for DEV performance (fewer modules compiled)
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns', 'lodash', 'recharts'],
  }
}

module.exports = nextConfig
