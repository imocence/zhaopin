'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import UnifiedSidebar from '@/components/layout/UnifiedSidebar';
import { favoriteService, companyService } from '@/lib/services/data';
import { Job, Company } from '@/types';
import { useLayuiTable } from '@/lib/hooks/useLayuiInit';
import useRequireAuth from '@/lib/hooks/useRequireAuth';
import useUserCenterCounts from '@/lib/hooks/useUserCenterCounts';

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

export default function UserFavoritesPage() {
  const isAuth = useRequireAuth();
  const [favoriteJobs, setFavoriteJobs] = useState<Job[]>([]);
  const [companyMap, setCompanyMap] = useState<Record<string, Company | undefined>>({});
  const pageSize = 5;
  const { counts } = useUserCenterCounts();
  const tableRef = useRef<LayuiTableInstance | null>(null);

  const sidebarItems = [
    { key: 'profile', label: '个人信息', icon: '👤', href: '/user/profile' },
    { key: 'applications', label: '我的申请', icon: '📝', href: '/user/applications', badge: counts.applications },
    { key: 'favorites', label: '收藏职位', icon: '⭐', href: '/user/favorites', badge: counts.favorites },
    { key: 'messages', label: '消息通知', icon: '💬', href: '/user/messages', badge: counts.unreadMessages },
    { key: 'settings', label: '账号设置', icon: '⚙️', href: '/user/settings' },
  ];

  useEffect(() => {
    async function loadData() {
      try {
        const jobs = await favoriteService.getMine();
        setFavoriteJobs(jobs);

        const ids = Array.from(new Set(jobs.map(j => j.companyId)));
        const entries = await Promise.all(ids.map(async (id) => [id, await companyService.getById(id)] as const));
        const map: Record<string, Company | undefined> = {};
        entries.forEach(([id, comp]) => { map[id] = comp; });
        setCompanyMap(map);
      } catch (error) {
        console.error('加载收藏职位失败', error);
      }
    }
    loadData();
  }, []);

  const tableJobs = useMemo(
    () => favoriteJobs.map(job => ({
      ...job,
      companyName: companyMap[job.companyId]?.name || '-',
      salaryText: job.salaryMin ? `$${job.salaryMin}-${job.salaryMax}` : '面议',
    })),
    [favoriteJobs, companyMap]
  );

  const initTable = useCallback(
    (layui: Layui) => {
      const container = document.getElementById('userFavoritesTable');
      if (!container) {
        return;
      }
      const table = layui.table;
      if (tableRef.current) {
        tableRef.current.reload({
          data: tableJobs,
          page: { curr: 1 }
        });
        return;
      }

      tableRef.current = table.render({
        elem: '#userFavoritesTable',
        data: tableJobs,
        page: true,
        limit: pageSize,
        limits: [5, 10, 20],
        skin: 'line',
        even: true,
        cols: [[
          {
            field: 'title',
            title: '职位名称',
            minWidth: 260,
            templet: function (d: Record<string, unknown>) {
              return `<a class="layui-font-cyan layui-text-decoration-none" href="/jobs/${d.id}">${d.title}</a>`;
            }
          },
          { field: 'companyName', title: '公司', width: 220 },
          { field: 'location', title: '城市', width: 140 },
          { field: 'salaryText', title: '薪资', width: 140 },
          {
            field: 'actions',
            title: '操作',
            width: 180,
            align: 'center',
            templet: function (d: Record<string, unknown>) {
              return `
                <div class="layui-btn-group">
                  <a class="layui-btn layui-btn-sm layui-btn-primary" href="/jobs/${d.id}">查看</a>
                  <button class="layui-btn layui-btn-sm layui-btn-danger">取消收藏</button>
                </div>`;
            }
          }
        ]]
      });
    },
    [tableJobs]
  );

  useLayuiTable(initTable);

  if (!isAuth) return null;

  return (
    <div className="layui-container layui-mt20">
      <div className="layui-row layui-col-space20">
        <div className="layui-col-md3">
          <UnifiedSidebar items={sidebarItems} variant="default" />
        </div>
        <div className="layui-col-md9">
          <div className="layui-card layui-mb20">
            <div className="layui-card-body">
              <div className="layui-row layui-col-space10 layui-mb20">
                <div className="layui-col-xs12">
                  <h1 className="layui-font-2xl layui-font-bold">收藏职位</h1>
                  <p className="layui-font-gray layui-mt5">共收藏 {favoriteJobs.length} 个职位</p>
                </div>
              </div>
              <div id="userFavoritesTable"></div>
              {favoriteJobs.length === 0 && (
                <div className="layui-card layui-mt20">
                  <div className="layui-card-body layui-text-center">
                    <div className="layui-font-title layui-mb15">⭐</div>
                    <p className="layui-font-gray layui-mb20">还没有收藏任何职位</p>
                    <Link href="/jobs" className="layui-btn">
                      去找职位
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
