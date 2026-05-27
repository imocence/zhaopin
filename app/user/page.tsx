'use client';

import UnifiedSidebar from '@/components/layout/UnifiedSidebar';
import Link from 'next/link';
import { companyService, jobService } from '@/lib/utils/data';

export default function UserCenterPage() {
  const user = {
    id: 'user1',
    name: '张三',
    email: 'demo@example.com',
    avatar: '/images/avatars/default.png',
  };

  const sidebarItems = [
    {
      key: 'profile',
      label: '个人信息',
      icon: '👤',
      href: '/user/profile',
    },
    {
      key: 'applications',
      label: '我的申请',
      icon: '📝',
      href: '/user/applications',
      badge: 3,
    },
    {
      key: 'favorites',
      label: '收藏职位',
      icon: '⭐',
      href: '/user/favorites',
      badge: 12,
    },
    {
      key: 'messages',
      label: '消息通知',
      icon: '💬',
      href: '/user/messages',
      badge: 5,
    },
    {
      key: 'settings',
      label: '账号设置',
      icon: '⚙️',
      href: '/user/settings',
    },
  ];

  const latestJobs = jobService.getLatestJobs(4);

  return (
    <div className="layui-container layui-mt20">
      <div className="layui-card">
        <div className="layui-card-body layui-hero-gradient">
          <div className="layui-flex layui-align-center layui-gap-15">
            <div className="layui-avatar-ring">
              <span className="layui-font-3xl">👤</span>
            </div>
            <div>
              <h1 className="layui-hero-headline">欢迎回来，{user.name}！</h1>
              <p className="layui-hero-subline layui-font-sm">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="layui-row layui-col-space20 layui-mt20">
        <div className="layui-col-md3">
          <UnifiedSidebar items={sidebarItems} variant="default" />
        </div>

        <div className="layui-col-md9">
          <div className="layui-row layui-col-space15 layui-mb20">
            <div className="layui-col-xs6 layui-col-sm3">
              <Link href="/user/applications" className="layui-text-decoration-none">
                <div className="layui-card">
                  <div className="layui-card-body layui-text-center">
                    <div className="layui-stat-number layui-stat-number-cyan">3</div>
                    <div className="layui-font-sm layui-font-gray layui-mt5">待处理申请</div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="layui-col-xs6 layui-col-sm3">
              <Link href="/user/favorites" className="layui-text-decoration-none">
                <div className="layui-card">
                  <div className="layui-card-body layui-text-center">
                    <div className="layui-stat-number layui-stat-number-blue">12</div>
                    <div className="layui-font-sm layui-font-gray layui-mt5">收藏职位</div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="layui-col-xs6 layui-col-sm3">
              <Link href="/user/messages" className="layui-text-decoration-none">
                <div className="layui-card">
                  <div className="layui-card-body layui-text-center">
                    <div className="layui-stat-number layui-stat-number-orange">5</div>
                    <div className="layui-font-sm layui-font-gray layui-mt5">未读消息</div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="layui-col-xs6 layui-col-sm3">
              <Link href="/user/profile" className="layui-text-decoration-none">
                <div className="layui-card">
                  <div className="layui-card-body layui-text-center">
                    <div className="layui-stat-number layui-stat-number-teal">85%</div>
                    <div className="layui-font-sm layui-font-gray layui-mt5">资料完整度</div>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          <div className="layui-card">
            <div className="layui-card-header">
              <span className="layui-font-bold">最新申请</span>
              <Link href="/user/applications" className="layui-font-cyan layui-fr layui-text-decoration-none">查看全部</Link>
            </div>
            <div className="layui-card-body">
              {latestJobs.map((job) => {
                const company = companyService.getById(job.companyId);
                return (
                  <Link
                    key={job.id}
                    href={`/jobs/${job.id}`}
                    className="layui-text-decoration-none layui-link-block"
                  >
                    <div className="layui-row layui-col-space10 layui-feed-row">
                      <div className="layui-col-xs2">
                        <div className="layui-feed-logo">
                          <span className="layui-font-lg">🏢</span>
                        </div>
                      </div>
                      <div className="layui-col-xs7">
                        <h4 className="layui-feed-title">{job.title}</h4>
                        <p className="layui-font-sm layui-font-gray">{company?.name} • {job.location}</p>
                        <p className="layui-font-xs layui-font-gray-light layui-mt5">申请于 2天前</p>
                      </div>
                      <div className="layui-col-xs3 layui-text-right">
                        <span className="layui-badge layui-bg-blue">处理中</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="layui-card layui-mt20">
            <div className="layui-card-header">
              <i className="layui-icon layui-icon-util"></i> 快捷操作
            </div>
            <div className="layui-card-body">
              <div className="layui-row layui-col-space15">
                <div className="layui-col-xs6 layui-col-sm3">
                  <Link href="/jobs" className="layui-text-decoration-none">
                    <div className="layui-card layui-text-center layui-card-click">
                      <div className="layui-card-body">
                        <div className="layui-font-2xl layui-mb10">🔍</div>
                        <div className="layui-font-sm">搜索职位</div>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="layui-col-xs6 layui-col-sm3">
                  <Link href="/post" className="layui-text-decoration-none">
                    <div className="layui-card layui-text-center layui-card-click">
                      <div className="layui-card-body">
                        <div className="layui-font-2xl layui-mb10">📝</div>
                        <div className="layui-font-sm">发布职位</div>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="layui-col-xs6 layui-col-sm3">
                  <Link href="/user/profile" className="layui-text-decoration-none">
                    <div className="layui-card layui-text-center layui-card-click">
                      <div className="layui-card-body">
                        <div className="layui-font-2xl layui-mb10">👤</div>
                        <div className="layui-font-sm">完善资料</div>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="layui-col-xs6 layui-col-sm3">
                  <Link href="/employer/company" className="layui-text-decoration-none">
                    <div className="layui-card layui-text-center layui-card-click">
                      <div className="layui-card-body">
                        <div className="layui-font-2xl layui-mb10">✅</div>
                        <div className="layui-font-sm">企业认证</div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
