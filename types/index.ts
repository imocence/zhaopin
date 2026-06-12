// 职位类型
export interface Job {
  id: string;
  title: string;
  companyId: string;
  category: string;
  location: string;
  state: string;
  salaryMin: number;
  salaryMax: number;
  salaryType: 'hourly' | 'monthly' | 'yearly';
  experience: string;
  education: string;
  description: string;
  requirements: string[];
  benefits: string[];
  status: 'active' | 'inactive' | 'closed' | 'draft';
  views: number;
  applications: number;
  createdAt: string;
  updatedAt: string;
}

// 公司类型
export interface Company {
  id: string;
  name: string;
  logo?: string;
  industry: string;
  size: string;
  location: string;
  city?: string;
  state: string;
  description: string;
  website?: string;
  email: string;
  phone?: string;
  contact?: {
    name?: string;
    phone?: string;
  };
  verified: boolean;
  verifiedAt?: string;
  jobCount?: number;
  rejectReason?: string;
  createdAt: string;
}

// 用户类型
export interface User {
  id: string;
  username?: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'jobseeker' | 'employer' | 'admin';
  phone?: string;
  location?: string;
  state?: string;
  resume?: string;
  bio?: string;
  status?: 'active' | 'inactive';
  companyId?: string;
  createdAt: string;
}

export interface UserWithPassword extends User {
  passwordHash?: string;
}

// 职位申请类型
export interface Application {
  id: string;
  jobId: string;
  userId: string;
  status: 'pending' | 'reviewed' | 'interview' | 'accepted' | 'rejected';
  coverLetter?: string;
  resume?: string;
  createdAt: string;
  updatedAt: string;
  jobTitle?: string;
  companyName?: string;
}

// 收藏类型
export interface Favorite {
  id: string;
  userId: string;
  jobId: string;
  createdAt: string;
}

// 消息类型
export interface Message {
  id: string;
  fromUserId: string;
  toUserId: string;
  jobId?: string;
  subject: string;
  content: string;
  read: boolean;
  createdAt: string;
}

// 分类类型
export interface Category {
  id: string;
  name: string;
  icon: string;
  slug: string;
}

// 地区类型
export interface Location {
  id: string;
  name: string;
  state: string;
  stateCode: string;
  cities: string[];
}

// 筛选参数类型
export interface JobFilters {
  category?: string;
  state?: string;
  city?: string;
  salaryMin?: number;
  salaryMax?: number;
  experience?: string;
  education?: string;
  keyword?: string;
}

// 分页类型
export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
