'use client';

import React, { useState } from 'react';
import UnifiedSidebar from '@/components/layout/UnifiedSidebar';
import { useLayuiForm } from '@/lib/hooks/useLayuiInit';
import useRequireAuth from '@/lib/hooks/useRequireAuth';
import useUserCenterCounts from '@/lib/hooks/useUserCenterCounts';

type TabKey = 'account' | 'password' | 'notifications' | 'privacy';

export default function UserSettingsPage() {
  const isAuth = useRequireAuth();
  const [activeTab, setActiveTab] = useState<TabKey>('account');
  const { counts } = useUserCenterCounts();

  const sidebarItems = [
    { key: 'profile', label: '个人信息', icon: '👤', href: '/user/profile' },
    { key: 'applications', label: '我的申请', icon: '📝', href: '/user/applications', badge: counts.applications },
    { key: 'favorites', label: '收藏职位', icon: '⭐', href: '/user/favorites', badge: counts.favorites },
    { key: 'messages', label: '消息通知', icon: '💬', href: '/user/messages', badge: counts.unreadMessages },
    { key: 'settings', label: '账号设置', icon: '⚙️', href: '/user/settings' },
  ];

  const tabs = [
    { key: 'account' as TabKey, label: '账号设置', icon: '👤' },
    { key: 'password' as TabKey, label: '修改密码', icon: '🔒' },
    { key: 'notifications' as TabKey, label: '通知设置', icon: '🔔' },
    { key: 'privacy' as TabKey, label: '隐私设置', icon: '🔐' },
  ];

  useLayuiForm();

  if (!isAuth) return null;

  return (
    <div className="layui-container layui-mt20">
      <div className="layui-row layui-col-space20">
        <div className="layui-col-md3">
          <UnifiedSidebar items={sidebarItems} variant="default" />
        </div>

        <div className="layui-col-md9">
          <div className="layui-card">
            <div className="layui-card-body">
              <div className="layui-tab layui-tab-brief layui-mb20">
                <ul className="layui-tab-title">
                  {tabs.map((tab) => (
                    <li
                      key={tab.key}
                      className={activeTab === tab.key ? 'layui-this' : ''}
                      onClick={() => setActiveTab(tab.key)}
                    >
                      <span>{tab.icon}</span> {tab.label}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="layui-tab-content">
                <div className={`layui-tab-item${activeTab === 'account' ? ' layui-show' : ''}`}>
                  <AccountSettings />
                </div>
                <div className={`layui-tab-item${activeTab === 'password' ? ' layui-show' : ''}`}>
                  <PasswordSettings />
                </div>
                <div className={`layui-tab-item${activeTab === 'notifications' ? ' layui-show' : ''}`}>
                  <NotificationSettings />
                </div>
                <div className={`layui-tab-item${activeTab === 'privacy' ? ' layui-show' : ''}`}>
                  <PrivacySettings />
                </div>
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
    <form className="layui-form">
      <div className="layui-form-item">
        <label className="layui-form-label">用户名</label>
        <div className="layui-input-block">
          <input type="text" className="layui-input" defaultValue="zhangsan" />
        </div>
      </div>
      <div className="layui-form-item">
        <label className="layui-form-label">邮箱</label>
        <div className="layui-input-block">
          <input type="email" className="layui-input" defaultValue="zhangsan@example.com" />
        </div>
      </div>
      <div className="layui-form-item">
        <label className="layui-form-label">手机号</label>
        <div className="layui-input-block">
          <input type="tel" className="layui-input" defaultValue="123-456-7890" />
        </div>
      </div>
      <div className="layui-form-item">
        <label className="layui-form-label">时区</label>
        <div className="layui-input-block">
          <select className="layui-select">
            <option>Pacific Time (PT)</option>
            <option>Mountain Time (MT)</option>
            <option>Central Time (CT)</option>
            <option>Eastern Time (ET)</option>
          </select>
        </div>
      </div>
      <div className="layui-form-item">
        <div className="layui-input-block">
          <button className="layui-btn layui-btn-primary" type="submit">
            保存更改
          </button>
        </div>
      </div>
    </form>
  );
}

// 修改密码
function PasswordSettings() {
  return (
    <form className="layui-form">
      <div className="layui-form-item">
        <label className="layui-form-label">当前密码</label>
        <div className="layui-input-block">
          <input type="password" className="layui-input" placeholder="请输入当前密码" />
        </div>
      </div>
      <div className="layui-form-item">
        <label className="layui-form-label">新密码</label>
        <div className="layui-input-block">
          <input type="password" className="layui-input" placeholder="6-20位字符" />
        </div>
      </div>
      <div className="layui-form-item">
        <label className="layui-form-label">确认密码</label>
        <div className="layui-input-block">
          <input type="password" className="layui-input" placeholder="再次输入新密码" />
        </div>
      </div>
      <div className="layui-form-item">
        <div className="layui-input-block">
          <button className="layui-btn layui-btn-primary" type="submit">
            修改密码
          </button>
        </div>
      </div>
    </form>
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

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <form className="layui-form">
      <div className="layui-form-item layui-form-text">
        <label className="layui-form-label">邮件通知</label>
        <div className="layui-input-block">
          <input
            type="checkbox"
            name="emailApplication"
            title="申请状态更新通知"
            checked={settings.emailApplication}
            onChange={() => handleToggle('emailApplication')}
          />
          <input
            type="checkbox"
            name="emailInterview"
            title="面试邀请通知"
            checked={settings.emailInterview}
            onChange={() => handleToggle('emailInterview')}
          />
          <input
            type="checkbox"
            name="emailCompany"
            title="关注企业新职位通知"
            checked={settings.emailCompany}
            onChange={() => handleToggle('emailCompany')}
          />
        </div>
      </div>

      <div className="layui-form-item layui-form-text">
        <label className="layui-form-label">浏览器通知</label>
        <div className="layui-input-block">
          <input
            type="checkbox"
            name="browserNotification"
            title="启用浏览器推送通知"
            checked={settings.browserNotification}
            onChange={() => handleToggle('browserNotification')}
          />
        </div>
      </div>

      <div className="layui-form-item layui-form-text">
        <label className="layui-form-label">短信通知</label>
        <div className="layui-input-block">
          <input
            type="checkbox"
            name="smsNotification"
            title="启用短信通知（面试邀请等）"
            checked={settings.smsNotification}
            onChange={() => handleToggle('smsNotification')}
          />
        </div>
      </div>

      <div className="layui-form-item">
        <div className="layui-input-block">
          <button className="layui-btn layui-btn-primary" type="submit">
            保存设置
          </button>
        </div>
      </div>
    </form>
  );
}

// 隐私设置
function PrivacySettings() {
  return (
    <form className="layui-form">
      <div className="layui-form-item">
        <label className="layui-form-label">谁可以查看我的简历</label>
        <div className="layui-input-block">
          <select className="layui-select">
            <option>所有企业</option>
            <option>我申请过的企业</option>
            <option>仅我关注的企业</option>
            <option>完全隐藏</option>
          </select>
        </div>
      </div>

      <div className="layui-form-item">
        <label className="layui-form-label">谁可以查看我的求职状态</label>
        <div className="layui-input-block">
          <select className="layui-select">
            <option>所有人</option>
            <option>仅企业用户</option>
            <option>完全隐藏</option>
          </select>
        </div>
      </div>

      <div className="layui-form-item layui-form-text">
        <label className="layui-form-label">隐私选项</label>
        <div className="layui-input-block">
          <input type="checkbox" name="resumeVisible" title="允许企业通过搜索找到我的简历" defaultChecked />
          <input type="checkbox" name="anonymousView" title="在'正在看这个职位的用户'中匿名显示" />
        </div>
      </div>

      <div className="layui-card layui-bg-gray">
        <div className="layui-card-body">
          <h3 className="layui-card-title">数据控制</h3>
          <p className="layui-font-sm layui-font-gray">您可以下载或删除您的个人数据</p>
          <div className="layui-btn-group">
            <button className="layui-btn layui-btn-sm layui-btn-outline" type="button">
              下载我的数据
            </button>
            <button className="layui-btn layui-btn-sm layui-btn-danger" type="button">
              删除账号
            </button>
          </div>
        </div>
      </div>

      <div className="layui-form-item">
        <div className="layui-input-block">
          <button className="layui-btn layui-btn-primary" type="submit">
            保存设置
          </button>
        </div>
      </div>
    </form>
  );
}
