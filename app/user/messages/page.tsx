'use client';

import React, { useCallback, useMemo, useRef, useState } from 'react';
import UnifiedSidebar from '@/components/layout/UnifiedSidebar';
import { useLayuiTable } from '@/lib/hooks/useLayuiInit';
import useRequireAuth from '@/lib/hooks/useRequireAuth';

type MessageType = 'all' | 'system' | 'application' | 'interview' | 'company';

interface Message {
  id: string;
  type: 'system' | 'application' | 'interview' | 'company';
  title: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

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

export default function UserMessagesPage() {
  const isAuth = useRequireAuth();
  const [typeFilter, setTypeFilter] = useState<MessageType>('all');
  const tableRef = useRef<LayuiTableInstance | null>(null);

  const sidebarItems = [
    { key: 'profile', label: '个人信息', icon: '👤', href: '/user/profile' },
    { key: 'applications', label: '我的申请', icon: '📝', href: '/user/applications', badge: 3 },
    { key: 'favorites', label: '收藏职位', icon: '⭐', href: '/user/favorites', badge: 12 },
    { key: 'messages', label: '消息通知', icon: '💬', href: '/user/messages' },
    { key: 'settings', label: '账号设置', icon: '⚙️', href: '/user/settings' },
  ];

  const messages: Message[] = useMemo(() => [
    {
      id: '1',
      type: 'system',
      title: '欢迎使用168招聘网',
      content: '感谢您注册168招聘网，祝您求职顺利！',
      createdAt: '2026-04-15 10:00',
      isRead: false,
    },
    {
      id: '2',
      type: 'application',
      title: '您的申请已被查看',
      content: '腾讯美国已查看您对"高级软件工程师"职位的申请',
      createdAt: '2026-04-14 15:30',
      isRead: false,
    },
    {
      id: '3',
      type: 'interview',
      title: '面试邀请',
      content: '字节跳动邀请您参加"前端工程师"职位的面试，请确认时间',
      createdAt: '2026-04-13 09:00',
      isRead: false,
    },
    {
      id: '4',
      type: 'company',
      title: '企业发布新职位',
      content: '您关注的企业"阿里巴巴美国"发布了新职位',
      createdAt: '2026-04-12 14:20',
      isRead: true,
    },
    {
      id: '5',
      type: 'application',
      title: '申请状态更新',
      content: '您对"产品经理"职位的申请已进入面试阶段',
      createdAt: '2026-04-11 11:00',
      isRead: true,
    },
  ],
    []
  );

  const filteredMessages = useMemo(
    () => (typeFilter === 'all' ? messages : messages.filter(msg => msg.type === typeFilter)),
    [typeFilter, messages]
  );

  const stats = useMemo(() => ({
    all: messages.length,
    system: messages.filter(m => m.type === 'system').length,
    application: messages.filter(m => m.type === 'application').length,
    interview: messages.filter(m => m.type === 'interview').length,
    company: messages.filter(m => m.type === 'company').length,
  }), [messages]);

  const initTable = useCallback(
    (layui: Layui) => {
      const container = document.getElementById('userMessagesTable');
      if (!container) {
        return;
      }
      const table = layui.table;
      if (tableRef.current) {
        tableRef.current.reload({
          data: filteredMessages,
          page: { curr: 1 },
        });
        return;
      }

      tableRef.current = table.render({
        elem: '#userMessagesTable',
        data: filteredMessages,
        page: true,
        limit: 5,
        limits: [5, 10, 20],
        skin: 'line',
        even: true,
        cols: [[
          {
            field: 'type',
            title: '类型',
            width: 140,
            templet: function (d: Record<string, unknown>) {
              const iconMap: Record<MessageType, string> = {
                system: '🔔',
                application: '📝',
                interview: '📅',
                company: '🏢',
                all: '📬',
              };
              const typeMap: Record<MessageType, { text: string; cls: string }> = {
                system: { text: '系统', cls: 'layui-bg-blue' },
                application: { text: '申请', cls: 'layui-bg-orange' },
                interview: { text: '面试', cls: 'layui-bg-green' },
                company: { text: '企业', cls: 'layui-bg-purple' },
                all: { text: '全部', cls: 'layui-bg-gray' },
              };
              const messageType = String(d.type) as MessageType;
              const icon = iconMap[messageType] || '📬';
              const type = typeMap[messageType] || { text: messageType, cls: '' };
              return `<div><span style="display:inline-block;width:24px">${icon}</span><span class="layui-badge ${type.cls}">${type.text}</span></div>`;
            },
          },
          {
            field: 'title',
            title: '消息内容',
            minWidth: 300,
            templet: function (d: Record<string, unknown>) {
              return `<div class="layui-font-lg layui-font-bold">${d.title}</div><div class="layui-font-sm layui-font-gray">${d.content}</div>`;
            },
          },
          { field: 'createdAt', title: '时间', width: 180 },
          {
            field: 'isRead',
            title: '状态',
            width: 80,
            templet: function (d: Record<string, unknown>) {
              return d.isRead
                ? '<span class="layui-badge layui-bg-green">已读</span>'
                : '<span class="layui-badge layui-bg-red">未读</span>';
            },
          },
          {
            field: 'action',
            title: '操作',
            width: 140,
            align: 'center',
            templet: function (d: Record<string, unknown>) {
              return d.isRead
                ? '<span class="layui-font-sm layui-font-gray">—</span>'
                : '<span class="layui-btn layui-btn-sm layui-btn-outline">标为已读</span>';
            },
          },
        ]],
      });
    },
    [filteredMessages]
  );

  useLayuiTable(initTable);

  const markAllAsRead = () => {
    console.log('全部标记为已读');
  };

  if (!isAuth) return null;

  return (
    <div className="layui-container layui-mt20">
      <div className="layui-row layui-col-space20">
        <div className="layui-col-md3">
          <UnifiedSidebar items={sidebarItems} title="用户中心" variant="default" />
        </div>

        <div className="layui-col-md9">
          <div className="layui-card layui-mb20">
            <div className="layui-card-body">
              <div className="layui-row layui-col-space10 layui-mb20">
                <div className="layui-col-xs8 layui-col-md10">
                  <h1 className="layui-font-lg layui-font-bold">消息通知</h1>
                  <div className="layui-tab layui-tab-brief layui-mt10">
                    <ul className="layui-tab-title">
                      {[
                        { key: 'all', label: `全部 (${stats.all})` },
                        { key: 'system', label: `系统消息 (${stats.system})` },
                        { key: 'application', label: `申请状态 (${stats.application})` },
                        { key: 'interview', label: `面试邀请 (${stats.interview})` },
                        { key: 'company', label: `企业动态 (${stats.company})` },
                      ].map((item) => (
                        <li
                          key={item.key}
                          className={typeFilter === item.key ? 'layui-this' : ''}
                          onClick={() => setTypeFilter(item.key as MessageType)}
                        >
                          {item.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="layui-col-xs4 layui-col-md2 layui-text-right">
                  <button
                    className="layui-btn layui-btn-sm layui-btn-outline"
                    onClick={markAllAsRead}
                  >
                    全部标为已读
                  </button>
                </div>
              </div>

              <div className="layui-card layui-mb20">
                <div className="layui-card-body">
                  <div id="userMessagesTable"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
