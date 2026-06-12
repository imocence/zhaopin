/*
Script: import-json-to-sqlite.ts
- 将 repo 下的 lib/data/*.json 导入到本地 SQLite 文件 data/local.db
- 依赖: better-sqlite3

用法:
1. 安装依赖: npm install --save-dev better-sqlite3
2. 运行: node ./scripts/import-json-to-sqlite.ts
*/

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const Database = require('better-sqlite3');

const dataDir = path.resolve(process.cwd(), 'lib', 'data');
const outDir = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
const dbPath = path.join(outDir, 'local.db');

const jobs = require(path.join(dataDir, 'jobs.json'));
const companies = require(path.join(dataDir, 'companies.json'));
const users = require(path.join(dataDir, 'users.json'));
const categories = require(path.join(dataDir, 'categories.json'));
const locations = require(path.join(dataDir, 'locations.json'));

console.log('Writing local SQLite DB to', dbPath);
const db = new Database(dbPath);

// Create tables (similar schema to lib/db/cloudflare.ts init script)
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar TEXT,
  role TEXT NOT NULL,
  phone TEXT,
  location TEXT,
  state TEXT,
  resume TEXT,
  bio TEXT,
  password_hash TEXT,
  company_id TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS companies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  logo TEXT,
  industry TEXT NOT NULL,
  size TEXT,
  location TEXT,
  city TEXT,
  state TEXT,
  description TEXT,
  website TEXT,
  email TEXT,
  phone TEXT,
  verified INTEGER DEFAULT 0,
  verified_at TEXT,
  job_count INTEGER DEFAULT 0,
  created_at TEXT
);

CREATE TABLE IF NOT EXISTS jobs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  company_id TEXT NOT NULL,
  category TEXT,
  location TEXT,
  state TEXT,
  salary_min INTEGER,
  salary_max INTEGER,
  salary_type TEXT,
  experience TEXT,
  education TEXT,
  description TEXT,
  requirements TEXT,
  benefits TEXT,
  status TEXT,
  views INTEGER DEFAULT 0,
  applications INTEGER DEFAULT 0,
  created_at TEXT,
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT,
  icon TEXT,
  slug TEXT,
  subcategories TEXT
);

CREATE TABLE IF NOT EXISTS locations (
  id TEXT PRIMARY KEY,
  name TEXT,
  state TEXT,
  state_code TEXT,
  cities TEXT
);
`);

const hashPassword = (password: string) => {
  const salt = 'zhaopin-salt-v1';
  return crypto.createHash('sha256').update(`${password}:${salt}`).digest('hex');
};

const insertUser = db.prepare(`INSERT OR REPLACE INTO users (id, username, email, name, avatar, role, phone, location, state, resume, bio, password_hash, company_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
const insertCompany = db.prepare(`INSERT OR REPLACE INTO companies (id, name, logo, industry, size, location, city, state, description, website, email, phone, verified, verified_at, job_count, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
const insertJob = db.prepare(`INSERT OR REPLACE INTO jobs (id, title, company_id, category, location, state, salary_min, salary_max, salary_type, experience, education, description, requirements, benefits, status, views, applications, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
const insertCategory = db.prepare(`INSERT OR REPLACE INTO categories (id, name, icon, slug, subcategories) VALUES (?, ?, ?, ?, ?)`);
const insertLocation = db.prepare(`INSERT OR REPLACE INTO locations (id, name, state, state_code, cities) VALUES (?, ?, ?, ?, ?)`);

const usersTrans = db.transaction((items: any[]) => {
  for (const u of items) {
    const passwordHash = u.passwordHash ?? (u.password ? hashPassword(u.password) : null);
    insertUser.run(
      u.id,
      u.username ?? null,
      u.email,
      u.name,
      u.avatar || null,
      u.role,
      u.phone || null,
      u.location || null,
      u.state || null,
      u.resume || null,
      u.bio || null,
      passwordHash,
      u.companyId ?? null,
      u.createdAt || null
    );
  }
});

const companiesTrans = db.transaction((items: any[]) => {
  for (const c of items) {
    insertCompany.run(c.id, c.name, c.logo || null, c.industry, c.size || null, c.location || null, c.city || null, c.state || null, c.description || null, c.website || null, c.email || null, c.phone || null, c.verified ? 1 : 0, c.verifiedAt || null, c.jobCount || 0, c.createdAt || null);
  }
});

const jobsTrans = db.transaction((items: any[]) => {
  for (const j of items) {
    insertJob.run(j.id, j.title, j.companyId, j.category || null, j.location || null, j.state || null, j.salaryMin || 0, j.salaryMax || 0, j.salaryType || null, j.experience || null, j.education || null, j.description || null, JSON.stringify(j.requirements || []), JSON.stringify(j.benefits || []), j.status || 'active', j.views || 0, j.applications || 0, j.createdAt || null, j.updatedAt || null);
  }
});

const categoriesTrans = db.transaction((items: any[]) => {
  for (const c of items) {
    insertCategory.run(c.id, c.name, c.icon || null, c.slug || null, JSON.stringify(c.subcategories || []));
  }
});

const locationsTrans = db.transaction((items: any[]) => {
  for (const l of items) {
    insertLocation.run(l.id, l.name, l.state || null, l.stateCode || null, JSON.stringify(l.cities || []));
  }
});

usersTrans(users);
companiesTrans(companies);
jobsTrans(jobs);
categoriesTrans(categories);
locationsTrans(locations);

console.log('Import complete.');
console.log('You can now run the app and it will use data/local.db for local SQLite data.');

db.close();
