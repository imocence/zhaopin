'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

type Theme = 'default' | 'dark' | 'blue' | 'green' | 'orange' | 'purple';

interface ThemeConfig {
  name: string;
  primary: string;
  header: string;
  side: string;
  body: string;
}

interface MenuItem {
  id: string;
  name: string;
  icon: string;
  path: string;
}

interface User {
  username: string;
}

const themes: Record<Theme, ThemeConfig> = {
  default: {
    name: '默认',
    primary: '#009688',
    header: '#393D49',
    side: '#20222A',
    body: '#f2f2f2'
  },
  dark: {
    name: '暗黑',
    primary: '#009688',
    header: '#1a1a1a',
    side: '#0f0f0f',
    body: '#f2f2f2'
  },
  blue: {
    name: '科技蓝',
    primary: '#1E9FFF',
    header: '#1E9FFF',
    side: '#20222A',
    body: '#f2f2f2'
  },
  green: {
    name: '清新绿',
    primary: '#5FB878',
    header: '#5FB878',
    side: '#20222A',
    body: '#f2f2f2'
  },
  orange: {
    name: '活力橙',
    primary: '#FFB800',
    header: '#FFB800',
    side: '#20222A',
    body: '#f2f2f2'
  },
  purple: {
    name: '优雅紫',
    primary: '#9588ff',
    header: '#9588ff',
    side: '#20222A',
    body: '#f2f2f2'
  }
};

const defaultMenu: MenuItem[] = [
  { id: 'dashboard', name: '控制台', icon: 'layui-icon-home', path: '/admin' },
  { id: 'users', name: '用户管理', icon: 'layui-icon-user', path: '/admin/users' },
  { id: 'companies', name: '企业管理', icon: 'layui-icon-group', path: '/admin/companies' },
  { id: 'jobs', name: '职位管理', icon: 'layui-icon-file', path: '/admin/jobs' },
  { id: 'reports', name: '举报管理', icon: 'layui-icon-tips', path: '/admin/reports' },
  { id: 'settings', name: '系统设置', icon: 'layui-icon-set', path: '/admin/settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [sidebarCollapse, setSidebarCollapse] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<Theme>('default');
  const [showThemePanel, setShowThemePanel] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(defaultMenu);
  const [layuiReady, setLayuiReady] = useState(false);

  const applyTheme = useCallback((theme: Theme) => {
    const config = themes[theme];
    console.log('应用主题:', theme, config);

    // 1. 设置 CSS 变量
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', config.primary);
    root.style.setProperty('--theme-header', config.header);
    root.style.setProperty('--theme-side', config.side);
    root.style.setProperty('--theme-body', config.body);

    // 2. 直接应用到元素（使用 !important 确保覆盖）
    const adminHeader = document.getElementById('adminHeader');
    const adminSide = document.getElementById('adminSide');

    console.log('应用主题到元素:', { adminHeader, adminSide });

    if (adminHeader) {
      adminHeader.style.background = `${config.header} !important`;
      adminHeader.style.setProperty('background', config.header, 'important');
    }
    if (adminSide) {
      adminSide.style.background = `${config.side} !important`;
      adminSide.style.setProperty('background', config.side, 'important');
    }

    // 3. 更新或创建动态样式表
    let styleEl = document.getElementById('admin-theme-style') as HTMLStyleElement;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'admin-theme-style';
      document.head.appendChild(styleEl);
    }

    styleEl.textContent = `
      /* 侧边栏导航高亮 */
      #adminSide.layui-bg-black,
      #adminSide {
        background: ${config.side} !important;
      }
      #adminSide .layui-nav-tree .layui-nav-item.layui-this a {
        background-color: ${config.primary} !important;
      }
      #adminSide .layui-nav-tree .layui-nav-item.layui-this a cite {
        color: #fff !important;
      }
      #adminSide .layui-nav-tree .layui-nav-item a:hover {
        background-color: ${config.primary} !important;
        opacity: 0.8;
      }

      /* Header */
      #adminHeader {
        background: ${config.header} !important;
      }

      /* 主题色按钮 */
      .layui-btn-primary {
        background-color: transparent !important;
        border-color: ${config.primary} !important;
        color: ${config.primary} !important;
      }
      .layui-btn-primary:hover {
        background-color: ${config.primary} !important;
        color: #fff !important;
      }

      /* 主色调相关元素 */
      .text-theme { color: ${config.primary} !important; }
      .bg-theme { background-color: ${config.primary} !important; }
      .border-theme { border-color: ${config.primary} !important; }

      /* layui-bg-primary 覆盖 */
      .layui-bg-primary,
      [class*="layui-bg-primary"] {
        background-color: ${config.primary} !important;
      }

      /* layui-badge 等组件 */
      .layui-badge.layui-bg-primary {
        background-color: ${config.primary} !important;
      }

      /* 强制覆盖所有相关颜色 */
      [style*="--layui-primary"] {
        --layui-primary: ${config.primary} !important;
      }
    `;

    console.log('主题样式已应用:', config.name, config.primary);

    // 4. 强制刷新所有相关元素
    setTimeout(() => {
      // 更新所有使用主题色的元素
      const themeElements = document.querySelectorAll('[class*="layui-primary"], [style*="layui-primary"], .layui-badge');

      themeElements.forEach(el => {
        const computedStyle = window.getComputedStyle(el);
        const backgroundColor = computedStyle.backgroundColor;

        // 如果元素使用了 layui-primary 相关的颜色，强制更新
        if (el.classList.contains('layui-bg-primary') ||
            el.textContent?.includes(config.primary) ||
            backgroundColor === 'rgb(0, 150, 136)') {
          el.classList.remove('layui-bg-primary');
          el.classList.add('theme-dynamic-update');
          void el.offsetWidth; // 触发重绘
          el.classList.remove('theme-dynamic-update');
        }
      });

      console.log('主题元素已更新，数量:', themeElements.length);
    }, 50);
  }, []);

  useEffect(() => {
    // 检查 layui 是否已加载
    const checkLayui = () => {
      if (window.layui) {
        setLayuiReady(true);
      } else {
        setTimeout(checkLayui, 100);
      }
    };
    checkLayui();

    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      setUser({ username: 'Admin' });
    } else {
      try {
        setUser(JSON.parse(userStr) as User);
      } catch {
        setUser({ username: 'Admin' });
      }
    }

    // 应用保存的主题
    const savedTheme = localStorage.getItem('admin-theme') as Theme;
    const themeToApply = savedTheme && themes[savedTheme] ? savedTheme : 'default';
    setCurrentTheme(themeToApply);
    applyTheme(themeToApply);
  }, [applyTheme]); // 添加 applyTheme 依赖

  const handleThemeChange = (theme: Theme) => {
    console.log('切换主题到:', theme, themes[theme]);
    setCurrentTheme(theme);
    localStorage.setItem('admin-theme', theme);

    // 先应用主题
    applyTheme(theme);

    // 延迟关闭面板，确保主题已应用
    setTimeout(() => {
      setShowThemePanel(false);
    }, 100);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const toggleSidebar = () => {
    setSidebarCollapse(!sidebarCollapse);
    const side = document.querySelector('.layui-side') as HTMLElement;
    const body = document.querySelector('.layui-body') as HTMLElement;
    const footer = document.querySelector('.layui-footer') as HTMLElement;
    const logo = document.querySelector('.layui-logo') as HTMLElement;
    const layoutLeft = document.querySelector('.layui-layout-left') as HTMLElement;

    if (sidebarCollapse) {
      side?.classList.remove('layui-side-collapse');
      body?.classList.remove('layui-body-collapse');
      footer?.classList.remove('layui-footer-collapse');
      logo?.classList.remove('layui-logo-collapse');
      layoutLeft?.classList.remove('layui-layout-left-collapse');
    } else {
      side?.classList.add('layui-side-collapse');
      body?.classList.add('layui-body-collapse');
      footer?.classList.add('layui-footer-collapse');
      logo?.classList.add('layui-logo-collapse');
      layoutLeft?.classList.add('layui-layout-left-collapse');
    }
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  const refresh = () => {
    window.location.reload();
  };

  if (!user || !layuiReady) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: 20
      }}>
        <div style={{
          width: 40,
          height: 40,
          border: '3px solid #f3f3f3',
          borderTop: '3px solid #009688',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{color: '#999'}}>加载中...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="layui-layout layui-layout-admin" style={{minHeight: '100vh'}}>
      <style>{`
        body {
          background: #f2f2f2 !important;
        }
      `}</style>
      <div className="layui-header" id="adminHeader">
        <div className="layui-logo">
          <i className="layui-icon layui-icon-group"></i>
          <span className="logo-text">168招聘网后台</span>
        </div>

        <ul className="layui-nav layui-layout-left" id="adminLayoutLeft">
          <li className="layui-nav-item" lay-unselect="true">
            <a href="javascript:;" onClick={toggleSidebar}>
              <i className={`layui-icon ${sidebarCollapse ? 'layui-icon-spread-left' : 'layui-icon-shrink-right'}`}></i>
            </a>
          </li>
          <li className="layui-nav-item" lay-unselect="true">
            <a href="/" target="_blank">
              <i className="layui-icon layui-icon-website"></i>
            </a>
          </li>
        </ul>

        <ul className="layui-nav layui-layout-right">
          <li className="layui-nav-item" lay-unselect="true">
            <a href="javascript:;" onClick={refresh}>
              <i className="layui-icon layui-icon-refresh-3"></i>
            </a>
          </li>
          <li className="layui-nav-item" lay-unselect="true">
            <a href="javascript:;" onClick={() => setShowThemePanel(!showThemePanel)}>
              <i className="layui-icon layui-icon-theme"></i>
            </a>
          </li>
          <li className="layui-nav-item" lay-unselect="true">
            <a href="javascript:;" onClick={handleFullscreen}>
              <i className={`layui-icon ${fullscreen ? 'layui-icon-screen-restore' : 'layui-icon-screen-full'}`}></i>
            </a>
          </li>
          <li className="layui-nav-item">
            <a href="javascript:;">
              <i className="layui-icon layui-icon-username"></i> {user.username}
            </a>
          </li>
          <li className="layui-nav-item">
            <a href="javascript:;" onClick={handleLogout}>
              <i className="layui-icon layui-icon-logout"></i> 退出
            </a>
          </li>
        </ul>
      </div>

      {showThemePanel && (
        <div
          className="theme-panel-overlay"
          onClick={() => {
            console.log('点击遮罩层关闭主题面板');
            setShowThemePanel(false);
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.3)',
            zIndex: 99999
          }}
        >
          <div
            className="theme-panel"
            onClick={(e) => {
              console.log('阻止事件冒泡');
              e.stopPropagation();
            }}
            style={{
              position: 'fixed',
              top: '60px',
              right: '20px',
              width: '240px',
              background: '#fff',
              borderRadius: '4px',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.15)',
              zIndex: 100000,
              animation: 'layui-fadein 0.2s ease'
            }}
          >
            <div style={{padding: '16px'}}>
              <div style={{marginBottom: 16, fontSize: 14, fontWeight: 600, color: '#333'}}>主题配色</div>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px'}}>
                {Object.entries(themes).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => {
                      console.log('选择主题:', key, config);
                      handleThemeChange(key as Theme);
                    }}
                    title={config.name}
                    style={{
                      width: '100%',
                      aspectRatio: '1',
                      borderRadius: '6px',
                      border: currentTheme === key ? '3px solid #333' : '2px solid #e6e6e6',
                      background: config.primary,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      position: 'relative',
                      padding: 0,
                      outline: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.08)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {currentTheme === key && (
                      <i className="layui-icon layui-icon-ok" style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: '#fff',
                        fontSize: '20px',
                        textShadow: '0 0 3px rgba(0,0,0,0.4)'
                      }}></i>
                    )}
                  </button>
                ))}
              </div>
              <div style={{marginTop: 16, paddingTop: 16, borderTop: '1px solid #e6e6e6'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8}}>
                  <span style={{fontSize: 12, color: '#666'}}>当前: <strong style={{color: '#333'}}>{themes[currentTheme].name}</strong></span>
                </div>
                <button
                  onClick={() => {
                    console.log('关闭主题面板');
                    setShowThemePanel(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '8px',
                    fontSize: 13,
                    border: '1px solid #e6e6e6',
                    borderRadius: '2px',
                    background: '#fff',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f5f5f5';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#fff';
                  }}
                >
                  关闭面板
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="layui-side layui-bg-black" id="adminSide">
        <div className="layui-side-scroll">
          <ul className="layui-nav layui-nav-tree" lay-filter="adminNav">
            {menuItems.map((item) => (
              <li
                key={item.id}
                className={`layui-nav-item ${pathname === item.path ? 'layui-this' : ''}`}
              >
                <a href={item.path}>
                  <i className={`layui-icon ${item.icon}`}></i>
                  <cite>{item.name}</cite>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="layui-body" id="adminBody">
        <div style={{padding: 15}}>
          {children}
        </div>
      </div>
      <div className="layui-footer layui-bg-gray layui-text-center layui-font-gray layui-padding-15">
          <p>© 2026 168招聘网 - 管理后台 v1.0.0</p>
      </div>
    </div>
  );
}