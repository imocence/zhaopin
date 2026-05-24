'use client';

import React, {useState} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {categoryService, jobService, locationService} from '@/lib/utils/data';
import {JobFilters} from '@/types';
import {EDUCATION_OPTIONS, EXPERIENCE_OPTIONS} from '@/lib/constants';
import JobList from '@/components/job/JobList';
import {FilterSection, FilterSidebar} from '@/components/filter';

export default function JobsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [filters, setFilters] = useState<JobFilters>({
        keyword: searchParams.get('keyword') || '',
        category: searchParams.get('category') || '',
        state: searchParams.get('state') || '',
        city: searchParams.get('city') || '',
        salaryMin: searchParams.get('salaryMin') ? Number(searchParams.get('salaryMin')) : undefined,
        salaryMax: searchParams.get('salaryMax') ? Number(searchParams.get('salaryMax')) : undefined,
        experience: searchParams.get('experience') || '',
        education: searchParams.get('education') || '',
    });
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const categories = categoryService.getAllSubcategories();
    const locations = locationService.getAll();

    const {data: jobs, pagination} = jobService.search(filters, page, pageSize);

    const handleFilterChange = (key: keyof JobFilters, value: any) => {
        const newFilters = {...filters, [key]: value};
        setFilters(newFilters);
        setPage(1);

        const params = new URLSearchParams();
        Object.entries(newFilters).forEach(([k, v]) => {
            if (v !== undefined && v !== '') {
                params.set(k, String(v));
            }
        });
        const queryString = params.toString();
        router.push(queryString ? `/jobs?${queryString}` : '/jobs');
    };

    const handleQuickFilter = (newFilters: Partial<JobFilters>) => {
        setFilters({...filters, ...newFilters});
        setPage(1);

        const params = new URLSearchParams();
        Object.entries({...filters, ...newFilters}).forEach(([k, v]) => {
            if (v !== undefined && v !== '') {
                params.set(k, String(v));
            }
        });
        const queryString = params.toString();
        router.push(queryString ? `/jobs?${queryString}` : '/jobs');
    };

    const handleResetFilters = () => {
        setFilters({});
        setPage(1);
        router.push('/jobs');
    };

    const hasActiveFilters = () => {
        return Object.entries(filters).some(([key, value]) => {
            if (value === undefined || value === null || value === '') {
                return false;
            }
            return true;
        });
    };

    const [sortBy, setSortBy] = useState('latest');

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    const handleSortChange = (value: string) => {
        setSortBy(value);
        setPage(1);
    };

    // 准备筛选配置
    const filterSections: FilterSection[] = [
        {
            key: 'keyword',
            label: '关键词',
            icon: 'layui-icon-search',
            type: 'text',
            placeholder: '搜索职位、公司...',
            value: filters.keyword,
            onChange: (value) => handleFilterChange('keyword', value)
        },
        {
            key: 'category',
            label: '职位分类',
            icon: 'layui-icon-file',
            type: 'select',
            options: categories.map(cat => ({value: cat, label: cat})),
            value: filters.category,
            onChange: (value) => handleFilterChange('category', value)
        },
        {
            key: 'state',
            label: '州/地区',
            icon: 'layui-icon-location',
            type: 'select',
            options: locations.map(loc => ({value: loc.stateCode, label: loc.name})),
            value: filters.state,
            onChange: (value) => handleFilterChange('state', value)
        },
        ...(filters.state ? [{
            key: 'city' as const,
            label: '城市',
            icon: 'layui-icon-engine',
            type: 'select' as const,
            options: locationService.getCitiesByState(filters.state).map(city => ({value: city, label: city})),
            value: filters.city,
            onChange: (value: string) => handleFilterChange('city', value)
        }] : []),
        {
            key: 'experience',
            label: '经验要求',
            icon: 'layui-icon-date',
            type: 'select',
            options: EXPERIENCE_OPTIONS.map(opt => ({value: opt.value, label: opt.label})),
            value: filters.experience,
            onChange: (value) => handleFilterChange('experience', value)
        },
        {
            key: 'education',
            label: '学历要求',
            icon: 'layui-icon-read',
            type: 'select',
            options: EDUCATION_OPTIONS.map(opt => ({value: opt.value, label: opt.label})),
            value: filters.education,
            onChange: (value) => handleFilterChange('education', value)
        },
        {
            key: 'salary',
            label: '年薪范围',
            icon: 'layui-icon-rmb',
            type: 'number-range',
            value: {min: filters.salaryMin, max: filters.salaryMax},
            onChange: (value) => {
                handleFilterChange('salaryMin', value.min);
                handleFilterChange('salaryMax', value.max);
            }
        }
    ];

    return (
        <div className="layui-container layui-mt20">
            {/* 页面头部 */}
            <div className="layui-card layui-page-header layui-mb25">
                <div className="layui-card-body layui-page-header-body layui-bg-gradient-cyan">
                    {/* 装饰性背景元素 */}
                    <div className="layui-header-decoration layui-header-decoration-lg"></div>
                    <div className="layui-header-decoration layui-header-decoration-sm"></div>

                    <div className="layui-row layui-row-flex layui-row-middle">
                        <div className="layui-col-xs8 layui-col-sm8 layui-col-md6">
                            <div className="layui-flex layui-flex-middle">
                                <div className="layui-header-icon layui-mr20">
                                    <i className="layui-icon layui-icon-search layui-font-white layui-font-3xl"></i>
                                </div>
                                <div>
                                    <h1 className="layui-font-title layui-font-white layui-font-bold layui-mb5">职位搜索</h1>
                                    <p className="layui-font-sm layui-font-gray-light layui-mt0 layui-mb0">发现理想工作，开启职业新篇章</p>
                                </div>
                            </div>
                        </div>
                        <div className="layui-col-xs4 layui-col-sm4 layui-col-md6 layui-text-right">
                            <div className="layui-header-badge layui-font-white layui-font-lg">
                                <i className="layui-icon layui-icon-ok-circle layui-font-white layui-icon-gap-md"></i>
                                <span className="layui-font-white">
                  <span className="layui-font-2xl layui-font-bold layui-font-white layui-mr5">{pagination.total}</span> 个职位
                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 快捷筛选标签 */}
            <div className="layui-card layui-mt20 layui-mb20 layui-card-enhanced">
                <div className="layui-card-body layui-p20">
                    <span className="layui-font-sm layui-font-gray-light layui-font-bold layui-mr20">热门搜索：</span>
                    <div className="layui-flex layui-flex-wrap layui-gap-10">
            <span
                className="layui-filter-tag layui-filter-tag-cyan"
                onClick={() => handleQuickFilter({category: '软件工程师'})}
            >
              <i className="layui-icon layui-icon-engine layui-icon-gap-sm"></i>
              软件工程师
            </span>
                        <span
                            className="layui-filter-tag layui-filter-tag-green"
                            onClick={() => handleQuickFilter({state: 'CA'})}
                        >
              <i className="layui-icon layui-icon-location layui-icon-gap-sm"></i>
              加州
            </span>
                        <span
                            className="layui-filter-tag layui-filter-tag-orange"
                            onClick={() => handleQuickFilter({state: 'NY'})}
                        >
              <i className="layui-icon layui-icon-location layui-icon-gap-sm"></i>
              纽约
            </span>
                        <span
                            className="layui-filter-tag layui-filter-tag-red"
                            onClick={() => handleQuickFilter({salaryMin: 80000})}
                        >
              <i className="layui-icon layui-icon-rmb layui-icon-gap-sm"></i>
              高薪职位
            </span>
                        <span
                            className="layui-filter-tag layui-filter-tag-purple"
                            onClick={() => handleQuickFilter({experience: '3年以上'})}
                        >
              <i className="layui-icon layui-icon-date layui-icon-gap-sm"></i>
              3年以上经验
            </span>
                    </div>
                </div>
            </div>

            <div className="layui-row layui-col-space20 layui-mt20">
                {/* 筛选侧边栏 */}
                <div className="layui-col-md3">
                    <FilterSidebar
                        filters={filterSections}
                        onReset={handleResetFilters}
                        hasActiveFilters={hasActiveFilters()}
                    />
                </div>
                {/* 职位列表 */}
                <div className="layui-col-md9">
                {/* 排序选项 */}
                <div className="layui-card layui-card-enhanced layui-mb15">
                    <div className="layui-card-body layui-p20">
                        <div className="layui-flex layui-flex-between layui-flex-wrap layui-m-5">
                            <div className="layui-flex layui-flex-center layui-gap-10">
                                <i className="layui-icon layui-icon-list layui-font-gray layui-mr5"></i>
                                <span className="layui-font-sm layui-font-gray-light">
                    显示 <span className="layui-font-lg layui-font-bold layui-font-blue">
                      {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, pagination.total)}
                    </span> 条，
                    共 <span className="layui-font-lg layui-font-bold layui-font-blue">{pagination.total}</span> 条
                  </span>
                            </div>
                            <div className="layui-flex layui-flex-center layui-gap-10">
                                <i className="layui-icon layui-icon-template-1 layui-font-gray layui-mr5"></i>
                                <span className="layui-font-sm layui-font-gray-light">排序：</span>
                                <select
                                    className="layui-input layui-inline-sort layui-mr5 layui-font-sm"
                                    value={sortBy}
                                    onChange={(e) => handleSortChange(e.target.value)}
                                >
                                    <option value="latest">最新发布</option>
                                    <option value="salary-high">薪资从高到低</option>
                                    <option value="salary-low">薪资从低到高</option>
                                    <option value="views">浏览最多</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <JobList
                    jobs={jobs}
                    total={pagination.total}
                    page={page}
                    pageSize={pageSize}
                    onPageChange={handlePageChange}
                />
            </div>
            </div>
        </div>
    );
}