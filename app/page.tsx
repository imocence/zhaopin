'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { jobService, companyService, locationService, categoryService } from '@/lib/services/data';
import { Job, Company, Location } from '@/types';

export default function HomePage() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const carouselInstRef = useRef<{ destroy?: () => void } | null>(null);
  const layuiRetryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 数据状态
  const [hotJobs, setHotJobs] = useState<Job[]>([]);
  const [latestJobs, setLatestJobs] = useState<Job[]>([]);
  const [hotCompanies, setHotCompanies] = useState<Company[]>([]);
  const [allStates, setAllStates] = useState<Location[]>([]);
  const [companiesMap, setCompaniesMap] = useState<Record<string, Company>>({});
  const [jobsCountByState, setJobsCountByState] = useState<Record<string, number>>({});
  const [stats, setStats] = useState({ totalJobs: 0, totalCompanies: 0, totalLocations: 0 });
  const [categories, setCategories] = useState<Array<{ id: string; name: string; icon: string; count: number }>>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  // 加载数据
  useEffect(() => {
    async function loadData() {
      try {
        const [jobs, latest, companies, states] = await Promise.all([
          jobService.getHotJobs(8),
          jobService.getLatestJobs(8),
          companyService.getVerified(),
          locationService.getAll(),
        ]);

        setHotJobs(jobs.filter(j => j.status === 'active').slice(0, 8));
        setLatestJobs(latest);
        setHotCompanies(companies.slice(0, 8));
        setAllStates(states.slice(0, 12));

        // 构建公司映射
        const allCompanies = await companyService.getAll();
        const map: Record<string, Company> = {};
        allCompanies.forEach(c => { map[c.id] = c; });
        setCompaniesMap(map);

        // 计算每个州的职位数
        const allJobs = await jobService.getAll();
        const countMap: Record<string, number> = {};
        allJobs.forEach(j => {
          countMap[j.state] = (countMap[j.state] || 0) + 1;
        });
        setJobsCountByState(countMap);

        const categoriesFromDb = await categoryService.getAll();
        const categoryCounts = allJobs.reduce((acc, job) => {
          acc[job.category] = (acc[job.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        setCategories(categoriesFromDb.slice(0, 10).map(cat => ({
          id: cat.id,
          name: cat.name,
          icon: cat.icon,
          count: categoryCounts[cat.slug] || 0,
        })));

        // 设置统计数据
        setStats({
          totalJobs: allJobs.filter(j => j.status === 'active').length,
          totalCompanies: allCompanies.length,
          totalLocations: states.length,
        });
      } catch (error) {
        console.error('Failed to load data:', error);
        setLoadError(String(error ?? 'Unknown error'));
      }
    }
    loadData();
  }, []);

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

  const renderJobCard = (job: Job) => {
    const company = companiesMap[job.companyId];
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
                <div className="layui-font-3xl">🏢</div>
              </div>
              <div className="layui-col-xs9">
                <h3 className="layui-font-lg layui-mb10">
                  <Link href={`/jobs/${job.id}`} prefetch={false} className="layui-font-lg layui-font-bold layui-font-dark">{job.title}</Link>
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
            <Link href="/post" prefetch={false} className="layui-btn layui-btn-lg layui-btn-primary">发布职位</Link>
          </div>
          <div className="layui-carousel-slide layui-carousel-slide--cyan">
            <h1 className="layui-carousel-hero-title">海量优质企业</h1>
            <p className="layui-carousel-hero-desc">已认证企业，求职更放心</p>
            <Link href="/companies" prefetch={false} className="layui-btn layui-btn-lg">浏览企业</Link>
          </div>
        </div>
      </div>

      <div className="layui-main">
        <div className="layui-mt30">
          {loadError && (
            <div className="layui-alert layui-bg-red layui-text-white layui-mb20">
              <p className="layui-font-sm">首页数据加载失败: {loadError}</p>
            </div>
          )}
          <div className="layui-row layui-col-space20">
            <div className="layui-col-md9">
              <div className="layui-card">
                <div className="layui-card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>
                    <i className="layui-icon layui-icon-list"></i> 推荐职位
                  </span>
                  <Link href="/jobs" prefetch={false}>更多职位.. </Link>
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
                      </div>
                      <div className="layui-tab-item">
                        <div className="layui-row layui-col-space15">
                          {latestJobs.map((job) => renderJobCard(job))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="layui-card layui-mt20">
                <div className="layui-card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <i className="layui-icon layui-icon-component"></i> 热门企业
                  <Link href="/companies" prefetch={false}>更多企业..</Link>
                </div>
                <div className="layui-card-body">
                  <div className="layui-row layui-col-space10">
                    {hotCompanies.map((company) => (
                      <div className="layui-col-md3 layui-col-sm6" key={company.id}>
                        <Link href={`/companies/${company.id}`} prefetch={false} className="layui-link-block">
                          <div className="layui-card">
                            <div className="layui-card-body layui-text-center">
                              <div className="layui-font-2xl layui-mb10">🏢</div>
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
                        <Link href={`/jobs?state=${state.id}`} prefetch={false} className="layui-link-block">
                          <div className="layui-card">
                            <div className="layui-card-body layui-text-center">
                              <h3 className="layui-font-lg layui-mb10 layui-font-dark">{state.name}</h3>
                              <p className="layui-font-xs layui-font-gray layui-mb0">
                                {jobsCountByState[state.stateCode] || 0} 个职位
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
                        <Link href={`/jobs?category=${category.id}`} prefetch={false} className="layui-link-block">
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
                        <div className="layui-stat-banner__num">{stats.totalJobs}</div>
                        <div className="layui-stat-banner__label">在线职位</div>
                      </div>
                    </div>
                    <div className="layui-col-xs6">
                      <div className="layui-stat-banner layui-stat-banner--blue">
                        <div className="layui-stat-banner__num">{stats.totalCompanies}</div>
                        <div className="layui-stat-banner__label">入驻企业</div>
                      </div>
                    </div>
                    <div className="layui-col-xs6">
                      <div className="layui-stat-banner layui-stat-banner--orange">
                        <div className="layui-stat-banner__num">{stats.totalLocations}</div>
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
