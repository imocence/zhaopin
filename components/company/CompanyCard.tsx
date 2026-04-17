'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Company } from '@/types';

const DEFAULT_LOGO = '/images/logos/default.svg';

export interface CompanyCardProps {
  company: Company;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  const [imageError, setImageError] = useState(false);
  const logoSrc = imageError || !company.logo ? DEFAULT_LOGO : company.logo;

  return (
    <Link
      href={`/companies/${company.id}`}
      className="layui-card hover:shadow-xl transition-all duration-300 group block"
    >
      <div className="layui-card-body">
        {/* 公司 Logo */}
        <div className="w-24 h-24 mx-auto mb-4 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
          <Image
            src={logoSrc}
            alt={company.name}
            width={96}
            height={96}
            className="object-cover"
            onError={() => setImageError(true)}
          />
        </div>

        {/* 公司名称 */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate group-hover:text-[var(--layui-primary)] transition-colors">
            {company.name}
          </h3>

          {/* 认证状态 */}
          <div className="flex items-center justify-center gap-2 mb-2">
            {company.verified && (
              <span className="layui-badge layui-bg-blue layui-badge-sm flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                已认证
              </span>
            )}
            {company.jobCount && company.jobCount > 10 && (
              <span className="layui-badge layui-bg-orange layui-badge-sm">
                热招
              </span>
            )}
          </div>

          {/* 行业 */}
          {company.industry && (
            <p className="text-sm text-gray-600 truncate">{company.industry}</p>
          )}

          {/* 位置 */}
          <p className="text-sm text-gray-500 mt-1 flex items-center justify-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {company.city}, {company.state}
          </p>

          {/* 在招职位数量 */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
              <svg className="w-4 h-4 text-[var(--layui-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="font-semibold text-[var(--layui-primary)]">{company.jobCount || 0}</span>
              <span>个在招职位</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CompanyCard;
