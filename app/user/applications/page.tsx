'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import UnifiedSidebar from '@/components/layout/UnifiedSidebar';
import { applicationService } from '@/lib/services/data';
import { Application } from '@/types';
import { useLayuiTable } from '@/lib/hooks/useLayuiInit';
import useRequireAuth from '@/lib/hooks/useRequireAuth';
import useUserCenterCounts from '@/lib/hooks/useUserCenterCounts';

type ApplicationStatus = 'all' | 'pending' | 'reviewed' | 'interview' | 'accepted' | 'rejected';

interface LayuiTableInstance {
  reload: (options: { data: unknown[]; page: { curr: number } }) => void;
}

interface Layui {
  table: {
    render: (options: {
      elem: string;
      data: unknown[];
      page: boolean;
      limit: number;
      limits: number[];
      skin: string;
      even: boolean;
      cols: unknown[][];
    }) => LayuiTableInstance;
  };
}

export default function UserApplicationsPage() {
  const isAuth = useRequireAuth();
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus>('all');
  const [applications, setApplications] = useState<Application[]>([]);
  const tableRef = useRef<LayuiTableInstance | null>(null);
  const { counts } = useUserCenterCounts();
  const pageSize = 5;

  const sidebarItems = [
    { key: 'profile', label: '个人信息', icon: '👤', href: '/user/profile' },
    { key: 'applications', label: '我的申请', icon: '📝', href: '/user/applications', badge: counts.applications },
    { key: 'favorites', label: '收藏职位', icon: '⭐', href: '/user/favorites', badge: counts.favorites },
    { key: 'messages', label: '消息通知', icon: '💬', href: '/user/messages', badge: counts.unreadMessages },
    { key: 'settings', label: '账号设置', icon: '⚙️', href: '/user/settings' },
  ];

  useEffect(() => {
    async function loadApplications() {
      try {
        const result = await applicationService.getMine();
        setApplications(result);
      } catch (error) {
        console.error('加载申请数据失败', error);
      }
    }
    loadApplications();
  }, []);

  const filteredApplications = useMemo(
    () => (statusFilter === 'all' ? applications : applications.filter(app => app.status === statusFilter)),
    [statusFilter, applications]
  );

  const tableApplications = useMemo(
    () => filteredApplications.map(app => ({
      ...app,
      companyName: app.companyName || '-',
      appliedAt: app.createdAt,
      lastUpdate: app.updatedAt,
      statusBadgeHtml: `<span class="layui-badge ${app.status === 'pending' ? 'layui-bg-orange' : app.status === 'reviewed' ? 'layui-bg-blue' : app.status === 'interview' ? 'layui-bg-green' : app.status === 'accepted' ? 'layui-bg-primary' : 'layui-bg-gray'}>${app.status === 'pending' ? '待处理' : app.status === 'reviewed' ? '已查看' : app.status === 'interview' ? '面试中' : app.status === 'accepted' ? '已录用' : '已拒绝'}</span>`,
    })),
    [filteredApplications]
  );

  const initTable = useCallback(
    (layui: Layui) => {
      const container = document.getElementById('userApplicationsTable');
      if (!container) {
        return;
      }
      const table = layui.table;
      if (tableRef.current) {
        tableRef.current.reload({
          data: tableApplications,
          page: { curr: 1 }
        });
        return;
      }

      tableRef.current = table.render({
        elem: '#userApplicationsTable',
        data: tableApplications,
        page: true,
        limit: pageSize,
        limits: [5, 10, 20],
        skin: 'line',
        even: true,
        cols: [[
          {
            field: 'jobTitle',
            title: '职位',
            minWidth: 220,
            templet: function (d: Record<string, unknown>) {
              return `<a class="layui-font-cyan layui-text-decoration-none" href="/jobs/${d.jobId}">${d.jobTitle}</a>`;
            }
          },
          {
            field: 'companyName',
            title: '公司',
            width: 150
          },
          {
            field: 'appliedAt',
            title: '申请时间',
            width: 120
          },
          {
            field: 'lastUpdate',
            title: '最后更新',
            width: 120
          },
          {
            field: 'status',
            title: '状态',
            width: 80,
            templet: function (d: Record<string, unknown>) {
              return d.statusBadgeHtml || '';
            }
          },
          {
            field: 'actions',
            title: '操作',
            width: 240,
            align: 'center',
            templet: function (d: Record<string, unknown>) {
              const jobId = String(d.jobId ?? '');
              let buttons = `<a class="layui-btn layui-btn-sm layui-btn-primary" href="/jobs/${jobId}">查看职位</a>`;
              if (d.status === 'accepted') {
                buttons += '<button class="layui-btn layui-btn-sm layui-btn-normal">接受offer</button>';
              }
              if (d.status === 'interview') {
                buttons += '<button class="layui-btn layui-btn-sm layui-btn-warm">面试安排</button>';
              }
              return `<div class="layui-btn-group">${buttons}</div>`;
            }
          }
        ]]
      });
    },
    [tableApplications]
  );

  useLayuiTable(initTable);

  if (!isAuth) return null;

  const stats = {
    all: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    reviewed: applications.filter(a => a.status === 'reviewed').length,
    interview: applications.filter(a => a.status === 'interview').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  return (
    <div className="layui-container layui-mt20">
      <div className="layui-row layui-col-space20">
        {/* 侧边栏 */}
        <div className="layui-col-md3">
          <UnifiedSidebar items={sidebarItems} title="用户中心" />
        </div>

        {/* 主内容区 */}
        <div className="layui-col-md9">
          <div className="layui-card layui-mb20">
            <div className="layui-card-body">
              <h2 className="layui-font-2xl layui-font-bold layui-mb15">我的申请</h2>

              {/* 状态筛选 Tabs */}
              <div className="layui-tab layui-tab-brief layui-mt10">
                <ul className="layui-tab-title">
                  {[
                    { key: 'all', label: `全部 (${stats.all})` },
                    { key: 'pending', label: `待处理 (${stats.pending})` },
                    { key: 'reviewed', label: `已查看 (${stats.reviewed})` },
                    { key: 'interview', label: `面试中 (${stats.interview})` },
                    { key: 'accepted', label: `已录用 (${stats.accepted})` },
                    { key: 'rejected', label: `已拒绝 (${stats.rejected})` },
                  ].map((tab) => (
                    <li
                      key={tab.key}
                      className={statusFilter === tab.key ? 'layui-this' : ''}
                      onClick={() => {
                        setStatusFilter(tab.key as ApplicationStatus);
                      }}
                    >
                      {tab.label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 申请列表 */}
          {filteredApplications.length > 0 ? (
            <div className="layui-card layui-mb15">
              <div className="layui-card-body">
                <div id="userApplicationsTable"></div>
              </div>
            </div>
          ) : (
            <div className="layui-card">
              <div className="layui-card-body layui-text-center layui-mt20">
                <div className="layui-font-title layui-mb15">📝</div>
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
