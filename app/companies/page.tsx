'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { companyService, locationService } from '@/lib/utils/data';
import CompanyCard from '@/components/company/CompanyCard';

export default function CompaniesPage() {
  const [filters, setFilters] = useState({
    keyword: '',
    state: '',
    industry: '',
    verified: false,
  });
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const laypageRef = useRef<HTMLDivElement>(null);
  const laypageInitialized = useRef(false);

  const allCompanies = useMemo(() => companyService.getAll(), []);
  const locations = locationService.getAll();

  const filteredCompanies = useMemo(() => {
    let result = allCompanies;

    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      result = result.filter(company =>
        company.name.toLowerCase().includes(keyword) ||
        company.industry?.toLowerCase().includes(keyword)
      );
    }

    if (filters.state) {
      result = result.filter(company => company.state === filters.state);
    }

    if (filters.industry) {
      result = result.filter(company => company.industry === filters.industry);
    }

    if (filters.verified) {
      result = result.filter(company => company.verified);
    }

    return result;
  }, [allCompanies, filters]);

  const totalPages = Math.ceil(filteredCompanies.length / pageSize);
  const paginatedCompanies = filteredCompanies.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const industries = useMemo(() => {
    const industrySet = new Set<string>();
    allCompanies.forEach(company => {
      if (company.industry) {
        industrySet.add(company.industry);
      }
    });
    return Array.from(industrySet).sort();
  }, [allCompanies]);

  // 初始化 laypage 分页组件
  useEffect(() => {
    const initLaypage = () => {
      const layui = (window as any).layui;
      if (!layui) {
        setTimeout(initLaypage, 100);
        return;
      }

      layui.use(['laypage'], function() {
        const laypage = layui.laypage;

        if (laypageRef.current && !laypageInitialized.current) {
          if (totalPages <= 1) {
            return;
          }

          laypage.render({
            elem: laypageRef.current,
            count: filteredCompanies.length,
            limit: pageSize,
            curr: page,
            layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
            jump: function(obj: any, first: boolean) {
              if (!first) {
                setPage(obj.curr);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }
          });

          laypageInitialized.current = true;
        }
      });
    };

    initLaypage();
  }, [filteredCompanies.length, page, pageSize]);

  // 当总页数变化时，重置 laypage
  useEffect(() => {
    laypageInitialized.current = false;
  }, [totalPages]);

  const handleFilterChange = (key: string, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters({ keyword: '', state: '', industry: '', verified: false });
    setPage(1);
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== undefined && v !== '' && v !== false);

  return (
    <div className="layui-container layui-mt20">
      {/* 页面头部 */}
      <div className="layui-card layui-page-header layui-mb25">
        <div className="layui-card-body layui-page-header-body layui-bg-gradient-blue">
          {/* 装饰性背景元素 */}
          <div className="layui-header-decoration layui-header-decoration-lg"></div>
          <div className="layui-header-decoration layui-header-decoration-sm"></div>

          <div style={{position: 'relative', zIndex: 1}}>
            <div className="layui-flex layui-mb15">
              <div className="layui-header-icon layui-mr20">
                <i className="layui-icon layui-icon-component layui-font-white layui-font-3xl"></i>
              </div>
              <div>
                <h1 className="layui-font-title layui-font-white layui-font-bold layui-mb5">企业大全</h1>
                <p className="layui-font-sm layui-font-gray-light layui-mt5 layui-mb0">发现优秀企业，开启职业新征程</p>
              </div>
            </div>
            <div className="layui-header-badge layui-font-white layui-font-lg">
              <i className="layui-icon layui-icon-ok-circle layui-font-white layui-icon-gap-lg"></i>
              <span className="layui-font-white">
                发现 <span className="layui-font-3xl layui-font-bold layui-font-white layui-mr5 layui-ml5">{filteredCompanies.length}</span> 家优秀企业
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 统计数据 */}
      <div className="layui-row layui-col-space20 layui-mb25">
        <div className="layui-col-md3 layui-col-xs6">
          <div className="layui-card layui-stat-card layui-card-body-p25 layui-text-center layui-hover-lift">
            <div className="layui-stat-number layui-stat-number-cyan">{filteredCompanies.length}</div>
            <div className="layui-font-sm layui-font-gray-light">全部企业</div>
          </div>
        </div>
        <div className="layui-col-md3 layui-col-xs6">
          <div className="layui-card layui-stat-card layui-card-body-p25 layui-text-center layui-hover-lift">
            <div className="layui-stat-number layui-stat-number-blue">{allCompanies.filter(c => c.verified).length}</div>
            <div className="layui-font-sm layui-font-gray-light">已认证企业</div>
          </div>
        </div>
        <div className="layui-col-md3 layui-col-xs6">
          <div className="layui-card layui-stat-card layui-card-body-p25 layui-text-center layui-hover-lift">
            <div className="layui-stat-number layui-stat-number-orange">{industries.length}</div>
            <div className="layui-font-sm layui-font-gray-light">覆盖行业</div>
          </div>
        </div>
        <div className="layui-col-md3 layui-col-xs6">
          <div className="layui-card layui-stat-card layui-card-body-p25 layui-text-center layui-hover-lift">
            <div className="layui-stat-number layui-stat-number-teal">{locations.length}</div>
            <div className="layui-font-sm layui-font-gray-light">覆盖地区</div>
          </div>
        </div>
      </div>

      <div className="layui-row layui-col-space20">
        {/* 侧边栏筛选 */}
        <div className="layui-col-md3">
          <div className="layui-card layui-card-enhanced">
            <div className="layui-card-header layui-card-header-bg layui-flex layui-flex-between">
              <div className="layui-flex layui-flex-center">
                <i className="layui-icon layui-icon-template-1 layui-font-blue layui-icon-gap"></i>
                <span className="layui-font-lg layui-font-bold layui-font-gray-light">筛选条件</span>
              </div>
              {hasActiveFilters && (
                <span className="layui-badge layui-badge-enhanced layui-badge-cyan">已筛选</span>
              )}
            </div>
            <div className="layui-card-body layui-p20">
              {/* 关键词搜索 */}
              <div className="layui-form-item-enhanced">
                <label className="layui-form-label-enhanced">
                  <i className="layui-icon layui-icon-search layui-font-gray-99 layui-icon-gap"></i>
                  关键词
                </label>
                <input
                  type="text"
                  placeholder="搜索企业名称..."
                  className="layui-input layui-input-enhanced"
                  value={filters.keyword}
                  onChange={(e) => handleFilterChange('keyword', e.target.value)}
                />
              </div>

              {/* 州筛选 */}
              <div className="layui-form-item-enhanced">
                <label className="layui-form-label-enhanced">
                  <i className="layui-icon layui-icon-location layui-font-gray-99 layui-icon-gap"></i>
                  所在州
                </label>
                <select
                  className="layui-input layui-input-enhanced"
                  value={filters.state}
                  onChange={(e) => handleFilterChange('state', e.target.value)}
                >
                  <option value="">全部州</option>
                  {locations.map(state => (
                    <option key={state.stateCode} value={state.stateCode}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 行业筛选 */}
              {industries.length > 0 && (
                <div className="layui-form-item-enhanced">
                  <label className="layui-form-label-enhanced">
                    <i className="layui-icon layui-icon-file layui-font-gray-99 layui-icon-gap"></i>
                    行业
                  </label>
                  <select
                    className="layui-input layui-input-enhanced"
                    value={filters.industry}
                    onChange={(e) => handleFilterChange('industry', e.target.value)}
                  >
                    <option value="">全部行业</option>
                    {industries.map(industry => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* 认证筛选 */}
              <div className="layui-form-item-enhanced">
                <label className="layui-flex layui-flex-center layui-gap-8 layui-font-sm layui-font-bold layui-font-gray-light" style={{cursor: 'pointer'}}
                  onClick={() => handleFilterChange('verified', !filters.verified)}
                >
                  <div style={{
                    width: '18px',
                    height: '18px',
                    border: filters.verified ? 'none' : '1px solid #d9d9d9',
                    borderRadius: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: filters.verified ? '#1890ff' : '#fff',
                    color: filters.verified ? '#fff' : 'transparent'
                  }}>
                    {filters.verified && (
                      <i className="layui-icon layui-icon-ok layui-font-xs"></i>
                    )}
                  </div>
                  仅显示已认证企业
                </label>
              </div>

              {/* 重置按钮 */}
              <div className="layui-pt20 layui-border-top">
                <button
                  className="layui-btn layui-btn-fluid layui-btn-primary layui-btn-enhanced layui-border"
                  onClick={handleResetFilters}
                >
                  <i className="layui-icon layui-icon-search layui-icon-gap"></i>筛选
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 企业列表 */}
        <div className="layui-col-md9">
          {/* 结果统计 */}
          <div className="layui-card layui-card-enhanced layui-mb15">
            <div className="layui-card-body layui-p20">
              <div className="layui-flex layui-flex-between layui-flex-wrap layui-m-5">
                <div className="layui-flex layui-flex-center layui-gap-10">
                  <i className="layui-icon layui-icon-list layui-font-gray layui-mr5"></i>
                  <span className="layui-font-sm layui-font-gray-light">
                    找到 <span className="layui-font-lg layui-font-bold layui-font-blue">{filteredCompanies.length}</span> 家企业
                  </span>
                  {hasActiveFilters && (
                    <button
                      className="layui-btn layui-btn-xxs layui-btn-primary layui-mr20"
                      onClick={handleResetFilters}
                    >
                      筛选
                    </button>
                  )}
                </div>
                <div className="layui-flex layui-flex-center layui-gap-10">
                  <i className="layui-icon layui-icon-template-1 layui-font-gray layui-mr5"></i>
                  <span className="layui-font-sm layui-font-gray-light">排序：</span>
                  <select className="layui-input layui-mr5" style={{width: '140px', padding: '6px 10px', border: '1px solid #e8e8e8', borderRadius: '4px', fontSize: '13px'}}>
                    <option value="default">默认排序</option>
                    <option value="jobs-desc">职位数从多到少</option>
                    <option value="verified">已认证优先</option>
                    <option value="name-asc">名称A-Z</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* 企业网格 */}
          {paginatedCompanies.length > 0 ? (
            <div className="layui-row layui-col-space20">
              {paginatedCompanies.map((company) => (
                <div className="layui-col-md4 layui-col-xs6" key={company.id}>
                  <CompanyCard company={company} />
                </div>
              ))}
            </div>
          ) : (
            <div className="layui-card layui-card-enhanced layui-text-center" style={{padding: '60px 20px'}}>
              <div style={{
                fontSize: '80px',
                marginBottom: '20px',
                opacity: '0.5'
              }}>🏢</div>
              <h3 className="layui-font-lg layui-font-bold layui-font-gray-light layui-mb10">暂无企业</h3>
              <p className="layui-font-sm layui-font-gray layui-mb20">没有找到符合条件的企业</p>
              <button
                className="layui-btn layui-btn-primary layui-btn-enhanced"
                onClick={handleResetFilters}
              >
                清除筛选条件
              </button>
            </div>
          )}

          {/* 分页 */}
          {totalPages > 1 && (
            <div className="layui-pagination-area">
              <div ref={laypageRef}></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
