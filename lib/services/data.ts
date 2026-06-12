import type { Job, Company, User, Category, Location, JobFilters, Pagination, Application, Message, Report } from '@/types';
import * as apiServices from '@/lib/services/client-api';

const isClient = typeof window !== 'undefined';

let dbServices: typeof import('@/lib/services/cloudflare-db') | null = null;

async function getDbServices() {
  if (!dbServices) {
    dbServices = await import('@/lib/services/cloudflare-db');
  }
  return dbServices;
}

export const jobService = {
  getAll: async (): Promise<Job[]> => {
    if (isClient) {
      const { jobService: svc } = apiServices;
      return svc.getAll();
    }
    const { jobService: svc } = await getDbServices();
    return svc.getAll();
  },

  getById: async (id: string): Promise<Job | undefined> => {
    if (isClient) {
      const { jobService: svc } = apiServices;
      return svc.getById(id);
    }
    const { jobService: svc } = await getDbServices();
    return svc.getById(id);
  },

  getByCompanyId: async (companyId: string): Promise<Job[]> => {
    if (isClient) {
      const { jobService: svc } = apiServices;
      return svc.getByCompanyId(companyId);
    }
    const { jobService: svc } = await getDbServices();
    return svc.getByCompanyId(companyId);
  },

  search: async (filters: JobFilters, page: number = 1, pageSize: number = 20): Promise<{ data: Job[]; pagination: Pagination }> => {
    if (isClient) {
      const { jobService: svc } = apiServices;
      return svc.search(filters, page, pageSize);
    }
    const { jobService: svc } = await getDbServices();
    return svc.search(filters, page, pageSize);
  },

  getHotJobs: async (limit: number = 10): Promise<Job[]> => {
    if (isClient) {
      const { jobService: svc } = apiServices;
      return svc.getHotJobs(limit);
    }
    const { jobService: svc } = await getDbServices();
    return svc.getHotJobs(limit);
  },

  getLatestJobs: async (limit: number = 10): Promise<Job[]> => {
    if (isClient) {
      const { jobService: svc } = apiServices;
      return svc.getLatestJobs(limit);
    }
    const { jobService: svc } = await getDbServices();
    return svc.getLatestJobs(limit);
  },
};

export const companyService = {
  getAll: async (): Promise<Company[]> => {
    if (isClient) {
      const { companyService: svc } = apiServices;
      return svc.getAll();
    }
    const { companyService: svc } = await getDbServices();
    return svc.getAll();
  },

  getById: async (id: string): Promise<Company | undefined> => {
    if (isClient) {
      const { companyService: svc } = apiServices;
      return svc.getById(id);
    }
    const { companyService: svc } = await getDbServices();
    return svc.getById(id);
  },

  getVerified: async (): Promise<Company[]> => {
    if (isClient) {
      const { companyService: svc } = apiServices;
      return svc.getVerified();
    }
    const { companyService: svc } = await getDbServices();
    return svc.getVerified();
  },

  getByState: async (state: string): Promise<Company[]> => {
    if (isClient) {
      const { companyService: svc } = apiServices;
      return svc.getByState(state);
    }
    const { companyService: svc } = await getDbServices();
    return svc.getByState(state);
  },
};

export const userService = {
  getAll: async (): Promise<User[]> => {
    if (isClient) {
      const { userService: svc } = apiServices;
      return svc.getAll();
    }
    const { userService: svc } = await getDbServices();
    return svc.getAll();
  },

  getById: async (id: string): Promise<User | undefined> => {
    if (isClient) {
      const { userService: svc } = apiServices;
      return svc.getById(id);
    }
    const { userService: svc } = await getDbServices();
    return svc.getById(id);
  },

  getByEmail: async (email: string): Promise<User | undefined> => {
    if (isClient) {
      const { userService: svc } = apiServices;
      return svc.getByEmail(email);
    }
    const { userService: svc } = await getDbServices();
    return svc.getByEmail(email);
  },
};

export const applicationService = {
  getMine: async (): Promise<Application[]> => {
    if (isClient) {
      const { applicationService: svc } = apiServices;
      return svc.getMine();
    }
    throw new Error('applicationService.getMine can only be used on the client');
  },

  getByCompanyId: async (companyId: string): Promise<Application[]> => {
    if (isClient) {
      const { applicationService: svc } = apiServices;
      return svc.getByCompanyId(companyId);
    }
    throw new Error('applicationService.getByCompanyId can only be used on the client');
  },
};

export const messageService = {
  getMine: async (): Promise<Message[]> => {
    if (isClient) {
      const { messageService: svc } = apiServices;
      return svc.getMine();
    }
    throw new Error('messageService.getMine can only be used on the client');
  },
};

export const favoriteService = {
  getMine: async (): Promise<Job[]> => {
    if (isClient) {
      const { favoriteService: svc } = apiServices;
      return svc.getMine();
    }
    throw new Error('favoriteService.getMine can only be used on the client');
  },
};

export const reportService = {
  getAll: async (): Promise<Report[]> => {
    if (isClient) {
      const { reportService: svc } = apiServices;
      return svc.getAll();
    }
    const { reportService: svc } = await getDbServices();
    return svc.getAll();
  },
};

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    if (isClient) {
      const { categoryService: svc } = apiServices;
      return svc.getAll();
    }
    const { categoryService: svc } = await getDbServices();
    return svc.getAll();
  },

  getById: async (id: string): Promise<Category | undefined> => {
    if (isClient) {
      const { categoryService: svc } = apiServices;
      return svc.getById(id);
    }
    const { categoryService: svc } = await getDbServices();
    return svc.getById(id);
  },

  getBySlug: async (slug: string): Promise<Category | undefined> => {
    if (isClient) {
      const { categoryService: svc } = apiServices;
      return svc.getBySlug(slug);
    }
    const { categoryService: svc } = await getDbServices();
    return svc.getBySlug(slug);
  },

  getAllSubcategories: async (): Promise<string[]> => {
    if (isClient) {
      const { categoryService: svc } = apiServices;
      return svc.getAllSubcategories();
    }
    const { categoryService: svc } = await getDbServices();
    return svc.getAllSubcategories();
  },
};

export const locationService = {
  getAll: async (): Promise<Location[]> => {
    if (isClient) {
      const { locationService: svc } = apiServices;
      return svc.getAll();
    }
    const { locationService: svc } = await getDbServices();
    return svc.getAll();
  },

  getById: async (id: string): Promise<Location | undefined> => {
    if (isClient) {
      const { locationService: svc } = apiServices;
      return svc.getById(id);
    }
    const { locationService: svc } = await getDbServices();
    return svc.getById(id);
  },

  getByState: async (stateCode: string): Promise<Location | undefined> => {
    if (isClient) {
      const { locationService: svc } = apiServices;
      return svc.getByState(stateCode);
    }
    const { locationService: svc } = await getDbServices();
    return svc.getByState(stateCode);
  },

  getAllCities: async (): Promise<string[]> => {
    if (isClient) {
      const { locationService: svc } = apiServices;
      return svc.getAllCities();
    }
    const { locationService: svc } = await getDbServices();
    return svc.getAllCities();
  },

  getCitiesByState: async (stateCode: string): Promise<string[]> => {
    if (isClient) {
      const { locationService: svc } = apiServices;
      return svc.getCitiesByState(stateCode);
    }
    const { locationService: svc } = await getDbServices();
    return svc.getCitiesByState(stateCode);
  },
};
