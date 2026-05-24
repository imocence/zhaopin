'use client';

import React from 'react';
import { Job } from '@/types';
import JobCard from './JobCard';
import Pagination from '@/components/ui/Pagination';
import { companyService } from '@/lib/utils/data';

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
        <div className="layui-flex layui-flex-center layui-flex-gap-10">
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
          const company = companyService.getById(job.companyId);
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
