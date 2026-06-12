'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { categoryService, jobService, locationService } from '@/lib/services/data';
import { JobFilters, Job, Pagination as PaginationType, Location } from '@/types';
import { EDUCATION_OPTIONS, EXPERIENCE_OPTIONS } from '@/lib/constants';
import JobList from '@/components/job/JobList';
import { FilterSection, FilterSidebar } from '@/components/filter';

export const dynamic = 'force-dynamic';

export default function JobsPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<JobFilters>({
    keyword: searchParams.get('keyword') || '',
    category: searchParams.get('category') || '',
    state: searchParams.get('state') || '',
    city: searchParams.get('city') || '',
    salaryMin: searchParams.get('salaryMin') ? Number(searchParams.get('salaryMin')) : undefined,
    salaryMax: searchParams.get('salaryMax') ? Number(searchParams.get('salaryMax')) : undefined,
    experience: searchParams.get('experience') || '',
    education: searchParams.get('education') || '',
  });
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [categories, setCategories] = useState<string[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [pagination, setPagination] = useState<PaginationType>({ page: 1, pageSize: 10, total: 0, totalPages: 0 });
  const [citiesByState, setCitiesByState] = useState<string[]>([]);

  useEffect(() => {
    async function loadFilterData() {
      const [cats, locs] = await Promise.all([
        categoryService.getAllSubcategories(),
        locationService.getAll(),
      ]);
      setCategories(cats);
      setLocations(locs);
    }
    loadFilterData();
  }, []);

  useEffect(() => {
    async function loadCities() {
      if (filters.state) {
        const cities = await locationService.getCitiesByState(filters.state);
        setCitiesByState(cities);
      } else {
        setCitiesByState([]);
      }
    }
    loadCities();
  }, [filters.state]);

  useEffect(() => {
    async function loadJobs() {
      const result = await jobService.search(filters, page, pageSize);
      setJobs(result.data);
      setPagination(result.pagination || { page, pageSize, total: 0, totalPages: 0 });
    }
    loadJobs();
  }, [filters, page, pageSize]);

  const handleFilterChange = (key: keyof JobFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setPage(1);

    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v !== undefined && v !== '') {
        params.set(k, String(v));
      }
    });
    const queryString = params.toString();
    router.push(queryString ? `/jobs?${queryString}` : '/jobs');
  };

  const handleQuickFilter = (newFilters: Partial<JobFilters>) => {
    setFilters({ ...filters, ...newFilters });
    setPage(1);

    const params = new URLSearchParams();
    Object.entries({ ...filters, ...newFilters }).forEach(([k, v]) => {
      if (v !== undefined && v !== '') {
        params.set(k, String(v));
      }
    });
    const queryString = params.toString();
    router.push(queryString ? `/jobs?${queryString}` : '/jobs');
  };

  const handleResetFilters = () => {
    setFilters({});
    setPage(1);
    router.push('/jobs');
  };

  const hasActiveFilters = () => {
    return Object.entries(filters).some(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        return false;
      }
      return true;
    });
  };

  const [sortBy, setSortBy] = useState('latest');

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setPage(1);
  };

  const filterSections: FilterSection[] = [
    {
      key: 'keyword',
      label: '关键词',
      icon: 'layui-icon-search',
      type: 'text',
      placeholder: '搜索职位、公司...',
      value: filters.keyword,
      onChange: (value: any) => handleFilterChange('keyword', value)
    },
    {
      key: 'category',
      label: '职位分类',
      icon: 'layui-icon-file',
      type: 'select',
      options: categories.map(cat => ({ value: cat, label: cat })),
      value: filters.category,
      onChange: (value: any) => handleFilterChange('category', value)
    },
    {
      key: 'state',
      label: '州/地区',
      icon: 'layui-icon-location',
      type: 'select',
      options: locations.map(loc => ({ value: loc.stateCode, label: loc.name })),
      value: filters.state,
      onChange: (value: any) => handleFilterChange('state', value)
    },
    ...(filters.state ? [{
      key: 'city' as const,
      label: '城市',
      icon: 'layui-icon-engine',
      type: 'select' as const,
      options: citiesByState.map(city => ({ value: city, label: city })),
      value: filters.city,
      onChange: (value: any) => handleFilterChange('city', value)
    }] : []),
    {
      key: 'experience',
      label: '经验要求',
      icon: 'layui-icon-date',
      type: 'select',
      options: EXPERIENCE_OPTIONS.map(opt => ({ value: opt.value, label: opt.label })),
      value: filters.experience,
      onChange: (value: any) => handleFilterChange('experience', value)
    },
    {
      key: 'education',
      label: '学历要求',
      icon: 'layui-icon-read',
      type: 'select',
      options: EDUCATION_OPTIONS.map(opt => ({ value: opt.value, label: opt.label })),
      value: filters.education,
      onChange: (value: any) => handleFilterChange('education', value)
    },
    {
      key: 'salary',
      label: '年薪范围',
      icon: 'layui-icon-rmb',
      type: 'number-range',
      value: { min: filters.salaryMin, max: filters.salaryMax },
      onChange: (value: any) => {
        handleFilterChange('salaryMin', value?.min);
        handleFilterChange('salaryMax', value?.max);
      }
    }
  ];

  return (
    <div className="layui-container layui-mt20">
      <div className="layui-card layui-page-header layui-mb25">
        <div className="layui-card-body layui-page-header-body layui-bg-gradient-cyan">
          <div className="layui-header-decoration layui-header-decoration-lg"></div>
          <div className="layui-header-decoration layui-header-decoration-sm"></div>

          <div className="layui-row layui-row-flex layui-row-middle">
            <div className="layui-col-xs8 layui-col-sm8 layui-col-md6">
              <div className="layui-flex layui-flex-middle">
                <div className="layui-header-icon layui-mr20">
                  <i className="layui-icon layui-icon-search layui-font-white layui-font-3xl"></i>
                </div>
                <div>
                  <h1 className="layui-font-title layui-font-white layui-font-bold layui-mb5">职位搜索</h1>
                  <p className="layui-font-sm layui-font-gray-light layui-mt0 layui-mb0">发现理想工作，开启职业新篇章</p>
                </div>
              </div>
            </div>
            <div className="layui-col-xs4 layui-col-sm4 layui-col-md6 layui-text-right">
              <div className="layui-header-badge layui-font-white layui-font-lg">
                <i className="layui-icon layui-icon-ok-circle layui-font-white layui-icon-gap-md"></i>
                <span className="layui-font-white">
                  <span className="layui-font-2xl layui-font-bold layui-font-white layui-mr5">{pagination.total}</span> 个职位
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="layui-card layui-mt20 layui-mb20 layui-card-enhanced">
        <div className="layui-card-body layui-p20">
          <span className="layui-font-sm layui-font-gray-light layui-font-bold layui-mr20">热门搜索：</span>
          <div className="layui-flex layui-flex-wrap layui-gap-10">
            <span className="layui-filter-tag layui-filter-tag-cyan" onClick={() => handleQuickFilter({ category: '软件工程师' })}>
              <i className="layui-icon layui-icon-engine layui-icon-gap-sm"></i> 软件工程师
            </span>
            <span className="layui-filter-tag layui-filter-tag-green" onClick={() => handleQuickFilter({ state: 'CA' })}>
              <i className="layui-icon layui-icon-location layui-icon-gap-sm"></i> 加州
            </span>
            <span className="layui-filter-tag layui-filter-tag-orange" onClick={() => handleQuickFilter({ state: 'NY' })}>
              <i className="layui-icon layui-icon-location layui-icon-gap-sm"></i> 纽约
            </span>
            <span className="layui-filter-tag layui-filter-tag-red" onClick={() => handleQuickFilter({ salaryMin: 80000 })}>
              <i className="layui-icon layui-icon-rmb layui-icon-gap-sm"></i> 高薪职位
            </span>
            <span className="layui-filter-tag layui-filter-tag-purple" onClick={() => handleQuickFilter({ experience: '3年以上' })}>
              <i className="layui-icon layui-icon-date layui-icon-gap-sm"></i> 3年以上经验
            </span>
          </div>
        </div>
      </div>

      <div className="layui-row layui-col-space20 layui-mt20">
        <div className="layui-col-md3">
          <FilterSidebar
            filters={filterSections}
            onReset={handleResetFilters}
            hasActiveFilters={hasActiveFilters()}
          />
        </div>
        <div className="layui-col-md9">
          <div className="layui-card layui-mb20">
            <div className="layui-card-header layui-flex layui-flex-between layui-flex-middle">
              <div>
                <h2 className="layui-font-title layui-font-bold">职位列表</h2>
                <p className="layui-font-sm layui-font-gray-light layui-mt5">为您匹配最新职位信息</p>
              </div>
              <div className="layui-flex layui-flex-middle layui-gap-10">
                <select
                  className="layui-select layui-select-sm"
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                >
                  <option value="latest">最新发布</option>
                  <option value="popular">最热职位</option>
                </select>
              </div>
            </div>
            <div className="layui-card-body">
              <JobList jobs={jobs} total={pagination.total} page={page} pageSize={pageSize} onPageChange={handlePageChange} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
