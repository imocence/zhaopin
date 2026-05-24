'use client';
import { useEffect, useRef } from 'react';
import { companyService } from '@/lib/utils/data';
import { companyStatusMap } from '@/lib/utils/status';
import { useLayuiTable } from '@/lib/hooks/useLayuiInit';

declare global {
  interface Window {
    layui: any;
  }
}

export default function AdminCompaniesPage() {
  const tableRef = useRef<any>(null);

  useEffect(() => {
    const companies = companyService.getAll();
    (window as any).companies = companies;

    useLayuiTable((layui: any) => {
      const table = layui.table;
      const layer = layui.layer;
      const form = layui.form;
        const $ = layui.$; // 获取 jQuery 对象
        tableRef.current = table.render({
          elem: '#companyTable',
          data: companies,
          page: true,
          limits: [10, 20, 30, 50],
          limit: 10,
          cols: [[
            {field: 'id', title: 'ID', width: 100, sort: true},
            {
              field: 'logo',
              title: 'Logo',
              width: 80,
              templet: function(d: any) {
                return d.logo
                  ? `<img src="${d.logo}" style="width: 40px; height: 40px; border-radius: 4px;" />`
                  : '<span style="color: #999;">-</span>';
              }
            },
            {field: 'name', title: '企业名称', minWidth: 160},
            {
              field: 'industry',
              title: '行业',
              width: 120,
              templet: function(d: any) {
                return d.industry || '<span style="color: #999;">-</span>';
              }
            },
            {
              field: 'location',
              title: '位置',
              width: 150,
              templet: function(d: any) {
                return `${d.city || '-'}, ${d.state || '-'}`;
              }
            },
            {
              field: 'contact',
              title: '联系人',
              width: 120,
              templet: function(d: any) {
                return d.contact?.name || '<span style="color: #999;">-</span>';
              }
            },
            {
              field: 'verified',
              title: '认证状态',
              width: 100,
              templet: function(d: any) {
                const status = companyStatusMap[d.verified ? 'verified' : 'pending'];
                return `<span class="layui-badge ${status.class}">${status.text}</span>`;
              }
            },
            {
              field: 'jobCount',
              title: '职位数',
              width: 80,
              templet: function(d: any) {
                return d.jobCount || 0;
              }
            },
            {
              fixed: 'right',
              title: '操作',
              minWidth: 200,
              align: 'center',
              templet: function(d: any) {
                return `
                  <a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="detail">
                    <i class="layui-icon layui-icon-detail"></i> 详情
                  </a>
                  <a class="layui-btn layui-btn-xs" lay-event="edit">
                    <i class="layui-icon layui-icon-edit"></i> 编辑
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
        table.on('tool(companyTable)', function(obj: any) {
          const data = obj.data;

          if (obj.event === 'del') {
            layer.confirm('确定要删除该企业吗？', {icon: 3, title: '提示'}, function(index: any) {
              const companies = companyService.getAll().filter(c => c.id !== data.id);
              (window as any).companies = companies;

              tableRef.current?.reload({
                data: companies
              });

              layer.msg('删除成功', {icon: 1});
              layer.close(index);
            });
          } else if (obj.event === 'detail') {
            // 显示详情弹窗，未认证企业显示审核按钮
            const isVerified = data.verified;
            const auditButtons = !isVerified ? `
              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e6e6e6; text-align: center;">
                <button class="layui-btn layui-btn-normal" id="btnVerify">
                  <i class="layui-icon layui-icon-ok"></i> 通过认证
                </button>
                <button class="layui-btn layui-btn-warm" id="btnReject">
                  <i class="layui-icon layui-icon-close"></i> 拒绝认证
                </button>
              </div>
            ` : '';

            const content = `
              <div style="padding: 20px;">
                <div class="layui-form-item">
                  <label class="layui-form-label" style="width: 100px; text-align: right;">企业名称</label>
                  <div style="margin-left: 130px;">
                    <input type="text" class="layui-input" value="${data.name}" readonly />
                  </div>
                </div>
                <div class="layui-form-item">
                  <label class="layui-form-label" style="width: 100px; text-align: right;">行业</label>
                  <div style="margin-left: 130px;">
                    <input type="text" class="layui-input" value="${data.industry || '-'}" readonly />
                  </div>
                </div>
                <div class="layui-form-item">
                  <label class="layui-form-label" style="width: 100px; text-align: right;">位置</label>
                  <div style="margin-left: 130px;">
                    <input type="text" class="layui-input" value="${data.city || '-'}, ${data.state || '-'}" readonly />
                  </div>
                </div>
                <div class="layui-form-item">
                  <label class="layui-form-label" style="width: 100px; text-align: right;">认证状态</label>
                  <div style="margin-left: 130px;">
                    <span class="layui-badge ${isVerified ? 'layui-bg-blue' : 'layui-bg-orange'}">
                      ${isVerified ? '已认证' : '待审核'}
                    </span>
                  </div>
                </div>
                <div class="layui-form-item">
                  <label class="layui-form-label" style="width: 100px; text-align: right;">联系人</label>
                  <div style="margin-left: 130px;">
                    <input type="text" class="layui-input" value="${data.contact?.name || '-'}" readonly />
                  </div>
                </div>
                <div class="layui-form-item">
                  <label class="layui-form-label" style="width: 100px; text-align: right;">联系电话</label>
                  <div style="margin-left: 130px;">
                    <input type="text" class="layui-input" value="${data.contact?.phone || '-'}" readonly />
                  </div>
                </div>
                ${data.description ? `
                <div class="layui-form-item layui-form-text">
                  <label class="layui-form-label" style="width: 100px; text-align: right;">企业简介</label>
                  <div style="margin-left: 130px;">
                    <textarea class="layui-textarea" readonly style="min-height: 80px;">${data.description}</textarea>
                  </div>
                </div>
                ` : ''}
                ${auditButtons}
              </div>
            `;

            layer.open({
              type: 1,
              title: '企业详情',
              area: ['600px', !isVerified ? '600px' : '550px'],
              content,
              success: function(layero: any, index: any) {
                // 只有未认证企业才有审核按钮
                if (!isVerified) {
                  // 通过认证
                  layero.find('#btnVerify').on('click', function() {
                    layer.confirm(`确定通过企业"${data.name}"的认证吗？`, {icon: 3, title: '提示'}, function(confirmIndex: any) {
                      const companies = companyService.getAll();
                      const company = companies.find(c => c.id === data.id);
                      if (company) {
                        company.verified = true;
                        (window as any).companies = companies;
                        tableRef.current?.reload();
                      }

                      layer.close(confirmIndex);
                      layer.close(index);
                      layer.msg('认证已通过', {icon: 1});
                    });
                  });

                  // 拒绝认证
                  layero.find('#btnReject').on('click', function() {
                    layer.prompt({
                      formType: 2,
                      value: '',
                      title: '请输入拒绝原因',
                      area: ['400px', '200px']
                    }, function(value: any, promptIndex: any) {
                      if (!value) {
                        layer.msg('请输入拒绝原因', {icon: 2});
                        return false;
                      }

                      console.log('拒绝原因:', value);

                      const companies = companyService.getAll();
                      const company = companies.find(c => c.id === data.id);
                      if (company) {
                        // 可以在这里保存拒绝原因到某个字段
                        company.rejectReason = value;
                        // 可选：将企业标记为已拒绝或从列表中移除
                        // company.verified = false;
                      }

                      tableRef.current?.reload();
                      layer.close(promptIndex);
                      layer.close(index);
                      layer.msg('已拒绝该企业', {icon: 1});
                      return false;
                    });
                  });
                }
              }
            });
          } else if (obj.event === 'edit') {
            // 企业编辑表单
            layer.open({
              type: 1,
              title: '编辑企业信息',
              area: ['550px', '550px'],
              content: `
                <div style="padding: 20px;">
                  <form class="layui-form" lay-filter="editCompanyForm" id="editCompanyForm">
                    <div class="layui-form-item">
                      <label class="layui-form-label">企业ID</label>
                      <div class="layui-input-block">
                        <input type="text" class="layui-input" value="${data.id}" readonly disabled style="background: #f5f5f5;" />
                      </div>
                    </div>
                    <div class="layui-form-item">
                      <label class="layui-form-label">企业名称 *</label>
                      <div class="layui-input-block">
                        <input type="text" name="name" value="${data.name || ''}" required lay-verify="required" class="layui-input" placeholder="请输入企业名称" />
                      </div>
                    </div>
                    <div class="layui-form-item">
                      <label class="layui-form-label">行业</label>
                      <div class="layui-input-block">
                        <input type="text" name="industry" value="${data.industry || ''}" class="layui-input" placeholder="请输入所属行业" />
                      </div>
                    </div>
                    <div class="layui-form-item">
                      <label class="layui-form-label">所在州</label>
                      <div class="layui-input-block">
                        <input type="text" name="state" value="${data.state || ''}" class="layui-input" placeholder="请输入所在州" />
                      </div>
                    </div>
                    <div class="layui-form-item">
                      <label class="layui-form-label">城市</label>
                      <div class="layui-input-block">
                        <input type="text" name="city" value="${data.city || ''}" class="layui-input" placeholder="请输入所在城市" />
                      </div>
                    </div>
                    <div class="layui-form-item">
                      <label class="layui-form-label">联系人</label>
                      <div class="layui-input-block">
                        <input type="text" name="contactName" value="${data.contact?.name || ''}" class="layui-input" placeholder="请输入联系人姓名" />
                      </div>
                    </div>
                    <div class="layui-form-item">
                      <label class="layui-form-label">联系电话</label>
                      <div class="layui-input-block">
                        <input type="text" name="contactPhone" value="${data.contact?.phone || ''}" class="layui-input" placeholder="请输入联系电话" />
                      </div>
                    </div>
                    <div class="layui-form-item layui-form-text">
                      <label class="layui-form-label">企业简介</label>
                      <div class="layui-input-block">
                        <textarea name="description" class="layui-textarea" placeholder="请输入企业简介">${data.description || ''}</textarea>
                      </div>
                    </div>
                  </form>
                </div>
              `,
              btn: ['保存', '取消'],
              success: function(layero: any, index: any) {
                // 等待 DOM 完全插入后再渲染
                setTimeout(() => {
                  form.render(null, 'editCompanyForm');
                }, 10);
              },
              yes: function(index: any) {
                const name = $('#editCompanyForm [name="name"]').val();
                const industry = $('#editCompanyForm [name="industry"]').val();
                const state = $('#editCompanyForm [name="state"]').val();
                const city = $('#editCompanyForm [name="city"]').val();
                const contactName = $('#editCompanyForm [name="contactName"]').val();
                const contactPhone = $('#editCompanyForm [name="contactPhone"]').val();
                const description = $('#editCompanyForm [name="description"]').val();

                if (!name) {
                  layer.msg('企业名称不能为空', {icon: 2});
                  return false;
                }

                // 更新企业信息
                const companies = companyService.getAll();
                const company = companies.find(c => c.id === data.id);
                if (company) {
                  company.name = name;
                  company.industry = industry;
                  company.state = state;
                  company.city = city;
                  company.contact = {
                    name: contactName,
                    phone: contactPhone
                  };
                  company.description = description;

                  // 更新 window 对象
                  (window as any).companies = companies;

                  // 重新加载表格
                  tableRef.current?.reload({
                    data: companies
                  });

                  layer.close(index);
                  layer.msg('保存成功', {icon: 1});
                } else {
                  layer.msg('企业不存在', {icon: 2});
                }
              }
            });
          }
        });
      });
    });
  }, []);

  return (
    <div className="layui-fluid">
      <fieldset className="layui-elem-field">
        <legend>企业管理</legend>
        <div className="layui-field-box">
          <p>管理平台上的所有企业信息，审核企业认证申请</p>
        </div>
      </fieldset>

      <div className="layui-card">
        <div className="layui-card-header">筛选操作</div>
        <div className="layui-card-body">
          <div className="layui-btn-group">
            <button
              className="layui-btn layui-btn-primary"
              onClick={() => tableRef.current?.reload({
                data: companyService.getAll()
              })}
            >
              全部
            </button>
            <button
              className="layui-btn layui-btn-warm"
              onClick={() => tableRef.current?.reload({
                data: companyService.getAll().filter(c => !c.verified)
              })}
            >
              待审核
            </button>
            <button
              className="layui-btn layui-btn-normal"
              onClick={() => tableRef.current?.reload({
                data: companyService.getVerified()
              })}
            >
              已认证
            </button>
          </div>
        </div>
      </div>

      <div className="layui-card">
        <div className="layui-card-header">企业列表</div>
        <div className="layui-card-body">
          <table id="companyTable" lay-filter="companyTable"></table>
        </div>
      </div>
    </div>
  );
}
