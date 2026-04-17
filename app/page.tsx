'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { jobService, companyService, locationService } from '@/lib/utils/data';

export default function HomePage() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const itemContainerRef = useRef<HTMLDivElement>(null);
  const carouselInitialized = useRef(false);

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
    const initLayui = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const layui = (window as any).layui;
      if (!layui) {
        setTimeout(initLayui, 100);
        return;
      }

      layui.use(['carousel', 'element', 'form'], function() {
        const carousel = layui.carousel;
        const element = layui.element;
        const form = layui.form;

        // 渲染表单
        if (formRef.current) {
          form.render();
        }

        // 渲染选项卡
        element.render('tab');

        // 初始化轮播图 - 只初始化一次
        if (!carouselInitialized.current && carouselRef.current && itemContainerRef.current) {
          // 设置 carousel-item 属性
          itemContainerRef.current.setAttribute('carousel-item', '');

          carousel.render({
            elem: '#homeCarousel',
            width: '100%',
            height: '400px'
          });

          carouselInitialized.current = true;
        }
      });
    };

    initLayui();
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
                <div style={{fontSize: '40px'}}>🏢</div>
              </div>
              <div className="layui-col-xs9">
                <h3 style={{fontSize: '16px', marginBottom: '8px'}}>
                  <Link href={`/jobs/${job.id}`} style={{color: '#333'}}>{job.title}</Link>
                  <span className={`layui-badge layui-fr ${salaryClass}`}>
                    ${job.salaryMin}-{job.salaryMax}
                  </span>
                </h3>
                <p style={{color: '#999', fontSize: '14px', marginBottom: '8px'}}>
                  {company?.name || '未知公司'}
                </p>
                <div style={{fontSize: '12px', color: '#999'}}>
                  <span className="layui-tag layui-bg-gray">{job.category}</span>
                  <span style={{marginLeft: '15px'}}>
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
      {/* 轮播图 - 全宽 */}
      <div className="layui-carousel" id="homeCarousel" ref={carouselRef} lay-filter="homeCarousel">
        <div ref={itemContainerRef}>
          <div style={{
            height: '400px',
            background: 'linear-gradient(135deg, #ffb800 0%, #ff5722 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            textAlign: 'center'
          }}>
            <h1 style={{fontSize: '42px', fontWeight: 'bold', marginBottom: '15px', color: '#fff'}}>企业招聘首选平台</h1>
            <p style={{fontSize: '18px', marginBottom: '30px', color: 'rgba(255,255,255,0.9)'}}>快速发布职位，精准匹配人才</p>
            <Link href="/post" className="layui-btn layui-btn-lg layui-btn-primary">发布职位</Link>
          </div>
          <div style={{
            height: '400px',
            background: 'linear-gradient(135deg, #16baaa 0%, #009688 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            textAlign: 'center'
          }}>
            <h1 style={{fontSize: '42px', fontWeight: 'bold', marginBottom: '15px', color: '#fff'}}>海量优质企业</h1>
            <p style={{fontSize: '18px', marginBottom: '30px', color: 'rgba(255,255,255,0.9)'}}>已认证企业，求职更放心</p>
            <Link href="/companies" className="layui-btn layui-btn-lg">浏览企业</Link>
          </div>
        </div>
      </div>

      {/* 主内容区域 - 限制宽度 */}
      <div className="layui-main">
        {/* 主内容 */}
        <div style={{marginTop: '30px'}}>
          <div className="layui-row layui-col-space20">
          {/* 左侧主内容 */}
          <div className="layui-col-md9">
            {/* 推荐职位 */}
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
                      <div className="layui-text-center" style={{marginTop: '20px'}}>
                        <Link href="/jobs" className="layui-btn layui-btn-primary">查看更多职位</Link>
                      </div>
                    </div>
                    <div className="layui-tab-item">
                      <div className="layui-row layui-col-space15">
                        {latestJobs.map((job) => renderJobCard(job))}
                      </div>
                      <div className="layui-text-center" style={{marginTop: '20px'}}>
                        <Link href="/jobs" className="layui-btn layui-btn-primary">查看更多职位</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 热门企业 */}
            <div className="layui-card" style={{marginTop: '20px'}}>
              <div className="layui-card-header">
                <i className="layui-icon layui-icon-component"></i> 热门企业
              </div>
              <div className="layui-card-body">
                <div className="layui-row layui-col-space10">
                  {hotCompanies.map((company) => (
                    <div className="layui-col-md3 layui-col-sm6" key={company.id}>
                      <Link href={`/companies/${company.id}`} style={{display: 'block', textDecoration: 'none'}}>
                        <div className="layui-card">
                          <div className="layui-card-body layui-text-center">
                            <div style={{fontSize: '36px', marginBottom: '10px'}}>🏢</div>
                            <h3 style={{fontSize: '14px', marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{company.name}</h3>
                            {company.industry && (
                              <p style={{fontSize: '12px', color: '#999', marginBottom: '8px'}}>{company.industry}</p>
                            )}
                            <div style={{fontSize: '12px', color: '#999'}}>
                              {company.verified && <span className="layui-badge layui-bg-blue" style={{marginRight: '5px'}}>认证</span>}
                              {company.location}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
                <div className="layui-text-center" style={{marginTop: '20px'}}>
                  <Link href="/companies" className="layui-btn layui-btn-primary">浏览更多企业</Link>
                </div>
              </div>
            </div>

            {/* 按地区搜索 */}
            <div className="layui-card" style={{marginTop: '20px'}}>
              <div className="layui-card-header">
                <i className="layui-icon layui-icon-location"></i> 按地区搜索
              </div>
              <div className="layui-card-body">
                <div className="layui-row layui-col-space10">
                  {allStates.map((state) => (
                    <div className="layui-col-md2 layui-col-sm4 layui-col-xs6" key={state.id}>
                      <Link href={`/jobs?state=${state.id}`} style={{display: 'block', textDecoration: 'none'}}>
                        <div className="layui-card">
                          <div className="layui-card-body layui-text-center">
                            <h3 style={{fontSize: '15px', marginBottom: '8px', color: '#333'}}>{state.name}</h3>
                            <p style={{fontSize: '12px', color: '#999', margin: 0}}>{jobService.getAll().filter(j => j.state === state.stateCode).length} 个职位</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 右侧边栏 */}
          <div className="layui-col-md3">
            {/* 热门分类 */}
            <div className="layui-card">
              <div className="layui-card-header">
                <i className="layui-icon layui-icon-template-1"></i> 热门分类
              </div>
              <div className="layui-card-body">
                <div className="layui-row layui-col-space10">
                  {categories.map((category) => (
                    <div className="layui-col-md6 layui-col-xs6" key={category.id}>
                      <Link href={`/jobs?category=${category.id}`} style={{display: 'block', textDecoration: 'none'}}>
                        <div style={{textAlign: 'center', padding: '15px 10px', background: '#f8f8f8', borderRadius: '4px', marginBottom: '10px'}}>
                          <div style={{fontSize: '28px', marginBottom: '5px'}}>{category.icon}</div>
                          <div style={{fontSize: '13px', color: '#333'}}>{category.name}</div>
                          <div style={{fontSize: '11px', color: '#999'}}>{category.count}</div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 数据统计 */}
            <div className="layui-card" style={{marginTop: '20px'}}>
              <div className="layui-card-header">
                <i className="layui-icon layui-icon-chart"></i> 数据统计
              </div>
              <div className="layui-card-body">
                <div className="layui-row layui-col-space10">
                  <div className="layui-col-xs6">
                    <div style={{textAlign: 'center', padding: '20px 10px', background: 'linear-gradient(135deg, #009688 0%, #16baaa 100%)', borderRadius: '4px', marginBottom: '10px'}}>
                      <div style={{fontSize: '28px', fontWeight: 'bold', color: '#fff', marginBottom: '5px'}}>{jobService.getAll().length}</div>
                      <div style={{fontSize: '12px', color: 'rgba(255,255,255,0.9)'}}>在线职位</div>
                    </div>
                  </div>
                  <div className="layui-col-xs6">
                    <div style={{textAlign: 'center', padding: '20px 10px', background: 'linear-gradient(135deg, #1e9fff 0%, #3a8ee6 100%)', borderRadius: '4px', marginBottom: '10px'}}>
                      <div style={{fontSize: '28px', fontWeight: 'bold', color: '#fff', marginBottom: '5px'}}>{companyService.getAll().length}</div>
                      <div style={{fontSize: '12px', color: 'rgba(255,255,255,0.9)'}}>入驻企业</div>
                    </div>
                  </div>
                  <div className="layui-col-xs6">
                    <div style={{textAlign: 'center', padding: '20px 10px', background: 'linear-gradient(135deg, #ffb800 0%, #ffa300 100%)', borderRadius: '4px', marginBottom: '10px'}}>
                      <div style={{fontSize: '28px', fontWeight: 'bold', color: '#fff', marginBottom: '5px'}}>{locationService.getAll().length}</div>
                      <div style={{fontSize: '12px', color: 'rgba(255,255,255,0.9)'}}>覆盖地区</div>
                    </div>
                  </div>
                  <div className="layui-col-xs6">
                    <div style={{textAlign: 'center', padding: '20px 10px', background: 'linear-gradient(135deg, #16baaa 0%, #5FB878 100%)', borderRadius: '4px', marginBottom: '10px'}}>
                      <div style={{fontSize: '28px', fontWeight: 'bold', color: '#fff', marginBottom: '5px'}}>{categories.reduce((sum, cat) => sum + cat.count, 0)}</div>
                      <div style={{fontSize: '12px', color: 'rgba(255,255,255,0.9)'}}>覆盖行业</div>
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