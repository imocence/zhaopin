
import { Job, Company, User, UserWithPassword, Category, Location, JobFilters, Pagination, Application, Favorite } from '@/types';
import { getDb } from '@/lib/db/cloudflare';
import { hashPassword, verifyPassword } from '@/lib/utils/password';

function mapJobRow(row: Record<string, unknown>): Job {
  return {
    id: row.id as string,
    title: row.title as string,
    companyId: row.company_id as string,
    category: row.category as string,
    location: row.location as string,
    state: row.state as string,
    salaryMin: row.salary_min as number,
    salaryMax: row.salary_max as number,
    salaryType: row.salary_type as Job['salaryType'],
    experience: row.experience as string,
    education: row.education as string,
    description: row.description as string,
    requirements: JSON.parse((row.requirements as string) || '[]'),
    benefits: JSON.parse((row.benefits as string) || '[]'),
    status: row.status as Job['status'],
    views: row.views as number,
    applications: row.applications as number,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function mapUserRow(row: Record<string, unknown>): UserWithPassword {
  return {
    id: row.id as string,
    username: row.username as string | undefined,
    email: row.email as string,
    name: row.name as string,
    avatar: row.avatar as string | undefined,
    role: row.role as User['role'],
    phone: row.phone as string | undefined,
    location: row.location as string | undefined,
    state: row.state as string | undefined,
    resume: row.resume as string | undefined,
    bio: row.bio as string | undefined,
    status: (row.status as User['status']) || 'active',
    companyId: row.company_id as string | undefined,
    passwordHash: row.password_hash as string | undefined,
    createdAt: row.created_at as string,
  };
}

function mapApplicationRow(row: Record<string, unknown>): Application {
  return {
    id: row.id as string,
    jobId: row.job_id as string,
    userId: row.user_id as string,
    status: row.status as Application['status'],
    coverLetter: row.cover_letter as string | undefined,
    resume: row.resume as string | undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    jobTitle: row.job_title as string | undefined,
    companyName: row.company_name as string | undefined,
  };
}

// 职位相关操作
export const jobService = {
  // 获取所有职位
  getAll: async (): Promise<Job[]> => {
    const db = getDb();
    const result = await db.prepare('SELECT * FROM jobs ORDER BY created_at DESC').all();
    return result.results.map((row: any) => ({
      id: row.id,
      title: row.title,
      companyId: row.company_id,
      category: row.category,
      location: row.location,
      state: row.state,
      salaryMin: row.salary_min,
      salaryMax: row.salary_max,
      salaryType: row.salary_type,
      experience: row.experience,
      education: row.education,
      description: row.description,
      requirements: JSON.parse(row.requirements || '[]'),
      benefits: JSON.parse(row.benefits || '[]'),
      status: row.status,
      views: row.views,
      applications: row.applications,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  },

  // 根据ID获取职位
  getById: async (id: string): Promise<Job | undefined> => {
    const db = getDb();
    const result = await db.prepare('SELECT * FROM jobs WHERE id = ?').bind(id).first();
    if (!result) return undefined;

    return {
      id: result.id,
      title: result.title,
      companyId: result.company_id,
      category: result.category,
      location: result.location,
      state: result.state,
      salaryMin: result.salary_min,
      salaryMax: result.salary_max,
      salaryType: result.salary_type,
      experience: result.experience,
      education: result.education,
      description: result.description,
      requirements: JSON.parse(result.requirements || '[]'),
      benefits: JSON.parse(result.benefits || '[]'),
      status: result.status,
      views: result.views,
      applications: result.applications,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    };
  },

  // 根据公司ID获取职位
  getByCompanyId: async (companyId: string): Promise<Job[]> => {
    const db = getDb();
    const result = await db.prepare('SELECT * FROM jobs WHERE company_id = ? ORDER BY created_at DESC')
      .bind(companyId)
      .all();
    return result.results.map((row: any) => ({
      id: row.id,
      title: row.title,
      companyId: row.company_id,
      category: row.category,
      location: row.location,
      state: row.state,
      salaryMin: row.salary_min,
      salaryMax: row.salary_max,
      salaryType: row.salary_type,
      experience: row.experience,
      education: row.education,
      description: row.description,
      requirements: JSON.parse(row.requirements || '[]'),
      benefits: JSON.parse(row.benefits || '[]'),
      status: row.status,
      views: row.views,
      applications: row.applications,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  },

  // 搜索和筛选职位
  search: async (filters: JobFilters, page: number = 1, pageSize: number = 20): Promise<{ data: Job[]; pagination: Pagination }> => {
    const db = getDb();

    // 构建查询条件
    const conditions: string[] = ['status = ?'];
    const params: any[] = ['active'];

    if (filters.keyword) {
      conditions.push('(title LIKE ? OR description LIKE ?)');
      const keyword = `%${filters.keyword}%`;
      params.push(keyword, keyword);
    }

    if (filters.category) {
      conditions.push('category = ?');
      params.push(filters.category);
    }

    if (filters.state) {
      conditions.push('state = ?');
      params.push(filters.state);
    }

    if (filters.city) {
      conditions.push('location = ?');
      params.push(filters.city);
    }

    if (filters.salaryMin !== undefined) {
      conditions.push('salary_max >= ?');
      params.push(filters.salaryMin);
    }

    if (filters.salaryMax !== undefined) {
      conditions.push('salary_min <= ?');
      params.push(filters.salaryMax);
    }

    if (filters.experience && filters.experience !== '不限') {
      conditions.push('experience = ?');
      params.push(filters.experience);
    }

    if (filters.education && filters.education !== '不限') {
      conditions.push('education = ?');
      params.push(filters.education);
    }

    const whereClause = conditions.join(' AND ');

    // 获取总数
    const countResult = await db.prepare(`SELECT COUNT(*) as total FROM jobs WHERE ${whereClause}`)
      .bind(...params)
      .first();
    const total = countResult?.total || 0;
    const totalPages = Math.ceil(total / pageSize);

    // 获取分页数据
    const offset = (page - 1) * pageSize;
    const result = await db.prepare(`SELECT * FROM jobs WHERE ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`)
      .bind(...params, pageSize, offset)
      .all();

    const jobs = result.results.map((row: any) => ({
      id: row.id,
      title: row.title,
      companyId: row.company_id,
      category: row.category,
      location: row.location,
      state: row.state,
      salaryMin: row.salary_min,
      salaryMax: row.salary_max,
      salaryType: row.salary_type,
      experience: row.experience,
      education: row.education,
      description: row.description,
      requirements: JSON.parse(row.requirements || '[]'),
      benefits: JSON.parse(row.benefits || '[]'),
      status: row.status,
      views: row.views,
      applications: row.applications,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return {
      data: jobs,
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
      },
    };
  },

  // 获取热门职位
  getHotJobs: async (limit: number = 10): Promise<Job[]> => {
    const db = getDb();
    const result = await db.prepare('SELECT * FROM jobs WHERE status = ? ORDER BY views DESC LIMIT ?')
      .bind('active', limit)
      .all();
    return result.results.map((row: any) => ({
      id: row.id,
      title: row.title,
      companyId: row.company_id,
      category: row.category,
      location: row.location,
      state: row.state,
      salaryMin: row.salary_min,
      salaryMax: row.salary_max,
      salaryType: row.salary_type,
      experience: row.experience,
      education: row.education,
      description: row.description,
      requirements: JSON.parse(row.requirements || '[]'),
      benefits: JSON.parse(row.benefits || '[]'),
      status: row.status,
      views: row.views,
      applications: row.applications,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  },

  // 获取最新职位
  getLatestJobs: async (limit: number = 10): Promise<Job[]> => {
    const db = getDb();
    const result = await db.prepare('SELECT * FROM jobs WHERE status = ? ORDER BY created_at DESC LIMIT ?')
      .bind('active', limit)
      .all();
    return result.results.map(mapJobRow);
  },

  create: async (input: Omit<Job, 'id' | 'views' | 'applications' | 'createdAt' | 'updatedAt'>): Promise<Job> => {
    const db = getDb();
    const id = `job_${Date.now()}`;
    const now = new Date().toISOString();
    await db.prepare(
      `INSERT INTO jobs (id, title, company_id, category, location, state, salary_min, salary_max, salary_type, experience, education, description, requirements, benefits, status, views, applications, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?, ?)`
    ).bind(
      id, input.title, input.companyId, input.category, input.location, input.state,
      input.salaryMin, input.salaryMax, input.salaryType, input.experience, input.education,
      input.description, JSON.stringify(input.requirements), JSON.stringify(input.benefits),
      input.status, now, now
    ).run();

    await db.prepare('UPDATE companies SET job_count = job_count + 1 WHERE id = ?').bind(input.companyId).run();
    return (await jobService.getById(id))!;
  },

  update: async (id: string, input: Partial<Job>): Promise<Job | undefined> => {
    const db = getDb();
    const existing = await jobService.getById(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...input, updatedAt: new Date().toISOString() };
    await db.prepare(
      `UPDATE jobs SET title = ?, category = ?, location = ?, state = ?, salary_min = ?, salary_max = ?, salary_type = ?, experience = ?, education = ?, description = ?, requirements = ?, benefits = ?, status = ?, updated_at = ? WHERE id = ?`
    ).bind(
      updated.title, updated.category, updated.location, updated.state,
      updated.salaryMin, updated.salaryMax, updated.salaryType, updated.experience,
      updated.education, updated.description, JSON.stringify(updated.requirements),
      JSON.stringify(updated.benefits), updated.status, updated.updatedAt, id
    ).run();
    return updated;
  },

  delete: async (id: string): Promise<boolean> => {
    const db = getDb();
    const job = await jobService.getById(id);
    if (!job) return false;
    await db.prepare('DELETE FROM jobs WHERE id = ?').bind(id).run();
    await db.prepare('UPDATE companies SET job_count = MAX(job_count - 1, 0) WHERE id = ?').bind(job.companyId).run();
    return true;
  },

  incrementViews: async (id: string): Promise<void> => {
    const db = getDb();
    const job = await jobService.getById(id);
    if (!job) return;
    await db.prepare('UPDATE jobs SET views = ? WHERE id = ?').bind(job.views + 1, id).run();
  },
};

// 公司相关操作
export const companyService = {
  getAll: async (): Promise<Company[]> => {
    const db = getDb();
    const result = await db.prepare('SELECT * FROM companies ORDER BY created_at DESC').all();
    return result.results.map((row: any) => ({
      id: row.id,
      name: row.name,
      logo: row.logo,
      industry: row.industry,
      size: row.size,
      location: row.location,
      city: row.city,
      state: row.state,
      description: row.description,
      website: row.website,
      email: row.email,
      phone: row.phone,
      verified: Boolean(row.verified),
      verifiedAt: row.verified_at,
      jobCount: row.job_count,
      createdAt: row.created_at,
    }));
  },

  getById: async (id: string): Promise<Company | undefined> => {
    const db = getDb();
    let result = await db.prepare('SELECT * FROM companies WHERE id = ?').bind(id).first();
    if (!result) {
      const all = await db.prepare('SELECT * FROM companies ORDER BY created_at DESC').all();
      result = (all.results as any[]).find((row) => row.id === id) || null;
    }
    if (!result) return undefined;

    return {
      id: result.id,
      name: result.name,
      logo: result.logo,
      industry: result.industry,
      size: result.size,
      location: result.location,
      city: result.city,
      state: result.state,
      description: result.description,
      website: result.website,
      email: result.email,
      phone: result.phone,
      verified: Boolean(result.verified),
      verifiedAt: result.verified_at,
      jobCount: result.job_count,
      createdAt: result.created_at,
    };
  },

  getVerified: async (): Promise<Company[]> => {
    const db = getDb();
    const result = await db.prepare('SELECT * FROM companies WHERE verified = 1 ORDER BY created_at DESC').all();
    return result.results.map((row: any) => ({
      id: row.id,
      name: row.name,
      logo: row.logo,
      industry: row.industry,
      size: row.size,
      location: row.location,
      city: row.city,
      state: row.state,
      description: row.description,
      website: row.website,
      email: row.email,
      phone: row.phone,
      verified: Boolean(row.verified),
      verifiedAt: row.verified_at,
      jobCount: row.job_count,
      createdAt: row.created_at,
    }));
  },

  getByState: async (state: string): Promise<Company[]> => {
    const db = getDb();
    const result = await db.prepare('SELECT * FROM companies WHERE state = ? ORDER BY created_at DESC')
      .bind(state)
      .all();
    return result.results.map((row: any) => ({
      id: row.id,
      name: row.name,
      logo: row.logo,
      industry: row.industry,
      size: row.size,
      location: row.location,
      city: row.city,
      state: row.state,
      description: row.description,
      website: row.website,
      email: row.email,
      phone: row.phone,
      verified: Boolean(row.verified),
      verifiedAt: row.verified_at,
      jobCount: row.job_count,
      createdAt: row.created_at,
    }));
  },
};

// 用户相关操作
function mapUser(result: any): User {
  return {
    id: result.id,
    username: result.username,
    email: result.email,
    name: result.name,
    avatar: result.avatar,
    role: result.role,
    phone: result.phone,
    location: result.location,
    state: result.state,
    resume: result.resume,
    bio: result.bio,
    companyId: result.company_id,
    createdAt: result.created_at,
  };
}

export const userService = {
  getAll: async (): Promise<User[]> => {
    const db = getDb();
    const result = await db.prepare('SELECT * FROM users ORDER BY created_at DESC').all();
    return result.results.map((row: any) => mapUser(row));
  },

  getById: async (id: string): Promise<User | undefined> => {
    const db = getDb();
    let result = await db.prepare('SELECT * FROM users WHERE id = ?').bind(id).first();
    if (!result) {
      const all = await db.prepare('SELECT * FROM users ORDER BY created_at DESC').all();
      result = (all.results as any[]).find((row) => row.id === id) || null;
    }
    if (!result) return undefined;
    return mapUser(result);
  },

  getByEmail: async (email: string): Promise<User | undefined> => {
    const db = getDb();
    let result = await db.prepare('SELECT * FROM users WHERE email = ?').bind(email).first();
    if (!result) {
      const all = await db.prepare('SELECT * FROM users ORDER BY created_at DESC').all();
      result = (all.results as any[]).find((row) => row.email === email) || null;
    }
    if (!result) return undefined;
    return mapUser(result);
  },

  create: async (input: {
    username: string;
    email: string;
    name: string;
    password: string;
    role: User['role'];
    phone?: string;
    location?: string;
    state?: string;
    resume?: string;
    bio?: string;
    companyId?: string;
  }): Promise<User> => {
    const db = getDb();
    const id = `user_${Date.now()}`;
    const now = new Date().toISOString();
    const passwordHash = input.password ? await hashPassword(input.password) : undefined;

    await db.prepare(
      `INSERT INTO users (id, username, email, name, avatar, role, phone, location, state, resume, bio, password_hash, company_id, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      id,
      input.username,
      input.email,
      input.name,
      null,
      input.role,
      input.phone ?? null,
      input.location ?? null,
      input.state ?? null,
      input.resume ?? null,
      input.bio ?? null,
      passwordHash ?? null,
      input.companyId ?? null,
      now,
    ).run();

    return {
      id,
      username: input.username,
      email: input.email,
      name: input.name,
      avatar: undefined,
      role: input.role,
      phone: input.phone,
      location: input.location,
      state: input.state,
      resume: input.resume,
      bio: input.bio,
      companyId: input.companyId,
      createdAt: now,
    };
  },

  update: async (id: string, input: Partial<{
    username: string;
    email: string;
    name: string;
    password: string;
    role: User['role'];
    phone: string;
    location: string;
    state: string;
    resume: string;
    bio: string;
    companyId: string;
  }>): Promise<User | undefined> => {
    const existing = await userService.getById(id);
    if (!existing) return undefined;
    const db = getDb();

    const updated = {
      ...existing,
      ...input,
      companyId: input.companyId ?? existing.companyId,
    } as User;

    const updates: string[] = [];
    const params: any[] = [];

    if (input.username !== undefined) {
      updates.push('username = ?');
      params.push(input.username);
    }
    if (input.email !== undefined) {
      updates.push('email = ?');
      params.push(input.email);
    }
    if (input.name !== undefined) {
      updates.push('name = ?');
      params.push(input.name);
    }
    if (input.phone !== undefined) {
      updates.push('phone = ?');
      params.push(input.phone);
    }
    if (input.location !== undefined) {
      updates.push('location = ?');
      params.push(input.location);
    }
    if (input.state !== undefined) {
      updates.push('state = ?');
      params.push(input.state);
    }
    if (input.resume !== undefined) {
      updates.push('resume = ?');
      params.push(input.resume);
    }
    if (input.bio !== undefined) {
      updates.push('bio = ?');
      params.push(input.bio);
    }
    if (input.companyId !== undefined) {
      updates.push('company_id = ?');
      params.push(input.companyId);
    }
    if (input.password !== undefined) {
      const passwordHash = await hashPassword(input.password);
      updates.push('password_hash = ?');
      params.push(passwordHash);
    }

    if (updates.length > 0) {
      params.push(id);
      await db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).bind(...params).run();
    }

    return userService.getById(id);
  },

  authenticate: async (identifier: string, password: string): Promise<User | undefined> => {
    const db = getDb();
    let result = await db.prepare('SELECT * FROM users WHERE email = ? OR name = ? OR username = ?').bind(identifier, identifier, identifier).first();
    if (!result) {
      const all = await db.prepare('SELECT * FROM users ORDER BY created_at DESC').all();
      result = (all.results as any[]).find((row) => row.email === identifier || row.name === identifier || row.username === identifier) || null;
    }
    if (!result) return undefined;

    const storedHash = result.password_hash as string | undefined;
    if (storedHash) {
      const valid = await verifyPassword(password, storedHash);
      if (!valid) return undefined;
    } else {
      // 本地开发环境默认密码
      if (password !== '123456') return undefined;
    }

    return mapUser(result);
  },
};

// 分类相关操作
export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const db = getDb();
    const result = await db.prepare('SELECT * FROM categories ORDER BY name').all();
    return result.results.map((row: any) => ({
      id: row.id,
      name: row.name,
      icon: row.icon,
      slug: row.slug,
    }));
  },

  getById: async (id: string): Promise<Category | undefined> => {
    const db = getDb();
    const result = await db.prepare('SELECT * FROM categories WHERE id = ?').bind(id).first();
    if (!result) return undefined;

    return {
      id: result.id,
      name: result.name,
      icon: result.icon,
      slug: result.slug,
    };
  },

  getBySlug: async (slug: string): Promise<Category | undefined> => {
    const db = getDb();
    let result = await db.prepare('SELECT * FROM categories WHERE slug = ?').bind(slug).first();
    if (!result) {
      const all = await db.prepare('SELECT * FROM categories ORDER BY name').all();
      result = (all.results as any[]).find((row) => row.slug === slug) || null;
    }
    if (!result) return undefined;

    return {
      id: result.id,
      name: result.name,
      icon: result.icon,
      slug: result.slug,
    };
  },

  getAllSubcategories: async (): Promise<string[]> => {
    // 注意：在Cloudflare D1中，我们可能需要单独创建一个子分类表
    // 这里暂时返回空数组，需要根据实际需求调整
    return [];
  },
};

// 地区相关操作
export const locationService = {
  getAll: async (): Promise<Location[]> => {
    const db = getDb();
    const result = await db.prepare('SELECT * FROM locations ORDER BY name').all();
    return result.results.map((row: any) => ({
      id: row.id,
      name: row.name,
      state: row.state,
      stateCode: row.state_code,
      cities: JSON.parse(row.cities || '[]'),
    }));
  },

  getById: async (id: string): Promise<Location | undefined> => {
    const db = getDb();
    const result = await db.prepare('SELECT * FROM locations WHERE id = ?').bind(id).first();
    if (!result) return undefined;

    return {
      id: result.id,
      name: result.name,
      state: result.state,
      stateCode: result.state_code,
      cities: JSON.parse(result.cities || '[]'),
    };
  },

  getByState: async (stateCode: string): Promise<Location | undefined> => {
    const db = getDb();
    let result = await db.prepare('SELECT * FROM locations WHERE state_code = ?').bind(stateCode).first();
    if (!result) {
      const all = await db.prepare('SELECT * FROM locations ORDER BY name').all();
      result = (all.results as any[]).find((row) => row.state_code === stateCode) || null;
    }
    if (!result) return undefined;

    return {
      id: result.id,
      name: result.name,
      state: result.state,
      stateCode: result.state_code,
      cities: JSON.parse(result.cities || '[]'),
    };
  },

  getAllCities: async (): Promise<string[]> => {
    const db = getDb();
    const result = await db.prepare('SELECT cities FROM locations').all();
    const allCities: string[] = [];
    result.results.forEach((row: any) => {
      const cities = JSON.parse(row.cities || '[]');
      allCities.push(...cities);
    });
    return [...new Set(allCities)];
  },

  getCitiesByState: async (stateCode: string): Promise<string[]> => {
    const db = getDb();
    const result = await db.prepare('SELECT cities FROM locations WHERE state_code = ?').bind(stateCode).first();
    if (!result) return [];
    return JSON.parse(result.cities || '[]');
  },
};
