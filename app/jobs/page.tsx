'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { jobService, categoryService, locationService } from '@/lib/utils/data';
import { JobFilters } from '@/types';
import { EXPERIENCE_OPTIONS, EDUCATION_OPTIONS } from '@/lib/constants';
import JobList from '@/components/job/JobList';

export default function JobsPage() {
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

  const categories = categoryService.getAllSubcategories();
  const locations = locationService.getAll();

  const { data: jobs, pagination } = jobService.search(filters, page, pageSize);

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

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="layui-container layui-mt20">
      {/* 页面头部 */}
      <div className="layui-card layui-page-header layui-mb25">
        <div className="layui-card-body layui-page-header-body layui-bg-gradient-cyan">
          {/* 装饰性背景元素 */}
          <div className="layui-header-decoration layui-header-decoration-lg"></div>
          <div className="layui-header-decoration layui-header-decoration-sm"></div>

          <div style={{position: 'relative', zIndex: 1}}>
            <div className="layui-flex layui-mb15">
              <div className="layui-header-icon layui-mr20">
                <i className="layui-icon layui-icon-search layui-font-white layui-font-3xl"></i>
              </div>
              <div>
                <h1 className="layui-font-title layui-font-white layui-font-bold layui-mb5">职位搜索</h1>
                <p className="layui-font-sm layui-font-gray-light layui-mt5 layui-mb0">发现理想工作，开启职业新篇章</p>
              </div>
            </div>
            <div className="layui-header-badge layui-font-white layui-font-lg">
              <i className="layui-icon layui-icon-ok-circle layui-font-white layui-icon-gap-lg"></i>
              <span className="layui-font-white">
                找到 <span className="layui-font-3xl layui-font-bold layui-font-white layui-mr5 layui-ml5">{pagination.total}</span> 个优质职位
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 快捷筛选标签 */}
      <div className="layui-card layui-mb20 layui-card-enhanced">
        <div className="layui-card-body layui-p20">
          <span className="layui-font-sm layui-font-gray-light layui-font-bold layui-mr20">热门搜索：</span>
          <span
            className="layui-filter-tag layui-filter-tag-cyan"
            onClick={() => handleQuickFilter({ category: '软件工程师' })}
          >
            <i className="layui-icon layui-icon-engine layui-icon-gap-sm"></i>
            软件工程师
          </span>
          <span
            className="layui-filter-tag layui-filter-tag-green"
            onClick={() => handleQuickFilter({ state: 'CA' })}
          >
            <i className="layui-icon layui-icon-location layui-icon-gap-sm"></i>
            加州
          </span>
          <span
            className="layui-filter-tag layui-filter-tag-orange"
            onClick={() => handleQuickFilter({ state: 'NY' })}
          >
            <i className="layui-icon layui-icon-location layui-icon-gap-sm"></i>
            纽约
          </span>
          <span
            className="layui-filter-tag layui-filter-tag-red"
            onClick={() => handleQuickFilter({ salaryMin: 80000, salaryType: 'yearly' })}
          >
            <i className="layui-icon layui-icon-rmb layui-icon-gap-sm"></i>
            高薪职位
          </span>
          <span
            className="layui-filter-tag layui-filter-tag-purple"
            onClick={() => handleQuickFilter({ experience: '3年以上' })}
          >
            <i className="layui-icon layui-icon-date layui-icon-gap-sm"></i>
            3年以上经验
          </span>
        </div>
      </div>

      <div className="layui-row layui-col-space20 layui-mt20">
        {/* 筛选侧边栏 */}
        <div className="layui-col-md3">
          <div className="layui-card layui-card-enhanced">
            <div className="layui-card-header layui-card-header-bg layui-flex layui-flex-between">
              <div className="layui-flex layui-flex-center">
                <i className="layui-icon layui-icon-template-1 layui-font-blue layui-icon-gap"></i>
                <span className="layui-font-lg layui-font-bold layui-font-gray-light">筛选条件</span>
              </div>
              {hasActiveFilters() && (
                <span className="layui-badge layui-badge-enhanced layui-badge-cyan">已筛选</span>
              )}
            </div>
            <div className="layui-card-body layui-p20">
              {/* 关键词搜索 */}
              <div className="layui-form-item-enhanced">
                <label className="layui-form-label-enhanced">
                  <i className="layui-icon layui-icon-search layui-font-gray-99 layui-icon-gap"></i>
                  关键词
                </label>
                <input
                  type="text"
                  placeholder="搜索职位、公司..."
                  className="layui-input layui-input-enhanced"
                  value={filters.keyword || ''}
                  onChange={(e) => handleFilterChange('keyword', e.target.value)}
                />
              </div>

              {/* 职位分类 */}
              <div className="layui-form-item-enhanced">
                <label className="layui-form-label-enhanced">
                  <i className="layui-icon layui-icon-file layui-font-gray-99 layui-icon-gap"></i>
                  职位分类
                </label>
                <select
                  className="layui-input layui-input-enhanced"
                  value={filters.category || ''}
                  onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
                >
                  <option value="">全部分类</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* 州/地区 */}
              <div className="layui-form-item-enhanced">
                <label className="layui-form-label-enhanced">
                  <i className="layui-icon layui-icon-location layui-font-gray-99 layui-icon-gap"></i>
                  州/地区
                </label>
                <select
                  className="layui-input layui-input-enhanced"
                  value={filters.state || ''}
                  onChange={(e) => handleFilterChange('state', e.target.value || undefined)}
                >
                  <option value="">全部州</option>
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.stateCode}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 城市 */}
              {filters.state && (
                <div className="layui-form-item-enhanced">
                  <label className="layui-form-label-enhanced">
                    <i className="layui-icon layui-icon-engine layui-font-gray-99 layui-icon-gap"></i>
                    城市
                  </label>
                  <select
                    className="layui-input layui-input-enhanced"
                    value={filters.city || ''}
                    onChange={(e) => handleFilterChange('city', e.target.value || undefined)}
                  >
                    <option value="">全部城市</option>
                    {locationService.getCitiesByState(filters.state).map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* 经验要求 */}
              <div className="layui-form-item-enhanced">
                <label className="layui-form-label-enhanced">
                  <i className="layui-icon layui-icon-date layui-font-gray-99 layui-icon-gap"></i>
                  经验要求
                </label>
                <select
                  className="layui-input layui-input-enhanced"
                  value={filters.experience || ''}
                  onChange={(e) => handleFilterChange('experience', e.target.value || undefined)}
                >
                  {EXPERIENCE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 学历要求 */}
              <div className="layui-form-item-enhanced">
                <label className="layui-form-label-enhanced">
                  <i className="layui-icon layui-icon-read layui-font-gray-99 layui-icon-gap"></i>
                  学历要求
                </label>
                <select
                  className="layui-input layui-input-enhanced"
                  value={filters.education || ''}
                  onChange={(e) => handleFilterChange('education', e.target.value || undefined)}
                >
                  {EDUCATION_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 薪资范围 */}
              <div className="layui-form-item-enhanced">
                <label className="layui-form-label-enhanced">
                  <i className="layui-icon layui-icon-rmb layui-font-gray-99 layui-icon-gap"></i>
                  年薪范围
                </label>
                <div className="layui-flex layui-flex-center">
                  <input
                    type="number"
                    placeholder="最低"
                    className="layui-input layui-input-enhanced layui-flex-item layui-mr5"
                    value={filters.salaryMin || ''}
                    onChange={(e) => handleFilterChange('salaryMin', e.target.value ? Number(e.target.value) : undefined)}
                  />
                  <span className="layui-font-gray layui-ml5 layui-mr5">-</span>
                  <input
                    type="number"
                    placeholder="最高"
                    className="layui-input layui-input-enhanced layui-flex-item layui-ml5"
                    value={filters.salaryMax || ''}
                    onChange={(e) => handleFilterChange('salaryMax', e.target.value ? Number(e.target.value) : undefined)}
                  />
                </div>
              </div>

              {/* 重置按钮 */}
              <div className="layui-pt20 layui-border-top">
                <button
                  className="layui-btn layui-btn-fluid layui-btn-primary layui-btn-enhanced layui-border"
                  onClick={handleResetFilters}
                >
                  <i className="layui-icon layui-icon-search layui-icon-gap"></i>筛选
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 职位列表 */}
        <div className="layui-col-md9">
          {/* 排序选项 */}
          <div className="layui-card layui-card-enhanced layui-mb15">
            <div className="layui-card-body layui-p20">
              <div className="layui-flex layui-flex-between layui-flex-wrap layui-m-5">
                <div className="layui-flex layui-flex-center layui-gap-10">
                  <i className="layui-icon layui-icon-list layui-font-gray layui-mr5"></i>
                  <span className="layui-font-sm layui-font-gray-light">
                    显示 <span className="layui-font-lg layui-font-bold layui-font-blue">
                      {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, pagination.total)}
                    </span> 条，
                    共 <span className="layui-font-lg layui-font-bold layui-font-blue">{pagination.total}</span> 条
                  </span>
                </div>
                <div className="layui-flex layui-flex-center layui-gap-10">
                  <i className="layui-icon layui-icon-template-1 layui-font-gray layui-mr5"></i>
                  <span className="layui-font-sm layui-font-gray-light">排序：</span>
                  <select className="layui-input layui-mr5" style={{width: '140px', padding: '6px 10px', border: '1px solid #e8e8e8', borderRadius: '4px', fontSize: '13px'}}>
                    <option value="latest">最新发布</option>
                    <option value="salary-high">薪资从高到低</option>
                    <option value="salary-low">薪资从低到高</option>
                    <option value="views">浏览最多</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <JobList
            jobs={jobs}
            total={pagination.total}
            page={page}
            pageSize={pageSize}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
