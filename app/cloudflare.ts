import { env } from "process";

// 定义Cloudflare环境变量类型
interface CloudflareEnv {
  // Cloudflare KV存储
  KV_NAMESPACE?: any;

  // Cloudflare D1数据库
  DB?: any;

  // Cloudflare环境变量
  ENVIRONMENT?: string;

  // 应用程序特定变量
  APP_NAME?: string;
  APP_VERSION?: string;

  // 其他自定义环境变量
  [key: string]: unknown;
}

// 将Cloudflare环境变量转换为TypeScript类型
declare global {
  interface Env extends CloudflareEnv {}
}

// 导出环境变量处理函数
export function getCloudflareEnv(): CloudflareEnv {
  // 在Cloudflare运行时环境中，env对象已经包含了所有环境变量
  // 在本地开发环境中，我们需要从process.env中获取
  if (typeof env !== "undefined" && "KV_NAMESPACE" in env) {
    // 在Cloudflare运行时环境中
    return env as CloudflareEnv;
  }

  // 在本地开发环境中
  return {
    // 这里可以添加本地开发环境的环境变量
    ENVIRONMENT: process.env.ENVIRONMENT || "development",
    APP_NAME: process.env.APP_NAME || "zhaopin",
    APP_VERSION: process.env.APP_VERSION || "1.0.0",
    // 添加其他本地环境变量
  } as CloudflareEnv;
}

// 导出环境变量
export const cloudflareEnv = getCloudflareEnv();

// 默认导出
export default cloudflareEnv;
