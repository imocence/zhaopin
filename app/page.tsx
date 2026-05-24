'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { jobService, companyService, locationService } from '@/lib/utils/data';

export default function HomePage() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const carouselInstRef = useRef<{ destroy?: () => void } | null>(null);
  const layuiRetryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const categories = [
    { id: 'tech', name: 'IT/互联网', icon: '💻', count: 1250 },
    { id: 'finance', name: '金融/会计', icon: '💰', count: 856 },
    { id: 'medical', name: '医疗/健康', icon: '🏥', count: 642 },
    { id: 'education', name: '教育/培训', icon: '📚', count: 528 },
    { id: 'design', name: '设计/创意', icon: '🎨', count: 435 },
    { id: 'marketing', name: '市场/营销', icon: '📢', count: 389 },
    { id: 'restaurant', name: '餐饮/服务', icon: '🍽️', count: 756 },
    { id: 'construction', name: '建筑/工程', icon: '🏗️', count: 267 },
    { id: 'logistics', name: '物流/运输', icon: '🚚', count: 324 },
    { id: 'retail', name: '零售/销售', icon: '🛒', count: 445 },
  ];

  useEffect(() => {
    let cancelled = false;

    const initLayui = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const layui = (window as any).layui;
      if (!layui) {
        layuiRetryTimerRef.current = setTimeout(initLayui, 100);
        return;
      }

      layui.use(['carousel', 'element', 'form'], function () {
        if (cancelled) return;

        const carousel = layui.carousel;
        const element = layui.element;
        const form = layui.form;

        if (formRef.current) {
          form.render();
        }

        element.render('tab');

        const elem = carouselRef.current;
        if (!elem) return;

        const inst = carousel.render({
          elem,
          width: '100%',
          height: '400px',
          arrow: 'always',
          indicator: 'inside',
        });
        carouselInstRef.current = inst;
      });
    };

    initLayui();

    return () => {
      cancelled = true;
      if (layuiRetryTimerRef.current) {
        clearTimeout(layuiRetryTimerRef.current);
        layuiRetryTimerRef.current = null;
      }
      const inst = carouselInstRef.current;
      carouselInstRef.current = null;
      if (inst && typeof inst.destroy === 'function') {
        inst.destroy();
      }
    };
  }, []);

  const hotJobs = jobService.getAll().filter(j => j.status === 'active').slice(0, 8);
  const latestJobs = jobService.getLatestJobs(8);
  const hotCompanies = companyService.getAll().filter(c => c.verified).slice(0, 8);
  const allStates = locationService.getAll().slice(0, 12);

  const renderJobCard = (job: any) => {
    const company = companyService.getById(job.companyId);
    const avgSalary = (job.salaryMin + job.salaryMax) / 2;
    let salaryClass = 'layui-bg-green';
    if (avgSalary > 80000) salaryClass = 'layui-bg-red';
    else if (avgSalary > 50000) salaryClass = 'layui-bg-orange';

    return (
      <div className="layui-col-md6 layui-col-sm12" key={job.id}>
        <div className="layui-card">
          <div className="layui-card-body">
            <div className="layui-row">
              <div className="layui-col-xs3 layui-text-center">
                <div className="layui-emoji-3xl">🏢</div>
              </div>
              <div className="layui-col-xs9">
                <h3 className="layui-font-lg layui-mb10">
                  <Link href={`/jobs/${job.id}`} className="layui-font-lg layui-font-bold layui-font-dark">{job.title}</Link>
                  <span className={`layui-badge layui-fr ${salaryClass}`}>${job.salaryMin}-{job.salaryMax}</span>
                </h3>
                <p className="layui-font-sm layui-font-gray layui-mb10">
                  {company?.name || '未知公司'}
                </p>
                <div className="layui-font-xs layui-font-gray">
                  <span className="layui-tag layui-bg-gray">{job.category}</span>
                  <span className="layui-ml15">
                    <i className="layui-icon layui-icon-location"></i> {job.location}
                  </span>
                  <span className="layui-fr">
                    <i className="layui-icon layui-icon-read"></i> {job.views}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="layui-carousel" id="homeCarousel" ref={carouselRef} lay-filter="homeCarousel">
        <div {...{ 'carousel-item': '' }}>
          <div className="layui-carousel-slide layui-carousel-slide--orange">
            <h1 className="layui-carousel-hero-title">企业招聘首选平台</h1>
            <p className="layui-carousel-hero-desc">快速发布职位，精准匹配人才</p>
            <Link href="/post" className="layui-btn layui-btn-lg layui-btn-primary">发布职位</Link>
          </div>
          <div className="layui-carousel-slide layui-carousel-slide--cyan">
            <h1 className="layui-carousel-hero-title">海量优质企业</h1>
            <p className="layui-carousel-hero-desc">已认证企业，求职更放心</p>
            <Link href="/companies" className="layui-btn layui-btn-lg">浏览企业</Link>
          </div>
        </div>
      </div>

      <div className="layui-main">
        <div className="layui-mt30">
          <div className="layui-row layui-col-space20">
          <div className="layui-col-md9">
            <div className="layui-card">
              <div className="layui-card-header">
                <i className="layui-icon layui-icon-list"></i> 推荐职位
              </div>
              <div className="layui-card-body">
                <div className="layui-tab layui-tab-card" lay-filter="jobTab">
                  <ul className="layui-tab-title">
                    <li className="layui-this">热门职位</li>
                    <li>最新职位</li>
                  </ul>
                  <div className="layui-tab-content">
                    <div className="layui-tab-item layui-show">
                      <div className="layui-row layui-col-space15">
                        {hotJobs.map((job) => renderJobCard(job))}
                      </div>
                      <div className="layui-text-center layui-mt20">
                        <Link href="/jobs" className="layui-btn layui-btn-primary">查看更多职位</Link>
                      </div>
                    </div>
                    <div className="layui-tab-item">
                      <div className="layui-row layui-col-space15">
                        {latestJobs.map((job) => renderJobCard(job))}
                      </div>
                      <div className="layui-text-center layui-mt20">
                        <Link href="/jobs" className="layui-btn layui-btn-primary">查看更多职位</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="layui-card layui-mt20">
              <div className="layui-card-header">
                <i className="layui-icon layui-icon-component"></i> 热门企业
              </div>
              <div className="layui-card-body">
                <div className="layui-row layui-col-space10">
                  {hotCompanies.map((company) => (
                    <div className="layui-col-md3 layui-col-sm6" key={company.id}>
                      <Link href={`/companies/${company.id}`} className="layui-link-block">
                        <div className="layui-card">
                          <div className="layui-card-body layui-text-center">
                            <div className="layui-emoji-2xl layui-mb10">🏢</div>
                            <h3 className="layui-font-sm layui-mb10 layui-elip">{company.name}</h3>
                            {company.industry && (
                              <p className="layui-font-xs layui-font-gray layui-mb10">{company.industry}</p>
                            )}
                            <div className="layui-font-xs layui-font-gray">
                              {company.verified && <span className="layui-badge layui-bg-blue layui-mr5">认证</span>}
                              {company.location}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
                <div className="layui-text-center layui-mt20">
                  <Link href="/companies" className="layui-btn layui-btn-primary">浏览更多企业</Link>
                </div>
              </div>
            </div>

            <div className="layui-card layui-mt20">
              <div className="layui-card-header">
                <i className="layui-icon layui-icon-location"></i> 按地区搜索
              </div>
              <div className="layui-card-body">
                <div className="layui-row layui-col-space10">
                  {allStates.map((state) => (
                    <div className="layui-col-md2 layui-col-sm4 layui-col-xs6" key={state.id}>
                      <Link href={`/jobs?state=${state.id}`} className="layui-link-block">
                        <div className="layui-card">
                          <div className="layui-card-body layui-text-center">
                            <h3 className="layui-font-lg layui-mb10 layui-font-dark">{state.name}</h3>
                            <p className="layui-font-xs layui-font-gray layui-mb0">
                              {jobService.getAll().filter(j => j.state === state.stateCode).length} 个职位
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="layui-col-md3">
            <div className="layui-card">
              <div className="layui-card-header">
                <i className="layui-icon layui-icon-template-1"></i> 热门分类
              </div>
              <div className="layui-card-body">
                <div className="layui-row layui-col-space10">
                  {categories.map((category) => (
                    <div className="layui-col-md6 layui-col-xs6" key={category.id}>
                      <Link href={`/jobs?category=${category.id}`} className="layui-link-block">
                        <div className="layui-tile-category">
                          <div className="layui-font-3xl layui-mb5">{category.icon}</div>
                          <div className="layui-font-sm layui-font-dark">{category.name}</div>
                          <div className="layui-font-xs layui-font-gray">{category.count}</div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="layui-card layui-mt20">
              <div className="layui-card-header">
                <i className="layui-icon layui-icon-chart"></i> 数据统计
              </div>
              <div className="layui-card-body">
                <div className="layui-row layui-col-space10">
                  <div className="layui-col-xs6">
                    <div className="layui-stat-banner layui-stat-banner--cyan">
                      <div className="layui-stat-banner__num">{jobService.getAll().length}</div>
                      <div className="layui-stat-banner__label">在线职位</div>
                    </div>
                  </div>
                  <div className="layui-col-xs6">
                    <div className="layui-stat-banner layui-stat-banner--blue">
                      <div className="layui-stat-banner__num">{companyService.getAll().length}</div>
                      <div className="layui-stat-banner__label">入驻企业</div>
                    </div>
                  </div>
                  <div className="layui-col-xs6">
                    <div className="layui-stat-banner layui-stat-banner--orange">
                      <div className="layui-stat-banner__num">{locationService.getAll().length}</div>
                      <div className="layui-stat-banner__label">覆盖地区</div>
                    </div>
                  </div>
                  <div className="layui-col-xs6">
                    <div className="layui-stat-banner layui-stat-banner--green">
                      <div className="layui-stat-banner__num">{categories.reduce((sum, cat) => sum + cat.count, 0)}</div>
                      <div className="layui-stat-banner__label">覆盖行业</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
  );
}
