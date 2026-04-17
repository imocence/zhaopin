'use client';

import Sidebar from '@/components/layout/Sidebar';
import Image from 'next/image';
import Link from 'next/link';
import { companyService, jobService } from '@/lib/utils/data';

const DEFAULT_LOGO = '/images/logos/default.svg';

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
      {/* 页面头部 */}
      <div className="layui-card">
        <div className="layui-card-body" style={{background: 'linear-gradient(135deg, #009688 0%, #1e9fff 100%)', padding: '30px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
            <div style={{width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid rgba(255,255,255,0.3)'}}>
              <span style={{fontSize: '40px'}}>👤</span>
            </div>
            <div>
              <h1 style={{fontSize: '28px', fontWeight: 'bold', color: '#fff', marginBottom: '5px'}}>欢迎回来，{user.name}！</h1>
              <p style={{color: 'rgba(255,255,255,0.9)'}}>{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="layui-row layui-col-space20 layui-mt20">
        {/* 侧边栏 */}
        <div className="layui-col-md3">
          <Sidebar items={sidebarItems} />
        </div>

        {/* 主内容区 */}
        <div className="layui-col-md9">
          {/* 统计数据 */}
          <div className="layui-row layui-col-space15 layui-mb20">
            <div className="layui-col-xs6 layui-col-sm3">
              <Link href="/user/applications" className="layui-text-decoration-none">
                <div className="layui-card">
                  <div className="layui-card-body layui-text-center">
                    <div style={{fontSize: '36px', fontWeight: 'bold', color: '#009688'}}>3</div>
                    <div className="layui-font-sm layui-font-gray layui-mt5">待处理申请</div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="layui-col-xs6 layui-col-sm3">
              <Link href="/user/favorites" className="layui-text-decoration-none">
                <div className="layui-card">
                  <div className="layui-card-body layui-text-center">
                    <div style={{fontSize: '36px', fontWeight: 'bold', color: '#1e9fff'}}>12</div>
                    <div className="layui-font-sm layui-font-gray layui-mt5">收藏职位</div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="layui-col-xs6 layui-col-sm3">
              <Link href="/user/messages" className="layui-text-decoration-none">
                <div className="layui-card">
                  <div className="layui-card-body layui-text-center">
                    <div style={{fontSize: '36px', fontWeight: 'bold', color: '#ffb800'}}>5</div>
                    <div className="layui-font-sm layui-font-gray layui-mt5">未读消息</div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="layui-col-xs6 layui-col-sm3">
              <Link href="/user/profile" className="layui-text-decoration-none">
                <div className="layui-card">
                  <div className="layui-card-body layui-text-center">
                    <div style={{fontSize: '36px', fontWeight: 'bold', color: '#16baaa'}}>85%</div>
                    <div className="layui-font-sm layui-font-gray layui-mt5">资料完整度</div>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* 最新动态 */}
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
                    className="layui-text-decoration-none"
                    style={{display: 'block'}}
                  >
                    <div className="layui-row layui-col-space10" style={{padding: '15px', borderBottom: '1px solid #eee'}}>
                      <div className="layui-col-xs2">
                        <div style={{width: '50px', height: '50px', borderRadius: '8px', background: '#f8f8f8', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                          <span style={{fontSize: '24px'}}>🏢</span>
                        </div>
                      </div>
                      <div className="layui-col-xs7">
                        <h4 style={{fontSize: '15px', fontWeight: 'bold', color: '#333', marginBottom: '8px'}}>{job.title}</h4>
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

          {/* 快捷操作 */}
          <div className="layui-card layui-mt20">
            <div className="layui-card-header">
              <i className="layui-icon layui-icon-util"></i> 快捷操作
            </div>
            <div className="layui-card-body">
              <div className="layui-row layui-col-space15">
                <div className="layui-col-xs6 layui-col-sm3">
                  <Link href="/jobs" className="layui-text-decoration-none">
                    <div className="layui-card layui-text-center" style={{cursor: 'pointer'}}>
                      <div className="layui-card-body">
                        <div style={{fontSize: '36px', marginBottom: '10px'}}>🔍</div>
                        <div className="layui-font-sm">搜索职位</div>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="layui-col-xs6 layui-col-sm3">
                  <Link href="/post" className="layui-text-decoration-none">
                    <div className="layui-card layui-text-center" style={{cursor: 'pointer'}}>
                      <div className="layui-card-body">
                        <div style={{fontSize: '36px', marginBottom: '10px'}}>📝</div>
                        <div className="layui-font-sm">发布职位</div>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="layui-col-xs6 layui-col-sm3">
                  <Link href="/user/profile" className="layui-text-decoration-none">
                    <div className="layui-card layui-text-center" style={{cursor: 'pointer'}}>
                      <div className="layui-card-body">
                        <div style={{fontSize: '36px', marginBottom: '10px'}}>👤</div>
                        <div className="layui-font-sm">完善资料</div>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="layui-col-xs6 layui-col-sm3">
                  <Link href="/company/verify" className="layui-text-decoration-none">
                    <div className="layui-card layui-text-center" style={{cursor: 'pointer'}}>
                      <div className="layui-card-body">
                        <div style={{fontSize: '36px', marginBottom: '10px'}}>✅</div>
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
