'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import UnifiedSidebar from '@/components/layout/UnifiedSidebar';
import { jobService, companyService } from '@/lib/utils/data';
import { formatDate } from '@/lib/utils/format';
import { getApplicationStatusBadge } from '@/lib/utils/status';

type ApplicationStatus = 'all' | 'pending' | 'viewed' | 'interview' | 'offered' | 'rejected';

export default function UserApplicationsPage() {
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus>('all');

  const sidebarItems = [
    { key: 'profile', label: '个人信息', icon: '👤', href: '/user/profile' },
    { key: 'applications', label: '我的申请', icon: '📝', href: '/user/applications' },
    { key: 'favorites', label: '收藏职位', icon: '⭐', href: '/user/favorites', badge: 12 },
    { key: 'messages', label: '消息通知', icon: '💬', href: '/user/messages', badge: 5 },
    { key: 'settings', label: '账号设置', icon: '⚙️', href: '/user/settings' },
  ];

  // 模拟申请数据
  const applications = [
    {
      id: '1',
      jobId: 'job1',
      jobTitle: '高级软件工程师',
      company: companyService.getAll()[0],
      appliedAt: '2026-04-15',
      status: 'pending' as const,
      lastUpdate: '2026-04-15',
    },
    {
      id: '2',
      jobId: 'job2',
      jobTitle: '前端开发工程师',
      company: companyService.getAll()[1],
      appliedAt: '2026-04-10',
      status: 'viewed' as const,
      lastUpdate: '2026-04-11',
    },
    {
      id: '3',
      jobId: 'job3',
      jobTitle: '全栈工程师',
      company: companyService.getAll()[2],
      appliedAt: '2026-04-05',
      status: 'interview' as const,
      lastUpdate: '2026-04-12',
    },
    {
      id: '4',
      jobId: 'job4',
      jobTitle: '产品经理',
      company: companyService.getAll()[3],
      appliedAt: '2026-03-28',
      status: 'offered' as const,
      lastUpdate: '2026-04-08',
    },
    {
      id: '5',
      jobId: 'job5',
      jobTitle: 'UI设计师',
      company: companyService.getAll()[4],
      appliedAt: '2026-03-20',
      status: 'rejected' as const,
      lastUpdate: '2026-03-25',
    },
  ];



  const filteredApplications = statusFilter === 'all'
    ? applications
    : applications.filter(app => app.status === statusFilter);

  const stats = {
    all: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    viewed: applications.filter(a => a.status === 'viewed').length,
    interview: applications.filter(a => a.status === 'interview').length,
    offered: applications.filter(a => a.status === 'offered').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  return (
    <div className="layui-container layui-mt20">
      <div className="layui-row layui-col-space20">
        {/* 侧边栏 */}
        <div className="layui-col-md3">
          <Sidebar items={sidebarItems} />
        </div>

        {/* 主内容区 */}
        <div className="layui-col-md9">
          <div className="layui-card layui-mb20">
            <div className="layui-card-body">
              <h2 style={{fontSize: '24px', fontWeight: 'bold', marginBottom: '20px'}}>我的申请</h2>

              {/* 状态筛选 */}
              <div className="layui-btn-container">
                <button
                  className={`layui-btn layui-btn-sm ${statusFilter === 'all' ? 'layui-btn-primary' : 'layui-btn-primary layui-btn-outline'}`}
                  onClick={() => setStatusFilter('all')}
                >
                  全部 ({stats.all})
                </button>
                <button
                  className={`layui-btn layui-btn-sm ${statusFilter === 'pending' ? 'layui-btn-primary' : 'layui-btn-primary layui-btn-outline'}`}
                  onClick={() => setStatusFilter('pending')}
                >
                  待处理 ({stats.pending})
                </button>
                <button
                  className={`layui-btn layui-btn-sm ${statusFilter === 'viewed' ? 'layui-btn-primary' : 'layui-btn-primary layui-btn-outline'}`}
                  onClick={() => setStatusFilter('viewed')}
                >
                  已查看 ({stats.viewed})
                </button>
                <button
                  className={`layui-btn layui-btn-sm ${statusFilter === 'interview' ? 'layui-btn-primary' : 'layui-btn-primary layui-btn-outline'}`}
                  onClick={() => setStatusFilter('interview')}
                >
                  面试中 ({stats.interview})
                </button>
                <button
                  className={`layui-btn layui-btn-sm ${statusFilter === 'offered' ? 'layui-btn-primary' : 'layui-btn-primary layui-btn-outline'}`}
                  onClick={() => setStatusFilter('offered')}
                >
                  已录用 ({stats.offered})
                </button>
                <button
                  className={`layui-btn layui-btn-sm ${statusFilter === 'rejected' ? 'layui-btn-primary' : 'layui-btn-primary layui-btn-outline'}`}
                  onClick={() => setStatusFilter('rejected')}
                >
                  已拒绝 ({stats.rejected})
                </button>
              </div>
            </div>
          </div>

          {/* 申请列表 */}
          {filteredApplications.length > 0 ? (
            filteredApplications.map((app) => (
              <div className="layui-card layui-mb15" key={app.id}>
                <div className="layui-card-body">
                  <div className="layui-row">
                    <div className="layui-col-md9">
                      <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px'}}>
                        <h3 style={{fontSize: '16px', fontWeight: 'bold'}}>
                          <Link href={`/jobs/${app.jobId}`} className="layui-font-cyan layui-text-decoration-none">
                            {app.jobTitle}
                          </Link>
                        </h3>
                        {getApplicationStatusBadge(app.status)}
                      </div>
                      <p className="layui-font-gray layui-font-sm layui-mb5">{app.company?.name}</p>
                      <div className="layui-font-xs layui-font-gray-light">
                        <span>📅 申请时间: {formatDate(app.appliedAt)}</span>
                        <span style={{marginLeft: '20px'}}>🕒 最后更新: {formatDate(app.lastUpdate)}</span>
                      </div>
                    </div>
                    <div className="layui-col-md3 layui-text-right">
                      <Link
                        href={`/jobs/${app.jobId}`}
                        className="layui-btn layui-btn-sm layui-btn-primary"
                      >
                        查看职位
                      </Link>
                      {app.status === 'offered' && (
                        <button className="layui-btn layui-btn-sm layui-btn-normal layui-mt5">
                          接受offer
                        </button>
                      )}
                      {app.status === 'interview' && (
                        <button className="layui-btn layui-btn-sm layui-btn-warm layui-mt5">
                          查看面试安排
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="layui-card">
              <div className="layui-card-body layui-text-center" style={{padding: '60px 20px'}}>
                <div style={{fontSize: '60px', marginBottom: '20px'}}>📝</div>
                <p className="layui-font-gray layui-mb20">
                  {statusFilter === 'all' ? '还没有申请任何职位' : '没有符合条件的申请记录'}
                </p>
                {statusFilter === 'all' && (
                  <Link href="/jobs" className="layui-btn">
                    去找职位
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
