'use client';
import { useState } from 'react';

export default function AdminReportsPage() {
  const [reports] = useState([
    {
      id: '1',
      type: '职位举报',
      title: '职位信息不实',
      targetId: 'job1',
      targetName: '高级软件工程师',
      reporter: 'user1',
      reporterName: '张三',
      status: 'pending',
      createdAt: '2026-04-15',
      description: '该职位的薪资描述与实际不符',
    },
    {
      id: '2',
      type: '企业举报',
      title: '企业存在欺诈行为',
      targetId: 'company1',
      targetName: '某科技公司',
      reporter: 'user2',
      reporterName: '李四',
      status: 'processing',
      createdAt: '2026-04-14',
      description: '该企业要求先交钱再面试',
    },
    {
      id: '3',
      type: '用户举报',
      title: '用户发布不当信息',
      targetId: 'user3',
      targetName: '王五',
      reporter: 'user4',
      reporterName: '赵六',
      status: 'resolved',
      createdAt: '2026-04-13',
      description: '该用户在评论区发布广告信息',
    },
  ]);

  const handleProcess = (reportId: string) => {
    alert('开始处理举报');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return '<span class="layui-badge layui-bg-orange">待处理</span>';
      case 'processing':
        return '<span class="layui-badge layui-bg-blue">处理中</span>';
      case 'resolved':
        return '<span class="layui-badge layui-bg-green">已解决</span>';
      default:
        return '<span class="layui-badge layui-bg-gray">未知</span>';
    }
  };

  return (
    <div className="layui-fluid">
      <fieldset className="layui-elem-field">
        <legend>举报管理</legend>
        <div className="layui-field-box">
          <p>处理用户提交的各类举报信息</p>
        </div>
      </fieldset>

      <div className="layui-card">
        <div className="layui-card-header">举报统计</div>
        <div className="layui-card-body">
          <div className="layui-row layui-col-space15">
            <div className="layui-col-md4 layui-col-sm4 layui-col-xs12">
              <div className="layui-elem-quote layui-text-center">
                <h2 className="layui-font-title layui-mt10">{reports.filter(r => r.status === 'pending').length}</h2>
                <p className="layui-text layui-word-aux">待处理举报</p>
              </div>
            </div>
            <div className="layui-col-md4 layui-col-sm4 layui-col-xs12">
              <div className="layui-elem-quote layui-text-center">
                <h2 className="layui-font-title layui-mt10">{reports.filter(r => r.status === 'processing').length}</h2>
                <p className="layui-text layui-word-aux">处理中举报</p>
              </div>
            </div>
            <div className="layui-col-md4 layui-col-sm4 layui-col-xs12">
              <div className="layui-elem-quote layui-text-center">
                <h2 className="layui-font-title layui-mt10">{reports.filter(r => r.status === 'resolved').length}</h2>
                <p className="layui-text layui-word-aux">已解决举报</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="layui-card">
        <div className="layui-card-header">举报列表</div>
        <div className="layui-card-body">
          <table className="layui-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>类型</th>
                <th>标题</th>
                <th>举报对象</th>
                <th>举报人</th>
                <th>举报时间</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id}>
                  <td>{report.id}</td>
                  <td>{report.type}</td>
                  <td>
                    <strong>{report.title}</strong>
                    <div className="layui-text layui-word-aux layui-mt5">
                      {report.description}
                    </div>
                  </td>
                  <td>{report.targetName}</td>
                  <td>{report.reporterName}</td>
                  <td>{report.createdAt}</td>
                  <td dangerouslySetInnerHTML={{ __html: getStatusBadge(report.status) }} />
                  <td>
                    <div className="layui-btn-group">
                      <button
                        className="layui-btn layui-btn-xs layui-btn-primary"
                        onClick={() => handleProcess(report.id)}
                      >
                        <i className="layui-icon layui-icon-form"></i> 处理
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
