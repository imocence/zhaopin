'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import EmployerSidebar from '@/components/layout/EmployerSidebar';
import { jobService, companyService } from '@/lib/utils/data';
import { formatDate } from '@/lib/utils/format';

export default function EmployerJobsPage() {
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'draft'>('all');
  const [searchKeyword, setSearchKeyword] = useState('');

  // 模拟当前企业
  const currentCompany = companyService.getVerified()[0];

  // 获取企业职位
  const allJobs = useMemo(() => {
    return jobService.getByCompanyId(currentCompany?.id || '');
  }, [currentCompany]);

  // 筛选职位
  const filteredJobs = useMemo(() => {
    let result = allJobs;

    // 状态筛选
    if (filter !== 'all') {
      result = result.filter(job => {
        if (filter === 'active') return job.status === 'active';
        if (filter === 'inactive') return job.status === 'inactive';
        if (filter === 'draft') return job.status === 'draft';
        return true;
      });
    }

    // 关键词搜索
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      result = result.filter(job =>
        job.title.toLowerCase().includes(keyword) ||
        job.category.toLowerCase().includes(keyword)
      );
    }

    return result;
  }, [allJobs, filter, searchKeyword]);

  // 统计数据
  const stats = {
    all: allJobs.length,
    active: allJobs.filter(j => j.status === 'active').length,
    inactive: allJobs.filter(j => j.status === 'inactive').length,
    draft: allJobs.filter(j => j.status === 'draft').length,
  };

  // 侧边栏菜单
  const sidebarItems = [
    { key: 'dashboard', label: '控制台', icon: '📊', href: '/employer' },
    { key: 'jobs', label: '职位管理', icon: '💼', href: '/employer/jobs' },
    { key: 'applications', label: '收到的申请', icon: '📝', href: '/employer/applications', badge: 8 },
    { key: 'interviews', label: '面试安排', icon: '📅', href: '/employer/interviews' },
    { key: 'company', label: '企业信息', icon: '🏢', href: '/employer/company' },
    { key: 'messages', label: '消息通知', icon: '💬', href: '/employer/messages', badge: 3 },
  ];

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { text: string; class: string } } = {
      active: { text: '招聘中', class: 'layui-bg-green' },
      inactive: { text: '已下架', class: 'layui-bg-gray' },
      draft: { text: '草稿', class: 'layui-bg-orange' },
      closed: { text: '已关闭', class: 'layui-bg-red' },
    };
    const s = statusMap[status] || { text: status, class: '' };
    return <span className={`layui-badge ${s.class}`}>{s.text}</span>;
  };

  const handleToggleStatus = (jobId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    // TODO: 调用 API 更新职位状态
    console.log(`Toggle job ${jobId} from ${currentStatus} to ${newStatus}`);
  };

  const handleDelete = (jobId: string) => {
    if (confirm('确定要删除这个职位吗？')) {
      // TODO: 调用 API 删除职位
      console.log(`Delete job ${jobId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* 侧边栏 */}
          <EmployerSidebar items={sidebarItems} />

          {/* 主内容区 */}
          <div className="flex-1">
            {/* 页面标题和操作 */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">职位管理</h1>
              <Link href="/post" className="layui-btn">
                ➕ 发布新职位
              </Link>
            </div>

            {/* 筛选栏 */}
            <div className="layui-card mb-6">
              <div className="layui-card-body">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* 状态筛选 */}
                  <div className="flex gap-2">
                    <button
                      className={`layui-btn layui-btn-sm ${filter === 'all' ? 'layui-btn-primary' : 'layui-btn-outline'}`}
                      onClick={() => setFilter('all')}
                    >
                      全部 ({stats.all})
                    </button>
                    <button
                      className={`layui-btn layui-btn-sm ${filter === 'active' ? 'layui-btn-primary' : 'layui-btn-outline'}`}
                      onClick={() => setFilter('active')}
                    >
                      招聘中 ({stats.active})
                    </button>
                    <button
                      className={`layui-btn layui-btn-sm ${filter === 'inactive' ? 'layui-btn-primary' : 'layui-btn-outline'}`}
                      onClick={() => setFilter('inactive')}
                    >
                      已下架 ({stats.inactive})
                    </button>
                    <button
                      className={`layui-btn layui-btn-sm ${filter === 'draft' ? 'layui-btn-primary' : 'layui-btn-outline'}`}
                      onClick={() => setFilter('draft')}
                    >
                      草稿 ({stats.draft})
                    </button>
                  </div>

                  {/* 搜索框 */}
                  <div className="flex-1 max-w-md">
                    <input
                      type="text"
                      placeholder="搜索职位名称、分类..."
                      className="layui-input"
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 职位列表 */}
            {filteredJobs.length > 0 ? (
              <div className="layui-card">
                <div className="layui-card-body p-0">
                  <table className="layui-table">
                    <thead>
                      <tr>
                        <th>职位名称</th>
                        <th>分类</th>
                        <th>工作地点</th>
                        <th>薪资</th>
                        <th>申请数</th>
                        <th>浏览量</th>
                        <th>发布时间</th>
                        <th>状态</th>
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredJobs.map((job) => (
                        <tr key={job.id}>
                          <td>
                            <Link href={`/jobs/${job.id}`} className="text-[var(--layui-primary)] hover:underline">
                              {job.title}
                            </Link>
                          </td>
                          <td>{job.category}</td>
                          <td>{job.location}, {job.state}</td>
                          <td>
                            ${job.salaryMin} - ${job.salaryMax}
                            <span className="text-xs text-gray-500 ml-1">
                              {job.salaryType === 'hourly' ? '/时' : job.salaryType === 'monthly' ? '/月' : '/年'}
                            </span>
                          </td>
                          <td>{job.applications}</td>
                          <td>{job.views}</td>
                          <td>{formatDate(job.createdAt)}</td>
                          <td>{getStatusBadge(job.status)}</td>
                          <td>
                            <div className="flex gap-2">
                              <button
                                className={`layui-btn layui-btn-xs ${job.status === 'active' ? 'layui-btn-warm' : 'layui-btn-primary'}`}
                                onClick={() => handleToggleStatus(job.id, job.status)}
                                title={job.status === 'active' ? '下架' : '上架'}
                              >
                                {job.status === 'active' ? '下架' : '上架'}
                              </button>
                              <Link
                                href={`/employer/jobs/${job.id}/edit`}
                                className="layui-btn layui-btn-xs layui-btn-normal"
                              >
                                编辑
                              </Link>
                              <button
                                className="layui-btn layui-btn-xs layui-btn-danger"
                                onClick={() => handleDelete(job.id)}
                              >
                                删除
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="layui-card">
                <div className="layui-card-body text-center py-12">
                  <div className="text-6xl mb-4">💼</div>
                  <p className="text-gray-600 mb-4">
                    {searchKeyword || filter !== 'all' ? '没有符合条件的职位' : '还没有发布任何职位'}
                  </p>
                  {!searchKeyword && filter === 'all' && (
                    <Link href="/post" className="layui-btn">
                      发布第一个职位
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
