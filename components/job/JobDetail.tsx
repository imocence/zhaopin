'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Job } from '@/types';
import { formatSalary, formatFullDate } from '@/lib/utils/format';
import Tag from '@/components/ui/Tag';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

const DEFAULT_LOGO = '/images/logos/default.svg';

export interface JobDetailProps {
  job: Job;
  companyName?: string;
  companyLogo?: string;
  companyDescription?: string;
  companyLocation?: string;
  companyVerified?: boolean;
}

const JobDetail: React.FC<JobDetailProps> = ({
  job,
  companyName,
  companyLogo,
  companyDescription,
  companyLocation,
  companyVerified = false,
}) => {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const logoSrc = logoError || !companyLogo ? DEFAULT_LOGO : companyLogo;

  const getSalaryVariant = (): 'red' | 'orange' | 'primary' => {
    const avgSalary = (job.salaryMin + job.salaryMax) / 2;
    if (job.salaryType === 'yearly' && avgSalary > 120000) return 'red';
    if (job.salaryType === 'yearly' && avgSalary > 80000) return 'orange';
    return 'primary';
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* 头部信息 */}
      <div className="layui-card mb-6">
        <div className="layui-card-body">
          <div className="flex items-start gap-6">
            {/* 公司Logo */}
            <div className="w-20 h-20 rounded bg-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
              <Image
                src={logoSrc}
                alt={companyName || '公司'}
                width={80}
                height={80}
                className="object-cover"
                onError={() => setLogoError(true)}
              />
            </div>

            {/* 职位基本信息 */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-3">{job.title}</h1>

              <div className="flex flex-wrap items-center gap-3 mb-3">
                <Tag variant={getSalaryVariant()}>
                  {formatSalary(job.salaryMin, job.salaryMax, job.salaryType)}
                </Tag>
                {companyVerified && (
                  <Tag variant="blue">已认证企业</Tag>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  {companyName}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {job.location}, {job.state}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  发布于 {formatFullDate(job.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-3 mt-6">
            <Button className="flex-1" onClick={() => setShowApplyModal(true)}>
              立即申请
            </Button>
            <Button variant="outline" className="flex-1">
              收藏职位
            </Button>
          </div>
        </div>
      </div>

      {/* 职位详情 */}
      <div className="layui-card mb-6">
        <div className="layui-card-header">职位描述</div>
        <div className="layui-card-body">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {job.description}
          </p>
        </div>
      </div>

      {/* 任职要求 */}
      <div className="layui-card mb-6">
        <div className="layui-card-header">任职要求</div>
        <div className="layui-card-body">
          <ul className="space-y-2">
            {job.requirements.map((req, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-[var(--layui-primary)] mt-1">•</span>
                <span className="text-gray-700">{req}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 职位福利 */}
      {job.benefits && job.benefits.length > 0 && (
        <div className="layui-card mb-6">
          <div className="layui-card-header">职位福利</div>
          <div className="layui-card-body">
            <div className="flex flex-wrap gap-2">
              {job.benefits.map((benefit, index) => (
                <Tag key={index} variant="outline">
                  {benefit}
                </Tag>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 职位信息 */}
      <div className="layui-card mb-6">
        <div className="layui-card-header">职位信息</div>
        <div className="layui-card-body">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">职位分类：</span>
              <span className="text-gray-900 ml-2">{job.category}</span>
            </div>
            <div>
              <span className="text-gray-500">工作地点：</span>
              <span className="text-gray-900 ml-2">{job.location}, {job.state}</span>
            </div>
            <div>
              <span className="text-gray-500">经验要求：</span>
              <span className="text-gray-900 ml-2">{job.experience}</span>
            </div>
            <div>
              <span className="text-gray-500">学历要求：</span>
              <span className="text-gray-900 ml-2">{job.education}</span>
            </div>
            <div>
              <span className="text-gray-500">薪资类型：</span>
              <span className="text-gray-900 ml-2">
                {job.salaryType === 'hourly' ? '时薪' : job.salaryType === 'monthly' ? '月薪' : '年薪'}
              </span>
            </div>
            <div>
              <span className="text-gray-500">浏览量：</span>
              <span className="text-gray-900 ml-2">{job.views}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 公司信息 */}
      <div className="layui-card">
        <div className="layui-card-header">公司信息</div>
        <div className="layui-card-body">
          <div className="flex gap-4">
            <div className="w-16 h-16 rounded bg-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
              <Image
                src={logoSrc}
                alt={companyName || '公司'}
                width={64}
                height={64}
                className="object-cover"
                onError={() => setLogoError(true)}
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {companyName}
                {companyVerified && (
                  <Tag variant="blue" className="ml-2">已认证</Tag>
                )}
              </h3>
              <p className="text-gray-600 text-sm">
                {companyLocation && <span>📍 {companyLocation}</span>}
              </p>
              {companyDescription && (
                <p className="text-gray-700 text-sm mt-2">{companyDescription}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 申请弹窗 */}
      <Modal
        open={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        title="申请职位"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowApplyModal(false)}>
              取消
            </Button>
            <Button onClick={() => setShowApplyModal(false)}>
              提交申请
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              姓名 *
            </label>
            <input type="text" className="layui-input" placeholder="请输入您的姓名" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              邮箱 *
            </label>
            <input type="email" className="layui-input" placeholder="请输入您的邮箱" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              手机号
            </label>
            <input type="tel" className="layui-input" placeholder="请输入您的手机号" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              简历 *
            </label>
            <input type="file" className="layui-input" accept=".pdf,.doc,.docx" />
            <p className="text-xs text-gray-500 mt-1">支持 PDF、Word 格式，文件大小不超过 5MB</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              求职信
            </label>
            <textarea
              className="layui-textarea"
              rows={4}
              placeholder="请简单介绍您的优势和为什么适合这个职位..."
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default JobDetail;
