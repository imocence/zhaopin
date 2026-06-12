'use client';

import React, { useEffect, useState } from 'react';
import { Job } from '@/types';
import JobCard from './JobCard';
import Pagination from '@/components/ui/Pagination';
import { companyService } from '@/lib/services/data';

export interface JobListProps {
  jobs: Job[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const JobList: React.FC<JobListProps> = ({
  jobs,
  total,
  page,
  pageSize,
  onPageChange,
}) => {
  const [companyMap, setCompanyMap] = useState<Record<string, any>>({});

  useEffect(() => {
    async function loadCompanies() {
      const ids = Array.from(new Set(jobs.map(j => j.companyId)));
      const entries = await Promise.all(ids.map(async (id) => [id, await companyService.getById(id)] as const));
      const map: Record<string, any> = {};
      entries.forEach(([id, comp]) => { map[id] = comp; });
      setCompanyMap(map);
    }
    loadCompanies();
  }, [jobs]);
  if (jobs.length === 0) {
    return (
      <div className="layui-card layui-empty-card">
        <div className="layui-empty-card__icon">🔍</div>
        <h3 className="layui-empty-card__title">
          没有找到相关职位
        </h3>
        <p className="layui-empty-card__desc">
          请尝试调整筛选条件或搜索关键词
        </p>
        <div className="layui-flex layui-flex-center layui-gap-10">
          <span className="layui-filter-tag layui-bg-gray layui-font-gray-light">
            <i className="layui-icon layui-icon-refresh layui-icon-xs layui-mr5"></i>
            清除筛选
          </span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="layui-mb20">
        {jobs.map((job) => {
          const company = companyMap[job.companyId];
          return (
            <JobCard
              key={job.id}
              job={job}
              companyName={company?.name}
              companyLogo={company?.logo}
              companyVerified={company?.verified}
            />
          );
        })}
      </div>

      {total > pageSize && (
        <div className="layui-pagination-bar">
          <Pagination
            current={page}
            total={total}
            pageSize={pageSize}
            onChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default JobList;
