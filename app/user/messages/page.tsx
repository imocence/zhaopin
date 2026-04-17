'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';

type MessageType = 'all' | 'system' | 'application' | 'interview' | 'company';

interface Message {
  id: string;
  type: 'system' | 'application' | 'interview' | 'company';
  title: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

export default function UserMessagesPage() {
  const [typeFilter, setTypeFilter] = useState<MessageType>('all');

  const sidebarItems = [
    { key: 'profile', label: '个人信息', icon: '👤', href: '/user/profile' },
    { key: 'applications', label: '我的申请', icon: '📝', href: '/user/applications', badge: 3 },
    { key: 'favorites', label: '收藏职位', icon: '⭐', href: '/user/favorites', badge: 12 },
    { key: 'messages', label: '消息通知', icon: '💬', href: '/user/messages' },
    { key: 'settings', label: '账号设置', icon: '⚙️', href: '/user/settings' },
  ];

  // 模拟消息数据
  const messages: Message[] = [
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
  ];

  const filteredMessages = typeFilter === 'all'
    ? messages
    : messages.filter(msg => msg.type === typeFilter);

  const stats = {
    all: messages.length,
    system: messages.filter(m => m.type === 'system').length,
    application: messages.filter(m => m.type === 'application').length,
    interview: messages.filter(m => m.type === 'interview').length,
    company: messages.filter(m => m.type === 'company').length,
  };

  const getTypeIcon = (type: string) => {
    const iconMap: { [key: string]: string } = {
      system: '🔔',
      application: '📝',
      interview: '📅',
      company: '🏢',
    };
    return iconMap[type] || '📬';
  };

  const getTypeBadge = (type: string) => {
    const typeMap: { [key: string]: { text: string; class: string } } = {
      system: { text: '系统', class: 'layui-bg-blue' },
      application: { text: '申请', class: 'layui-bg-orange' },
      interview: { text: '面试', class: 'layui-bg-green' },
      company: { text: '企业', class: 'layui-bg-purple' },
    };
    const t = typeMap[type] || { text: type, class: '' };
    return <span className={`layui-badge ${t.class}`}>{t.text}</span>;
  };

  const markAsRead = (messageId: string) => {
    console.log('标记为已读:', messageId);
  };

  const markAllAsRead = () => {
    console.log('全部标记为已读');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* 侧边栏 */}
          <Sidebar items={sidebarItems} />

          {/* 主内容区 */}
          <div className="flex-1">
            <div className="layui-card mb-6">
              <div className="layui-card-body">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-2xl font-bold text-gray-900">消息通知</h1>
                  <button
                    className="layui-btn layui-btn-sm layui-btn-outline"
                    onClick={markAllAsRead}
                  >
                    全部标为已读
                  </button>
                </div>

                {/* 类型筛选 */}
                <div className="flex flex-wrap gap-2">
                  <button
                    className={`layui-btn layui-btn-sm ${typeFilter === 'all' ? 'layui-btn-primary' : 'layui-btn-outline'}`}
                    onClick={() => setTypeFilter('all')}
                  >
                    全部 ({stats.all})
                  </button>
                  <button
                    className={`layui-btn layui-btn-sm ${typeFilter === 'system' ? 'layui-btn-primary' : 'layui-btn-outline'}`}
                    onClick={() => setTypeFilter('system')}
                  >
                    系统消息 ({stats.system})
                  </button>
                  <button
                    className={`layui-btn layui-btn-sm ${typeFilter === 'application' ? 'layui-btn-primary' : 'layui-btn-outline'}`}
                    onClick={() => setTypeFilter('application')}
                  >
                    申请状态 ({stats.application})
                  </button>
                  <button
                    className={`layui-btn layui-btn-sm ${typeFilter === 'interview' ? 'layui-btn-primary' : 'layui-btn-outline'}`}
                    onClick={() => setTypeFilter('interview')}
                  >
                    面试邀请 ({stats.interview})
                  </button>
                  <button
                    className={`layui-btn layui-btn-sm ${typeFilter === 'company' ? 'layui-btn-primary' : 'layui-btn-outline'}`}
                    onClick={() => setTypeFilter('company')}
                  >
                    企业动态 ({stats.company})
                  </button>
                </div>
              </div>
            </div>

            {/* 消息列表 */}
            {filteredMessages.length > 0 ? (
              <div className="space-y-3">
                {filteredMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`layui-card ${!msg.isRead ? 'border-l-4 border-l-[var(--layui-primary)]' : ''}`}
                  >
                    <div className="layui-card-body">
                      <div className="flex items-start gap-4">
                        <div className="text-3xl">{getTypeIcon(msg.type)}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className={`font-semibold ${!msg.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                              {msg.title}
                            </h3>
                            {!msg.isRead && <span className="layui-badge layui-bg-red">新</span>}
                            {getTypeBadge(msg.type)}
                          </div>
                          <p className="text-gray-700 mb-2">{msg.content}</p>
                          <p className="text-xs text-gray-500">{msg.createdAt}</p>
                        </div>
                        {!msg.isRead && (
                          <button
                            className="layui-btn layui-btn-sm layui-btn-outline"
                            onClick={() => markAsRead(msg.id)}
                          >
                            标为已读
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="layui-card">
                <div className="layui-card-body text-center py-12">
                  <div className="text-6xl mb-4">💬</div>
                  <p className="text-gray-600">暂无消息</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
