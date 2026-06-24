
// Cloudflare D1数据库连接配置
interface D1PreparedStatement {
  bind: (...params: unknown[]) => D1PreparedStatement;
  all: <T = unknown>() => Promise<{ results: T[] }>;
  first: <T = unknown>() => Promise<T | null>;
  run: () => Promise<unknown>;
}

interface D1Database {
  prepare: (sql: string) => D1PreparedStatement;
}

interface Env {
  DB?: D1Database;
}

// 全局数据库实例缓存
let dbInstance: D1Database | null = null;
import { getLocalD1 } from '@/lib/db/local-d1';
import { getCloudflareContext } from '@opennextjs/cloudflare/cloudflare-context';

function getDbFromCloudflareContext(): D1Database | null {
  try {
    const context = getCloudflareContext({ async: false }) as unknown as { env?: Record<string, unknown> } | null;
    if (context?.env && 'DB' in context.env && context.env.DB) {
      return context.env.DB as D1Database;
    }
  } catch {
    // not available in this runtime or sync mode not supported
  }

  // Fallback direct global symbol lookup in case the context is injected but the helper fails.
  try {
    const ctx = (globalThis as unknown as Record<symbol, unknown>)[Symbol.for('__cloudflare-context__')] as { env?: Record<string, unknown> } | undefined;
    if (ctx?.env && 'DB' in ctx.env && ctx.env.DB) {
      return ctx.env.DB as D1Database;
    }
  } catch {
    // ignore
  }

  return null;
}

export async function getDbFromCloudflareContextAsync(): Promise<D1Database | null> {
  try {
    const context = await getCloudflareContext({ async: true }) as unknown as { env?: Record<string, unknown> } | null;
    if (context?.env && 'DB' in context.env && context.env.DB) {
      return context.env.DB as D1Database;
    }
  } catch {
    // not available in this runtime or async mode not supported
  }

  try {
    const ctx = (globalThis as unknown as Record<symbol, unknown>)[Symbol.for('__cloudflare-context__')] as { env?: Record<string, unknown> } | undefined;
    if (ctx?.env && 'DB' in ctx.env && ctx.env.DB) {
      return ctx.env.DB as D1Database;
    }
  } catch {
    // ignore
  }

  return null;
}

/**
 * 设置数据库实例
 * 在API路由中使用，从请求环境中获取数据库连接
 */
export function setDb(db: D1Database): void {
  dbInstance = db;
}

/**
 * 获取数据库实例
 * 支持多种方式获取数据库连接：
 * 1. 直接传入env对象
 * 2. 使用之前设置的实例
 * 3. 从全局变量获取
 */
export function getDb(env?: Env): D1Database {
  // 优先使用传入的env
  if (env && env.DB) {
    return env.DB;
  }

  // 使用缓存的实例
  if (dbInstance) {
    return dbInstance;
  }

  // 尝试从Cloudflare OpenNext上下文中读取绑定
  const cfBinding = getDbFromCloudflareContext();
  if (cfBinding) {
    dbInstance = cfBinding;
    return dbInstance;
  }

  // 尝试从全局获取（Cloudflare Workers / Edge 运行环境）
  const runtimeGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof global !== 'undefined' ? global : undefined;
  if (runtimeGlobal && typeof runtimeGlobal === 'object' && 'DB' in runtimeGlobal) {
    const candidate = (runtimeGlobal as { DB?: unknown }).DB;
    if (candidate) {
      dbInstance = candidate as D1Database;
      return dbInstance;
    }
  }

  // 尝试从process.env获取
  if (typeof process !== 'undefined') {
    const processEnv = (process as unknown as { env?: Record<string, unknown> }).env;
    if (processEnv && 'DB' in processEnv && processEnv.DB) {
      dbInstance = processEnv.DB as D1Database;
      return dbInstance;
    }
  }

  // Fallback to a local in-memory D1 implementation for local builds/dev
  // If running in production and the deploy explicitly disables local fallback, fail fast.
  // Set `DISABLE_LOCAL_FALLBACK=true` in production environment to enforce D1 binding presence.
  if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'production' && process.env.DISABLE_LOCAL_FALLBACK === 'true') {
    throw new Error('D1 database not found in production. Ensure D1 binding (DB) is configured and exposed to runtime.');
  }

  try {
    return getLocalD1();
  } catch {
    throw new Error('Database connection not available. Please provide env with DB property or call setDb() first.');
  }
}

/**
 * 从Next.js请求中获取Cloudflare环境变量
 * 用于API路由中
 */
export function getDbFromRequest(request: Request): D1Database | null {
  // 尝试从请求对象中读取 Cloudflare 绑定的 DB
  if (request && typeof request === 'object') {
    const requestObject = request as unknown as Record<string, unknown>;
    if ('env' in requestObject) {
      const env = requestObject.env as Record<string, unknown> | undefined;
      if (env && 'DB' in env && env.DB) {
        return env.DB as D1Database;
      }
    }

    if ('bindings' in requestObject) {
      const bindings = requestObject.bindings as Record<string, unknown> | undefined;
      if (bindings && 'DB' in bindings && bindings.DB) {
        return bindings.DB as D1Database;
      }
    }
  }

  // 尝试从OpenNext Cloudflare上下文中读取绑定
  const cfBinding = getDbFromCloudflareContext();
  if (cfBinding) {
    return cfBinding;
  }

  // 兼容 Cloudflare Workers / Edge 运行时，通过全局对象访问绑定
  const runtimeGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof global !== 'undefined' ? global : undefined;
  if (runtimeGlobal && typeof runtimeGlobal === 'object' && 'DB' in runtimeGlobal) {
    const candidate = (runtimeGlobal as { DB?: unknown }).DB;
    if (candidate) {
      return candidate as D1Database;
    }
  }

  // 兼容本地开发或特殊运行时，通过 process.env 访问
  if (typeof process !== 'undefined') {
    const processEnv = (process as unknown as { env?: Record<string, unknown> }).env;
    if (processEnv && 'DB' in processEnv && processEnv.DB) {
      return processEnv.DB as D1Database;
    }
  }

  return null;
}

// 数据库初始化脚本
export const initDbScript = `
-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar TEXT,
  role TEXT NOT NULL CHECK (role IN ('jobseeker', 'employer', 'admin')),
  phone TEXT,
  location TEXT,
  state TEXT,
  resume TEXT,
  bio TEXT,
  password_hash TEXT,
  company_id TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 创建公司表
CREATE TABLE IF NOT EXISTS companies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  logo TEXT,
  industry TEXT NOT NULL,
  size TEXT NOT NULL,
  location TEXT NOT NULL,
  city TEXT,
  state TEXT NOT NULL,
  description TEXT NOT NULL,
  website TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  verified INTEGER NOT NULL DEFAULT 0,
  verified_at TEXT,
  job_count INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 创建职位表
CREATE TABLE IF NOT EXISTS jobs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  company_id TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  state TEXT NOT NULL,
  salary_min INTEGER NOT NULL,
  salary_max INTEGER NOT NULL,
  salary_type TEXT NOT NULL CHECK (salary_type IN ('hourly', 'monthly', 'yearly')),
  experience TEXT NOT NULL,
  education TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT NOT NULL,
  benefits TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'closed', 'draft')),
  views INTEGER DEFAULT 0,
  applications INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- 创建职位申请表
CREATE TABLE IF NOT EXISTS applications (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'reviewed', 'interview', 'accepted', 'rejected')),
  cover_letter TEXT,
  resume TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 创建消息表
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  from_user_id TEXT NOT NULL,
  to_user_id TEXT NOT NULL,
  job_id TEXT,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  read INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (from_user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (to_user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE SET NULL
);

-- 创建举报表
CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('职位举报', '企业举报', '用户举报')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  target_id TEXT,
  target_name TEXT NOT NULL,
  reporter_id TEXT,
  reporter_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'resolved')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 创建分类表
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL
);

-- 创建地区表
CREATE TABLE IF NOT EXISTS locations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  state_code TEXT UNIQUE NOT NULL,
  cities TEXT NOT NULL
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_jobs_company ON jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs(category);
CREATE INDEX IF NOT EXISTS idx_jobs_state ON jobs(state);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_companies_state ON companies(state);
CREATE INDEX IF NOT EXISTS idx_companies_verified ON companies(verified);
CREATE INDEX IF NOT EXISTS idx_applications_job ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_user ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_from_user ON messages(from_user_id);
CREATE INDEX IF NOT EXISTS idx_messages_to_user ON messages(to_user_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
`;
