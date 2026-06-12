'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import UnifiedSidebar from '@/components/layout/UnifiedSidebar';
import { companyService, jobService } from '@/lib/services/data';
import { Company, Job } from '@/types';

export default function EmployerDashboardPage() {
  const [currentCompany, setCurrentCompany] = useState<Company | undefined>(undefined);
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 45,
    pendingReview: 8,
    totalViews: 1234,
  });

  useEffect(() => {
    async function loadData() {
      const verified = await companyService.getVerified();
      const company = verified[0];
      setCurrentCompany(company);

      if (company) {
        const jobs = await jobService.getByCompanyId(company.id);
        setStats(prev => ({
          ...prev,
          activeJobs: jobs.filter(j => j.status === 'active').length,
        }));
      }
    }
    loadData();
  }, []);

  // 侧边栏菜单项
  const sidebarItems = [
    {
      key: 'dashboard',
      label: '控制台',
      icon: '📊',
      href: '/employer',
    },
    {
      key: 'jobs',
      label: '职位管理',
      icon: '💼',
      href: '/employer/jobs',
    },
    {
      key: 'applications',
      label: '收到的申请',
      icon: '📝',
      href: '/employer/applications',
      badge: stats.pendingReview,
    },
    {
      key: 'interviews',
      label: '面试安排',
      icon: '📅',
      href: '/employer/interviews',
    },
    {
      key: 'company',
      label: '企业信息',
      icon: '🏢',
      href: '/employer/company',
    },
    {
      key: 'messages',
      label: '消息通知',
      icon: '💬',
      href: '/employer/messages',
      badge: 3,
    },
  ];

  // 获取最新申请
  const recentApplications = [
    {
      id: '1',
      jobTitle: '高级软件工程师',
      applicantName: '张三',
      email: 'zhangsan@example.com',
      phone: '123-456-7890',
      appliedAt: '2026-04-15',
      status: 'pending',
    },
    {
      id: '2',
      jobTitle: '市场专员',
      applicantName: '李四',
      email: 'lisi@example.com',
      phone: '234-567-8901',
      appliedAt: '2026-04-14',
      status: 'reviewed',
    },
    {
      id: '3',
      jobTitle: 'UI设计师',
      applicantName: '王五',
      email: 'wangwu@example.com',
      phone: '345-678-9012',
      appliedAt: '2026-04-13',
      status: 'interview',
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { text: string; class: string } } = {
      pending: { text: '待处理', class: 'layui-bg-orange' },
      reviewed: { text: '已查看', class: 'layui-bg-blue' },
      interview: { text: '面试中', class: 'layui-bg-green' },
      hired: { text: '已录用', class: 'layui-bg-primary' },
      rejected: { text: '已拒绝', class: 'layui-bg-gray' },
    };
    const s = statusMap[status] || { text: status, class: '' };
    return <span className={`layui-badge ${s.class}`}>{s.text}</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* 侧边栏 */}
          <UnifiedSidebar items={sidebarItems} variant="employer" />

          {/* 主内容区 */}
          <div className="flex-1">
            {/* 欢迎卡片 */}
            <div className="layui-card mb-6">
              <div className="layui-card-body">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  欢迎回来，{currentCompany?.name}！
                </h2>
                <p className="text-gray-600">
                  {currentCompany?.verified ? (
                    <span className="layui-badge layui-bg-blue">已认证企业</span>
                  ) : (
                    <span className="layui-badge layui-bg-orange">未认证企业</span>
                  )}
                </p>
              </div>
            </div>

            {/* 统计数据 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="layui-card">
                <div className="layui-card-body text-center">
                  <div className="text-3xl font-bold text-[var(--layui-primary)]">{stats.activeJobs}</div>
                  <div className="text-sm text-gray-600">在招职位</div>
                </div>
              </div>
              <div className="layui-card">
                <div className="layui-card-body text-center">
                  <div className="text-3xl font-bold text-[var(--layui-blue)]">{stats.totalApplications}</div>
                  <div className="text-sm text-gray-600">收到申请</div>
                </div>
              </div>
              <div className="layui-card">
                <div className="layui-card-body text-center">
                  <div className="text-3xl font-bold text-[var(--layui-orange)]">{stats.pendingReview}</div>
                  <div className="text-sm text-gray-600">待处理申请</div>
                </div>
              </div>
              <div className="layui-card">
                <div className="layui-card-body text-center">
                  <div className="text-3xl font-bold text-[var(--layui-green)]">{stats.totalViews}</div>
                  <div className="text-sm text-gray-600">职位浏览量</div>
                </div>
              </div>
            </div>

            {/* 快捷操作 */}
            <div className="layui-card mb-6">
              <div className="layui-card-header">快捷操作</div>
              <div className="layui-card-body">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link href="/post" className="layui-card hover:shadow-md transition-shadow text-center">
                    <div className="layui-card-body py-6">
                      <div className="text-3xl mb-2">➕</div>
                      <div className="text-sm font-medium">发布新职位</div>
                    </div>
                  </Link>
                  <Link href="/employer/jobs" className="layui-card hover:shadow-md transition-shadow text-center">
                    <div className="layui-card-body py-6">
                      <div className="text-3xl mb-2">💼</div>
                      <div className="text-sm font-medium">管理职位</div>
                    </div>
                  </Link>
                  <Link href="/employer/applications" className="layui-card hover:shadow-md transition-shadow text-center">
                    <div className="layui-card-body py-6">
                      <div className="text-3xl mb-2">📝</div>
                      <div className="text-sm font-medium">查看申请</div>
                    </div>
                  </Link>
                  <Link href="/employer/company" className="layui-card hover:shadow-md transition-shadow text-center">
                    <div className="layui-card-body py-6">
                      <div className="text-3xl mb-2">🏢</div>
                      <div className="text-sm font-medium">企业信息</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* 最新申请 */}
            <div className="layui-card">
              <div className="layui-card-header flex items-center justify-between">
                <span>最新申请</span>
                <Link href="/employer/applications" className="text-sm text-[var(--layui-primary)] hover:underline">
                  查看全部 →
                </Link>
              </div>
              <div className="layui-card-body">
                <div className="space-y-4">
                  {recentApplications.map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-medium text-gray-900">{app.applicantName}</h4>
                          {getStatusBadge(app.status)}
                        </div>
                        <p className="text-sm text-gray-600">{app.jobTitle}</p>
                        <div className="flex gap-4 mt-1 text-xs text-gray-500">
                          <span>📧 {app.email}</span>
                          <span>📱 {app.phone}</span>
                          <span>📅 {app.appliedAt}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="layui-btn layui-btn-sm layui-btn-primary">
                          查看简历
                        </button>
                        <button className="layui-btn layui-btn-sm">
                          联系
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
