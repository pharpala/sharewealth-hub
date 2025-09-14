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
  async rewrites() {
    return [
      // Proxy API requests to FastAPI backend
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
      {
        source: '/docs',
        destination: 'http://localhost:8000/docs',
      },
      {
        source: '/test-database',
        destination: 'http://localhost:8000/test-database',
      },
      {
        source: '/upload',
        destination: 'http://localhost:8000/upload',
      },
    ];
  },
};

export default nextConfig;
