import type { NextConfig } from "next";

// Import the bundle analyzer plugin using ES module syntax
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // The Carrying City is a standalone Vite build in public/carrying-city/; serve its index for the bare path.
  async rewrites() {
    return [
      { source: '/carrying-city', destination: '/carrying-city/index.html' },
    ];
  },
};

// Wrap the config with the bundle analyzer
export default withBundleAnalyzer(nextConfig);
