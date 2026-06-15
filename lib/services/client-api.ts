
import { authHeaders } from '@/lib/utils/auth-client';
import { Job, Company, User, Category, Location, JobFilters, Pagination, Application, Message, Report } from '@/types';

// API基础URL
const API_BASE = '/api';

type ApiResponse<T> = {
  status: 'success' | 'error';
  message: string;
  data?: T;
};

// 通用fetch函数
async function fetchApi<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${API_BASE}${endpoint}`, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        url.searchParams.set(key, value);
      }
    });
  }

  const response = await fetch(url.toString(), {
    headers: authHeaders(),
  });
  const json = (await response.json()) as ApiResponse<T>;
  if (!response.ok || json.status === 'error') {
    throw new Error(json.message || `API error: ${response.status} ${response.statusText}`);
  }

  return json.data as T;
}

// 职位相关操作 - 客户端API
export const jobService = {
  // 获取所有职位
  getAll: async (): Promise<Job[]> => {
    return fetchApi<Job[]>('/jobs');
  },

  // 根据ID获取职位
  getById: async (id: string): Promise<Job | undefined> => {
    try {
      return await fetchApi<Job>(`/jobs/${id}`);
    } catch {
      return undefined;
    }
  },

  // 根据公司ID获取职位
  getByCompanyId: async (companyId: string): Promise<Job[]> => {
    return fetchApi<Job[]>('/jobs', { companyId });
  },

  // 搜索和筛选职位
  search: async (filters: JobFilters, page: number = 1, pageSize: number = 20): Promise<{ data: Job[]; pagination: Pagination }> => {
    const params: Record<string, string> = {
      page: page.toString(),
      pageSize: pageSize.toString(),
    };

    if (filters.keyword) params.keyword = filters.keyword;
    if (filters.category) params.category = filters.category;
    if (filters.state) params.state = filters.state;
    if (filters.city) params.city = filters.city;
    if (filters.salaryMin !== undefined) params.salaryMin = filters.salaryMin.toString();
    if (filters.salaryMax !== undefined) params.salaryMax = filters.salaryMax.toString();
    if (filters.experience && filters.experience !== '不限') params.experience = filters.experience;
    if (filters.education && filters.education !== '不限') params.education = filters.education;

    const url = new URL(`${API_BASE}/jobs`, window.location.origin);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });

    const response = await fetch(url.toString());
    const json = (await response.json()) as ApiResponse<{ data: Job[]; pagination: Pagination }>;
    if (!response.ok || json.status === 'error') {
      throw new Error(json.message || `API error: ${response.status} ${response.statusText}`);
    }

    return json.data as { data: Job[]; pagination: Pagination };
  },

  // 获取热门职位
  getHotJobs: async (limit: number = 10): Promise<Job[]> => {
    return fetchApi<Job[]>('/jobs', { type: 'hot', limit: limit.toString() });
  },

  // 获取最新职位
  getLatestJobs: async (limit: number = 10): Promise<Job[]> => {
    return fetchApi<Job[]>('/jobs', { type: 'latest', limit: limit.toString() });
  },
};

// 公司相关操作 - 客户端API
export const companyService = {
  getAll: async (): Promise<Company[]> => {
    return fetchApi<Company[]>('/companies');
  },

  getById: async (id: string): Promise<Company | undefined> => {
    try {
      return await fetchApi<Company>(`/companies/${id}`);
    } catch {
      return undefined;
    }
  },

  getVerified: async (): Promise<Company[]> => {
    return fetchApi<Company[]>('/companies', { type: 'verified' });
  },

  getByState: async (state: string): Promise<Company[]> => {
    return fetchApi<Company[]>('/companies', { state });
  },
};

// 用户相关操作 - 客户端API
export const userService = {
  getAll: async (): Promise<User[]> => {
    return fetchApi<User[]>('/users');
  },

  getById: async (id: string): Promise<User | undefined> => {
    try {
      return await fetchApi<User>(`/users/${id}`);
    } catch {
      return undefined;
    }
  },

  getByEmail: async (email: string): Promise<User | undefined> => {
    try {
      return await fetchApi<User>('/users', { email });
    } catch {
      return undefined;
    }
  },
};

// 应用相关操作 - 客户端API
export const applicationService = {
  getMine: async (): Promise<Application[]> => {
    return fetchApi<Application[]>('/applications');
  },

  getByCompanyId: async (companyId: string): Promise<Application[]> => {
    return fetchApi<Application[]>(`/applications`, { companyId });
  },
};

// 消息相关操作 - 客户端API
export const messageService = {
  getMine: async (): Promise<Message[]> => {
    return fetchApi<Message[]>('/messages');
  },
};

export const favoriteService = {
  getMine: async (): Promise<Job[]> => {
    return fetchApi<Job[]>('/favorites');
  },
};

export const reportService = {
  getAll: async (): Promise<Report[]> => {
    return fetchApi<Report[]>('/reports');
  },
};

// 分类相关操作 - 客户端API
export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    return fetchApi<Category[]>('/categories');
  },

  getById: async (id: string): Promise<Category | undefined> => {
    try {
      const categories = await fetchApi<Category[]>('/categories');
      return categories.find(c => c.id === id);
    } catch {
      return undefined;
    }
  },

  getBySlug: async (slug: string): Promise<Category | undefined> => {
    try {
      return await fetchApi<Category>('/categories', { slug });
    } catch {
      return undefined;
    }
  },

  getAllSubcategories: async (): Promise<string[]> => {
    return fetchApi<string[]>('/categories', { type: 'subcategories' });
  },
};

// 地区相关操作 - 客户端API
export const locationService = {
  getAll: async (): Promise<Location[]> => {
    return fetchApi<Location[]>('/locations');
  },

  getById: async (id: string): Promise<Location | undefined> => {
    try {
      const locations = await fetchApi<Location[]>('/locations');
      return locations.find(l => l.id === id);
    } catch {
      return undefined;
    }
  },

  getByState: async (stateCode: string): Promise<Location | undefined> => {
    try {
      return await fetchApi<Location>('/locations', { stateCode });
    } catch {
      return undefined;
    }
  },

  getAllCities: async (): Promise<string[]> => {
    return fetchApi<string[]>('/locations', { type: 'cities' });
  },

  getCitiesByState: async (stateCode: string): Promise<string[]> => {
    return fetchApi<string[]>('/locations', { type: 'cities', stateCode });
  },
};
