import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/seaweed-game',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
