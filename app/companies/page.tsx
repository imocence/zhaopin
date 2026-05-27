'use client';

import React, {useEffect, useMemo, useRef, useState} from 'react';
import {companyService, locationService} from '@/lib/utils/data';
import CompanyCard from '@/components/company/CompanyCard';
import {FilterSection, FilterSidebar} from '@/components/filter';

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

            layui.use(['laypage'], function () {
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
                        jump: function (obj: any, first: boolean) {
                            if (!first) {
                                setPage(obj.curr);
                                window.scrollTo({top: 0, behavior: 'smooth'});
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

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({...prev, [key]: value}));
        setPage(1);
    };

    const handleResetFilters = () => {
        setFilters({keyword: '', state: '', industry: '', verified: false});
        setPage(1);
    };

    const hasActiveFilters = Object.values(filters).some(v => v !== undefined && v !== '' && v !== false);

    // 准备筛选配置
    const filterSections: FilterSection[] = [
        {
            key: 'keyword',
            label: '关键词',
            icon: 'layui-icon-search',
            type: 'text',
            placeholder: '搜索企业名称...',
            value: filters.keyword,
            onChange: (value) => handleFilterChange('keyword', value)
        },
        {
            key: 'state',
            label: '所在州',
            icon: 'layui-icon-location',
            type: 'select',
            options: locations.map(loc => ({value: loc.stateCode, label: loc.name})),
            value: filters.state,
            onChange: (value) => handleFilterChange('state', value)
        },
        ...(industries.length > 0 ? [{
            key: 'industry' as const,
            label: '行业',
            icon: 'layui-icon-file',
            type: 'select' as const,
            options: industries.map(ind => ({value: ind, label: ind})),
            value: filters.industry,
            onChange: (value: string) => handleFilterChange('industry', value)
        }] : []),
        {
            key: 'verified',
            label: '已认证',
            icon: 'layui-icon-ok-circle',
            type: 'checkbox',
            value: filters.verified,
            onChange: (value) => handleFilterChange('verified', value)
        }
    ];

    return (
        <div className="layui-container layui-mt20">
            {/* 页面头部 */}
            <div className="layui-card layui-page-header layui-mb25">
                <div className="layui-card-body layui-page-header-body layui-bg-gradient-blue">
                    {/* 装饰性背景元素 */}
                    <div className="layui-header-decoration layui-header-decoration-lg"></div>
                    <div className="layui-header-decoration layui-header-decoration-sm"></div>

                    <div className="layui-row layui-row-flex layui-row-middle">
                        <div className="layui-col-xs8 layui-col-sm8 layui-col-md6">
                            <div className="layui-flex layui-flex-middle">
                                <div className="layui-header-icon layui-mr20">
                                    <i className="layui-icon layui-icon-component layui-font-white layui-font-3xl"></i>
                                </div>
                                <div>
                                    <h1 className="layui-font-title layui-font-white layui-font-bold layui-mb5">企业大全</h1>
                                    <p className="layui-font-sm layui-font-gray-light layui-mt0 layui-mb0">发现优秀企业，开启职业新征程</p>
                                </div>
                            </div>
                        </div>
                        <div className="layui-col-xs4 layui-col-sm4 layui-col-md6 layui-text-right">
                            <div className="layui-header-badge layui-font-white layui-font-lg">
                                <i className="layui-icon layui-icon-ok-circle layui-font-white layui-icon-gap-md"></i>
                                <span className="layui-font-white">
                  <span className="layui-font-2xl layui-font-bold layui-font-white layui-mr5">{filteredCompanies.length}</span> 家企业
                </span>
                            </div>
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
                    <FilterSidebar
                        filters={filterSections}
                        onReset={handleResetFilters}
                        hasActiveFilters={hasActiveFilters}
                    />
                </div>

                {/* 企业列表 */}
                <div className="layui-col-md9">
                    {/* 结果统计 */}
                    <div className="layui-card layui-card-enhanced layui-mb15">
                        <div className="layui-card-body layui-p20">
                            <div className="layui-flex layui-flex-between layui-flex-wrap layui-m-5 layui-flex-items-center">
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
                                <div className="layui-flex layui-flex-center layui-gap-10 layui-flex-nowrap">
                                    <i className="layui-icon layui-icon-template-1 layui-font-gray layui-mr5"></i>
                                    <span className="layui-font-sm layui-font-gray-light layui-flex-shrink-0">排序：</span>
                                    <select className="layui-input layui-inline layui-inline-sort layui-mr5 layui-font-sm" style={{width: "auto", minWidth: "120px"}}>
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
                                    <CompanyCard company={company}/>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="layui-card layui-card-enhanced layui-text-center layui-p60-20">
                            <div className="layui-empty-icon-80">🏢</div>
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
