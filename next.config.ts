import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  // Use Webpack instead of Turbopack to avoid UNC path issues on network drives
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;
