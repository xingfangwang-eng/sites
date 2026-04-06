import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@data': path.resolve(process.cwd(), '@data'),
    };
    return config;
  },
};

export default nextConfig;
