'use client';

import React from 'react';
import Link from 'next/link';
import Sidebar from '@/components/layout/Sidebar';
import { jobService, companyService } from '@/lib/utils/data';
import JobCard from '@/components/job/JobCard';

export default function UserFavoritesPage() {
  const sidebarItems = [
    { key: 'profile', label: '个人信息', icon: '👤', href: '/user/profile' },
    { key: 'applications', label: '我的申请', icon: '📝', href: '/user/applications', badge: 3 },
    { key: 'favorites', label: '收藏职位', icon: '⭐', href: '/user/favorites' },
    { key: 'messages', label: '消息通知', icon: '💬', href: '/user/messages', badge: 5 },
    { key: 'settings', label: '账号设置', icon: '⚙️', href: '/user/settings' },
  ];

  // 获取收藏的职位（模拟数据，取前8个职位）
  const favoriteJobs = jobService.getLatestJobs(12);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* 侧边栏 */}
          <Sidebar items={sidebarItems} />

          {/* 主内容区 */}
          <div className="flex-1">
            {/* 页面标题 */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">收藏职位</h1>
              <p className="text-gray-600">共收藏 {favoriteJobs.length} 个职位</p>
            </div>

            {/* 收藏职位列表 */}
            {favoriteJobs.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {favoriteJobs.map((job) => {
                  const company = companyService.getById(job.companyId);
                  return (
                    <div key={job.id} className="relative">
                      <button
                        className="absolute top-4 right-4 z-10 text-yellow-500 hover:text-yellow-600 text-2xl"
                        title="取消收藏"
                      >
                        ⭐
                      </button>
                      <JobCard
                        job={job}
                        companyName={company?.name}
                        companyLogo={company?.logo}
                        companyVerified={company?.verified}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="layui-card">
                <div className="layui-card-body text-center py-12">
                  <div className="text-6xl mb-4">⭐</div>
                  <p className="text-gray-600 mb-4">还没有收藏任何职位</p>
                  <Link href="/jobs" className="layui-btn">
                    去找职位
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
