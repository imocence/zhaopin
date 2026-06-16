"use client";
import { useEffect, useRef } from 'react';
import { userService } from '@/lib/services/data';
import { useLayuiTable } from '@/lib/hooks/useLayuiInit';
import { userRoleMap, userStatusMap } from '@/lib/utils/status';
import { User } from '@/types';

declare global {
  interface Window {
    layui: any;
  }
}

// use `User` from shared types

export default function AdminUsersPage() {
  const tableRef = useRef<any>(null);

  useEffect(() => {
    async function loadData() {
      // 加载用户数据
      const users = await userService.getAll();

      // 将数据放到 window 对象上，方便访问
      (window as any).users = users;

      const initTable = () => {
        const layui = (window as any).layui;
        if (!layui) {
          setTimeout(initTable, 100);
          return;
        }
        layui.use(['table', 'layer', 'form'], function () {
          const table = layui.table;
          const layer = layui.layer;
          const form = layui.form;
          const $ = layui.$;

          // 通用的用户表单函数
          const openUserForm = (userData: User | null = null) => {
            const isEdit = userData !== null;
            const title = isEdit ? '编辑用户' : '新增用户';

            const content = `
          <div style="padding: 20px;">
            <form class="layui-form" lay-filter="userForm" id="userForm">
              ${isEdit ? `
                <div class="layui-form-item">
                  <label class="layui-form-label">用户ID</label>
                  <div class="layui-input-block">
                    <input type="text" class="layui-input" value="${userData.id}" readonly disabled style="background: #f5f5f5;" />
                  </div>
                </div>
              ` : ''}
              <div class="layui-form-item">
                <label class="layui-form-label">用户名 *</label>
                <div class="layui-input-block">
                  <input type="text" name="name" value="${userData?.name || ''}" required lay-verify="required" class="layui-input" placeholder="请输入用户名" />
                </div>
              </div>
              <div class="layui-form-item">
                <label class="layui-form-label">邮箱 *</label>
                <div class="layui-input-block">
                  <input type="email" name="email" value="${userData?.email || ''}" required lay-verify="required|email" class="layui-input" placeholder="请输入邮箱" />
                </div>
              </div>
              <div class="layui-form-item">
                <label class="layui-form-label">角色</label>
                <div class="layui-input-block">
                  <select name="role" lay-verify="">
                    <option value="jobseeker" ${userData?.role === 'jobseeker' ? 'selected' : ''}>求职者</option>
                    <option value="employer" ${userData?.role === 'employer' ? 'selected' : ''}>企业用户</option>
                    <option value="admin" ${userData?.role === 'admin' ? 'selected' : ''}>管理员</option>
                  </select>
                </div>
              </div>
              <div class="layui-form-item">
                <label class="layui-form-label">状态</label>
                <div class="layui-input-block">
                  <input type="radio" name="status" value="active" title="正常" ${userData?.status === 'inactive' ? '' : 'checked'} />
                  <input type="radio" name="status" value="inactive" title="禁用" ${userData?.status === 'inactive' ? 'checked' : ''} />
                </div>
              </div>
            </form>
          </div>
        `;

            layer.open({
              type: 1,
              title,
              area: ['500px', isEdit ? '450px' : '400px'],
              content,
              btn: ['保存', '取消'],
              success: function (layero: any, index: any) {
                setTimeout(() => {
                  form.render(null, 'userForm');
                }, 10);
              },
              yes: function (index: any) {
                const name = $('#userForm [name="name"]').val();
                const email = $('#userForm [name="email"]').val();
                const role = $('#userForm [name="role"]').val();
                const status = $('#userForm [name="status"]:checked').val();

                if (!name || !email) {
                  layer.msg('请填写完整信息', { icon: 2 });
                  return false;
                }

                if (isEdit) {
                  // 更新用户信息
                  userService.getAll().then((users) => {
                    const user = users.find(u => u.id === userData.id);
                    if (user) {
                      user.name = name;
                      user.email = email;
                      user.role = role;
                      user.status = status;

                      (window as any).users = users;
                      tableRef.current?.reload({ data: users });

                      layer.close(index);
                      layer.msg('修改成功', { icon: 1 });
                    } else {
                      layer.msg('用户不存在', { icon: 2 });
                    }
                  });
                } else {
                  // 添加新用户
                  const newUser: User = {
                    id: Date.now().toString(),
                    name,
                    email,
                    role,
                    status,
                    createdAt: new Date().toISOString()
                  };

                  userService.getAll().then((users) => {
                    users.push(newUser);
                    (window as any).users = users;

                    tableRef.current?.reload({ data: users });

                    layer.close(index);
                    layer.msg('添加成功', { icon: 1 });
                  });
                }
              }
            });
          };

          // 将表单函数保存到 window 对象上，方便在工具条事件中调用
          (window as any).openUserForm = openUserForm;

          tableRef.current = table.render({
            elem: '#userTable',
            data: users,
            page: true,
            limits: [10, 20, 30, 50],
            limit: 10,
            cols: [[
              { field: 'id', title: 'ID', width: 80, sort: true },
              { field: 'name', title: '用户名', width: 120 },
              { field: 'email', title: '邮箱', minWidth: 160 },
              {
                field: 'role',
                title: '角色',
                width: 100,
                templet: function (d: User) {
                  const role = userRoleMap[d?.role || 'jobseeker'] || { text: d?.role || '未知', class: '' };
                  return `<span class="layui-badge ${role.class}">${role.text}</span>`;
                }
              },
              {
                field: 'status',
                title: '状态',
                width: 100,
                templet: function (d: User) {
                  const status = userStatusMap[d?.status || 'active'] || { text: d?.status || '未知', class: '' };
                  return `<span class="layui-badge ${status.class}">${status.text}</span>`;
                }
              },
              {
                field: 'createdAt',
                title: '注册时间',
                width: 120,
                templet: function (d: User) {
                  return d.createdAt
                    ? new Date(d.createdAt).toLocaleDateString('zh-CN')
                    : '-';
                }
              },
              {
                fixed: 'right',
                title: '操作',
                width: 200,
                align: 'center',
                templet: function (d: any) {
                  return `
                  <a class="layui-btn layui-btn-xs" lay-event="edit">
                    <i class="layui-icon layui-icon-edit"></i> 编辑
                  </a>
                  <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">
                    <i class="layui-icon layui-icon-delete"></i> 删除
                  </a>
                `;
                }
              }
            ]]
          });

          // 监听工具条事件
          table.on('tool(userTable)', function (obj: any) {
            const data = obj.data;

            if (obj.event === 'del') {
              layer.confirm('确定要删除该用户吗？', { icon: 3, title: '提示' }, function (index: any) {
                userService.getAll().then((users) => {
                  const newUsers = users.filter(u => u.id !== data.id);
                  (window as any).users = newUsers;
                  tableRef.current?.reload({ data: newUsers });
                  layer.msg('删除成功', { icon: 1 });
                  layer.close(index);
                });
              });
            } else if (obj.event === 'edit') {
              openUserForm(data);
            }
          });
        });
      };
      initTable();
    }
    loadData();
  }, []);

  const handleAddUser = () => {
    const openUserForm = (window as any).openUserForm;
    if (openUserForm) {
      openUserForm(null);
    }
  };

  return (
    <div className="layui-fluid">
      <fieldset className="layui-elem-field">
        <legend>用户管理</legend>
        <div className="layui-field-box">
          <p>管理系统中的所有注册用户，支持编辑和删除操作</p>
        </div>
      </fieldset>

      <div className="layui-card">
        <div className="layui-card-header">操作栏</div>
        <div className="layui-card-body">
          <div className="layui-inline">
            <input
              type="text"
              id="userSearch"
              placeholder="搜索用户名或邮箱"
              className="layui-input"
            />
          </div>
          <button
            className="layui-btn"
            onClick={() => {
              const keyword = (document.getElementById('userSearch') as HTMLInputElement)?.value || '';
              if (keyword) {
                const users = (window as any).users || [];
                const filtered = users.filter((u: any) =>
                (u.name?.toLowerCase().includes(keyword.toLowerCase()) ||
                  u.email?.toLowerCase().includes(keyword.toLowerCase()))
                );
                tableRef.current?.reload({
                  data: filtered
                });
              } else {
                tableRef.current?.reload({
                  data: (window as any).users || []
                });
              }
            }}
          >
            <i className="layui-icon layui-icon-search"></i> 搜索
          </button>
          <button
            className="layui-btn layui-btn-warm"
            onClick={handleAddUser}
          >
            <i className="layui-icon layui-icon-add-1"></i> 新增用户
          </button>
          <button
            className="layui-btn layui-btn-normal"
            onClick={() => tableRef.current?.reload()}
          >
            <i className="layui-icon layui-icon-refresh"></i> 刷新
          </button>
        </div>
      </div>

      <div className="layui-card">
        <div className="layui-card-header">用户列表</div>
        <div className="layui-card-body">
          <table id="userTable" lay-filter="userTable"></table>
        </div>
      </div>
    </div>
  );
}
