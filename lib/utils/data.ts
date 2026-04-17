import { Job, Company, User, Category, Location, JobFilters, Pagination } from '@/types';

// 导入数据
import jobsData from '@/lib/data/jobs.json';
import companiesData from '@/lib/data/companies.json';
import usersData from '@/lib/data/users.json';
import categoriesData from '@/lib/data/categories.json';
import locationsData from '@/lib/data/locations.json';

// 类型断言
const jobs: Job[] = jobsData as Job[];
const companies: Company[] = companiesData as Company[];
const users: User[] = usersData as User[];
const categories: Category[] = categoriesData as Category[];
const locations: Location[] = locationsData as Location[];

// 职位相关操作
export const jobService = {
  // 获取所有职位
  getAll: () => jobs,

  // 根据ID获取职位
  getById: (id: string) => jobs.find(job => job.id === id),

  // 根据公司ID获取职位
  getByCompanyId: (companyId: string) => jobs.filter(job => job.companyId === companyId),

  // 搜索和筛选职位
  search: (filters: JobFilters, page: number = 1, pageSize: number = 20) => {
    let filtered = [...jobs];

    // 关键词搜索
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(keyword) ||
        job.description.toLowerCase().includes(keyword)
      );
    }

    // 分类筛选
    if (filters.category) {
      filtered = filtered.filter(job => job.category === filters.category);
    }

    // 州筛选
    if (filters.state) {
      filtered = filtered.filter(job => job.state === filters.state);
    }

    // 城市筛选
    if (filters.city) {
      filtered = filtered.filter(job => job.location === filters.city);
    }

    // 薪资筛选
    if (filters.salaryMin !== undefined) {
      filtered = filtered.filter(job => job.salaryMax >= filters.salaryMin!);
    }
    if (filters.salaryMax !== undefined) {
      filtered = filtered.filter(job => job.salaryMin <= filters.salaryMax!);
    }

    // 经验筛选
    if (filters.experience && filters.experience !== '不限') {
      filtered = filtered.filter(job => job.experience === filters.experience);
    }

    // 学历筛选
    if (filters.education && filters.education !== '不限') {
      filtered = filtered.filter(job => job.education === filters.education);
    }

    // 只显示激活的职位
    filtered = filtered.filter(job => job.status === 'active');

    // 排序（最新的在前）
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // 分页
    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedJobs = filtered.slice(start, end);

    return {
      data: paginatedJobs,
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
      } as Pagination,
    };
  },

  // 获取热门职位
  getHotJobs: (limit: number = 10) => {
    return jobs
      .filter(job => job.status === 'active')
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);
  },

  // 获取最新职位
  getLatestJobs: (limit: number = 10) => {
    return jobs
      .filter(job => job.status === 'active')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  },
};

// 公司相关操作
export const companyService = {
  getAll: () => companies,
  getById: (id: string) => companies.find(company => company.id === id),
  getVerified: () => companies.filter(company => company.verified),
  getByState: (state: string) => companies.filter(company => company.state === state),
};

// 用户相关操作
export const userService = {
  getAll: () => users,
  getById: (id: string) => users.find(user => user.id === id),
  getByEmail: (email: string) => users.find(user => user.email === email),
};

// 分类相关操作
export const categoryService = {
  getAll: () => categories,
  getById: (id: string) => categories.find(category => category.id === id),
  getBySlug: (slug: string) => categories.find(category => category.slug === slug),
  getAllSubcategories: () => {
    const allSubcategories: string[] = [];
    categories.forEach(category => {
      if (category.subcategories) {
        allSubcategories.push(...category.subcategories);
      }
    });
    return [...new Set(allSubcategories)];
  },
};

// 地区相关操作
export const locationService = {
  getAll: () => locations,
  getById: (id: string) => locations.find(location => location.id === id),
  getByState: (stateCode: string) => locations.find(location => location.stateCode === stateCode),
  getAllCities: () => {
    const allCities: string[] = [];
    locations.forEach(location => {
      allCities.push(...location.cities);
    });
    return [...new Set(allCities)];
  },
  getCitiesByState: (stateCode: string) => {
    const location = locations.find(loc => loc.stateCode === stateCode);
    return location?.cities || [];
  },
};
