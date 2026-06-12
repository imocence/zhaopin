import React from 'react';

type StatusMap = Record<string, { text: string; class: string }>;

export const jobStatusMap: StatusMap = {
  active: { text: '招聘中', class: 'layui-bg-green' },
  inactive: { text: '已下架', class: 'layui-bg-gray' },
  draft: { text: '草稿', class: 'layui-bg-orange' },
  closed: { text: '已关闭', class: 'layui-bg-red' },
};

export const applicationStatusMap: StatusMap = {
  pending: { text: '待处理', class: 'layui-bg-orange' },
  viewed: { text: '已查看', class: 'layui-bg-blue' },
  interview: { text: '面试中', class: 'layui-bg-green' },
  offered: { text: '已录用', class: 'layui-bg-primary' },
  rejected: { text: '已拒绝', class: 'layui-bg-gray' },
};

export const companyStatusMap: StatusMap = {
  verified: { text: '已认证', class: 'layui-bg-blue' },
  pending: { text: '待审核', class: 'layui-bg-orange' },
  rejected: { text: '已拒绝', class: 'layui-bg-red' },
  unverified: { text: '未认证', class: 'layui-bg-gray' },
};

export const userStatusMap: StatusMap = {
  active: { text: '正常', class: 'layui-bg-green' },
  inactive: { text: '禁用', class: 'layui-bg-gray' },
  suspended: { text: '已封禁', class: 'layui-bg-red' },
};

export const userRoleMap: StatusMap = {
  admin: { text: '管理员', class: 'layui-bg-red' },
  employer: { text: '企业用户', class: 'layui-bg-blue' },
  jobseeker: { text: '求职者', class: 'layui-bg-green' },
};

const createBadge = (text: string, className: string) =>
  React.createElement('span', { className: `layui-badge ${className}` }, text);

export const getJobStatusBadge = (status: string) => {
  const s = jobStatusMap[status] || { text: status, class: '' };
  return createBadge(s.text, s.class);
};

export const getApplicationStatusBadge = (status: string) => {
  const s = applicationStatusMap[status] || { text: status, class: '' };
  return createBadge(s.text, s.class);
};

export const getCompanyStatusBadge = (status: string) => {
  const s = companyStatusMap[status] || { text: status, class: '' };
  return createBadge(s.text, s.class);
};

export const getUserStatusBadge = (status: string) => {
  const s = userStatusMap[status] || { text: status, class: '' };
  return createBadge(s.text, s.class);
};
