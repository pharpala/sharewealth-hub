import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Disable ESLint during builds to avoid deployment issues
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript errors during builds if needed
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
