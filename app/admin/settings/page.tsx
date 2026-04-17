'use client';

import { useState, useEffect } from 'react';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('basic');
  const [settings, setSettings] = useState({
    siteName: '168招聘网',
    siteUrl: 'https://www.168zhaopin.com',
    siteKeywords: '美国招聘,华人招聘,168招聘网',
    siteDescription: '美国华人168招聘网，为在美华人提供优质的求职招聘服务',
    enableRegister: true,
    requireVerify: true,
    enableCaptcha: true,
    maxJobsPerCompany: 100,
    maxApplicationsPerUser: 50,
    emailHost: 'smtp.gmail.com',
    emailPort: 587,
    emailUser: 'noreply@168zhaopin.com',
  });

  const handleSave = () => {
    localStorage.setItem('adminSettings', JSON.stringify(settings));
    const layui = (window as any).layui;
    if (layui) {
      layui.use('layer', function(layer: any) {
        layer.msg('设置已保存', {icon: 1});
      });
    } else {
      alert('设置已保存');
    }
  };

  const handleReset = () => {
    setSettings({
      siteName: '168招聘网',
      siteUrl: 'https://www.168zhaopin.com',
      siteKeywords: '美国招聘,华人招聘,168招聘网',
      siteDescription: '美国华人168招聘网，为在美华人提供优质的求职招聘服务',
      enableRegister: true,
      requireVerify: true,
      enableCaptcha: true,
      maxJobsPerCompany: 100,
      maxApplicationsPerUser: 50,
      emailHost: 'smtp.gmail.com',
      emailPort: 587,
      emailUser: 'noreply@168zhaopin.com',
    });
  };

  useEffect(() => {
    const savedSettings = localStorage.getItem('adminSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error('加载设置失败', e);
      }
    }

    const initLayui = () => {
      const layui = (window as any).layui;
      if (!layui) {
        setTimeout(initLayui, 100);
        return;
      }

      layui.use(['element', 'form'], function(element: any, form: any) {
        element.render('settingsTab');
        element.on('tab(settingsTab)', function(data: any) {
          setActiveTab(data.index === 0 ? 'basic' : data.index === 1 ? 'feature' : 'limit');
          setTimeout(() => {
            form.render();
          }, 50);
        });
        setTimeout(() => {
          form.render();
        }, 200);
      });
    };

    initLayui();
  }, []);

  return (
    <div className="layui-fluid">
      <fieldset className="layui-elem-field">
        <legend>系统设置</legend>
        <div className="layui-field-box">
          <p>配置系统的基础参数和功能开关</p>
        </div>
      </fieldset>

      <div className="layui-tab layui-tab-card" lay-filter="settingsTab">
        <ul className="layui-tab-title">
          <li className="layui-this">
            <i className="layui-icon layui-icon-set"></i> 基本信息
          </li>
          <li>
            <i className="layui-icon layui-icon-component"></i> 功能设置
          </li>
          <li>
            <i className="layui-icon layui-icon-util"></i> 限制配置
          </li>
          <li>
            <i className="layui-icon layui-icon-email"></i> 邮件设置
          </li>
        </ul>

        <div className="layui-tab-content">
          {/* 基本信息 */}
          <div className="layui-tab-item layui-show">
            <div style={{padding: '20px'}}>
              <form className="layui-form layui-form-pane">
                <div className="layui-form-item">
                  <label className="layui-form-label">网站名称</label>
                  <div className="layui-input-block">
                    <input
                      type="text"
                      name="siteName"
                      value={settings.siteName}
                      onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                      className="layui-input"
                      placeholder="请输入网站名称"
                    />
                  </div>
                </div>

                <div className="layui-form-item">
                  <label className="layui-form-label">网站URL</label>
                  <div className="layui-input-block">
                    <input
                      type="text"
                      name="siteUrl"
                      value={settings.siteUrl}
                      onChange={(e) => setSettings({...settings, siteUrl: e.target.value})}
                      className="layui-input"
                      placeholder="请输入网站URL"
                    />
                  </div>
                </div>

                <div className="layui-form-item">
                  <label className="layui-form-label">关键词</label>
                  <div className="layui-input-block">
                    <input
                      type="text"
                      name="siteKeywords"
                      value={settings.siteKeywords}
                      onChange={(e) => setSettings({...settings, siteKeywords: e.target.value})}
                      className="layui-input"
                      placeholder="请输入网站关键词，多个关键词用逗号分隔"
                    />
                  </div>
                </div>

                <div className="layui-form-item layui-form-text">
                  <label className="layui-form-label">网站描述</label>
                  <div className="layui-input-block">
                    <textarea
                      name="siteDescription"
                      value={settings.siteDescription}
                      onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                      className="layui-textarea"
                      placeholder="请输入网站描述"
                    />
                  </div>
                </div>

                <div className="layui-form-item">
                  <label className="layui-form-label">验证码功能</label>
                  <div className="layui-input-block">
                    <input
                      type="checkbox"
                      name="enableCaptcha"
                      {...(settings.enableCaptcha ? {checked: true} : {})}
                      lay-skin="switch"
                      lay-text="开启|关闭"
                      onChange={(e) => setSettings({...settings, enableCaptcha: e.target.checked})}
                    />
                    <span className="layui-word-aux" style={{marginLeft: '10px'}}>开启后，注册和登录时需要输入验证码</span>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* 功能设置 */}
          <div className="layui-tab-item">
            <div style={{padding: '20px'}}>
              <form className="layui-form layui-form-pane">
                <div className="layui-form-item">
                  <label className="layui-form-label">开放注册</label>
                  <div className="layui-input-block">
                    <input
                      type="checkbox"
                      name="enableRegister"
                      {...(settings.enableRegister ? {checked: true} : {})}
                      lay-skin="switch"
                      lay-text="开启|关闭"
                      onChange={(e) => setSettings({...settings, enableRegister: e.target.checked})}
                    />
                    <span className="layui-word-aux" style={{marginLeft: '10px'}}>关闭后新用户无法注册</span>
                  </div>
                </div>

                <div className="layui-form-item">
                  <label className="layui-form-label">企业认证</label>
                  <div className="layui-input-block">
                    <input
                      type="checkbox"
                      name="requireVerify"
                      {...(settings.requireVerify ? {checked: true} : {})}
                      lay-skin="switch"
                      lay-text="必须|可选"
                      onChange={(e) => setSettings({...settings, requireVerify: e.target.checked})}
                    />
                    <span className="layui-word-aux" style={{marginLeft: '10px'}}>开启后，企业必须通过认证才能发布职位</span>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* 限制配置 */}
          <div className="layui-tab-item">
            <div style={{padding: '20px'}}>
              <form className="layui-form layui-form-pane">
                <div className="layui-form-item">
                  <label className="layui-form-label">企业职位数</label>
                  <div className="layui-input-block">
                    <input
                      type="number"
                      name="maxJobsPerCompany"
                      value={settings.maxJobsPerCompany}
                      onChange={(e) => setSettings({...settings, maxJobsPerCompany: parseInt(e.target.value)})}
                      className="layui-input"
                      placeholder="请输入数量"
                    />
                    <div className="layui-form-mid layui-word-aux">每个企业最多可发布的职位数量</div>
                  </div>
                </div>

                <div className="layui-form-item">
                  <label className="layui-form-label">用户申请数</label>
                  <div className="layui-input-block">
                    <input
                      type="number"
                      name="maxApplicationsPerUser"
                      value={settings.maxApplicationsPerUser}
                      onChange={(e) => setSettings({...settings, maxApplicationsPerUser: parseInt(e.target.value)})}
                      className="layui-input"
                      placeholder="请输入数量"
                    />
                    <div className="layui-form-mid layui-word-aux">每个用户最多可同时申请的职位数量</div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* 邮件设置 */}
          <div className="layui-tab-item">
            <div style={{padding: '20px'}}>
              <form className="layui-form layui-form-pane">
                <div className="layui-form-item">
                  <label className="layui-form-label">SMTP服务器</label>
                  <div className="layui-input-block">
                    <input
                      type="text"
                      name="emailHost"
                      value={settings.emailHost}
                      onChange={(e) => setSettings({...settings, emailHost: e.target.value})}
                      className="layui-input"
                      placeholder="请输入SMTP服务器地址"
                    />
                  </div>
                </div>

                <div className="layui-form-item">
                  <label className="layui-form-label">端口</label>
                  <div className="layui-input-block">
                    <input
                      type="number"
                      name="emailPort"
                      value={settings.emailPort}
                      onChange={(e) => setSettings({...settings, emailPort: parseInt(e.target.value)})}
                      className="layui-input"
                      placeholder="请输入端口号"
                    />
                    <div className="layui-form-mid layui-word-aux">常用端口：25, 465, 587</div>
                  </div>
                </div>

                <div className="layui-form-item">
                  <label className="layui-form-label">发件人邮箱</label>
                  <div className="layui-input-block">
                    <input
                      type="email"
                      name="emailUser"
                      value={settings.emailUser}
                      onChange={(e) => setSettings({...settings, emailUser: e.target.value})}
                      className="layui-input"
                      placeholder="请输入发件人邮箱"
                    />
                  </div>
                </div>

                <div className="layui-form-item">
                  <label className="layui-form-label">邮箱密码</label>
                  <div className="layui-input-block">
                    <input
                      type="password"
                      name="emailPassword"
                      className="layui-input"
                      placeholder="请输入邮箱密码或授权码"
                    />
                  </div>
                </div>

                <div className="layui-form-item">
                  <div className="layui-input-block">
                    <button type="button" className="layui-btn layui-btn-normal" onClick={() => alert('测试邮件功能开发中')}>
                      <i className="layui-icon layui-icon-email"></i> 发送测试邮件
                    </button>
                    <div className="layui-form-mid layui-word-aux">配置完成后可测试邮件发送功能</div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* 底部操作按钮 */}
          <div className="layui-form-item" style={{marginTop: 20, marginLeft: 30}}>
            <div className="layui-input-block">
              <button className="layui-btn" onClick={handleSave}>
                <i className="layui-icon layui-icon-ok"></i> 保存设置
              </button>
              <button type="button" className="layui-btn layui-btn-primary" onClick={handleReset}>
                <i className="layui-icon layui-icon-refresh"></i> 重置
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
