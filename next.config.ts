import type { NextConfig } from "next";

// Import the bundle analyzer plugin using ES module syntax
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  /* config options here */
};

// Wrap the config with the bundle analyzer
export default withBundleAnalyzer(nextConfig);
