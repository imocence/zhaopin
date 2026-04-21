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
      <div className="layui-card" style={{
        borderRadius: '8px',
        textAlign: 'center',
        padding: '60px 20px'
      }}>
        <div style={{
          fontSize: '80px',
          marginBottom: '20px',
          opacity: '0.5'
        }}>🔍</div>
        <h3 style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#333',
          marginBottom: '10px'
        }}>
          没有找到相关职位
        </h3>
        <p style={{
          fontSize: '14px',
          color: '#999',
          marginBottom: '20px'
        }}>
          请尝试调整筛选条件或搜索关键词
        </p>
        <div style={{
          display: 'inline-flex',
          gap: '10px'
        }}>
          <span style={{
            padding: '6px 16px',
            background: '#f5f5f5',
            borderRadius: '20px',
            fontSize: '13px',
            color: '#666',
            cursor: 'pointer'
          }}>
            <i className="layui-icon layui-icon-refresh" style={{fontSize: '12px'}}></i>
            清除筛选
          </span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* 职位列表 */}
      <div style={{marginBottom: '20px'}}>
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
        <div style={{
          marginTop: '30px',
          padding: '20px',
          background: '#fafafa',
          borderRadius: '8px'
        }}>
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
