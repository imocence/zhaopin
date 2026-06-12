
-- 招聘网站数据库初始化脚本
-- 使用方法: npx wrangler d1 execute zhaopin-db --file=./scripts/init-db.sql

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar TEXT,
  role TEXT NOT NULL CHECK (role IN ('jobseeker', 'employer', 'admin')),
  phone TEXT,
  location TEXT,
  state TEXT,
  resume TEXT,
  bio TEXT,
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
