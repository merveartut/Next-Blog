import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96],
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

export default withNextIntl(nextConfig);
