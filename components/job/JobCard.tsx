'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Job } from '@/types';
import { formatSalary, formatDate, formatViews } from '@/lib/utils/format';
import Tag, { TagVariant } from '@/components/ui/Tag';

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

  const getSalaryVariant = (): TagVariant => {
    const avgSalary = (job.salaryMin + job.salaryMax) / 2;
    if (job.salaryType === 'yearly' && avgSalary > 120000) return 'red';
    if (job.salaryType === 'yearly' && avgSalary > 80000) return 'orange';
    return 'primary';
  };

  const getSalaryClass = () => {
    const avgSalary = (job.salaryMin + job.salaryMax) / 2;
    if (job.salaryType === 'yearly' && avgSalary > 120000) return 'layui-bg-red';
    if (job.salaryType === 'yearly' && avgSalary > 80000) return 'layui-bg-orange';
    return 'layui-bg-green';
  };

  return (
    <div className="layui-card hover:shadow-lg transition-all duration-300 group">
      <div className="layui-card-body">
        <div className="flex items-start gap-4">
          {/* 公司Logo */}
          {showCompany && (
            <Link
              href={`/companies/${job.companyId}`}
              className="w-14 h-14 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform"
            >
              <Image
                src={logoSrc}
                alt={companyName || '公司'}
                width={56}
                height={56}
                className="object-cover"
                onError={() => setImageError(true)}
              />
            </Link>
          )}

          {/* 职位信息 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                {/* 职位标题 */}
                <Link href={`/jobs/${job.id}`}>
                  <h3 className="text-lg font-semibold text-gray-900 hover:text-[var(--layui-primary)] transition-colors line-clamp-1 group-hover:translate-x-1 duration-300">
                    {job.title}
                  </h3>
                </Link>

                {/* 公司名称 */}
                {showCompany && companyName && (
                  <div className="flex items-center gap-2 mt-1">
                    <Link
                      href={`/companies/${job.companyId}`}
                      className="text-sm text-gray-600 hover:text-[var(--layui-primary)] transition-colors"
                    >
                      {companyName}
                    </Link>
                    {companyVerified && (
                      <span className="layui-badge layui-bg-blue layui-badge-sm">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        认证
                      </span>
                    )}
                  </div>
                )}

                {/* 职位详情 */}
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="layui-tag layui-tag-outline text-xs">
                    <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {job.category}
                  </span>
                  <span className="layui-tag layui-tag-outline text-xs">
                    <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {job.location}, {job.state}
                  </span>
                  <span className="layui-tag layui-tag-outline text-xs">
                    <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {job.experience}
                  </span>
                  <span className="layui-tag layui-tag-outline text-xs">
                    <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                    </svg>
                    {job.education}
                  </span>
                </div>
              </div>

              {/* 薪资标签 */}
              <div className="flex flex-col items-end gap-2">
                <span className={`layui-badge layui-badge-sm ${getSalaryClass()} whitespace-nowrap`}>
                  {formatSalary(job.salaryMin, job.salaryMax, job.salaryType)}
                </span>

                {/* 收藏按钮 */}
                <button
                  className={`text-gray-400 hover:text-[var(--layui-red)] transition-colors ${
                    isSaved ? 'text-[var(--layui-red)]' : ''
                  }`}
                  onClick={() => setIsSaved(!isSaved)}
                  aria-label={isSaved ? '取消收藏' : '收藏'}
                >
                  <svg className="w-5 h-5" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* 底部信息 */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {formatDate(job.createdAt)}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {formatViews(job.views)}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {job.applications} 申请
                </span>
              </div>

              {/* 立即申请按钮 */}
              <Link
                href={`/jobs/${job.id}`}
                className="layui-btn layui-btn-xs layui-btn-primary opacity-0 group-hover:opacity-100 transition-opacity"
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
