
/// <reference types="@cloudflare/workers-types" />

interface CloudflareEnv {
  DB: D1Database;
}

// 扩展Next.js的请求类型以包含Cloudflare环境
declare module 'next' {
  interface NextRequest {
    env?: CloudflareEnv;
  }
}

// 全局类型声明
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB?: D1Database;
    }
  }
}

export {};
