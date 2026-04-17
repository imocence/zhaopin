'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { companyService, jobService, userService } from '@/lib/utils/data';

declare global {
  interface Window {
    layui: any;
  }
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCompanies: 0,
    verifiedCompanies: 0,
    totalJobs: 0,
    activeJobs: 0,
    totalViews: 0,
    newJobsToday: 0,
    serverTime: ''
  });

  useEffect(() => {
    updateServerTime();
    const timeInterval = setInterval(updateServerTime, 1000);
    return () => clearInterval(timeInterval);
  }, []);

  useEffect(() => {
    fetchStats();
  }, []);

  const updateServerTime = useCallback(() => {
    const now = new Date();
    const timeStr = now.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    setStats(prev => ({ ...prev, serverTime: timeStr }));
  }, []);

  const fetchStats = () => {
    const users = userService.getAll();
    const companies = companyService.getAll();
    const jobs = jobService.getAll();
    const verifiedCompanies = companyService.getVerified();
    const activeJobs = jobs.filter(j => j.status === 'active');

    const today = new Date().toDateString();
    const newJobsToday = jobs.filter(j => {
      const createdDate = new Date(j.createdAt).toDateString();
      return createdDate === today;
    }).length;

    const totalViews = jobs.reduce((sum, j) => sum + (j.views || 0), 0);

    setStats({
      totalUsers: users.length,
      totalCompanies: companies.length,
      verifiedCompanies: verifiedCompanies.length,
      totalJobs: jobs.length,
      activeJobs: activeJobs.length,
      totalViews,
      newJobsToday,
      serverTime: stats.serverTime
    });
  };

  const quickActions = [
    {
      title: '用户管理',
      icon: 'layui-icon-user',
      color: 'layui-btn-normal',
      href: '/admin/users',
      desc: '管理平台用户'
    },
    {
      title: '企业管理',
      icon: 'layui-icon-group',
      color: 'layui-btn-warm',
      href: '/admin/companies',
      desc: '审核企业认证'
    },
    {
      title: '职位管理',
      icon: 'layui-icon-file',
      color: 'layui-btn-cyan',
      href: '/admin/jobs',
      desc: '管理职位信息'
    },
    {
      title: '举报管理',
      icon: 'layui-icon-tips',
      color: 'layui-btn-danger',
      href: '/admin/reports',
      desc: '处理用户举报'
    },
  ];

  return (
    <div className="layui-fluid">
      {/* 欢迎横幅 */}
      <div className="layui-card mb-4">
        <div className="layui-card-body">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                欢迎使用168招聘网后台管理系统
              </h1>
              <p className="text-gray-600">
                服务器时间: <span className="layui-badge layui-bg-blue">{stats.serverTime}</span>
              </p>
            </div>
            <button className="layui-btn layui-btn-sm" onClick={fetchStats}>
              <i className="layui-icon layui-icon-refresh"></i> 刷新数据
            </button>
          </div>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="layui-row layui-col-space15 mb-4">
        <div className="layui-col-md3">
          <div className="layui-card hover:shadow-lg transition-shadow">
            <div className="layui-card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">注册用户</p>
                  <h3 className="text-3xl font-bold text-[var(--layui-primary)]">{stats.totalUsers}</h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-[var(--layui-primary)]/10 flex items-center justify-center">
                  <i className="layui-icon layui-icon-user text-2xl text-[var(--layui-primary)]"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="layui-col-md3">
          <div className="layui-card hover:shadow-lg transition-shadow">
            <div className="layui-card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">入驻企业</p>
                  <h3 className="text-3xl font-bold text-[var(--layui-blue)]">{stats.totalCompanies}</h3>
                  <p className="text-xs text-gray-500 mt-1">已认证 {stats.verifiedCompanies}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-[var(--layui-blue)]/10 flex items-center justify-center">
                  <i className="layui-icon layui-icon-group text-2xl text-[var(--layui-blue)]"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="layui-col-md3">
          <div className="layui-card hover:shadow-lg transition-shadow">
            <div className="layui-card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">职位总数</p>
                  <h3 className="text-3xl font-bold text-[var(--layui-orange)]">{stats.totalJobs}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    在招 {stats.activeJobs} | 今日 +{stats.newJobsToday}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-[var(--layui-orange)]/10 flex items-center justify-center">
                  <i className="layui-icon layui-icon-file text-2xl text-[var(--layui-orange)]"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="layui-col-md3">
          <div className="layui-card hover:shadow-lg transition-shadow">
            <div className="layui-card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">总浏览量</p>
                  <h3 className="text-3xl font-bold text-[var(--layui-red)]">{stats.totalViews}</h3>
                  <p className="text-xs text-gray-500 mt-1">累计访问</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-[var(--layui-red)]/10 flex items-center justify-center">
                  <i className="layui-icon layui-icon-chart text-2xl text-[var(--layui-red)]"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 最新职位和快捷操作 */}
      <div className="layui-row layui-col-space15">
        <div className="layui-col-md8">
          <div className="layui-card">
            <div className="layui-card-header flex items-center justify-between">
              <span>
                <i className="layui-icon layui-icon-template-1"></i> 最新发布的职位
              </span>
              <Link href="/admin/jobs" className="text-sm text-[var(--layui-primary)] hover:underline">
                查看全部
              </Link>
            </div>
            <div className="layui-card-body">
              <table className="layui-table" lay-skin="line">
                <colgroup>
                  <col width="40%" />
                  <col width="30%" />
                  <col width="30%" />
                </colgroup>
                <thead>
                  <tr>
                    <th>职位名称</th>
                    <th>公司</th>
                    <th>发布时间</th>
                  </tr>
                </thead>
                <tbody>
                  {jobService.getLatestJobs(5).map((job) => {
                    const company = companyService.getById(job.companyId);
                    return (
                      <tr key={job.id}>
                        <td>
                          <Link href={`/jobs/${job.id}`} target="_blank" className="text-[var(--layui-primary)] hover:underline">
                            {job.title}
                          </Link>
                        </td>
                        <td>{company?.name || '未知'}</td>
                        <td>{new Date(job.createdAt).toLocaleDateString('zh-CN')}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="layui-col-md4">
          <div className="layui-card">
            <div className="layui-card-header">
              <i className="layui-icon layui-icon-util"></i> 快捷操作
            </div>
            <div className="layui-card-body">
              <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                {quickActions.map((action) => (
                  <Link
                    key={action.href}
                    href={action.href}
                    className={`layui-btn ${action.color}`}
                    style={{flex: '0 0 calc(50% - 4px)', minWidth: '0'}}
                  >
                    <i className={`layui-icon ${action.icon}`}></i> {action.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
