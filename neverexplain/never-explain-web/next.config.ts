import type { NextConfig } from "next";
import { resolve } from "path";

// 明确指定项目根目录
const projectRoot = resolve(__dirname);

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client"],
  turbopack: {
    root: projectRoot,
  },
  compress: true, // 开启 Gzip 压缩
  trailingSlash: true, // 添加尾部斜杠
  images: {
    unoptimized: true, // 静态导出时需要
  },
};

export default nextConfig;
