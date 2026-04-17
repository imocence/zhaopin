'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface SidebarItem {
  key: string;
  label: string;
  icon: string;
  href: string;
  badge?: number;
}

export interface AdminSidebarProps {
  items: SidebarItem[];
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ items }) => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin' || pathname === '/admin/';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="layui-card">
      <div className="layui-card-body p-0">
        <nav className="layui-nav layui-bg-dark">
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

export default AdminSidebar;
