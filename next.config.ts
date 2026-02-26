import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['google-play-scraper', 'app-store-scraper', 'playwright'],
};

export default nextConfig;
