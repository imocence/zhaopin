'use client';
import { useEffect, useState } from 'react';
import type { ApiResponse } from '@/lib/utils/api-response';

interface ReportItem {
  id: string;
  type: '职位举报' | '企业举报' | '用户举报';
  title: string;
  description: string;
  targetId?: string;
  targetName: string;
  reporterId?: string;
  reporterName: string;
  status: 'pending' | 'processing' | 'resolved';
  createdAt: string;
}

// use `ApiResponse<T>` from `lib/utils/api-response`

export default function AdminReportsPage() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loadingIds, setLoadingIds] = useState<string[]>([]);

  useEffect(() => {
    async function loadReports() {
      try {
        const response = await fetch('/api/reports', { credentials: 'include' });
        const json = (await response.json()) as ApiResponse<ReportItem[]>;
        if (response.ok && json.status === 'success') {
          setReports(json.data || []);
        } else {
          console.error('获取举报数据失败：', json.message || response.statusText);
        }
      } catch (error) {
        console.error('获取举报数据异常：', error);
      }
    }

    loadReports();
  }, []);

  const handleProcess = async (reportId: string) => {
    const report = reports.find((item) => item.id === reportId);
    if (!report) return;

    let nextStatus: ReportItem['status'] | undefined;
    if (report.status === 'pending') {
      nextStatus = 'processing';
    } else if (report.status === 'processing') {
      nextStatus = 'resolved';
    }

    if (!nextStatus) {
      alert('该举报已经处于已解决状态');
      return;
    }

    setLoadingIds((prev) => [...prev, reportId]);
    try {
      const response = await fetch(`/api/reports/${reportId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: nextStatus }),
        credentials: 'include',
      });
      const json = (await response.json()) as ApiResponse<ReportItem>;
      if (response.ok && json.status === 'success') {
        const updatedReport = json.data as ReportItem;
        setReports((prev) => prev.map((item) => (item.id === reportId ? updatedReport : item)));
      } else {
        console.error('更新举报状态失败：', json.message || response.statusText);
        alert(json.message || '更新举报状态失败');
      }
    } catch (error) {
      console.error('更新举报状态异常：', error);
      alert('更新举报状态异常，请检查控制台');
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== reportId));
    }
  };

  const renderStatusBadge = (status: ReportItem['status']) => {
    switch (status) {
      case 'pending':
        return <span className="layui-badge layui-bg-orange">待处理</span>;
      case 'processing':
        return <span className="layui-badge layui-bg-blue">处理中</span>;
      case 'resolved':
        return <span className="layui-badge layui-bg-green">已解决</span>;
      default:
        return <span className="layui-badge layui-bg-gray">未知</span>;
    }
  };

  const pendingCount = reports.filter((report) => report.status === 'pending').length;
  const processingCount = reports.filter((report) => report.status === 'processing').length;
  const resolvedCount = reports.filter((report) => report.status === 'resolved').length;

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
                <h2 className="layui-font-title layui-mt10">{pendingCount}</h2>
                <p className="layui-text layui-word-aux">待处理举报</p>
              </div>
            </div>
            <div className="layui-col-md4 layui-col-sm4 layui-col-xs12">
              <div className="layui-elem-quote layui-text-center">
                <h2 className="layui-font-title layui-mt10">{processingCount}</h2>
                <p className="layui-text layui-word-aux">处理中举报</p>
              </div>
            </div>
            <div className="layui-col-md4 layui-col-sm4 layui-col-xs12">
              <div className="layui-elem-quote layui-text-center">
                <h2 className="layui-font-title layui-mt10">{resolvedCount}</h2>
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
              {reports.length === 0 ? (
                <tr>
                  <td className="layui-elem-quote" colSpan={8}>
                    暂无举报记录
                  </td>
                </tr>
              ) : (
                reports.map((report) => (
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
                    <td>{renderStatusBadge(report.status)}</td>
                    <td>
                      <div className="layui-btn-group">
                        <button
                          className="layui-btn layui-btn-xs layui-btn-primary"
                          disabled={report.status === 'resolved' || loadingIds.includes(report.id)}
                          onClick={() => handleProcess(report.id)}
                        >
                          <i className="layui-icon layui-icon-form"></i>
                          {report.status === 'pending' ? ' 开始处理' : report.status === 'processing' ? ' 标记已解决' : ' 已解决'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
