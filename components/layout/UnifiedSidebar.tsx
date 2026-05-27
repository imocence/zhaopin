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
      <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
          <nav className="space-y-1">
            {items.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                    active
                      ? 'bg-[var(--layui-primary)] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="layui-badge">{item.badge}</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    );
  }

  // 雇主和管理员侧边栏样式
  const bgClass = variant === 'employer' ? 'layui-bg-gray' : 'layui-bg-black';

  return (
    <div className="layui-card">
      <div className="layui-card-body p-0">
        <nav className={`layui-nav ${bgClass}`}>
          <ul className="layui-nav-tree">
            {items.map((item) => (
              <li
                key={item.key}
                className={`layui-nav-item ${isActive(item.href) ? 'layui-this' : ''}`}
              >
                <Link href={item.href} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="layui-badge layui-bg-red">{item.badge}</span>
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
