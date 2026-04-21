'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type UserType = 'jobseeker' | 'employer';

export default function RegisterPage() {
  const router = useRouter();
  const [userType, setUserType] = useState<UserType>('jobseeker');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    captcha: '',
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);
  const [captchaCode, setCaptchaCode] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [enableCaptcha, setEnableCaptcha] = useState(true);

  // 生成验证码
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
  };

  React.useEffect(() => {
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
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // 清除对应字段的错误
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.username.trim()) {
      newErrors.username = '请输入用户名';
    } else if (formData.username.length < 3) {
      newErrors.username = '用户名长度不能少于3位';
    } else if (formData.username.length > 20) {
      newErrors.username = '用户名长度不能超过20位';
    }

    if (!formData.email.trim()) {
      newErrors.email = '请输入邮箱';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = '请输入手机号';
    } else if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = '请输入有效的手机号';
    }

    if (!formData.password) {
      newErrors.password = '请输入密码';
    } else if (formData.password.length < 6) {
      newErrors.password = '密码长度不能少于6位';
    } else if (formData.password.length > 20) {
      newErrors.password = '密码长度不能超过20位';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '请确认密码';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致';
    }

    // 只有开启验证码时才验证
    if (enableCaptcha) {
      if (!formData.captcha.trim()) {
        newErrors.captcha = '请输入验证码';
      } else if (formData.captcha.toUpperCase() !== captchaCode) {
        newErrors.captcha = '验证码不正确';
      }
    }

    if (!agreed) {
      newErrors.agreed = '请阅读并同意用户协议';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);
      // 模拟注册请求
      setTimeout(() => {
        setLoading(false);
        // 注册成功，跳转到登录页
        router.push('/login?registered=true');
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo 和标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">美国华人168招聘网</h1>
          <p className="text-gray-600">创建您的账号</p>
        </div>

        {/* 注册表单卡片 */}
        <div className="layui-card">
          <div className="layui-card-body p-8">
            {/* 用户类型选择 */}
            <div className="flex gap-2 mb-6">
              <button
                type="button"
                onClick={() => setUserType('jobseeker')}
                className={`flex-1 py-3 px-4 rounded text-center transition-colors ${
                  userType === 'jobseeker'
                    ? 'bg-[var(--layui-primary)] text-white'
                    : 'bg-white text-gray-700 border border-gray-300'
                }`}
              >
                <span className="text-lg mr-2">👤</span>
                求职者
              </button>
              <button
                type="button"
                onClick={() => setUserType('employer')}
                className={`flex-1 py-3 px-4 rounded text-center transition-colors ${
                  userType === 'employer'
                    ? 'bg-[var(--layui-primary)] text-white'
                    : 'bg-white text-gray-700 border border-gray-300'
                }`}
              >
                <span className="text-lg mr-2">🏢</span>
                企业招聘
              </button>
            </div>

            <form onSubmit={handleSubmit} className="layui-form">
              {/* 用户名 */}
              <div className="layui-form-item mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  用户名 *
                </label>
                <div className="layui-input-block !m-0">
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="3-20位字符"
                    className={`layui-input ${errors.username ? 'border-red-500' : ''}`}
                    maxLength={20}
                  />
                  {errors.username && (
                    <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                  )}
                </div>
              </div>

              {/* 邮箱 */}
              <div className="layui-form-item mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  邮箱 *
                </label>
                <div className="layui-input-block !m-0">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="用于登录和接收通知"
                    className={`layui-input ${errors.email ? 'border-red-500' : ''}`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* 手机号 */}
              <div className="layui-form-item mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  手机号 *
                </label>
                <div className="layui-input-block !m-0">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="用于账号验证"
                    className={`layui-input ${errors.phone ? 'border-red-500' : ''}`}
                    maxLength={11}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* 密码 */}
              <div className="layui-form-item mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  密码 *
                </label>
                <div className="layui-input-block !m-0">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="6-20位字符"
                    className={`layui-input ${errors.password ? 'border-red-500' : ''}`}
                    maxLength={20}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                  )}
                </div>
              </div>

              {/* 确认密码 */}
              <div className="layui-form-item mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  确认密码 *
                </label>
                <div className="layui-input-block !m-0">
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="再次输入密码"
                    className={`layui-input ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    maxLength={20}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {/* 验证码 */}
              {enableCaptcha && (
                <div className="layui-form-item mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    验证码 *
                  </label>
                  <div className="layui-codebox">
                    <div className="flex-1 layui-input-block !m-0">
                      <input
                        type="text"
                        name="captcha"
                        value={formData.captcha}
                        onChange={handleInputChange}
                        placeholder="请输入验证码"
                        className={`layui-input ${errors.captcha ? 'border-red-500' : ''}`}
                        maxLength={4}
                      />
                    </div>
                    <div
                      className="layui-codebox-img"
                      onClick={generateCaptcha}
                      title="点击刷新"
                    >
                      {captchaCode}
                    </div>
                  </div>
                  {errors.captcha && (
                    <p className="text-red-500 text-xs mt-1">{errors.captcha}</p>
                  )}
                </div>
              )}

              {/* 用户协议 */}
              <div className="layui-form-item mb-6">
                <label style={{display: 'flex', alignItems: 'flex-start', cursor: 'pointer'}}>
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    checked={agreed}
                    onChange={(e) => {
                      setAgreed(e.target.checked);
                      if (errors.agreed) {
                        setErrors(prev => ({ ...prev, agreed: '' }));
                      }
                    }}
                    style={{width: '18px', height: '18px', marginTop: '2px', cursor: 'pointer'}}
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    我已阅读并同意
                    <Link href="/terms" className="text-[var(--layui-primary)] hover:underline mx-1">
                      《用户协议》
                    </Link>
                    和
                    <Link href="/privacy" className="text-[var(--layui-primary)] hover:underline mx-1">
                      《隐私政策》
                    </Link>
                  </span>
                </label>
                {errors.agreed && (
                  <p className="text-red-500 text-xs mt-1 ml-7">{errors.agreed}</p>
                )}
              </div>

              {/* 注册按钮 */}
              <button
                type="submit"
                className="layui-btn layui-btn-lg w-full"
                disabled={loading}
              >
                {loading ? '注册中...' : '注册'}
              </button>
            </form>

            {/* 分割线 */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">社交账号注册</span>
              </div>
            </div>

            {/* 社交注册按钮 */}
            <div className="flex justify-center gap-4">
              <button className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.045c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z"/>
                </svg>
              </button>
              <button className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 5.303 3.438 9.8 8.207 11.387.6.11.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
              </button>
              <button className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </button>
            </div>

            {/* 登录链接 */}
            <p className="text-center mt-6 text-sm text-gray-600">
              已有账号？
              <Link href="/login" className="text-[var(--layui-primary)] hover:underline font-medium">
                立即登录
              </Link>
            </p>
          </div>
        </div>

        {/* 返回首页 */}
        <p className="text-center mt-6">
          <Link href="/" className="text-sm text-gray-600 hover:text-[var(--layui-primary)]">
            ← 返回首页
          </Link>
        </p>
      </div>
    </div>
  );
}
