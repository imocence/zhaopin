'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { jobService } from '@/lib/utils/data';
import { JobFilters } from '@/types';
import JobFilter from '@/components/job/JobFilter';
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
  const pageSize = 20;

  // 获取筛选后的职位数据
  const { data: jobs, pagination } = jobService.search(filters, page, pageSize);

  // 更新筛选条件
  const handleFilterChange = (newFilters: JobFilters) => {
    setFilters(newFilters);
    setPage(1);

    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.set(key, String(value));
      }
    });
    const queryString = params.toString();
    router.push(queryString ? `/jobs?${queryString}` : '/jobs');
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="layui-container layui-mt20">
      {/* 页面头部 */}
      <div className="layui-card">
        <div className="layui-card-body" style={{background: 'linear-gradient(135deg, #009688 0%, #1e9fff 100%)', padding: '30px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px'}}>
            <i className="layui-icon layui-icon-list" style={{fontSize: '32px', color: '#fff'}}></i>
            <h1 style={{fontSize: '28px', fontWeight: 'bold', color: '#fff', margin: 0}}>职位搜索</h1>
          </div>
          <p style={{fontSize: '16px', color: 'rgba(255,255,255,0.9)'}}>
            找到 <span style={{fontWeight: 'bold', color: '#fff'}}>{pagination.total}</span> 个优质职位
          </p>
        </div>
      </div>

      {/* 快捷筛选标签 */}
      <div style={{marginTop: '20px'}}>
        <span className="layui-font-gray layui-font-sm">热门搜索：</span>
        <span className="layui-tag layui-bg-cyan" style={{cursor: 'pointer', marginLeft: '10px'}} onClick={() => handleFilterChange({ category: '软件工程师' })}>软件工程师</span>
        <span className="layui-tag layui-bg-blue" style={{cursor: 'pointer', marginLeft: '5px'}} onClick={() => handleFilterChange({ state: 'CA' })}>加州</span>
        <span className="layui-tag layui-bg-orange" style={{cursor: 'pointer', marginLeft: '5px'}} onClick={() => handleFilterChange({ state: 'NY' })}>纽约</span>
        <span className="layui-tag layui-bg-red" style={{cursor: 'pointer', marginLeft: '5px'}} onClick={() => handleFilterChange({ salaryMin: 80000, salaryType: 'yearly' })}>高薪职位</span>
      </div>

      <div className="layui-row layui-col-space20" style={{marginTop: '20px'}}>
        {/* 筛选侧边栏 */}
        <div className="layui-col-md3">
          <JobFilter filters={filters} onChange={handleFilterChange} />
        </div>

        {/* 职位列表 */}
        <div className="layui-col-md9">
          {/* 排序选项 */}
          <div className="layui-card">
            <div className="layui-card-body">
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <span className="layui-font-sm layui-font-gray">
                  显示 <span className="layui-font-bold">{(page - 1) * pageSize + 1}-{Math.min(page * pageSize, pagination.total)}</span> 条，
                  共 <span className="layui-font-bold">{pagination.total}</span> 条
                </span>
                <div>
                  <span className="layui-font-sm layui-font-gray">排序：</span>
                  <select className="layui-input" style={{display: 'inline-block', width: 'auto'}}>
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
