'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { companyService, jobService } from '@/lib/services/data';
import { Company, Job } from '@/types';
import { formatDate } from '@/lib/utils/format';

const DEFAULT_LOGO = '/images/logos/default.svg';

export default function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [logoError, setLogoError] = useState(false);
  const [company, setCompany] = useState<Company | undefined>(undefined);
  const [companyJobs, setCompanyJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const { id } = await params;
      const [comp, jobs] = await Promise.all([
        companyService.getById(id),
        jobService.getByCompanyId(id),
      ]);
      setCompany(comp);
      setCompanyJobs(jobs);
      setLoading(false);
    }
    loadData();
  }, [params]);

  if (loading) {
    return (
      <div className="layui-container layui-mt20">
        <div className="layui-card">
          <div className="layui-card-body layui-text-center layui-p60-20">
            <div className="layui-empty-icon-60">⏳</div>
            <h1 className="layui-font-title layui-font-bold layui-mb15">加载中...</h1>
          </div>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="layui-container layui-mt20">
        <div className="layui-card">
          <div className="layui-card-body layui-text-center layui-p60-20">
            <div className="layui-empty-icon-60">😕</div>
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

  const logoSrc = logoError || !company.logo ? DEFAULT_LOGO : company.logo;

  return (
    <div className="layui-container layui-mt20">
      <div className="layui-card">
        <div className="layui-card-body layui-hero-gradient">
          <div className="layui-flex layui-align-center layui-gap-20">
            <div className="layui-avatar-square">
              <Image
                src={logoSrc}
                alt={company.name}
                width={100}
                height={100}
                className="layui-img-cover"
                onError={() => setLogoError(true)}
              />
            </div>

            <div className="layui-flex-1">
              <h1 className="layui-hero-headline">{company.name}</h1>
              <div className="layui-flex layui-align-center layui-gap-10 layui-flex-wrap">
                {company.verified && (
                  <span className="layui-badge layui-bg-blue">已认证企业</span>
                )}
                {company.industry && (
                  <span className="layui-tag layui-bg-orange">{company.industry}</span>
                )}
              </div>
              <div className="layui-hero-meta-row">
                <span>📍 {company.city}, {company.state}</span>
                <span>👥 {company.size || '规模未知'}</span>
                <span>💼 {companyJobs.length} 在招职位</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="layui-row layui-col-space20 layui-mt20">
        <div className="layui-col-md9">
          <div className="layui-card">
            <div className="layui-card-header">
              <i className="layui-icon layui-icon-about"></i> 公司简介
            </div>
            <div className="layui-card-body">
              {company.description ? (
                <p className="layui-font-gray layui-line-height-relaxed layui-whitespace-preline">
                  {company.description}
                </p>
              ) : (
                <p className="layui-font-gray-light">暂无公司简介</p>
              )}
            </div>
          </div>

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
                          <div className="layui-card layui-card-transition">
                            <div className="layui-card-body">
                              <div className="layui-flex layui-justify-between layui-align-center">
                                <div className="layui-flex-1">
                                  <h4 className="layui-job-inline-title">
                                    {job.title}
                                  </h4>
                                  <div className="layui-job-inline-meta">
                                    <span className="layui-tag layui-bg-gray">{job.category}</span>
                                    <span className="layui-dot-sep">•</span>
                                    <span>{job.location}, {job.state}</span>
                                    <span className="layui-dot-sep">•</span>
                                    <span>{job.experience}</span>
                                    <span className="layui-dot-sep">•</span>
                                    <span>{job.education}</span>
                                  </div>
                                  <div className="layui-job-inline-foot">
                                    发布于 {formatDate(job.createdAt)}
                                  </div>
                                </div>
                                <span className={`layui-badge ${salaryClass}`}>
                                  ${job.salaryMin.toLocaleString()}-{job.salaryMax.toLocaleString()}/{job.salaryType === 'yearly' ? '年' : '时'}
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
                <div className="layui-text-center layui-p60-20">
                  <div className="layui-empty-icon-50">💼</div>
                  <p className="layui-font-gray">该公司暂无在招职位</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="layui-col-md3">
          <div className="layui-card">
            <div className="layui-card-header">
              <i className="layui-icon layui-icon-template-1"></i> 公司信息
            </div>
            <div className="layui-card-body">
              <div className="layui-font-sm">
                <div className="layui-kv-row">
                  <span className="layui-font-gray-light">所在地区</span>
                  <span className="layui-font-gray">{company.city}, {company.state}</span>
                </div>
                {company.industry && (
                  <div className="layui-kv-row">
                    <span className="layui-font-gray-light">所属行业</span>
                    <span className="layui-font-gray">{company.industry}</span>
                  </div>
                )}
                {company.size && (
                  <div className="layui-kv-row">
                    <span className="layui-font-gray-light">公司规模</span>
                    <span className="layui-font-gray">{company.size}</span>
                  </div>
                )}
                {company.website && (
                  <div className="layui-kv-row">
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

          <div className="layui-card layui-mt20">
            <div className="layui-card-header">
              <i className="layui-icon layui-icon-chart"></i> 统计数据
            </div>
            <div className="layui-card-body">
              <div className="layui-row layui-col-space10">
                <div className="layui-col-xs6 layui-text-center">
                  <div className="layui-stat-num-md-cyan">
                    {companyJobs.length}
                  </div>
                  <div className="layui-font-xs layui-font-gray-light">在招职位</div>
                </div>
                <div className="layui-col-xs6 layui-text-center">
                  <div className="layui-stat-num-md-blue">
                    {company.jobCount || 0}
                  </div>
                  <div className="layui-font-xs layui-font-gray-light">历史发布</div>
                </div>
              </div>
            </div>
          </div>

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
