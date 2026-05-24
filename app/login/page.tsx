'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLayuiForm } from '@/lib/hooks/useLayuiInit';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    captcha: '',
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);
  const [captchaCode, setCaptchaCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [enableCaptcha, setEnableCaptcha] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
  };

  useEffect(() => {
    generateCaptcha();

    // 读取系统设置
    const adminSettings = localStorage.getItem('adminSettings');
    if (adminSettings) {
      try {
        const settings = JSON.parse(adminSettings);
        setEnableCaptcha(settings.enableCaptcha ?? true);
      } catch (e) {
        console.error('读取系统设置失败', e);
      }
    }

    if (formRef.current) {
      useLayuiForm();
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.username.trim()) {
      newErrors.username = '请输入用户名';
    }

    if (!formData.password) {
      newErrors.password = '请输入密码';
    } else if (formData.password.length < 6) {
      newErrors.password = '密码长度不能少于6位';
    }

    if (enableCaptcha) {
      if (!formData.captcha) {
        newErrors.captcha = '请输入验证码';
      } else if (formData.captcha.toUpperCase() !== captchaCode) {
        newErrors.captcha = '验证码不正确';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        localStorage.setItem('token', 'demo-token-' + Date.now());
        router.push('/');
      }, 1000);
    }
  };

  return (
    <div className="layui-auth-shell">
      <div className="layui-auth-shell-inner">
        {/* Logo 和标题 */}
        <div className="layui-text-center layui-mb30 layui-anim layui-anim-fadein">
          <div className="layui-inline-block layui-mb20 layui-auth-logo-box">
            <span className="layui-auth-logo-text">168</span>
          </div>
          <h1 className="layui-font-2xl layui-font-bold layui-mb10 layui-font-white">
            美国华人168招聘网
          </h1>
          <p className="layui-font-lg layui-font-gray-light layui-opacity-90">
            欢迎回来，请登录您的账号
          </p>
        </div>

        {/* 登录表单卡片 */}
        <div className="layui-card layui-anim layui-anim-scale layui-auth-card">
          <div className="layui-card-body">
            <form ref={formRef} onSubmit={handleSubmit} className="layui-form">
              {/* 用户名/邮箱 */}
              <div className="layui-form-item">
                <div className="layui-input-wrap">
                  <div className="layui-input-prefix">
                    <i className="layui-icon layui-icon-username"></i>
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="用户名"
                    lay-verify="required"
                    lay-reqtext="请填写用户名"
                    className={`layui-input ${errors.username ? 'layui-border-red' : ''}`}
                  />
                </div>
                {errors.username && (
                  <p className="layui-font-xs layui-font-red layui-mt5">
                    <i className="layui-icon layui-icon-close layui-mr5"></i>
                    {errors.username}
                  </p>
                )}
              </div>

              {/* 密码 */}
              <div className="layui-form-item">
                <div className="layui-input-wrap">
                  <div className="layui-input-prefix">
                    <i className="layui-icon layui-icon-password"></i>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="密码"
                    lay-verify="required"
                    lay-reqtext="请填写密码"
                    className={`layui-input ${errors.password ? 'layui-border-red' : ''}`}
                  />
                  <div className="layui-input-suffix layui-cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                    <i className={`layui-icon ${showPassword ? 'layui-icon-eye' : 'layui-icon-eye-invisible'}`}></i>
                  </div>
                </div>
                {errors.password && (
                  <p className="layui-font-xs layui-font-red layui-mt5">
                    <i className="layui-icon layui-icon-close layui-mr5"></i>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* 验证码 */}
              {enableCaptcha && (
                <div className="layui-form-item">
                  <div className="layui-row">
                    <div className="layui-col-xs7">
                      <div className="layui-input-wrap">
                        <div className="layui-input-prefix">
                          <i className="layui-icon layui-icon-vercode"></i>
                        </div>
                        <input
                          type="text"
                          name="captcha"
                          value={formData.captcha}
                          onChange={handleInputChange}
                          placeholder="验证码"
                          lay-verify="required"
                          lay-reqtext="请填写验证码"
                          className={`layui-input layui-captcha-uppercase ${errors.captcha ? 'layui-border-red' : ''}`}
                          maxLength={4}
                        />
                      </div>
                    </div>
                    <div className="layui-col-xs5">
                      <div
                        className="layui-captcha-box"
                        onClick={generateCaptcha}
                        title="点击刷新"
                      >
                        {captchaCode}
                      </div>
                    </div>
                  </div>
                  {errors.captcha && (
                    <p className="layui-font-xs layui-font-red layui-mt5">
                      <i className="layui-icon layui-icon-close layui-mr5"></i>
                      {errors.captcha}
                    </p>
                  )}
                </div>
              )}

              {/* 记住我 & 忘记密码 */}
              <div className="layui-flex layui-flex-between layui-mb20">
                <label className="layui-checkbox-row">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    name="remember"
                    title="记住我"
                    lay-skin="primary"
                  />
                  <span className="layui-ml5">记住我</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="layui-font-sm layui-font-cyan layui-link-plain"
                >
                  忘记密码？
                </Link>
              </div>

              {/* 登录按钮 */}
              <button
                type="submit"
                className="layui-btn layui-btn-fluid layui-btn-lg layui-btn-enhanced layui-btn-gradient-submit"
                disabled={loading}
              >
                {loading ? (
                  <span className="layui-flex layui-flex-center">
                    <i className="layui-icon layui-icon-loading layui-anim layui-anim-rotate layui-anim-loop layui-mr10"></i>
                    登录中...
                  </span>
                ) : (
                  <span className="layui-flex layui-flex-center">
                    <i className="layui-icon layui-icon-ok layui-mr10"></i>
                    登录
                  </span>
                )}
              </button>
            </form>

            {/* 分割线 */}
            <div className="layui-mt25 layui-mb25 layui-login-divider">
              <div className="layui-login-divider-inner">
                <span className="layui-login-divider-text">
                  社交账号登录
                </span>
              </div>
            </div>

            {/* 社交登录按钮 */}
            <div className="layui-flex layui-flex-center layui-flex-gap-15">
              <button type="button" className="layui-filter-tag layui-filter-tag-green layui-hover-lift layui-oauth-icon-btn">
                <i className="layui-icon layui-icon-login-wechat layui-icon-md"></i>
              </button>
              <button type="button" className="layui-filter-tag layui-filter-tag-cyan layui-hover-lift layui-oauth-icon-btn">
                <i className="layui-icon layui-icon-login-qq layui-icon-md"></i>
              </button>
              <button type="button" className="layui-filter-tag layui-filter-tag-red layui-hover-lift layui-oauth-icon-btn">
                <i className="layui-icon layui-icon-login-weibo layui-icon-md"></i>
              </button>
            </div>

            {/* 注册链接 */}
            <p className="layui-text-center layui-mt20 layui-font-sm layui-font-gray-66">
              还没有账号？
              <Link href="/register" className="layui-font-cyan layui-font-bold layui-ml5 layui-link-plain">
                立即注册
              </Link>
            </p>
          </div>
        </div>

        {/* 返回首页 */}
        <p className="layui-text-center layui-mt20">
          <Link href="/" className="layui-font-sm layui-font-gray-light layui-link-plain layui-opacity-90">
            <i className="layui-icon layui-icon-return layui-mr5"></i>
            返回首页
          </Link>
        </p>
      </div>
    </div>
  );
}
