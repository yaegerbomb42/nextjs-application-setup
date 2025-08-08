import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/photos/**',
      },
    ],
  },
  // Remove experimental.appDir due to type error
  allowedDevOrigins: ['http://localhost:8000', 'http://127.0.0.1:8000', 'https://gvhdtj-8000.csb.app'],
}

export default nextConfig
