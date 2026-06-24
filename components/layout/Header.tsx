'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useLayuiNav } from '@/lib/hooks/useLayuiInit';
import { getAuthToken, clearAuth } from '@/lib/utils/auth-client';

const Header: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 初始化 Layui 导航
  useLayuiNav();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const loginHref = `/login?next=${encodeURIComponent(pathname || '/')}`;

  useEffect(() => {
    setMounted(true);
    const checkAuth = () => setIsLoggedIn(!!getAuthToken());
    checkAuth();
    window.addEventListener('authChange', checkAuth);
    window.addEventListener('storage', checkAuth);
    return () => {
      window.removeEventListener('authChange', checkAuth);
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  if (!mounted) {
    return null;
  }

  const handleLogout = () => {
    clearAuth();
    window.location.href = '/';
  };

  return (
    <header className="layui-bg-black" style={{ marginBottom: pathname === '/' ? '0' : '10px' }}>
      <ul className="layui-container layui-nav">
        <li className="layui-nav-item">
          <Link href="/" prefetch={false} className="layui-logo">168招聘网</Link>
        </li>

        <li className="layui-nav-item">
          <Link href="/" prefetch={false} className={isActive('/') ? 'layui-this' : ''}>首页</Link>
        </li>

        <li className="layui-nav-item">
          <Link href="/jobs" prefetch={false} className={isActive('/jobs') ? 'layui-this' : ''}>职位搜索</Link>
        </li>

        <li className="layui-nav-item">
          <Link href="/companies" prefetch={false} className={isActive('/companies') ? 'layui-this' : ''}>企业大全</Link>
        </li>

        <li className="layui-nav-item">
          <Link href="/post" prefetch={false} className={isActive('/post') ? 'layui-this' : ''}>发布职位</Link>
        </li>

        {!isLoggedIn ? (
          <>
            <li className="layui-nav-item" style={{ float: 'right' }}>
              <Link href={loginHref} prefetch={false}>登录</Link>
            </li>
            <li className="layui-nav-item" style={{ float: 'right' }}>
              <Link href="/register" prefetch={false}>注册</Link>
            </li>
          </>
        ) : (
          <li className="layui-nav-item" style={{ float: 'right' }}>
            <Link href="/user">
              <i className="layui-icon layui-icon-username"></i> 用户中心
            </Link>
            <dl className="layui-nav-child">
              <dd><Link href="/user/profile">个人信息</Link></dd>
              <dd><Link href="/user/applications">我的申请</Link></dd>
              <dd><Link href="/user/messages">消息通知</Link></dd>
              <dd><a onClick={handleLogout}>退出登录</a></dd>
            </dl>
          </li>
        )}
      </ul>
    </header>
  );
};

export default Header;