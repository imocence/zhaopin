import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone', 
  // Cloudflare环境配置
  serverExternalPackages: [],
};

const openNextDevEnabled = process.env.OPENNEXT_DEV === 'true';

if (process.env.NODE_ENV === 'development' && openNextDevEnabled) {
  const { initOpenNextCloudflareForDev } = require('@opennextjs/cloudflare');
  initOpenNextCloudflareForDev().catch((error: unknown) => {
    console.error('OpenNext Cloudflare dev initialization failed:', error);
    console.error('Continuing with Next.js development server without OpenNext dev context.');
  });
}

export default nextConfig;
