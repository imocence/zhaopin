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
      className="layui-card company-card-hover"
    >
      <div className="layui-card-body layui-p15 layui-flex layui-flex-center">
        {/* 左侧 Logo */}
        <div className="layui-company-logo layui-mr15">
          <Image
            src={logoSrc}
            alt={company.name}
            width={80}
            height={80}
            className="layui-company-logo-img"
            onError={() => setImageError(true)}
          />
        </div>

        {/* 右侧信息 */}
        <div className="layui-company-info layui-flex-item">
          {/* 公司名称 */}
          <h3 className="layui-company-name layui-mb8">
            {company.name}
          </h3>

          {/* 认证状态 */}
          <div className="layui-mb8">
            {company.verified ? (
              <span className="layui-badge layui-bg-blue layui-badge-sm layui-mr5">
                <i className="layui-icon layui-icon-ok layui-font-xxs layui-mr3"></i>
                已认证
              </span>
            ) : (
              <span className="layui-badge layui-bg-gray layui-badge-sm layui-mr5">
                <i className="layui-icon layui-icon-close layui-font-xxs layui-mr3"></i>
                未认证
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
            <p className="layui-company-industry layui-mb5">
              <i className="layui-icon layui-icon-app layui-font-xs layui-mr3 layui-font-gray-light"></i>
              {company.industry}
            </p>
          )}

          {/* 位置 */}
          <p className="layui-company-location layui-mb8">
            <i className="layui-icon layui-icon-location layui-font-xs layui-mr3 layui-font-gray-light"></i>
            {company.city}, {company.state}
          </p>

          {/* 在招职位数量 */}
          <div className="layui-company-jobs layui-pt10 layui-border-top layui-border-color-gray-light">
            <span className="layui-company-jobs-icon">
              <i className="layui-icon layui-icon-template-1 layui-font-primary"></i>
            </span>
            <span className="layui-company-jobs-count layui-font-primary">{company.jobCount || 0}</span>
            <span className="layui-company-jobs-text">在招职位</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CompanyCard;
