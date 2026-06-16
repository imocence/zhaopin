import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  /* config options here */
  // Cloudflare环境配置
  serverExternalPackages: [],
};

initOpenNextCloudflareForDev();

export default nextConfig;
