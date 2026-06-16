'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLayuiForm } from '@/lib/hooks/useLayuiInit';
import { fetchCaptcha, isCaptchaEnabled, verifyCaptcha } from '@/lib/utils/captcha';
import { saveAuth } from '@/lib/utils/auth-client';
import { User } from '@/types';
import type { ApiResponse } from '@/lib/utils/api-response';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    captcha: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [captchaCode, setCaptchaCode] = useState('');
  const [captchaId, setCaptchaId] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [enableCaptcha, setEnableCaptcha] = useState(isCaptchaEnabled());
  const formRef = useRef<HTMLFormElement>(null);

  // 从接口获取验证码
  const refreshCaptcha = useCallback(async () => {
    try {
      const data = await fetchCaptcha();
      setCaptchaId(data.captchaId);
      setCaptchaCode(data.captchaCode);
    } catch (e) {
      console.error('获取验证码失败', e);
    }
  }, []);

  // 初始化 layui 表单（必须在组件顶层调用 Hook）
  useLayuiForm();

  useEffect(() => {
    if (isCaptchaEnabled()) {
      // 在微任务中调用以避免同步 setState 导致的渲染警告
      Promise.resolve().then(() => refreshCaptcha());
    }

    // 读取系统设置
    const adminSettings = localStorage.getItem('adminSettings');
    if (adminSettings) {
      try {
        const settings = JSON.parse(adminSettings);
        Promise.resolve().then(() => setEnableCaptcha(isCaptchaEnabled() ? settings.enableCaptcha ?? true : false));
      } catch (e) {
        console.error('读取系统设置失败', e);
      }
    }
  }, [refreshCaptcha]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = async () => {
    const newErrors: { [key: string]: string } = {};

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
      } else {
        // 通过接口验证验证码
        const result = await verifyCaptcha(captchaId, formData.captcha);
        if (!result.success) {
          newErrors.captcha = result.message;
          // 验证失败后刷新验证码
          refreshCaptcha();
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!(await validateForm())) return;
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: formData.username.trim(), password: formData.password }),
      });
      const data = (await res.json().catch(() => null)) as ApiResponse<{ user: User; token: string; expiresAt?: number }> | null;
      if (!res.ok || data?.status === 'error') {
        setLoginError(data?.message || '登录失败，请稍后重试');
        if (enableCaptcha) {
          refreshCaptcha();
        }
        setLoading(false);
        return;
      }

      // 后端返回 { status, message, data: { user, token } }
      saveAuth(data?.data?.token ?? '', data?.data?.user as User, data?.data?.expiresAt ?? undefined);

      // 优先使用 URL 参数 next/redirect，其次尝试同源的 document.referrer，最后回到 /user
      try {
        const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
        const nextParam = params?.get('next') || params?.get('redirect');
        if (nextParam) {
          const decodedNext = decodeURIComponent(nextParam);
          if (decodedNext.startsWith('/')) {
            router.push(decodedNext);
          } else {
            // if decodedNext is full URL but same-origin, push its pathname
            try {
              const u = new URL(decodedNext, window.location.href);
              if (u.origin === window.location.origin) {
                router.push(u.pathname + u.search + u.hash);
              } else {
                router.push('/user');
              }
            } catch {
              router.push('/user');
            }
          }
        } else if (typeof document !== 'undefined' && document.referrer) {
          try {
            const ref = new URL(document.referrer);
            const currentPath = window.location.pathname;
            if (ref.origin === window.location.origin && ref.pathname !== currentPath) {
              // 保留 ref 的 pathname + search + hash
              router.push(ref.pathname + ref.search + ref.hash);
            } else {
              router.push('/user');
            }
          } catch {
            router.push('/user');
          }
        } else {
          router.push('/user');
        }
      } catch {
        router.push('/user');
      }
    } catch (error) {
      console.error('登录请求失败', error);
      setLoginError('登录请求失败，请检查网络后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layui-auth-shell layui-auth-shell--soft">
      <div className="layui-auth-shell-inner">
        {/* Logo 和标题 */}
        <div className="layui-text-center layui-mb30 layui-anim layui-anim-fadein">
          <div className="layui-inline-block layui-mb20 layui-auth-logo-box-soft">
            <span className="layui-auth-logo-text-soft">168</span>
          </div>
          <h1 className="layui-font-2xl layui-font-bold layui-mb10 layui-font-dark" style={{ textShadow: 'none' }}>
            美国华人168招聘网
          </h1>
          <p className="layui-font-lg layui-font-gray" style={{ opacity: 1 }}>
            欢迎回来，请登录您的账号
          </p>
        </div>

        {/* 登录表单卡片 */}
        <div className="layui-card layui-anim layui-anim-scale layui-auth-card">
          <div className="layui-card-body" style={{ padding: '35px 30px' }}>
            <form ref={formRef} onSubmit={handleSubmit} className="layui-form">
              {loginError && (
                <p className="layui-font-sm layui-font-red layui-mb10">{loginError}</p>
              )}
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
                  <button
                    type="button"
                    className="layui-btn layui-btn-xs layui-btn-primary layui-input-suffix layui-cursor-pointer"
                    style={{ pointerEvents: 'auto' }}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? '隐藏密码' : '显示密码'}
                  >
                    <i className={`layui-icon ${showPassword ? 'layui-icon-eye' : 'layui-icon-eye-invisible'}`}></i>
                  </button>
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
                  <div className="layui-row layui-col-space10">
                    <div className="layui-col-md8 layui-col-xs7">
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
                    <div className="layui-col-md4 layui-col-xs5">
                      <div
                        className="layui-captcha-box"
                        style={{ height: '42px', borderRadius: '8px' }}
                        onClick={refreshCaptcha}
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
              <div className="layui-flex layui-flex-between layui-mb20" style={{ marginTop: '5px' }}>
                <label className="layui-checkbox-row">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    name="remember"
                    lay-skin="primary"
                  />
                  <span className="layui-ml5">记住我</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="layui-font-sm layui-link-plain"
                  style={{ color: '#009688' }}
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
            <div className="layui-flex layui-flex-center layui-gap-15">
              <button type="button" className="layui-filter-tag layui-filter-tag-green layui-hover-lift layui-oauth-icon-btn" title="微信登录">
                <i className="layui-icon layui-icon-login-wechat layui-icon-md"></i>
              </button>
              <button type="button" className="layui-filter-tag layui-filter-tag-cyan layui-hover-lift layui-oauth-icon-btn" title="QQ登录">
                <i className="layui-icon layui-icon-login-qq layui-icon-md"></i>
              </button>
              <button type="button" className="layui-filter-tag layui-filter-tag-red layui-hover-lift layui-oauth-icon-btn" title="微博登录">
                <i className="layui-icon layui-icon-login-weibo layui-icon-md"></i>
              </button>
            </div>

            {/* 注册链接 */}
            <p className="layui-text-center layui-mt20 layui-font-sm" style={{ color: '#999' }}>
              还没有账号？
              <Link href="/register" className="layui-font-bold layui-ml5 layui-link-plain" style={{ color: '#009688' }}>
                立即注册
              </Link>
            </p>
          </div>
        </div>

        {/* 返回首页 */}
        <p className="layui-text-center layui-mt20">
          <Link href="/" className="layui-font-sm layui-link-plain layui-font-gray" style={{ opacity: 0.8, transition: 'opacity 0.3s' }}>
            <i className="layui-icon layui-icon-return layui-mr5"></i>
            返回首页
          </Link>
        </p>
      </div>
    </div>
  );
}
