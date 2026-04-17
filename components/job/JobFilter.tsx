'use client';

import React from 'react';
import { JobFilters } from '@/types';
import { categoryService, locationService } from '@/lib/utils/data';
import { EXPERIENCE_OPTIONS, EDUCATION_OPTIONS } from '@/lib/constants';

export interface JobFilterProps {
  filters: JobFilters;
  onChange: (filters: JobFilters) => void;
}

const JobFilter: React.FC<JobFilterProps> = ({ filters, onChange }) => {
  const categories = categoryService.getAllSubcategories();
  const locations = locationService.getAll();

  const handleChange = (key: keyof JobFilters, value: any) => {
    onChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = () => {
    return Object.values(filters).some(v => v !== undefined && v !== '');
  };

  return (
    <aside className="w-full lg:w-72 flex-shrink-0">
      <div className="layui-card sticky top-20">
        <div className="layui-card-header flex items-center justify-between">
          <span className="font-semibold flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            筛选条件
          </span>
          {hasActiveFilters() && (
            <span className="layui-badge layui-bg-blue">已筛选</span>
          )}
        </div>
        <div className="layui-card-body space-y-5">
          {/* 关键词搜索 */}
          <div className="layui-form-item">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                关键词
              </span>
            </label>
            <div className="layui-search">
              <input
                type="text"
                placeholder="搜索职位、公司..."
                className="layui-input"
                value={filters.keyword || ''}
                onChange={(e) => handleChange('keyword', e.target.value)}
              />
            </div>
          </div>

          {/* 职位分类 */}
          <div className="layui-form-item">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                职位分类
              </span>
            </label>
            <select
              className="layui-select"
              value={filters.category || ''}
              onChange={(e) => handleChange('category', e.target.value || undefined)}
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
          <div className="layui-form-item">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                州/地区
              </span>
            </label>
            <select
              className="layui-select"
              value={filters.state || ''}
              onChange={(e) => handleChange('state', e.target.value || undefined)}
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
            <div className="layui-form-item layui-anim layui-anim-fadein">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  城市
                </span>
              </label>
              <select
                className="layui-select"
                value={filters.city || ''}
                onChange={(e) => handleChange('city', e.target.value || undefined)}
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
          <div className="layui-form-item">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                经验要求
              </span>
            </label>
            <select
              className="layui-select"
              value={filters.experience || ''}
              onChange={(e) => handleChange('experience', e.target.value || undefined)}
            >
              {EXPERIENCE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* 学历要求 */}
          <div className="layui-form-item">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
                学历要求
              </span>
            </label>
            <select
              className="layui-select"
              value={filters.education || ''}
              onChange={(e) => handleChange('education', e.target.value || undefined)}
            >
              {EDUCATION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* 薪资范围 */}
          <div className="layui-form-item">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                年薪范围
              </span>
            </label>
            <div className="layui-input-inline" style={{width: '100%'}}>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  placeholder="最低"
                  className="layui-input"
                  value={filters.salaryMin || ''}
                  onChange={(e) => handleChange('salaryMin', e.target.value ? Number(e.target.value) : undefined)}
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  placeholder="最高"
                  className="layui-input"
                  value={filters.salaryMax || ''}
                  onChange={(e) => handleChange('salaryMax', e.target.value ? Number(e.target.value) : undefined)}
                />
              </div>
            </div>
          </div>

          {/* 重置按钮 */}
          <div className="pt-2 border-t border-gray-100">
            <button
              className={`layui-btn layui-btn-fluid ${hasActiveFilters() ? 'layui-btn-primary' : 'layui-btn-disabled'}`}
              onClick={() => onChange({})}
              disabled={!hasActiveFilters()}
            >
              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              重置筛选
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default JobFilter;
