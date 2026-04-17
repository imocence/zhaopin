'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
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
  const pageSize = 20;

  const allCompanies = useMemo(() => companyService.getAll(), []);

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

  const handleFilterChange = (key: string, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== undefined && v !== '' && v !== false);

  return (
    <div className="layui-container layui-mt20">
      {/* 页面标题 */}
      <div className="layui-card">
        <div className="layui-card-body" style={{background: 'linear-gradient(135deg, #009688 0%, #1e9fff 100%)', padding: '40px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px'}}>
            <i className="layui-icon layui-icon-component" style={{fontSize: '36px', color: '#fff'}}></i>
            <h1 style={{fontSize: '32px', fontWeight: 'bold', color: '#fff', margin: 0}}>企业大全</h1>
          </div>
          <p style={{fontSize: '18px', color: 'rgba(255,255,255,0.9)'}}>
            发现 <span style={{fontWeight: 'bold', color: '#fff'}}>{filteredCompanies.length}</span> 家优秀企业，开启职业新征程
          </p>
        </div>
      </div>

      {/* 统计数据 */}
      <div className="layui-row layui-col-space15 layui-mt20">
        <div className="layui-col-md3 layui-col-xs6">
          <div className="layui-card">
            <div className="layui-card-body layui-text-center">
              <div style={{fontSize: '32px', fontWeight: 'bold', color: '#009688'}}>{filteredCompanies.length}</div>
              <div className="layui-font-sm layui-font-gray">全部企业</div>
            </div>
          </div>
        </div>
        <div className="layui-col-md3 layui-col-xs6">
          <div className="layui-card">
            <div className="layui-card-body layui-text-center">
              <div style={{fontSize: '32px', fontWeight: 'bold', color: '#1e9fff'}}>
                {allCompanies.filter(c => c.verified).length}
              </div>
              <div className="layui-font-sm layui-font-gray">已认证企业</div>
            </div>
          </div>
        </div>
        <div className="layui-col-md3 layui-col-xs6">
          <div className="layui-card">
            <div className="layui-card-body layui-text-center">
              <div style={{fontSize: '32px', fontWeight: 'bold', color: '#ffb800'}}>{industries.length}</div>
              <div className="layui-font-sm layui-font-gray">覆盖行业</div>
            </div>
          </div>
        </div>
        <div className="layui-col-md3 layui-col-xs6">
          <div className="layui-card">
            <div className="layui-card-body layui-text-center">
              <div style={{fontSize: '32px', fontWeight: 'bold', color: '#16baaa'}}>{locationService.getAll().length}</div>
              <div className="layui-font-sm layui-font-gray">覆盖地区</div>
            </div>
          </div>
        </div>
      </div>

      <div className="layui-row layui-col-space20 layui-mt20">
        {/* 侧边栏筛选 */}
        <div className="layui-col-md3">
          <div className="layui-card">
            <div className="layui-card-header">
              <span className="layui-font-bold">筛选条件</span>
              {hasActiveFilters && <span className="layui-badge layui-bg-blue layui-fr">已筛选</span>}
            </div>
            <div className="layui-card-body">
              {/* 关键词搜索 */}
              <div className="layui-form-item">
                <label className="layui-form-label">关键词</label>
                <div className="layui-input-block">
                  <input
                    type="text"
                    placeholder="搜索企业名称..."
                    className="layui-input"
                    value={filters.keyword}
                    onChange={(e) => handleFilterChange('keyword', e.target.value)}
                  />
                </div>
              </div>

              {/* 州筛选 */}
              <div className="layui-form-item">
                <label className="layui-form-label">所在州</label>
                <div className="layui-input-block">
                  <select
                    className="layui-input"
                    value={filters.state}
                    onChange={(e) => handleFilterChange('state', e.target.value)}
                  >
                    <option value="">全部州</option>
                    {locationService.getAll().map(state => (
                      <option key={state.code} value={state.code}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 行业筛选 */}
              {industries.length > 0 && (
                <div className="layui-form-item">
                  <label className="layui-form-label">行业</label>
                  <div className="layui-input-block">
                    <select
                      className="layui-input"
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
                </div>
              )}

              {/* 认证筛选 */}
              <div className="layui-form-item">
                <label className="layui-form-label">认证</label>
                <div className="layui-input-block">
                  <input
                    type="checkbox"
                    checked={filters.verified}
                    onChange={(e) => handleFilterChange('verified', e.target.checked)}
                    title="仅显示已认证企业"
                  />
                </div>
              </div>

              {/* 重置按钮 */}
              <button
                className={`layui-btn layui-btn-fluid ${hasActiveFilters ? 'layui-btn-primary' : 'layui-btn-disabled'}`}
                onClick={() => setFilters({ keyword: '', state: '', industry: '', verified: false })}
                disabled={!hasActiveFilters}
              >
                重置筛选
              </button>
            </div>
          </div>
        </div>

        {/* 企业列表 */}
        <div className="layui-col-md9">
          {/* 结果统计 */}
          <div className="layui-card">
            <div className="layui-card-body">
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <span className="layui-font-sm layui-font-gray">
                  找到 <span className="layui-font-bold layui-font-cyan">{filteredCompanies.length}</span> 家企业
                  {hasActiveFilters && (
                    <button
                      className="layui-btn layui-btn-xs layui-btn-primary"
                      style={{marginLeft: '10px'}}
                      onClick={() => setFilters({ keyword: '', state: '', industry: '', verified: false })}
                    >
                      清除筛选
                    </button>
                  )}
                </span>
                <select className="layui-input" style={{display: 'inline-block', width: 'auto'}}>
                  <option value="default">默认排序</option>
                  <option value="jobs-desc">职位数从多到少</option>
                  <option value="verified">已认证优先</option>
                  <option value="name-asc">名称A-Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* 企业网格 */}
          {paginatedCompanies.length > 0 ? (
            <div className="layui-row layui-col-space15 layui-mt20">
              {paginatedCompanies.map((company) => (
                <div className="layui-col-md4 layui-col-xs6" key={company.id}>
                  <CompanyCard company={company} />
                </div>
              ))}
            </div>
          ) : (
            <div className="layui-card layui-mt20">
              <div className="layui-card-body layui-text-center" style={{padding: '60px 20px'}}>
                <i className="layui-icon layui-icon-component" style={{fontSize: '80px', color: '#d2d2d2'}}></i>
                <h3 className="layui-font-title layui-mt20">暂无企业</h3>
                <p className="layui-font-gray layui-mb20">没有找到符合条件的企业</p>
                <button
                  className="layui-btn layui-btn-primary"
                  onClick={() => setFilters({ keyword: '', state: '', industry: '', verified: false })}
                >
                  清除筛选条件
                </button>
              </div>
            </div>
          )}

          {/* 分页 */}
          {totalPages > 1 && (
            <div className="layui-mt20 layui-text-center">
              <div className="layui-pagination">
                {page > 1 && (
                  <button
                    className="layui-icon"
                    onClick={() => setPage(page - 1)}
                  >
                    «
                  </button>
                )}

                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      className={pageNum === page ? 'layui-this' : ''}
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {page < totalPages && (
                  <button
                    className="layui-icon"
                    onClick={() => setPage(page + 1)}
                  >
                    »
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
