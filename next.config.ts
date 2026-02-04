import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Tüm hostname'lere izin verir
      },
      {
        protocol: "http",
        hostname: "**", // HTTP olanlara da izin verir
      },
    ],
  },
};

export default nextConfig;
