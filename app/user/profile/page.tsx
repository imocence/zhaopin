'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import UnifiedSidebar from '@/components/layout/UnifiedSidebar';
import { getStoredUser } from '@/lib/utils/auth-client';
import { User } from '@/types';
import useRequireAuth from '@/lib/hooks/useRequireAuth';

export default function UserProfilePage() {
  const isAuth = useRequireAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    skills: '',
    experience: '',
    education: '',
    expectedSalary: '',
    expectedSalaryType: 'yearly',
  });

  useEffect(() => {
    const currentUser = getStoredUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setFormData(prev => ({
      ...prev,
      username: (currentUser as any).username ?? prev.username,
      name: currentUser.name,
      email: currentUser.email,
      phone: (currentUser as any).phone ?? prev.phone,
      location: (currentUser as any).location ?? prev.location,
      bio: (currentUser as any).bio ?? prev.bio,
      skills: (currentUser as any).skills ?? prev.skills,
      experience: (currentUser as any).experience ?? prev.experience,
      education: (currentUser as any).education ?? prev.education,
      expectedSalary: (currentUser as any).expectedSalary ?? prev.expectedSalary,
      expectedSalaryType: (currentUser as any).expectedSalaryType ?? prev.expectedSalaryType,
    }));
    setLoaded(true);
  }, [router]);

  if (!loaded || !isAuth) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentUser = getStoredUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch(`/api/users/${currentUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
          bio: formData.bio,
        }),
      });

      if (!res.ok) {
        console.error('Failed to save user info', await res.text());
        return;
      }

      const data = await res.json().catch(() => null) as any;
      const updatedUser = data?.data as User;
      if (updatedUser) {
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving user info:', error);
    }
  };

  const sidebarItems = [
    { key: 'profile', label: '个人信息', icon: '👤', href: '/user/profile' },
    { key: 'applications', label: '我的申请', icon: '📝', href: '/user/applications', badge: 3 },
    { key: 'favorites', label: '收藏职位', icon: '⭐', href: '/user/favorites', badge: 12 },
    { key: 'messages', label: '消息通知', icon: '💬', href: '/user/messages', badge: 5 },
    { key: 'settings', label: '账号设置', icon: '⚙️', href: '/user/settings' },
  ];

  return (
    <div className="layui-container layui-mt20">
      <div className="layui-row layui-col-space20">
        {/* 侧边栏 */}
        <div className="layui-col-md3">
          <UnifiedSidebar items={sidebarItems} variant="default" />
        </div>

        {/* 主内容区 */}
        <div className="layui-col-md9">
          <div className="layui-card">
            <div className="layui-card-header">
              <span className="layui-font-bold">个人信息</span>
              {!isEditing && (
                <button
                  className="layui-btn layui-btn-sm layui-fr"
                  onClick={() => setIsEditing(true)}
                >
                  <i className="layui-icon layui-icon-edit"></i> 编辑资料
                </button>
              )}
            </div>
            <div className="layui-card-body">
              {isEditing ? (
                <form onSubmit={handleSubmit} className="layui-form">
                  {/* 基本信息 */}
                  <fieldset className="layui-elem-field">
                    <legend>基本信息</legend>
                    <div className="layui-field-box">
                      <div className="layui-form-item">
                        <div className="layui-inline">
                          <label className="layui-form-label">账号</label>
                          <div className="layui-input-inline">
                            <input
                              type="text"
                              name="username"
                              value={formData.username}
                              disabled
                              className="layui-input"
                            />
                          </div>
                        </div>
                        <div className="layui-inline">
                          <label className="layui-form-label">姓名</label>
                          <div className="layui-input-inline">
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              className="layui-input"
                              required
                            />
                          </div>
                        </div>
                        <div className="layui-inline">
                          <label className="layui-form-label">邮箱</label>
                          <div className="layui-input-inline">
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="layui-input"
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="layui-form-item">
                        <div className="layui-inline">
                          <label className="layui-form-label">手机号</label>
                          <div className="layui-input-inline">
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="layui-input"
                            />
                          </div>
                        </div>
                        <div className="layui-inline">
                          <label className="layui-form-label">所在地区</label>
                          <div className="layui-input-inline">
                            <input
                              type="text"
                              name="location"
                              value={formData.location}
                              onChange={handleInputChange}
                              className="layui-input"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </fieldset>

                  {/* 职业信息 */}
                  <fieldset className="layui-elem-field layui-mt20">
                    <legend>职业信息</legend>
                    <div className="layui-field-box">
                      <div className="layui-form-item">
                        <div className="layui-inline">
                          <label className="layui-form-label">工作年限</label>
                          <div className="layui-input-inline">
                            <select
                              name="experience"
                              value={formData.experience}
                              onChange={handleInputChange}
                              className="layui-input"
                            >
                              <option value="应届生">应届生</option>
                              <option value="1年以下">1年以下</option>
                              <option value="1-3年">1-3年</option>
                              <option value="3-5年">3-5年</option>
                              <option value="5-10年">5-10年</option>
                              <option value="10年以上">10年以上</option>
                            </select>
                          </div>
                        </div>
                        <div className="layui-inline">
                          <label className="layui-form-label">学历</label>
                          <div className="layui-input-inline">
                            <select
                              name="education"
                              value={formData.education}
                              onChange={handleInputChange}
                              className="layui-input"
                            >
                              <option value="高中">高中</option>
                              <option value="大专">大专</option>
                              <option value="本科">本科</option>
                              <option value="硕士">硕士</option>
                              <option value="博士">博士</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="layui-form-item">
                        <label className="layui-form-label">期望薪资</label>
                        <div className="layui-input-inline" style={{ width: '200px' }}>
                          <input
                            type="text"
                            name="expectedSalary"
                            value={formData.expectedSalary}
                            onChange={handleInputChange}
                            className="layui-input"
                            placeholder="例如: 80000-120000"
                          />
                        </div>
                        <div className="layui-input-inline" style={{ width: '100px' }}>
                          <select
                            name="expectedSalaryType"
                            value={formData.expectedSalaryType}
                            onChange={handleInputChange}
                            className="layui-input"
                          >
                            <option value="hourly">时薪</option>
                            <option value="monthly">月薪</option>
                            <option value="yearly">年薪</option>
                          </select>
                        </div>
                      </div>
                      <div className="layui-form-item">
                        <label className="layui-form-label">技能标签</label>
                        <div className="layui-input-block">
                          <input
                            type="text"
                            name="skills"
                            value={formData.skills}
                            onChange={handleInputChange}
                            className="layui-input"
                            placeholder="用逗号分隔多个技能"
                          />
                        </div>
                      </div>
                    </div>
                  </fieldset>

                  {/* 个人简介 */}
                  <fieldset className="layui-elem-field layui-mt20">
                    <legend>个人简介</legend>
                    <div className="layui-field-box">
                      <div className="layui-form-item layui-form-text">
                        <label className="layui-form-label">简介</label>
                        <div className="layui-input-block">
                          <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleInputChange}
                            className="layui-textarea"
                            placeholder="简单介绍一下自己..."
                          />
                        </div>
                      </div>
                    </div>
                  </fieldset>

                  {/* 操作按钮 */}
                  <div className="layui-form-item layui-mt20">
                    <div className="layui-input-block">
                      <button type="submit" className="layui-btn layui-btn-primary">
                        <i className="layui-icon layui-icon-ok"></i> 保存
                      </button>
                      <button
                        type="button"
                        className="layui-btn layui-btn-primary"
                        onClick={() => setIsEditing(false)}
                      >
                        取消
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <>
                  {/* 头像和基本信息 */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                    <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '48px' }}>👤</span>
                    </div>
                    <div>
                      <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>{formData.name}</h2>
                      <p className="layui-font-gray">{formData.email}</p>
                      <p className="layui-font-sm layui-font-gray-light layui-mt5">{formData.location}</p>
                    </div>
                  </div>

                  {/* 职业信息 */}
                  <div className="layui-row layui-col-space15 layui-mb20">
                    <div className="layui-col-md4 layui-col-xs6">
                      <div className="layui-card">
                        <div className="layui-card-body layui-text-center">
                          <div className="layui-font-xs layui-font-gray-light">工作年限</div>
                          <div className="layui-font-bold layui-mt5">{formData.experience}</div>
                        </div>
                      </div>
                    </div>
                    <div className="layui-col-md4 layui-col-xs6">
                      <div className="layui-card">
                        <div className="layui-card-body layui-text-center">
                          <div className="layui-font-xs layui-font-gray-light">学历</div>
                          <div className="layui-font-bold layui-mt5">{formData.education}</div>
                        </div>
                      </div>
                    </div>
                    <div className="layui-col-md4 layui-col-xs6">
                      <div className="layui-card">
                        <div className="layui-card-body layui-text-center">
                          <div className="layui-font-xs layui-font-gray-light">期望薪资</div>
                          <div className="layui-font-bold layui-mt5">
                            ${formData.expectedSalary}
                            <span className="layui-font-xs layui-font-gray-light">
                              /{formData.expectedSalaryType === 'yearly' ? '年' : formData.expectedSalaryType === 'monthly' ? '月' : '时'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 技能标签 */}
                  <div className="layui-mb20">
                    <div className="layui-font-sm layui-font-gray-light layui-mb10">技能标签</div>
                    <div>
                      {formData.skills.split(',').map((skill, index) => (
                        <span key={index} className="layui-tag layui-bg-cyan layui-mr5 layui-mb5">
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 个人简介 */}
                  <div className="layui-mb20">
                    <div className="layui-font-sm layui-font-gray-light layui-mb10">个人简介</div>
                    <blockquote className="layui-elem-quote layui-quote-nm">
                      {formData.bio || '暂无简介'}
                    </blockquote>
                  </div>

                  {/* 资料完整度 */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span className="layui-font-sm layui-font-gray-light">资料完整度</span>
                      <span className="layui-font-sm layui-font-cyan">85%</span>
                    </div>
                    <div className="layui-progress">
                      <div className="layui-progress-bar layui-bg-cyan" lay-percent="85%"></div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
