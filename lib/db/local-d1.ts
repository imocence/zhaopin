import jobsData from '@/lib/data/jobs.json';
import companiesData from '@/lib/data/companies.json';
import usersData from '@/lib/data/users.json';
import categoriesData from '@/lib/data/categories.json';
import locationsData from '@/lib/data/locations.json';
import fs from 'fs';
import path from 'path';
import { Job, Company, User, Category, Location } from '@/types';

// Local aliases for Cloudflare D1 types to avoid requiring Cloudflare types in local dev
type D1Database = any;
type D1PreparedStatement = any;
type D1Result<T = any> = any;
type D1ExecResult = any;
type D1Meta = any;

type Row = Record<string, unknown>;

let localDbInstance: LocalD1Database | null = null;

export function getLocalD1(): D1Database {
  if (!localDbInstance) {
    localDbInstance = new LocalD1Database();
  }
  return localDbInstance as unknown as D1Database;
}

class LocalD1Database {
  tables: Map<string, Row[]> = new Map();

  constructor() {
    // Prefer local SQLite file if present (data/local.db)
    if (typeof window === 'undefined') {
      const fs = eval("require('fs')");
      const path = eval("require('path')");
      const dbPath = path.resolve(process.cwd(), 'data', 'local.db');
      if (fs.existsSync(dbPath)) {
        try {
          this.seedFromSqlite(dbPath);
          return;
        } catch (e) {
          // fallback to JSON seed on error
           
          console.warn('Failed to load local SQLite DB, falling back to JSON seed:', e);
        }
      }
    }

    this.seed();
  }

  private seedFromSqlite(dbPath: string) {
    // Lazy require to avoid startup errors if dependency missing and avoid bundler static analysis
    let Database: any;
    try {
      Database = eval("require('better-sqlite3')");
    } catch (e) {
      throw new Error('Please install better-sqlite3 to use local SQLite data: npm install --save-dev better-sqlite3');
    }

    const db = new Database(dbPath, { readonly: true });

    const users = db.prepare('SELECT id, username, email, name, avatar, role, phone, location, state, resume, bio, password_hash, created_at FROM users ORDER BY created_at DESC').all();
    const companies = db.prepare('SELECT id, name, logo, industry, size, location, city, state, description, website, email, phone, verified, verified_at, job_count, created_at FROM companies ORDER BY created_at DESC').all();
    const jobs = db.prepare('SELECT id, title, company_id, category, location, state, salary_min, salary_max, salary_type, experience, education, description, requirements, benefits, status, views, applications, created_at, updated_at FROM jobs ORDER BY created_at DESC').all();
    const categories = db.prepare('SELECT id, name, icon, slug, subcategories FROM categories ORDER BY name').all();
    const locations = db.prepare('SELECT id, name, state, state_code, cities FROM locations ORDER BY name').all();

    // Map columns to local table shapes
    this.tables.set('users', users.map((u: any) => ({
      id: u.id,
      username: u.username ?? null,
      email: u.email,
      name: u.name,
      avatar: u.avatar ?? null,
      role: u.role,
      phone: u.phone ?? null,
      location: u.location ?? null,
      state: u.state ?? null,
      resume: u.resume ?? null,
      bio: u.bio ?? null,
      status: 'active',
      company_id: null,
      password_hash: u.password_hash ?? '',
      created_at: u.created_at,
    })));

    this.tables.set('companies', companies.map((c: any) => ({
      id: c.id,
      name: c.name,
      logo: c.logo ?? null,
      industry: c.industry,
      size: c.size,
      location: c.location,
      city: c.city ?? null,
      state: c.state,
      description: c.description,
      website: c.website ?? null,
      email: c.email,
      phone: c.phone ?? null,
      verified: Number(c.verified) ? 1 : 0,
      verified_at: c.verified_at ?? null,
      job_count: c.job_count ?? 0,
      created_at: c.created_at,
    })));

    this.tables.set('jobs', jobs.map((j: any) => ({
      id: j.id,
      title: j.title,
      company_id: j.company_id,
      category: j.category,
      location: j.location,
      state: j.state,
      salary_min: j.salary_min,
      salary_max: j.salary_max,
      salary_type: j.salary_type,
      experience: j.experience,
      education: j.education,
      description: j.description,
      requirements: j.requirements ?? '[]',
      benefits: j.benefits ?? '[]',
      status: j.status,
      views: j.views,
      applications: j.applications,
      created_at: j.created_at,
      updated_at: j.updated_at,
    })));

    this.tables.set('categories', categories.map((c: any) => ({
      id: c.id,
      name: c.name,
      icon: c.icon,
      slug: c.slug,
      subcategories: c.subcategories ?? '[]',
    })));

    this.tables.set('locations', locations.map((l: any) => ({
      id: l.id,
      name: l.name,
      state: l.state,
      state_code: l.state_code,
      cities: l.cities ?? '[]',
    })));

    this.tables.set('applications', []);
    this.tables.set('favorites', []);
    this.tables.set('messages', []);

    db.close();
  }

  prepare(query: string): D1PreparedStatement {
    return new LocalPreparedStatement(this, query.replace(/\s+/g, ' ').trim());
  }

  async batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]> {
    const results: D1Result<T>[] = [];
    for (const stmt of statements) {
      results.push(await (stmt as LocalPreparedStatement).run());
    }
    return results;
  }

  async exec(query: string): Promise<D1ExecResult> {
    const statements = query.split(';').map((s) => s.trim()).filter(Boolean);
    for (const sql of statements) {
      new LocalPreparedStatement(this, sql).runSync();
    }
    return { count: statements.length, duration: 0 };
  }

  private seed() {
    const users = (usersData as User[]).map((u) => ({
      id: u.id,
      username: (u as any).username ?? null,
      email: u.email,
      name: u.name,
      avatar: u.avatar ?? null,
      role: u.role,
      phone: u.phone ?? null,
      location: u.location ?? null,
      state: u.state ?? null,
      resume: u.resume ?? null,
      bio: u.bio ?? null,
      status: 'active',
      company_id: u.role === 'employer' ? 'company1' : null,
      password_hash: (u as any).passwordHash ?? '',
      password: (u as any).password ?? null,
      created_at: u.createdAt,
    }));

    const companies = (companiesData as Company[]).map((c) => ({
      id: c.id,
      name: c.name,
      logo: c.logo ?? null,
      industry: c.industry,
      size: c.size,
      location: c.location,
      city: c.city ?? null,
      state: c.state,
      description: c.description,
      website: c.website ?? null,
      email: c.email,
      phone: c.phone ?? null,
      verified: c.verified ? 1 : 0,
      verified_at: c.verifiedAt ?? null,
      job_count: c.jobCount ?? 0,
      created_at: c.createdAt,
    }));

    const jobs = (jobsData as Job[]).map((j) => ({
      id: j.id,
      title: j.title,
      company_id: j.companyId,
      category: j.category,
      location: j.location,
      state: j.state,
      salary_min: j.salaryMin,
      salary_max: j.salaryMax,
      salary_type: j.salaryType,
      experience: j.experience,
      education: j.education,
      description: j.description,
      requirements: JSON.stringify(j.requirements),
      benefits: JSON.stringify(j.benefits),
      status: j.status,
      views: j.views,
      applications: j.applications,
      created_at: j.createdAt,
      updated_at: j.updatedAt,
    }));

    const categories = (categoriesData as (Category & { subcategories?: string[] })[]).map((c) => ({
      id: c.id,
      name: c.name,
      icon: c.icon,
      slug: c.slug,
      subcategories: JSON.stringify(c.subcategories ?? []),
    }));

    const locations = (locationsData as Location[]).map((l) => ({
      id: l.id,
      name: l.name,
      state: l.state,
      state_code: l.stateCode,
      cities: JSON.stringify(l.cities),
    }));

    this.tables.set('users', users);
    this.tables.set('companies', companies);
    this.tables.set('jobs', jobs);
    this.tables.set('categories', categories);
    this.tables.set('locations', locations);
    this.tables.set('applications', []);
    this.tables.set('favorites', []);
    this.tables.set('messages', []);
  }
}

class LocalPreparedStatement {
  private params: unknown[] = [];

  constructor(
    private db: LocalD1Database,
    private sql: string,
  ) {}

  bind(...values: unknown[]): D1PreparedStatement {
    this.params = values;
    return this as unknown as D1PreparedStatement;
  }

  async first<T = Row>(): Promise<T | null> {
    const rows = this.selectRows();
    return (rows[0] as T) ?? null;
  }

  async all<T = Row>(): Promise<D1Result<T>> {
    const rows = this.selectRows();
    return { results: rows as T[], success: true, meta: {} as D1Meta };
  }

  async run(): Promise<D1Result> {
    return this.runSync();
  }

  runSync(): D1Result {
    const upper = this.sql.toUpperCase();

    if (upper.startsWith('SELECT')) {
      const rows = this.selectRows();
      return { results: rows, success: true, meta: {} as D1Meta };
    }

    if (upper.startsWith('INSERT')) {
      const table = this.extractTable(this.sql, /INTO\s+(\w+)/i);
      const rows = this.db.tables.get(table!) ?? [];
      const row = this.parseInsert();
      const idx = rows.findIndex((r) => r.id === row.id);
      if (idx >= 0) rows[idx] = row;
      else rows.push(row);
      this.db.tables.set(table!, rows);
      return { success: true, meta: { changes: 1 } as D1Meta };
    }

    if (upper.startsWith('UPDATE')) {
      const table = this.extractTable(this.sql, /UPDATE\s+(\w+)/i);
      const rows = this.db.tables.get(table!) ?? [];
      const id = this.params[this.params.length - 1];
      const idx = rows.findIndex((r) => r.id === id);
      if (idx >= 0) {
        Object.assign(rows[idx], this.parseUpdateSet());
        if (this.sql.includes('updated_at')) {
          rows[idx].updated_at = new Date().toISOString();
        }
      }
      return { success: true, meta: { changes: idx >= 0 ? 1 : 0 } as D1Meta };
    }

    if (upper.startsWith('DELETE')) {
      const table = this.extractTable(this.sql, /FROM\s+(\w+)/i);
      const rows = this.db.tables.get(table!) ?? [];
      if (table === 'favorites' && this.params.length === 2) {
        const next = rows.filter((r) => !(r.user_id === this.params[0] && r.job_id === this.params[1]));
        this.db.tables.set(table!, next);
        return { success: true, meta: { changes: rows.length - next.length } as D1Meta };
      }
      const id = this.params[0];
      const filtered = rows.filter((r) => r.id !== id);
      this.db.tables.set(table!, filtered);
      return { success: true, meta: { changes: rows.length - filtered.length } as D1Meta };
    }

    return { success: true, meta: {} as D1Meta };
  }

  private extractTable(sql: string, pattern: RegExp): string | null {
    const match = sql.match(pattern);
    return match?.[1] ?? null;
  }

  private parseInsert(): Row {
    const colsMatch = this.sql.match(/\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)/i);
    if (!colsMatch) return {};
    const cols = colsMatch[1].split(',').map((c) => c.trim());
    const row: Row = {};
    cols.forEach((col, i) => {
      row[col] = this.params[i] ?? null;
    });
    return row;
  }

  private parseUpdateSet(): Row {
    const setPart = this.sql.match(/SET\s+(.+?)\s+WHERE/i)?.[1];
    if (!setPart) return {};
    const parts = setPart.split(',').map((p) => p.trim());
    const row: Row = {};
    parts.forEach((part, i) => {
      const col = part.split('=')[0].trim();
      row[col] = this.params[i];
    });
    return row;
  }

  private selectRows(): Row[] {
    const upper = this.sql.toUpperCase();
    const fromMatch = this.sql.match(/FROM\s+(\w+)/i);
    const table = fromMatch?.[1] ?? '';
    let rows = [...(this.db.tables.get(table) ?? [])];

    if (upper.includes('COUNT(*)')) {
      rows = this.applyWhere(rows);
      return [{ total: rows.length }];
    }

    rows = this.applyWhere(rows);
    rows = this.applyOrderBy(rows);
    rows = this.applyLimitOffset(rows);
    return rows;
  }

  private applyWhere(rows: Row[]): Row[] {
    const wherePart = this.sql.split(/WHERE/i)[1]?.split(/ORDER BY|LIMIT/i)[0] ?? '';
    const checks: Array<(row: Row) => boolean> = [];
    let p = 0;

    const addCheck = (pattern: RegExp, fn: (row: Row, val: unknown) => boolean) => {
      if (pattern.test(wherePart) || pattern.test(this.sql)) {
        const val = this.params[p++];
        checks.push((row) => fn(row, val));
      }
    };

    if (/status\s*=\s*\?/i.test(wherePart)) {
      const val = this.params[p++];
      checks.push((row) => row.status === val);
    }
    if (/\(title\s+LIKE\s+\?\s+OR\s+description\s+LIKE\s+\?\)/i.test(wherePart)) {
      const kw = String(this.params[p++]).replace(/%/g, '').toLowerCase();
      p++;
      checks.push((row) =>
        String(row.title).toLowerCase().includes(kw) ||
        String(row.description).toLowerCase().includes(kw)
      );
    }
    if (/category\s*=\s*\?/i.test(wherePart)) {
      checks.push((row) => row.category === this.params[p++]);
    }
    if (/state\s*=\s*\?/i.test(wherePart) && !/state_code/i.test(wherePart)) {
      checks.push((row) => row.state === this.params[p++]);
    }
    if (/location\s*=\s*\?/i.test(wherePart)) {
      checks.push((row) => row.location === this.params[p++]);
    }
    if (/salary_max\s*>=\s*\?/i.test(wherePart)) {
      checks.push((row) => Number(row.salary_max) >= Number(this.params[p++]));
    }
    if (/salary_min\s*<=\s*\?/i.test(wherePart)) {
      checks.push((row) => Number(row.salary_min) <= Number(this.params[p++]));
    }
    if (/experience\s*=\s*\?/i.test(wherePart)) {
      checks.push((row) => row.experience === this.params[p++]);
    }
    if (/education\s*=\s*\?/i.test(wherePart)) {
      checks.push((row) => row.education === this.params[p++]);
    }
    if (/WHERE\s+id\s*=\s*\?/i.test(this.sql)) {
      checks.push((row) => row.id === this.params[p++]);
    }
    if (/WHERE\s+email\s*=\s*\?\s+OR\s+name\s*=\s*\?\s+OR\s+username\s*=\s*\?/i.test(this.sql)) {
      const val = this.params[p++];
      p += 2;
      checks.push((row) => row.email === val || row.name === val || row.username === val);
    } else if (/WHERE\s+email\s*=\s*\?/i.test(this.sql)) {
      checks.push((row) => row.email === this.params[p++]);
    }
    if (/WHERE\s+username\s*=\s*\?/i.test(this.sql)) {
      checks.push((row) => row.username === this.params[p++]);
    }
    if (/WHERE\s+company_id\s*=\s*\?/i.test(this.sql)) {
      checks.push((row) => row.company_id === this.params[p++]);
    }
    if (/WHERE\s+user_id\s*=\s*\?/i.test(this.sql)) {
      checks.push((row) => row.user_id === this.params[p++]);
    }
    if (/WHERE\s+job_id\s*=\s*\?/i.test(this.sql)) {
      checks.push((row) => row.job_id === this.params[p++]);
    }
    if (/WHERE\s+state_code\s*=\s*\?/i.test(this.sql)) {
      checks.push((row) => row.state_code === this.params[p++]);
    }
    if (/WHERE\s+slug\s*=\s*\?/i.test(this.sql)) {
      checks.push((row) => row.slug === this.params[p++]);
    }
    if (/WHERE\s+verified\s*=\s*1/i.test(this.sql)) {
      checks.push((row) => row.verified === 1);
    }
    if (/user_id\s*=\s*\?\s+AND\s+job_id\s*=\s*\?/i.test(this.sql)) {
      checks.push((row) => row.user_id === this.params[0] && row.job_id === this.params[1]);
    }

    addCheck(/AND\s+company_id\s*=\s*\?/i, (row, val) => row.company_id === val);

    return rows.filter((row) => checks.every((fn) => fn(row)));
  }

  private applyOrderBy(rows: Row[]): Row[] {
    if (/ORDER BY\s+created_at\s+DESC/i.test(this.sql)) {
      return rows.sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
    }
    if (/ORDER BY\s+views\s+DESC/i.test(this.sql)) {
      return rows.sort((a, b) => Number(b.views) - Number(a.views));
    }
    if (/ORDER BY\s+name/i.test(this.sql)) {
      return rows.sort((a, b) => String(a.name).localeCompare(String(b.name)));
    }
    return rows;
  }

  private applyLimitOffset(rows: Row[]): Row[] {
    const limitMatch = this.sql.match(/LIMIT\s+\?\s+OFFSET\s+\?/i);
    if (limitMatch) {
      const limitIdx = this.params.length - 2;
      const limit = Number(this.params[limitIdx]);
      const offset = Number(this.params[limitIdx + 1]);
      return rows.slice(offset, offset + limit);
    }
    const limitOnly = this.sql.match(/LIMIT\s+\?/i);
    if (limitOnly) {
      const limit = Number(this.params[this.params.length - 1]);
      return rows.slice(0, limit);
    }
    return rows;
  }
}

export async function initLocalDbPasswords(): Promise<void> {
  const { hashPassword } = await import('@/lib/utils/password');
  const defaultHash = await hashPassword('123456');
  const db = getLocalD1() as unknown as LocalD1Database;
  const users = db.tables.get('users') ?? [];
  for (const u of users) {
    if (!u.password_hash) {
      if (typeof u.password === 'string' && u.password) {
        u.password_hash = await hashPassword(u.password);
        delete u.password;
      } else {
        u.password_hash = defaultHash;
      }
    }
  }
}
