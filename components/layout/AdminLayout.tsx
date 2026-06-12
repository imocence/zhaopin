'use client';

import UnifiedSidebar, { SidebarItem } from '@/components/layout/UnifiedSidebar';

const adminSidebarItems: SidebarItem[] = [
  { key: 'dashboard', label: '仪表盘', icon: '', href: '/admin' },
  { key: 'companies', label: '企业管理', icon: '', href: '/admin/companies' },
  { key: 'jobs', label: '职位管理', icon: '', href: '/admin/jobs' },
  { key: 'users', label: '用户管理', icon: '', href: '/admin/users' },
  { key: 'reports', label: '报表统计', icon: '', href: '/admin/reports' },
  { key: 'settings', label: '系统设置', icon: '', href: '/admin/settings' },
];

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="layui-layout layui-layout-admin">
      <div className="layui-header">
        <div className="layui-logo">168 招聘网后台</div>
        <ul className="layui-nav layui-layout-right">
          <li className="layui-nav-item">
            <a href="javascript:void(0)">管理员</a>
            <dl className="layui-nav-child">
              <dd><a href="/">返回前台</a></dd>
              <dd><a href="/login">退出登录</a></dd>
            </dl>
          </li>
        </ul>
      </div>

      <div className="layui-side layui-bg-black">
        <div className="layui-side-scroll">
          <UnifiedSidebar items={adminSidebarItems} title="管理后台" variant="admin" />
        </div>
      </div>

      <div className="layui-body layui-bg-gray">
        <div className="layui-main layui-container layui-mt20">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
