'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLayuiNav } from '@/lib/hooks/useLayuiInit';

export interface SidebarItem {
  key: string;
  label: string;
  icon: React.ReactNode | string;
  href: string;
  badge?: number;
}

export interface UnifiedSidebarProps {
  items: SidebarItem[];
  title?: string;
  variant?: 'default' | 'employer' | 'admin';
}

const UnifiedSidebar: React.FC<UnifiedSidebarProps> = ({
  items,
  title = '用户中心',
  variant = 'default'
}) => {
  const pathname = usePathname();

  // 初始化 Layui 导航
  useLayuiNav();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname === href || pathname.startsWith(href);
  };

  // 默认样式（用户侧边栏）
  if (variant === 'default') {
    return (
      <aside className="layui-card">
        <div className="layui-card-body">
          <h2 className="layui-font-lg layui-font-bold layui-mb15">{title}</h2>
          <ul className="layui-nav layui-nav-tree" lay-filter="user-center-nav" style={{ width: '100%' }} >
            {items.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.key} className={`layui-nav-item ${active ? 'layui-this' : ''}`}>
                  <Link href={item.href}>
                    <span>{item.icon}</span>
                    <span>{' '}{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="layui-badge layui-bg-red">{' '}{item.badge}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
    );
  }

  // 雇主侧边栏仍保持卡片风格，管理员侧边栏使用标准 layui-admin 样式
  if (variant === 'admin') {
    return (
      <ul className="layui-nav layui-nav-tree layui-bg-black" lay-filter="admin-side-nav">
        {items.map((item) => (
          <li
            key={item.key}
            className={`layui-nav-item ${isActive(item.href) ? 'layui-this' : ''}`}
          >
            <Link href={item.href}>
              <span className="layui-icon layui-icon-home"></span>
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  const bgClass = variant === 'employer' ? 'layui-bg-gray' : 'layui-bg-black';

  return (
    <div className="layui-card">
      <div className="layui-card-body">
        <nav className={`layui-nav ${bgClass}`}>
          <ul className="layui-nav-tree">
            {items.map((item) => (
              <li
                key={item.key}
                className={`layui-nav-item ${isActive(item.href) ? 'layui-this' : ''}`}
              >
                <Link href={item.href}>
                  <span>{item.icon}</span>
                  <span>{' '}{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="layui-badge layui-bg-red">{' '}{item.badge}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default UnifiedSidebar;
