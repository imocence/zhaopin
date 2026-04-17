'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Job } from '@/types';
import { formatSalary, formatDate, formatViews } from '@/lib/utils/format';

export interface JobCardProps {
  job: Job;
  showCompany?: boolean;
  companyName?: string;
  companyLogo?: string;
  companyVerified?: boolean;
}

const JobCard: React.FC<JobCardProps> = ({
  job,
  showCompany = true,
  companyName,
  companyLogo,
  companyVerified = false,
}) => {
  const [isSaved, setIsSaved] = useState(false);

  const getSalaryClass = () => {
    const avgSalary = (job.salaryMin + job.salaryMax) / 2;
    if (job.salaryType === 'yearly' && avgSalary > 120000) return 'layui-bg-red';
    if (job.salaryType === 'yearly' && avgSalary > 80000) return 'layui-bg-orange';
    return 'layui-bg-green';
  };

  const getSalaryColor = () => {
    const avgSalary = (job.salaryMin + job.salaryMax) / 2;
    if (job.salaryType === 'yearly' && avgSalary > 120000) return '#ff4d4f';
    if (job.salaryType === 'yearly' && avgSalary > 80000) return '#fa8c16';
    return '#52c41a';
  };

  return (
    <div className="layui-card layui-card-enhanced layui-hover-lift" style={{marginBottom: '15px'}}>
      <div className="layui-card-body layui-p20">
        <div className="layui-row">
          {/* 左侧 - 职位信息 */}
          <div className="layui-col-md9 layui-col-sm8 layui-col-xs12">
            <div className="layui-row">
              <div className="layui-col-md3 layui-col-sm4 layui-col-xs12 layui-text-center layui-mr15" style={{
                width: '70px',
                height: '70px',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 10px',
                fontSize: '40px'
              }}>
                🏢
              </div>
              <div className="layui-col-md9 layui-col-sm8 layui-col-xs12">
                <h3 className="layui-font-lg layui-font-bold layui-font-gray-light layui-mb8">
                  <Link href={`/jobs/${job.id}`} className="layui-text-decoration-none" style={{color: '#333'}}>
                    {job.title}
                  </Link>
                </h3>
                {showCompany && companyName && (
                  <p className="layui-font-sm layui-font-gray-light layui-mb8 layui-flex layui-flex-center layui-gap-8">
                    <Link href={`/companies/${job.companyId}`} className="layui-text-decoration-none" style={{color: '#666'}}>
                      {companyName}
                    </Link>
                    {companyVerified && (
                      <span className="layui-badge layui-badge-enhanced layui-badge-cyan layui-flex layui-flex-center layui-gap-3 layui-font-xs">
                        <i className="layui-icon layui-icon-ok layui-font-xxs"></i>
                        认证
                      </span>
                    )}
                  </p>
                )}
                <div className="layui-flex layui-flex-wrap layui-gap-8 layui-font-sm layui-font-gray-light">
                  <span className="layui-tag layui-tag-enhanced layui-bg-gray layui-flex layui-flex-center layui-gap-3 layui-font-xs">
                    <i className="layui-icon layui-icon-file layui-font-xs layui-mr3"></i>
                    {job.category}
                  </span>
                  <span className="layui-tag layui-tag-enhanced layui-bg-gray layui-flex layui-flex-center layui-gap-3 layui-font-xs">
                    <i className="layui-icon layui-icon-location layui-font-xs layui-mr3"></i>
                    {job.location}, {job.state}
                  </span>
                  <span className="layui-tag layui-tag-enhanced layui-bg-gray layui-flex layui-flex-center layui-gap-3 layui-font-xs">
                    <i className="layui-icon layui-icon-engine layui-font-xs layui-mr3"></i>
                    {job.experience}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧 - 薪资和操作 */}
          <div className="layui-col-md3 layui-col-sm4 layui-col-xs12 layui-text-right layui-pl15 layui-border-left">
            <div className="layui-mb12">
              <span className="layui-font-2xl layui-font-bold" style={{color: getSalaryColor()}}>
                ${job.salaryMin} - ${job.salaryMax}
              </span>
              <span className="layui-font-xs layui-font-gray layui-ml3">
                / {job.salaryType === 'yearly' ? '年' : job.salaryType === 'monthly' ? '月' : '小时'}
              </span>
            </div>
            <div className="layui-font-xs layui-font-gray layui-mb15 layui-flex layui-flex-center layui-gap-12">
              <span className="layui-mr12">
                <i className="layui-icon layui-icon-date layui-font-xs"></i> {formatDate(job.createdAt)}
              </span>
              <span>
                <i className="layui-icon layui-icon-read layui-font-xs"></i> {formatViews(job.views)}
              </span>
            </div>
            <div>
              <Link href={`/jobs/${job.id}`} className="layui-btn layui-btn-sm layui-btn-normal">
                查看详情
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
