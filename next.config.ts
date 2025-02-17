import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel handles optimization automatically
  images: {
    domains: ['vercel.com'],
  },
};

export default nextConfig;
