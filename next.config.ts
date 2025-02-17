import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable CSS optimization
  optimizeFonts: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
