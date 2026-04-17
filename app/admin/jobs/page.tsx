'use client';
import { useEffect, useRef } from 'react';
import { jobService, companyService } from '@/lib/utils/data';

declare global {
  interface Window {
    layui: any;
  }
}

export default function AdminJobsPage() {
  const tableRef = useRef<any>(null);

  useEffect(() => {
    const jobs = jobService.getAll();
    (window as any).jobs = jobs;

    const initTable = () => {
      const layui = window.layui;
      if (!layui) {
        setTimeout(initTable, 100);
        return;
      }

      layui.use(['table', 'layer', 'form'], function(table: any, layer: any, form: any) {
        const $ = layui.$; // 获取 jQuery 对象
        tableRef.current = table.render({
          elem: '#jobTable',
          data: jobs,
          page: true,
          limits: [10, 20, 30, 50],
          limit: 10,
          cols: [[
            {field: 'id', title: 'ID', width: 80, sort: true},
            {field: 'title', title: '职位名称', minWidth: 180},
            {
              field: 'companyId',
              title: '公司',
              width: 140,
              templet: function(d: any) {
                const company = companyService.getById(d.companyId);
                return company?.name || '<span style="color: #999;">未知</span>';
              }
            },
            {
              field: 'category',
              title: '分类',
              width: 100
            },
            {
              field: 'location',
              title: '位置',
              width: 140,
              templet: function(d: any) {
                return `${d.location}, ${d.state}`;
              }
            },
            {
              field: 'salary',
              title: '薪资',
              width: 140,
              templet: function(d: any) {
                const typeMap: { [key: string]: string } = {
                  'hourly': '时薪',
                  'monthly': '月薪',
                  'yearly': '年薪'
                };
                return `$${d.salaryMin} - $${d.salaryMax}
                  <span class="layui-badge layui-bg-gray" style="margin-left: 5px;">
                    ${typeMap[d.salaryType] || '年薪'}
                  </span>`;
              }
            },
            {
              field: 'status',
              title: '状态',
              width: 90,
              templet: function(d: any) {
                const statusMap: { [key: string]: string } = {
                  'active': '<span class="layui-badge layui-bg-green">招聘中</span>',
                  'inactive': '<span class="layui-badge layui-bg-gray">已下架</span>',
                  'draft': '<span class="layui-badge layui-bg-orange">草稿</span>'
                };
                return statusMap[d.status] || '<span class="layui-badge">未知</span>';
              }
            },
            {
              field: 'views',
              title: '浏览',
              width: 70,
              templet: function(d: any) {
                return `<span class="layui-badge-dot layui-bg-green"></span> ${d.views || 0}`;
              }
            },
            {
              field: 'applications',
              title: '申请',
              width: 70,
              templet: function(d: any) {
                return `<span class="layui-badge-dot layui-bg-blue"></span> ${d.applications || 0}`;
              }
            },
            {
              field: 'createdAt',
              title: '发布时间',
              width: 110,
              sort: true,
              templet: function(d: any) {
                return new Date(d.createdAt).toLocaleDateString('zh-CN');
              }
            },
            {
              fixed: 'right',
              title: '操作',
              width: 250,
              align: 'center',
              templet: function(d: any) {
                return `
                  <a class="layui-btn layui-btn-xs" lay-event="edit">
                    <i class="layui-icon layui-icon-edit"></i>
                  </a>
                  <a class="layui-btn layui-btn-xs layui-btn-normal" lay-event="toggle">
                    <i class="layui-icon layui-icon-play"></i>
                  </a>
                  <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">
                    <i class="layui-icon layui-icon-delete"></i>
                  </a>
                `;
              }
            }
          ]]
        });

        // 监听工具条事件
        table.on('tool(jobTable)', function(obj: any) {
          const data = obj.data;

          if (obj.event === 'del') {
            layer.confirm('确定要删除该职位吗？', {icon: 3, title: '提示'}, function(index: any) {
              const jobs = jobService.getAll().filter(j => j.id !== data.id);
              (window as any).jobs = jobs;

              tableRef.current?.reload({
                data: jobs
              });

              layer.msg('删除成功', {icon: 1});
              layer.close(index);
            });
          } else if (obj.event === 'edit') {
            // 获取所有公司选项
            const companies = companyService.getAll();
            const companyOptions = companies.map(c =>
              `<option value="${c.id}" ${data.companyId === c.id ? 'selected' : ''}>${c.name}</option>`
            ).join('');

            // 薪资类型选项
            const salaryTypes = [
              {value: 'hourly', label: '时薪'},
              {value: 'monthly', label: '月薪'},
              {value: 'yearly', label: '年薪'}
            ];
            const salaryTypeOptions = salaryTypes.map(st =>
              `<option value="${st.value}" ${data.salaryType === st.value ? 'selected' : ''}>${st.label}</option>`
            ).join('');

            // 状态选项
            const statuses = [
              {value: 'active', label: '招聘中'},
              {value: 'inactive', label: '已下架'},
              {value: 'draft', label: '草稿'}
            ];
            const statusOptions = statuses.map(s =>
              `<option value="${s.value}" ${data.status === s.value ? 'selected' : ''}>${s.label}</option>`
            ).join('');

            // 经验选项
            const experiences = ['不限', '1-3年', '3-5年', '5-10年', '10年以上'];
            const experienceOptions = experiences.map(e =>
              `<option value="${e}" ${data.experience === e ? 'selected' : ''}>${e}</option>`
            ).join('');

            // 学历选项
            const educations = ['不限', '高中', '大专', '本科', '硕士', '博士'];
            const educationOptions = educations.map(e =>
              `<option value="${e}" ${data.education === e ? 'selected' : ''}>${e}</option>`
            ).join('');

            // 职位编辑表单
            layer.open({
              type: 1,
              title: '编辑职位信息',
              area: ['700px', '650px'],
              content: `
                <div style="padding: 20px; max-height: 550px; overflow-y: auto;">
                  <form class="layui-form" lay-filter="editJobForm" id="editJobForm">
                    <div class="layui-form-item">
                      <label class="layui-form-label">职位ID</label>
                      <div class="layui-input-block">
                        <input type="text" class="layui-input" value="${data.id}" readonly disabled style="background: #f5f5f5;" />
                      </div>
                    </div>
                    <div class="layui-form-item">
                      <label class="layui-form-label">职位名称 *</label>
                      <div class="layui-input-block">
                        <input type="text" name="title" value="${data.title}" required lay-verify="required" class="layui-input" placeholder="请输入职位名称" />
                      </div>
                    </div>
                    <div class="layui-form-item">
                      <label class="layui-form-label">所属公司 *</label>
                      <div class="layui-input-block">
                        <select name="companyId" lay-verify="required">
                          <option value="">请选择公司</option>
                          ${companyOptions}
                        </select>
                      </div>
                    </div>
                    <div class="layui-form-item">
                      <label class="layui-form-label">职位分类 *</label>
                      <div class="layui-input-block">
                        <input type="text" name="category" value="${data.category}" required lay-verify="required" class="layui-input" placeholder="请输入职位分类" />
                      </div>
                    </div>
                    <div class="layui-form-item">
                      <div class="layui-inline">
                        <label class="layui-form-label">最低薪资 *</label>
                        <div class="layui-input-inline" style="width: 100px;">
                          <input type="number" name="salaryMin" value="${data.salaryMin}" required lay-verify="required" class="layui-input" placeholder="0" />
                        </div>
                      </div>
                      <div class="layui-inline">
                        <label class="layui-form-label">最高薪资 *</label>
                        <div class="layui-input-inline" style="width: 100px;">
                          <input type="number" name="salaryMax" value="${data.salaryMax}" required lay-verify="required" class="layui-input" placeholder="0" />
                        </div>
                      </div>
                      <div class="layui-inline">
                        <label class="layui-form-label">薪资类型</label>
                        <div class="layui-input-inline" style="width: 100px;">
                          <select name="salaryType">
                            ${salaryTypeOptions}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div class="layui-form-item">
                      <div class="layui-inline">
                        <label class="layui-form-label">所在州</label>
                        <div class="layui-input-inline" style="width: 120px;">
                          <input type="text" name="state" value="${data.state}" class="layui-input" placeholder="州" />
                        </div>
                      </div>
                      <div class="layui-inline">
                        <label class="layui-form-label">城市</label>
                        <div class="layui-input-inline" style="width: 150px;">
                          <input type="text" name="location" value="${data.location}" class="layui-input" placeholder="城市" />
                        </div>
                      </div>
                    </div>
                    <div class="layui-form-item">
                      <div class="layui-inline">
                        <label class="layui-form-label">经验要求</label>
                        <div class="layui-input-inline" style="width: 120px;">
                          <select name="experience">
                            ${experienceOptions}
                          </select>
                        </div>
                      </div>
                      <div class="layui-inline">
                        <label class="layui-form-label">学历要求</label>
                        <div class="layui-input-inline" style="width: 120px;">
                          <select name="education">
                            ${educationOptions}
                          </select>
                        </div>
                      </div>
                      <div class="layui-inline">
                        <label class="layui-form-label">状态</label>
                        <div class="layui-input-inline" style="width: 120px;">
                          <select name="status">
                            ${statusOptions}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div class="layui-form-item layui-form-text">
                      <label class="layui-form-label">职位描述 *</label>
                      <div class="layui-input-block">
                        <textarea name="description" required lay-verify="required" class="layui-textarea" style="min-height: 100px;" placeholder="请输入职位描述">${data.description}</textarea>
                      </div>
                    </div>
                    <div class="layui-form-item layui-form-text">
                      <label class="layui-form-label">任职要求</label>
                      <div class="layui-input-block">
                        <textarea name="requirements" class="layui-textarea" style="min-height: 80px;" placeholder="请输入任职要求，每行一条">${Array.isArray(data.requirements) ? data.requirements.join('\n') : data.requirements}</textarea>
                      </div>
                    </div>
                  </form>
                </div>
              `,
              btn: ['保存', '取消'],
              success: function(layero: any, index: any) {
                // 等待 DOM 完全插入后再渲染
                setTimeout(() => {
                  form.render(null, 'editJobForm');
                }, 10);
              },
              yes: function(index: any) {
                const title = $('#editJobForm [name="title"]').val();
                const companyId = $('#editJobForm [name="companyId"]').val();
                const category = $('#editJobForm [name="category"]').val();
                const salaryMin = $('#editJobForm [name="salaryMin"]').val();
                const salaryMax = $('#editJobForm [name="salaryMax"]').val();
                const salaryType = $('#editJobForm [name="salaryType"]').val();
                const state = $('#editJobForm [name="state"]').val();
                const location = $('#editJobForm [name="location"]').val();
                const experience = $('#editJobForm [name="experience"]').val();
                const education = $('#editJobForm [name="education"]').val();
                const status = $('#editJobForm [name="status"]').val();
                const description = $('#editJobForm [name="description"]').val();
                const requirements = $('#editJobForm [name="requirements"]').val();

                if (!title || !companyId || !category || !salaryMin || !salaryMax || !description) {
                  layer.msg('请填写所有必填项', {icon: 2});
                  return false;
                }

                // 更新职位信息
                const jobs = jobService.getAll();
                const job = jobs.find(j => j.id === data.id);
                if (job) {
                  job.title = title;
                  job.companyId = companyId;
                  job.category = category;
                  job.salaryMin = parseInt(salaryMin);
                  job.salaryMax = parseInt(salaryMax);
                  job.salaryType = salaryType;
                  job.state = state;
                  job.location = location;
                  job.experience = experience;
                  job.education = education;
                  job.status = status;
                  job.description = description;
                  job.requirements = requirements.split('\n').filter(r => r.trim());

                  // 更新 window 对象
                  (window as any).jobs = jobs;

                  // 重新加载表格
                  tableRef.current?.reload({
                    data: jobs
                  });

                  layer.close(index);
                  layer.msg('保存成功', {icon: 1});
                } else {
                  layer.msg('职位不存在', {icon: 2});
                }
              }
            });
          } else if (obj.event === 'toggle') {
            const isActive = data.status === 'active';
            const action = isActive ? '下架' : '上架';

            layer.confirm(`确定要${action}该职位吗？`, {icon: 3, title: '提示'}, function(index: any) {
              const jobs = jobService.getAll();
              const job = jobs.find(j => j.id === data.id);
              if (job) {
                job.status = isActive ? 'inactive' : 'active';
              }

              tableRef.current?.reload();

              layer.msg(`职位已${action}`, {icon: 1});
              layer.close(index);
            });
          }
        });
      });
    };

    initTable();
  }, []);

  return (
    <div className="layui-fluid">
      <fieldset className="layui-elem-field">
        <legend>职位管理</legend>
        <div className="layui-field-box">
          <p>管理平台上的所有职位信息，支持上架/下架和删除操作</p>
        </div>
      </fieldset>

      <div className="layui-card">
        <div className="layui-card-header">筛选操作</div>
        <div className="layui-card-body">
          <div className="layui-btn-group">
            <button
              className="layui-btn layui-btn-primary"
              onClick={() => tableRef.current?.reload({
                data: jobService.getAll()
              })}
            >
              全部
            </button>
            <button
              className="layui-btn layui-btn-normal"
              onClick={() => tableRef.current?.reload({
                data: jobService.getAll().filter(j => j.status === 'active')
              })}
            >
              招聘中
            </button>
            <button
              className="layui-btn layui-btn-warm"
              onClick={() => tableRef.current?.reload({
                data: jobService.getAll().filter(j => j.status === 'inactive')
              })}
            >
              已下架
            </button>
          </div>
        </div>
      </div>

      <div className="layui-card">
        <div className="layui-card-header">职位列表</div>
        <div className="layui-card-body">
          <table id="jobTable" lay-filter="jobTable"></table>
        </div>
      </div>
    </div>
  );
}
