'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Job } from '@/types';
import { formatSalary, formatDate, formatViews } from '@/lib/utils/format';

export interface JobCardProps {
  job: Job;
  showCompany?: boolean;
  companyName?: string;
  companyLogo?: string;
  companyVerified?: boolean;
}

const DEFAULT_LOGO = '/images/logos/default.svg';

const JobCard: React.FC<JobCardProps> = ({
  job,
  showCompany = true,
  companyName,
  companyLogo,
  companyVerified = false,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const logoSrc = imageError || !companyLogo ? DEFAULT_LOGO : companyLogo;

  const getSalaryClass = () => {
    const avgSalary = (job.salaryMin + job.salaryMax) / 2;
    if (job.salaryType === 'yearly' && avgSalary > 120000) return 'layui-bg-red';
    if (job.salaryType === 'yearly' && avgSalary > 80000) return 'layui-bg-orange';
    return 'layui-bg-green';
  };

  return (
    <div className="layui-card layui-hover-lift layui-mb15">
      <div className="layui-card-body">
        <div className="layui-flex layui-align-start layui-gap-16">
          {showCompany && (
            <Link
              href={`/companies/${job.companyId}`}
              className="layui-job-card-logo"
            >
              <Image
                src={logoSrc}
                alt={companyName || '公司'}
                width={56}
                height={56}
                className="layui-company-logo-img"
                onError={() => setImageError(true)}
              />
            </Link>
          )}

          <div className="layui-flex-1">
            <div className="layui-flex layui-align-start layui-justify-between layui-gap-16">
              <div className="layui-flex-1">
                <Link href={`/jobs/${job.id}`}>
                  <h3 className="layui-job-card-title">
                    {job.title}
                  </h3>
                </Link>

                {showCompany && companyName && (
                  <div className="layui-flex layui-align-center layui-gap-8 layui-mt5">
                    <Link
                      href={`/companies/${job.companyId}`}
                      className="layui-job-card-sub layui-link-plain"
                    >
                      {companyName}
                    </Link>
                    {companyVerified && (
                      <span className="layui-badge layui-bg-blue layui-badge-sm">
                        <svg className="layui-mr3" style={{ width: '12px', height: '12px', verticalAlign: 'middle' }} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        认证
                      </span>
                    )}
                  </div>
                )}

                <div className="layui-job-card-tags">
                  <span className="layui-tag layui-tag-outline layui-font-xs">
                    <svg className="layui-mr3" style={{ width: '12px', height: '12px', display: 'inline', verticalAlign: 'middle' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {job.category}
                  </span>
                  <span className="layui-tag layui-tag-outline layui-font-xs">
                    <svg className="layui-mr3" style={{ width: '12px', height: '12px', display: 'inline', verticalAlign: 'middle' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {job.location}, {job.state}
                  </span>
                  <span className="layui-tag layui-tag-outline layui-font-xs">
                    <svg className="layui-mr3" style={{ width: '12px', height: '12px', display: 'inline', verticalAlign: 'middle' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {job.experience}
                  </span>
                  <span className="layui-tag layui-tag-outline layui-font-xs">
                    <svg className="layui-mr3" style={{ width: '12px', height: '12px', display: 'inline', verticalAlign: 'middle' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    </svg>
                    {job.education}
                  </span>
                </div>
              </div>

              <div className="layui-flex layui-stack-center-8">
                <span className={`layui-badge layui-badge-sm layui-nowrap ${getSalaryClass()}`}>
                  {formatSalary(job.salaryMin, job.salaryMax, job.salaryType)}
                </span>

                <button
                  type="button"
                  className={`layui-btn-fav${isSaved ? ' is-saved' : ''}`}
                  onClick={() => setIsSaved(!isSaved)}
                  aria-label={isSaved ? '取消收藏' : '收藏'}
                >
                  <svg width="20" height="20" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="layui-job-card-footer">
              <div className="layui-job-card-meta">
                <span>
                  <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {formatDate(job.createdAt)}
                </span>
                <span>
                  <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {formatViews(job.views)}
                </span>
                <span>
                  <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {job.applications} 申请
                </span>
              </div>

              <Link
                href={`/jobs/${job.id}`}
                className="layui-btn layui-btn-xs layui-btn-primary"
              >
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
