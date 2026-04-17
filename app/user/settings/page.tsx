'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';

type TabKey = 'account' | 'password' | 'notifications' | 'privacy';

export default function UserSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('account');

  const sidebarItems = [
    { key: 'profile', label: '个人信息', icon: '👤', href: '/user/profile' },
    { key: 'applications', label: '我的申请', icon: '📝', href: '/user/applications', badge: 3 },
    { key: 'favorites', label: '收藏职位', icon: '⭐', href: '/user/favorites', badge: 12 },
    { key: 'messages', label: '消息通知', icon: '💬', href: '/user/messages', badge: 5 },
    { key: 'settings', label: '账号设置', icon: '⚙️', href: '/user/settings' },
  ];

  const tabs = [
    { key: 'account' as TabKey, label: '账号设置', icon: '👤' },
    { key: 'password' as TabKey, label: '修改密码', icon: '🔒' },
    { key: 'notifications' as TabKey, label: '通知设置', icon: '🔔' },
    { key: 'privacy' as TabKey, label: '隐私设置', icon: '🔐' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* 侧边栏 */}
          <Sidebar items={sidebarItems} />

          {/* 主内容区 */}
          <div className="flex-1">
            <div className="layui-card">
              {/* 选项卡导航 */}
              <div className="layui-card-body border-b">
                <div className="flex gap-2 overflow-x-auto">
                  {tabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex items-center gap-2 px-4 py-2 rounded whitespace-nowrap transition-colors ${
                        activeTab === tab.key
                          ? 'bg-[var(--layui-primary)] text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span>{tab.icon}</span>
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 选项卡内容 */}
              <div className="layui-card-body">
                {activeTab === 'account' && <AccountSettings />}
                {activeTab === 'password' && <PasswordSettings />}
                {activeTab === 'notifications' && <NotificationSettings />}
                {activeTab === 'privacy' && <PrivacySettings />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 账号设置
function AccountSettings() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">账号设置</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            用户名
          </label>
          <input type="text" className="layui-input" defaultValue="zhangsan" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            邮箱
          </label>
          <input type="email" className="layui-input" defaultValue="zhangsan@example.com" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            手机号
          </label>
          <input type="tel" className="layui-input" defaultValue="123-456-7890" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            所在时区
          </label>
          <select className="layui-select">
            <option>Pacific Time (PT)</option>
            <option>Mountain Time (MT)</option>
            <option>Central Time (CT)</option>
            <option>Eastern Time (ET)</option>
          </select>
        </div>
        <button type="submit" className="layui-btn layui-btn-primary">
          保存更改
        </button>
      </form>
    </div>
  );
}

// 修改密码
function PasswordSettings() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">修改密码</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            当前密码 *
          </label>
          <input type="password" className="layui-input" placeholder="请输入当前密码" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            新密码 *
          </label>
          <input type="password" className="layui-input" placeholder="6-20位字符" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            确认新密码 *
          </label>
          <input type="password" className="layui-input" placeholder="再次输入新密码" />
        </div>
        <button type="submit" className="layui-btn layui-btn-primary">
          修改密码
        </button>
      </form>
    </div>
  );
}

// 通知设置
function NotificationSettings() {
  const [settings, setSettings] = useState({
    emailApplication: true,
    emailInterview: true,
    emailCompany: false,
    browserNotification: true,
    smsNotification: false,
  });

  const handleToggle = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">通知设置</h2>

      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">邮件通知</h3>
        <div className="space-y-3">
          <label className="layui-checkbox">
            <input
              type="checkbox"
              checked={settings.emailApplication}
              onChange={() => handleToggle('emailApplication')}
            />
            <span></span>
            <span className="ml-7 text-sm text-gray-700">申请状态更新通知</span>
          </label>
          <label className="layui-checkbox">
            <input
              type="checkbox"
              checked={settings.emailInterview}
              onChange={() => handleToggle('emailInterview')}
            />
            <span></span>
            <span className="ml-7 text-sm text-gray-700">面试邀请通知</span>
          </label>
          <label className="layui-checkbox">
            <input
              type="checkbox"
              checked={settings.emailCompany}
              onChange={() => handleToggle('emailCompany')}
            />
            <span></span>
            <span className="ml-7 text-sm text-gray-700">关注企业新职位通知</span>
          </label>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">浏览器通知</h3>
        <label className="layui-checkbox">
          <input
            type="checkbox"
            checked={settings.browserNotification}
            onChange={() => handleToggle('browserNotification')}
          />
          <span></span>
          <span className="ml-7 text-sm text-gray-700">启用浏览器推送通知</span>
        </label>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">短信通知</h3>
        <label className="layui-checkbox">
          <input
            type="checkbox"
            checked={settings.smsNotification}
            onChange={() => handleToggle('smsNotification')}
          />
          <span></span>
          <span className="ml-7 text-sm text-gray-700">启用短信通知（面试邀请等）</span>
        </label>
      </div>

      <button className="layui-btn layui-btn-primary">保存设置</button>
    </div>
  );
}

// 隐私设置
function PrivacySettings() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">隐私设置</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            谁可以查看我的简历
          </label>
          <select className="layui-select">
            <option>所有企业</option>
            <option>我申请过的企业</option>
            <option>仅我关注的企业</option>
            <option>完全隐藏</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            谁可以查看我的求职状态
          </label>
          <select className="layui-select">
            <option>所有人</option>
            <option>仅企业用户</option>
            <option>完全隐藏</option>
          </select>
        </div>

        <div>
          <label className="layui-checkbox">
            <input type="checkbox" defaultChecked />
            <span></span>
            <span className="ml-7 text-sm text-gray-700">
              允许企业通过搜索找到我的简历
            </span>
          </label>
        </div>

        <div>
          <label className="layui-checkbox">
            <input type="checkbox" />
            <span></span>
            <span className="ml-7 text-sm text-gray-700">
              在"正在看这个职位的用户"中匿名显示
            </span>
          </label>
        </div>
      </div>

      <div className="layui-card layui-bg-gray bg-opacity-10">
        <div className="layui-card-body">
          <h3 className="font-medium text-gray-900 mb-2">数据控制</h3>
          <p className="text-sm text-gray-600 mb-4">
            您可以下载或删除您的个人数据
          </p>
          <div className="flex gap-3">
            <button className="layui-btn layui-btn-sm layui-btn-outline">
              下载我的数据
            </button>
            <button className="layui-btn layui-btn-sm layui-btn-danger">
              删除账号
            </button>
          </div>
        </div>
      </div>

      <button className="layui-btn layui-btn-primary">保存设置</button>
    </div>
  );
}
