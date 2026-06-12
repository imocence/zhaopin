
/**
 * 数据库种子脚本 - 将JSON数据导入到Cloudflare D1数据库
 * 
 * 使用方法:
 * 1. 确保已安装wrangler: npm install -g wrangler
 * 2. 登录Cloudflare: wrangler login
 * 3. 创建D1数据库: wrangler d1 create zhaopin-db
 * 4. 更新wrangler.toml中的数据库ID
 * 5. 运行此脚本: npx wrangler d1 execute zhaopin-db --file=./scripts/seed-db.sql
 */

import { Job, Company, User, Category, Location } from '@/types';

// 导入JSON数据
import jobsData from '@/lib/data/jobs.json';
import companiesData from '@/lib/data/companies.json';
import usersData from '@/lib/data/users.json';
import categoriesData from '@/lib/data/categories.json';
import locationsData from '@/lib/data/locations.json';

const jobs = jobsData as Job[];
const companies = companiesData as Company[];
const users = usersData as User[];
const categories = categoriesData as Category[];
const locations = locationsData as Location[];

// 生成SQL插入语句
function generateInsertSQL() {
  const statements: string[] = [];

  // 插入用户
  users.forEach(user => {
    statements.push(
      `INSERT OR REPLACE INTO users (id, email, name, avatar, role, phone, location, state, resume, bio, created_at) VALUES ('${user.id}', '${user.email}', '${user.name.replace(/'/g, "''")}', ${user.avatar ? `'${user.avatar}'` : 'NULL'}, '${user.role}', ${user.phone ? `'${user.phone}'` : 'NULL'}, ${user.location ? `'${user.location}'` : 'NULL'}, ${user.state ? `'${user.state}'` : 'NULL'}, ${user.resume ? `'${user.resume}'` : 'NULL'}, ${user.bio ? `'${user.bio.replace(/'/g, "''")}'` : 'NULL'}, '${user.createdAt}');`
    );
  });

  // 插入公司
  companies.forEach(company => {
    statements.push(
      `INSERT OR REPLACE INTO companies (id, name, logo, industry, size, location, city, state, description, website, email, phone, verified, verified_at, job_count, created_at) VALUES ('${company.id}', '${company.name.replace(/'/g, "''")}', ${company.logo ? `'${company.logo}'` : 'NULL'}, '${company.industry.replace(/'/g, "''")}', '${company.size}', '${company.location.replace(/'/g, "''")}', ${company.city ? `'${company.city}'` : 'NULL'}, '${company.state}', '${company.description.replace(/'/g, "''")}', ${company.website ? `'${company.website}'` : 'NULL'}, '${company.email}', ${company.phone ? `'${company.phone}'` : 'NULL'}, ${company.verified ? 1 : 0}, ${company.verifiedAt ? `'${company.verifiedAt}'` : 'NULL'}, ${company.jobCount || 0}, '${company.createdAt}');`
    );
  });

  // 插入职位
  jobs.forEach(job => {
    statements.push(
      `INSERT OR REPLACE INTO jobs (id, title, company_id, category, location, state, salary_min, salary_max, salary_type, experience, education, description, requirements, benefits, status, views, applications, created_at, updated_at) VALUES ('${job.id}', '${job.title.replace(/'/g, "''")}', '${job.companyId}', '${job.category}', '${job.location.replace(/'/g, "''")}', '${job.state}', ${job.salaryMin}, ${job.salaryMax}, '${job.salaryType}', '${job.experience}', '${job.education}', '${job.description.replace(/'/g, "''")}', '${JSON.stringify(job.requirements).replace(/'/g, "''")}', '${JSON.stringify(job.benefits).replace(/'/g, "''")}', '${job.status}', ${job.views}, ${job.applications}, '${job.createdAt}', '${job.updatedAt}');`
    );
  });

  // 插入分类
  categories.forEach(category => {
    statements.push(
      `INSERT OR REPLACE INTO categories (id, name, icon, slug) VALUES ('${category.id}', '${category.name.replace(/'/g, "''")}', '${category.icon}', '${category.slug}');`
    );
  });

  // 插入地区
  locations.forEach(location => {
    statements.push(
      `INSERT OR REPLACE INTO locations (id, name, state, state_code, cities) VALUES ('${location.id}', '${location.name.replace(/'/g, "''")}', '${location.state.replace(/'/g, "''")}', '${location.stateCode}', '${JSON.stringify(location.cities).replace(/'/g, "''")}');`
    );
  });

  return statements.join('');
}

// 输出SQL
console.log('-- 招聘网站数据库种子数据');
console.log('-- 生成时间: ' + new Date().toISOString());
console.log('');
console.log(generateInsertSQL());
