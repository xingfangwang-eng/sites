import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
