'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

const Header: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    const initLayuiNav = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const layui = (window as any).layui;
      if (!layui) {
        setTimeout(initLayuiNav, 100);
        return;
      }
      layui.use('element', function(element: any) {
        element.render('nav');
      });
    };

    setTimeout(initLayuiNav, 300);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div className="layui-bg-dark">
      <ul className="layui-nav">
        <li className="layui-nav-item">
          <Link href="/" className="layui-logo">168招聘网</Link>
        </li>

        <li className="layui-nav-item">
          <Link href="/" className={isActive('/') ? 'layui-this' : ''}>首页</Link>
        </li>

        <li className="layui-nav-item">
          <Link href="/jobs" className={isActive('/jobs') ? 'layui-this' : ''}>职位搜索</Link>
        </li>

        <li className="layui-nav-item">
          <Link href="/companies" className={isActive('/companies') ? 'layui-this' : ''}>企业大全</Link>
        </li>

        <li className="layui-nav-item">
          <Link href="/post" className={isActive('/post') ? 'layui-this' : ''}>发布职位</Link>
        </li>

        {!isLoggedIn ? (
          <>
            <li className="layui-nav-item" style={{float: 'right'}}>
              <Link href="/login">登录</Link>
            </li>
            <li className="layui-nav-item" style={{float: 'right'}}>
              <Link href="/register">注册</Link>
            </li>
          </>
        ) : (
          <li className="layui-nav-item" style={{float: 'right'}}>
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
    </div>
  );
};

export default Header;