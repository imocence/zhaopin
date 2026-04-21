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
      <div className="layui-card">
        <div className="layui-card-body text-center py-12">
          <svg
            className="w-16 h-16 mx-auto text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            没有找到相关职位
          </h3>
          <p className="text-gray-500">
            请尝试调整筛选条件或搜索关键词
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 职位列表 */}
      <div className="space-y-4">
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

      {/* 分页 */}
      {total > pageSize && (
        <div className="flex justify-center mt-6">
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
