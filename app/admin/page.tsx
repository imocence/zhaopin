'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { companyService, jobService, userService } from '@/lib/services/data';

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

  const [latestJobs, setLatestJobs] = useState<any[]>([]);


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

  const fetchStats = useCallback(async () => {
    const [users, companies, jobs, verifiedCompanies, latest] = await Promise.all([
      userService.getAll(),
      companyService.getAll(),
      jobService.getAll(),
      companyService.getVerified(),
      jobService.getLatestJobs(5),
    ]);
    const activeJobs = jobs.filter(j => j.status === 'active');

    const today = new Date().toDateString();
    const newJobsToday = jobs.filter(j => {
      const createdDate = new Date(j.createdAt).toDateString();
      return createdDate === today;
    }).length;

    const totalViews = jobs.reduce((sum, j) => sum + (j.views || 0), 0);

    setStats(prev => ({
      totalUsers: users.length,
      totalCompanies: companies.length,
      verifiedCompanies: verifiedCompanies.length,
      totalJobs: jobs.length,
      activeJobs: activeJobs.length,
      totalViews,
      newJobsToday,
      serverTime: prev.serverTime
    }));

    setLatestJobs(latest);
  }, []);

  useEffect(() => {
    updateServerTime();
    const timeInterval = setInterval(updateServerTime, 1000);
    return () => clearInterval(timeInterval);
  }, [updateServerTime]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

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
      <div className="layui-row layui-col-space20">
        <div className="layui-col-xs12">
          <fieldset className="layui-elem-field layui-field-title">
            <legend>后台仪表盘</legend>
            <div className="layui-field-box">
              <p>欢迎使用 168 招聘网后台管理系统，当前服务器时间：<span className="layui-badge layui-bg-blue">{stats.serverTime}</span></p>
              <button className="layui-btn layui-btn-sm layui-btn-normal" onClick={fetchStats}>
                <i className="layui-icon layui-icon-refresh"></i> 刷新数据
              </button>
            </div>
          </fieldset>
        </div>
      </div>

      <div className="layui-row layui-col-space15 layui-mt20">
        <div className="layui-col-md3 layui-col-sm6 layui-col-xs12">
          <div className="layui-card">
            <div className="layui-card-body">
              <p className="layui-text">注册用户</p>
              <h2 className="layui-font-title layui-mt10">{stats.totalUsers}</h2>
              <p className="layui-font-gray">当前注册总数</p>
            </div>
          </div>
        </div>

        <div className="layui-col-md3 layui-col-sm6 layui-col-xs12">
          <div className="layui-card">
            <div className="layui-card-body">
              <p className="layui-text">入驻企业</p>
              <h2 className="layui-font-title layui-mt10">{stats.totalCompanies}</h2>
              <p className="layui-font-gray">已认证企业 {stats.verifiedCompanies}</p>
            </div>
          </div>
        </div>

        <div className="layui-col-md3 layui-col-sm6 layui-col-xs12">
          <div className="layui-card">
            <div className="layui-card-body">
              <p className="layui-text">职位总数</p>
              <h2 className="layui-font-title layui-mt10">{stats.totalJobs}</h2>
              <p className="layui-font-gray">在招 {stats.activeJobs}，今日新增 {stats.newJobsToday}</p>
            </div>
          </div>
        </div>

        <div className="layui-col-md3 layui-col-sm6 layui-col-xs12">
          <div className="layui-card">
            <div className="layui-card-body">
              <p className="layui-text">总浏览量</p>
              <h2 className="layui-font-title layui-mt10">{stats.totalViews}</h2>
              <p className="layui-font-gray">平台累计访问</p>
            </div>
          </div>
        </div>
      </div>

      <div className="layui-row layui-col-space15 layui-mt20">
        <div className="layui-col-md8 layui-col-xs12">
          <div className="layui-card">
            <div className="layui-card-header">
              <i className="layui-icon layui-icon-chart-screen"></i> 最新发布的职位
              <Link href="/admin/jobs" className="layui-btn layui-btn-sm layui-btn-primary layui-float-right">
                查看全部
              </Link>
            </div>
            <div className="layui-card-body">
              <table className="layui-table" lay-skin="line">
                <colgroup>
                  <col width="45%" />
                  <col width="30%" />
                  <col width="25%" />
                </colgroup>
                <thead>
                  <tr>
                    <th>职位名称</th>
                    <th>公司</th>
                    <th>发布时间</th>
                  </tr>
                </thead>
                <tbody>
                  {latestJobs.map((job) => {
                    const companies = (window as any).companies || [];
                    const company = companies.find((c: any) => c.id === job.companyId);
                    return (
                      <tr key={job.id}>
                        <td>
                          <Link href={`/jobs/${job.id}`} target="_blank" className="layui-link">
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

        <div className="layui-col-md4 layui-col-xs12">
          <div className="layui-card">
            <div className="layui-card-header">
              <i className="layui-icon layui-icon-util"></i> 快捷操作
            </div>
            <div className="layui-card-body">
              <div className="layui-btn-container">
                {quickActions.map((action) => (
                  <Link
                    key={action.href}
                    href={action.href}
                    className={`layui-btn ${action.color} layui-btn-fluid layui-mb10`}
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
