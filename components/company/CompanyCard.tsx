'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Company } from '@/types';
import { jobService } from '@/lib/utils/data';

const DEFAULT_LOGO = '/images/logos/default.svg';

export interface CompanyCardProps {
  company: Company;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  const [imageError, setImageError] = useState(false);
  const logoSrc = imageError || !company.logo ? DEFAULT_LOGO : company.logo;

  const jobCount = company.jobCount || jobService.getAll().filter(j => j.companyId === company.id && j.status === 'active').length;

  return (
    <Link
      href={`/companies/${company.id}`}
      className="layui-text-decoration-none"
    >
      <div className="layui-card layui-card-enhanced layui-hover-lift" style={{marginBottom: '15px'}}>
        <div className="layui-card-body layui-p20">
          {/* 公司 Logo */}
          <div className="layui-flex layui-flex-center layui-mb15" style={{
            width: '70px',
            height: '70px',
            margin: '0 auto 15px',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
            borderRadius: '12px',
            overflow: 'hidden'
          }}>
            {imageError || !company.logo ? (
              <span style={{fontSize: '40px'}}>🏢</span>
            ) : (
              <img
                src={logoSrc}
                alt={company.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                onError={() => setImageError(true)}
              />
            )}
          </div>

          {/* 公司名称 */}
          <div className="layui-text-center">
            <h3 className="layui-font-lg layui-font-bold layui-font-gray-light layui-mb8 layui-elip">
              {company.name}
            </h3>

            {/* 认证状态和标签 */}
            <div className="layui-flex layui-flex-center layui-flex-wrap layui-gap-6 layui-mb10">
              {company.verified && (
                <span className="layui-badge layui-badge-enhanced layui-badge-cyan layui-flex layui-flex-center layui-gap-3">
                  <i className="layui-icon layui-icon-ok layui-font-xxs"></i>
                  已认证
                </span>
              )}
              {jobCount > 10 && (
                <span className="layui-badge layui-badge-enhanced layui-badge-orange layui-font-xxs">
                  热招
                </span>
              )}
            </div>

            {/* 行业 */}
            {company.industry && (
              <p className="layui-font-sm layui-font-gray-light layui-mb6 layui-elip">
                {company.industry}
              </p>
            )}

            {/* 位置 */}
            <p className="layui-font-xs layui-font-gray layui-flex layui-flex-center layui-gap-4 layui-mb12">
              <i className="layui-icon layui-icon-location layui-font-xs"></i>
              {company.city ? `${company.city}, ` : ''}{company.state}
            </p>

            {/* 在招职位数量 */}
            <div className="layui-mt15 layui-pt12 layui-border-top layui-flex layui-flex-center layui-gap-6 layui-font-xs layui-font-gray-light">
              <i className="layui-icon layui-icon-file layui-font-blue layui-font-sm"></i>
              <span className="layui-font-lg layui-font-bold layui-font-blue">{jobCount}</span>
              <span>个在招职位</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CompanyCard;
