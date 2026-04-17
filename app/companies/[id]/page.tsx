'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { companyService, jobService } from '@/lib/utils/data';
import { formatSalary, formatDate } from '@/lib/utils/format';
import Tag from '@/components/ui/Tag';

const DEFAULT_LOGO = '/images/logos/default.svg';

export default function CompanyDetailPage({ params }: { params: { id: string } }) {
  const [logoError, setLogoError] = useState(false);
  const company = companyService.getById(params.id);

  if (!company) {
    return (
      <div className="layui-container layui-mt20">
        <div className="layui-card">
          <div className="layui-card-body layui-text-center" style={{padding: '60px 20px'}}>
            <div style={{fontSize: '60px', marginBottom: '20px'}}>😕</div>
            <h1 className="layui-font-title layui-font-bold layui-mb15">公司不存在</h1>
            <p className="layui-font-gray layui-mb20">抱歉，找不到该公司信息</p>
            <Link href="/companies" className="layui-btn">
              返回企业列表
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 获取该公司的所有职位
  const companyJobs = useMemo(() => {
    return jobService.getByCompanyId(params.id);
  }, [params.id]);

  const logoSrc = logoError || !company.logo ? DEFAULT_LOGO : company.logo;

  return (
    <div className="layui-container layui-mt20">
      {/* 公司头部信息 */}
      <div className="layui-card">
        <div className="layui-card-body" style={{background: 'linear-gradient(135deg, #009688 0%, #1e9fff 100%)', padding: '30px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
            {/* 公司 Logo */}
            <div style={{width: '100px', height: '100px', borderRadius: '8px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
              <Image
                src={logoSrc}
                alt={company.name}
                width={100}
                height={100}
                className="object-cover"
                onError={() => setLogoError(true)}
              />
            </div>

            {/* 公司名称和标签 */}
            <div style={{flex: 1}}>
              <h1 style={{fontSize: '28px', fontWeight: 'bold', color: '#fff', marginBottom: '10px'}}>{company.name}</h1>
              <div style={{display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap'}}>
                {company.verified && (
                  <span className="layui-badge layui-bg-blue">已认证企业</span>
                )}
                {company.industry && (
                  <span className="layui-tag layui-bg-orange">{company.industry}</span>
                )}
              </div>
              <div style={{marginTop: '10px', display: 'flex', gap: '20px', fontSize: '14px', color: 'rgba(255,255,255,0.9)'}}>
                <span>📍 {company.city}, {company.state}</span>
                <span>👥 {company.size || '规模未知'}</span>
                <span>💼 {companyJobs.length} 在招职位</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="layui-row layui-col-space20 layui-mt20">
        {/* 主要内容区 */}
        <div className="layui-col-md9">
          {/* 公司简介 */}
          <div className="layui-card">
            <div className="layui-card-header">
              <i className="layui-icon layui-icon-about"></i> 公司简介
            </div>
            <div className="layui-card-body">
              {company.description ? (
                <p className="layui-font-gray" style={{lineHeight: '1.8', whiteSpace: 'pre-line'}}>
                  {company.description}
                </p>
              ) : (
                <p className="layui-font-gray-light">暂无公司简介</p>
              )}
            </div>
          </div>

          {/* 在招职位 */}
          <div className="layui-card layui-mt20">
            <div className="layui-card-header">
              <i className="layui-icon layui-icon-list"></i> 在招职位 ({companyJobs.length})
            </div>
            <div className="layui-card-body">
              {companyJobs.length > 0 ? (
                <div className="layui-row layui-col-space15">
                  {companyJobs.map((job) => {
                    const avgSalary = (job.salaryMin + job.salaryMax) / 2;
                    let salaryClass = 'layui-bg-green';
                    if (avgSalary > 120000) salaryClass = 'layui-bg-red';
                    else if (avgSalary > 80000) salaryClass = 'layui-bg-orange';

                    return (
                      <div className="layui-col-md12" key={job.id}>
                        <Link href={`/jobs/${job.id}`} className="layui-text-decoration-none">
                          <div className="layui-card" style={{transition: 'all 0.3s'}}>
                            <div className="layui-card-body">
                              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <div style={{flex: 1}}>
                                  <h4 style={{fontSize: '16px', fontWeight: 'bold', color: '#333', marginBottom: '8px'}}>
                                    {job.title}
                                  </h4>
                                  <div style={{fontSize: '13px', color: '#999'}}>
                                    <span className="layui-tag layui-bg-gray">{job.category}</span>
                                    <span style={{margin: '0 8px'}}>•</span>
                                    <span>{job.location}, {job.state}</span>
                                    <span style={{margin: '0 8px'}}>•</span>
                                    <span>{job.experience}</span>
                                    <span style={{margin: '0 8px'}}>•</span>
                                    <span>{job.education}</span>
                                  </div>
                                  <div style={{fontSize: '12px', color: '#ccc', marginTop: '8px'}}>
                                    发布于 {formatDate(job.createdAt)}
                                  </div>
                                </div>
                                <span className={`layui-badge ${salaryClass}`}>
                                  ${job.salaryMin.toLocaleString()}-${job.salaryMax.toLocaleString()}/{job.salaryType === 'yearly' ? '年' : '时'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="layui-text-center" style={{padding: '60px 20px'}}>
                  <div style={{fontSize: '50px', marginBottom: '15px'}}>💼</div>
                  <p className="layui-font-gray">该公司暂无在招职位</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 侧边栏 */}
        <div className="layui-col-md3">
          {/* 公司信息 */}
          <div className="layui-card">
            <div className="layui-card-header">
              <i className="layui-icon layui-icon-template-1"></i> 公司信息
            </div>
            <div className="layui-card-body">
              <div style={{fontSize: '13px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '12px'}}>
                  <span className="layui-font-gray-light">所在地区</span>
                  <span className="layui-font-gray">{company.city}, {company.state}</span>
                </div>
                {company.industry && (
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '12px'}}>
                    <span className="layui-font-gray-light">所属行业</span>
                    <span className="layui-font-gray">{company.industry}</span>
                  </div>
                )}
                {company.size && (
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '12px'}}>
                    <span className="layui-font-gray-light">公司规模</span>
                    <span className="layui-font-gray">{company.size}</span>
                  </div>
                )}
                {company.website && (
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '12px'}}>
                    <span className="layui-font-gray-light">公司网站</span>
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="layui-font-cyan layui-text-decoration-none"
                    >
                      访问网站
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 统计数据 */}
          <div className="layui-card layui-mt20">
            <div className="layui-card-header">
              <i className="layui-icon layui-icon-chart"></i> 统计数据
            </div>
            <div className="layui-card-body">
              <div className="layui-row layui-col-space10">
                <div className="layui-col-xs6 layui-text-center">
                  <div style={{fontSize: '24px', fontWeight: 'bold', color: '#009688'}}>
                    {companyJobs.length}
                  </div>
                  <div className="layui-font-xs layui-font-gray-light">在招职位</div>
                </div>
                <div className="layui-col-xs6 layui-text-center">
                  <div style={{fontSize: '24px', fontWeight: 'bold', color: '#1e9fff'}}>
                    {company.jobCount || 0}
                  </div>
                  <div className="layui-font-xs layui-font-gray-light">历史发布</div>
                </div>
              </div>
            </div>
          </div>

          {/* 快捷操作 */}
          <div className="layui-card layui-mt20">
            <div className="layui-card-body">
              <Link href={`/jobs?company=${company.id}`} className="layui-btn layui-btn-fluid layui-mb10">
                查看所有职位
              </Link>
              {company.verified ? (
                <button className="layui-btn layui-btn-normal layui-btn-fluid" disabled>
                  已认证企业
                </button>
              ) : (
                <Link href="/company/verify" className="layui-btn layui-btn-warm layui-btn-fluid">
                  申请企业认证
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
