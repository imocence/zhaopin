'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLayuiInit } from '@/lib/hooks/useLayuiInit';
import { fetchCaptcha, isCaptchaEnabled, verifyCaptcha } from '@/lib/utils/captcha';

type UserType = 'jobseeker' | 'employer';

export default function RegisterPage() {
    const router = useRouter();

    const [enableRegister, setEnableRegister] = useState(true);

    const [userType, setUserType] = useState<UserType>('jobseeker');
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        emailCode: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);
    const [captchaCode, setCaptchaCode] = useState('');
    const [captchaId, setCaptchaId] = useState('');
    const [agreed, setAgreed] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const isLocalDev = !isCaptchaEnabled();

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

    useEffect(() => {
        if (!isLocalDev) {
            refreshCaptcha();
        }
        // 读取管理员设置，控制是否允许注册
        try {
            const raw = localStorage.getItem('adminSettings');
            if (raw) {
                const s = JSON.parse(raw) as { enableRegister?: boolean };
                if (typeof s.enableRegister === 'boolean') setEnableRegister(Boolean(s.enableRegister));
            }
        } catch { }
    }, [refreshCaptcha, isLocalDev]);

    // 初始化 layui form（必须在组件顶层调用 Hook）
    useLayuiInit({
        modules: ['form'],
        callback: (layui) => {
            const form = layui.form;
            form.render();
        },
    });

    // 发送验证码倒计时
    const startCountdown = () => {
        setCountdown(60);
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

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

        if (!isLocalDev) {
            if (!formData.emailCode.trim()) {
                newErrors.emailCode = '请输入验证码';
            } else {
                // 通过接口验证验证码
                const result = await verifyCaptcha(captchaId, formData.emailCode);
                if (!result.success) {
                    newErrors.emailCode = result.message;
                    // 验证失败后刷新验证码
                    refreshCaptcha();
                }
            }
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

        if (!agreed) {
            newErrors.agreed = '请阅读并同意用户协议';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (await validateForm()) {
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                router.push('/login?registered=true');
            }, 1000);
        }
    };

    return (
        <div className="layui-container layui-mt20">
            {/* 页面头部 */}
            <div className="layui-card layui-page-header layui-mb20">
                <div className="layui-card-body layui-page-header-body layui-bg-gradient-cyan layui-flex layui-flex-center">
                    <div className="layui-page-z1">
                        <h1 className="layui-font-2xl layui-font-bold layui-font-white layui-mb0 layui-mt0">用户注册</h1>
                        <p className="layui-font-sm layui-font-gray-light layui-mb0 layui-mt0">创建您的账号，开启职业新篇章</p>
                    </div>
                </div>
            </div>

            {/* 注册内容区域 */}
            <div className="layui-row layui-col-space20">
                {/* 左侧注册表单 */}
                <div className="layui-col-md7 layui-col-xs12">
                    <div className="layui-card layui-card-enhanced">
                        {/* Tab 切换 */}
                        <div className="layui-tab layui-tab-brief">
                            <ul className="layui-tab-title">
                                <li
                                    className={userType === 'jobseeker' ? 'layui-this' : ''}
                                    onClick={() => setUserType('jobseeker')}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <i className="layui-icon layui-icon-user layui-icon-gap"></i>
                                    求职者注册
                                </li>
                                <li
                                    className={userType === 'employer' ? 'layui-this' : ''}
                                    onClick={() => setUserType('employer')}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <i className="layui-icon layui-icon-component layui-icon-gap"></i>
                                    企业注册
                                </li>
                            </ul>
                            {/* 注册表单 - 根据 userType 动态切换 */}
                            <div className="layui-tab-item layui-show">
                                {!enableRegister ? (
                                    <div className="layui-p25">
                                        <p>当前站点已关闭注册。如需注册请联系管理员。</p>
                                        <div style={{ marginTop: 12 }}>
                                            <Link href="/login" prefetch={false} className="layui-btn layui-btn-primary">去登录</Link>
                                        </div>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="layui-form layui-p25">
                                        <input type="hidden" name="userType" value={userType} />
                                        {/* 用户名/企业名称 */}
                                        <div className="layui-form-item layui-mb20">
                                            <div className="layui-input-wrap">
                                                <div className="layui-input-prefix">
                                                    <i className="layui-icon layui-icon-username"></i>
                                                </div>
                                                <input
                                                    type="text"
                                                    name="username"
                                                    value={formData.username}
                                                    onChange={handleInputChange}
                                                    placeholder={userType === 'employer' ? '请输入企业名称' : '3-20位字符'}
                                                    lay-verify="required"
                                                    lay-reqtext={userType === 'employer' ? '请填写企业名称' : '请填写用户名'}
                                                    className={`layui-input ${errors.username ? 'layui-border-red' : ''}`}
                                                    maxLength={userType === 'employer' ? 50 : 20}
                                                />
                                            </div>
                                            {errors.username && (
                                                <p className="layui-font-xs layui-font-red layui-mt5">
                                                    <i className="layui-icon layui-icon-close layui-mr5"></i>
                                                    {errors.username}
                                                </p>
                                            )}
                                        </div>

                                        {/* 邮箱 */}
                                        <div className="layui-form-item layui-mb20">
                                            <div className="layui-row layui-col-space10">
                                                <div className="layui-col-md8 layui-col-xs7">
                                                    <div className="layui-input-wrap">
                                                        <div className="layui-input-prefix">
                                                            <i className="layui-icon layui-icon-email"></i>
                                                        </div>
                                                        <input
                                                            type="email"
                                                            name="email"
                                                            value={formData.email}
                                                            onChange={handleInputChange}
                                                            placeholder="用于登录和接收通知"
                                                            lay-verify="required|email"
                                                            className={`layui-input ${errors.email ? 'layui-border-red' : ''}`}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="layui-col-md4 layui-col-xs5">
                                                    <button
                                                        type="button"
                                                        className="layui-btn layui-btn-fluid layui-btn-primary layui-border"
                                                        disabled={countdown > 0}
                                                        onClick={() => {
                                                            startCountdown();
                                                            alert(userType === 'employer' ? '验证码已发送至企业邮箱' : '验证码已发送至您的邮箱');
                                                        }}
                                                    >
                                                        {countdown > 0 ? `${countdown}s` : '发送验证码'}
                                                    </button>
                                                </div>
                                            </div>
                                            {errors.email && (
                                                <p className="layui-font-xs layui-font-red layui-mt5">
                                                    <i className="layui-icon layui-icon-close layui-mr5"></i>
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div>

                                        {!isLocalDev && (
                                            <div className="layui-form-item layui-mb20">
                                                <div className="layui-row layui-col-space10">
                                                    <div className="layui-col-md8 layui-col-xs7">
                                                        <div className="layui-input-wrap">
                                                            <div className="layui-input-prefix">
                                                                <i className="layui-icon layui-icon-vercode"></i>
                                                            </div>
                                                            <input
                                                                type="text"
                                                                name="emailCode"
                                                                value={formData.emailCode}
                                                                onChange={handleInputChange}
                                                                placeholder="请输入验证码"
                                                                lay-verify="required"
                                                                lay-reqtext="请填写验证码"
                                                                className={`layui-input layui-captcha-uppercase ${errors.emailCode ? 'layui-border-red' : ''}`}
                                                                maxLength={4}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="layui-col-md4 layui-col-xs5">
                                                        <div
                                                            className="layui-captcha-box"
                                                            onClick={refreshCaptcha}
                                                            title="点击刷新验证码"
                                                        >
                                                            {captchaCode}
                                                        </div>
                                                    </div>
                                                </div>
                                                {errors.emailCode && (
                                                    <p className="layui-font-xs layui-font-red layui-mt5">
                                                        <i className="layui-icon layui-icon-close layui-mr5"></i>
                                                        {errors.emailCode}
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {/* 密码 */}
                                        <div className="layui-form-item layui-mb20">
                                            <div className="layui-input-wrap">
                                                <div className="layui-input-prefix">
                                                    <i className="layui-icon layui-icon-password"></i>
                                                </div>
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleInputChange}
                                                    placeholder="6-20位字符"
                                                    lay-verify="required"
                                                    lay-reqtext="请填写密码"
                                                    className={`layui-input ${errors.password ? 'layui-border-red' : ''}`}
                                                    maxLength={20}
                                                />
                                                <div className="layui-input-suffix layui-cursor-pointer"
                                                    onClick={() => setShowPassword(!showPassword)}>
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

                                        {/* 确认密码 */}
                                        <div className="layui-form-item layui-mb20">
                                            <div className="layui-input-wrap">
                                                <div className="layui-input-prefix">
                                                    <i className="layui-icon layui-icon-password"></i>
                                                </div>
                                                <input
                                                    type="password"
                                                    name="confirmPassword"
                                                    value={formData.confirmPassword}
                                                    onChange={handleInputChange}
                                                    placeholder="再次输入密码"
                                                    lay-verify="required"
                                                    lay-reqtext="请确认密码"
                                                    className={`layui-input ${errors.confirmPassword ? 'layui-border-red' : ''}`}
                                                    maxLength={20}
                                                />
                                            </div>
                                            {errors.confirmPassword && (
                                                <p className="layui-font-xs layui-font-red layui-mt5">
                                                    <i className="layui-icon layui-icon-close layui-mr5"></i>
                                                    {errors.confirmPassword}
                                                </p>
                                            )}
                                        </div>

                                        {/* 用户协议 */}
                                        <div className="layui-form-item layui-mb20 layui-pt20 layui-border-top">
                                            <div className="layui-input-block">
                                                <input
                                                    type="checkbox"
                                                    name="agreeTerms"
                                                    lay-skin="primary"
                                                    checked={agreed}
                                                    onChange={(e) => {
                                                        setAgreed(e.target.checked);
                                                        if (errors.agreed) {
                                                            setErrors(prev => ({ ...prev, agreed: '' }));
                                                        }
                                                    }}
                                                />
                                                <span style={{ display: 'inline-block', verticalAlign: '-webkit-baseline-middle' }}>
                                                    我已阅读并同意
                                                    <Link href="/terms" className="layui-font-blue layui-ml5">《用户协议》</Link>和
                                                    <Link href="/privacy" className="layui-font-blue">《隐私政策》</Link>
                                                </span>
                                                {errors.agreed && (
                                                    <p className="layui-font-xs layui-font-red layui-mt5">
                                                        <i className="layui-icon layui-icon-close layui-mr5"></i>
                                                        {errors.agreed}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* 注册按钮 */}
                                        <button
                                            type="submit"
                                            className="layui-btn layui-btn-fluid layui-btn-lg layui-btn-enhanced layui-btn-gradient-submit"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <span className="layui-flex layui-flex-center">
                                                    <i className="layui-icon layui-icon-loading layui-anim layui-anim-rotate layui-anim-loop layui-mr10"></i>
                                                    注册中...
                                                </span>
                                            ) : (
                                                <span className="layui-flex layui-flex-center">
                                                    <i className="layui-icon layui-icon-ok layui-mr10"></i>
                                                    立即注册
                                                </span>
                                            )}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 注册优势 */}
                    <div className="layui-card layui-card-enhanced layui-mt20">
                        <div
                            className="layui-card-header layui-card-header-bg layui-font-lg layui-font-bold layui-font-gray-light layui-flex layui-flex-center layui-gap-8">
                            <i className="layui-icon layui-icon-about layui-font-cyan layui-font-xl"></i>
                            注册优势
                        </div>
                        <div className="layui-card-body" style={{ padding: '10px 15px' }}>
                            <div className="layui-row layui-col-space10">
                                <div className="layui-col-md4 layui-col-xs6">
                                    <div className="layui-text-center" style={{ padding: '8px 5px' }}>
                                        <i className="layui-icon layui-icon-ok layui-font-cyan" style={{ fontSize: '20px' }}></i>
                                        <p className="layui-font-xs layui-font-gray-light layui-mt5">海量优质职位，精准匹配</p>
                                    </div>
                                </div>
                                <div className="layui-col-md4 layui-col-xs6">
                                    <div className="layui-text-center" style={{ padding: '8px 5px' }}>
                                        <i className="layui-icon layui-icon-ok layui-font-cyan" style={{ fontSize: '20px' }}></i>
                                        <p className="layui-font-xs layui-font-gray-light layui-mt5">企业实名认证，安全可靠</p>
                                    </div>
                                </div>
                                <div className="layui-col-md4 layui-col-xs6">
                                    <div className="layui-text-center" style={{ padding: '8px 5px' }}>
                                        <i className="layui-icon layui-icon-ok layui-font-cyan" style={{ fontSize: '20px' }}></i>
                                        <p className="layui-font-xs layui-font-gray-light layui-mt5">一键投递简历，快速入职</p>
                                    </div>
                                </div>
                                <div className="layui-col-md4 layui-col-xs6">
                                    <div className="layui-text-center" style={{ padding: '8px 5px' }}>
                                        <i className="layui-icon layui-icon-ok layui-font-cyan" style={{ fontSize: '20px' }}></i>
                                        <p className="layui-font-xs layui-font-gray-light layui-mt5">隐私保护，信息加密</p>
                                    </div>
                                </div>
                                <div className="layui-col-md4 layui-col-xs6">
                                    <div className="layui-text-center" style={{ padding: '8px 5px' }}>
                                        <i className="layui-icon layui-icon-ok layui-font-cyan" style={{ fontSize: '20px' }}></i>
                                        <p className="layui-font-xs layui-font-gray-light layui-mt5">专业服务，全程协助</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 右侧边栏 */}
                <div className="layui-col-md5 layui-col-xs12">
                    {/* 常见问题 */}
                    <div className="layui-card layui-card-enhanced">
                        <div
                            className="layui-card-header layui-card-header-bg layui-font-lg layui-font-bold layui-font-gray-light layui-flex layui-flex-center layui-gap-8">
                            <i className="layui-icon layui-icon-help layui-font-orange layui-font-xl"></i>
                            常见问题
                        </div>
                        <div className="layui-card-body layui-p20">
                            <div className="layui-collapse">
                                <div className="layui-colla-item">
                                    <h2 className="layui-colla-title layui-flex layui-flex-between layui-flex-center layui-gap-8">
                                        <span className="layui-font-sm layui-font-bold layui-font-gray-light">如何找回密码？</span>
                                    </h2>
                                    <div className="layui-colla-content layui-show layui-anim layui-anim-fadein">
                                        <p className="layui-font-sm layui-font-gray-light layui-mb0">
                                            在登录页面点击“忘记密码”，通过注册邮箱可以重置密码。
                                        </p>
                                    </div>
                                </div>
                                <div className="layui-colla-item">
                                    <h2 className="layui-colla-title layui-flex layui-flex-between layui-flex-center layui-gap-8">
                                        <span className="layui-font-sm layui-font-bold layui-font-gray-light">邮箱收不到验证码？</span>
                                    </h2>
                                    <div className="layui-colla-content layui-show layui-anim layui-anim-fadein">
                                        <p className="layui-font-sm layui-font-gray-light layui-mb0">
                                            请检查垃圾邮件箱，或将邮箱添加到白名单中。如果仍无法接收，请联系客服。
                                        </p>
                                    </div>
                                </div>
                                <div className="layui-colla-item">
                                    <h2 className="layui-colla-title layui-flex layui-flex-between layui-flex-center layui-gap-8">
                                        <span
                                            className="layui-font-sm layui-font-bold layui-font-gray-light">一个账号可以发布多个职位吗？</span>
                                    </h2>
                                    <div className="layui-colla-content layui-show layui-anim layui-anim-fadein">
                                        <p className="layui-font-sm layui-font-gray-light layui-mb0">
                                            是的，企业账号可以发布多个职位，但需要审核通过后才能生效。
                                        </p>
                                    </div>
                                </div>
                                <div className="layui-colla-item">
                                    <h2 className="layui-colla-title layui-flex layui-flex-between layui-flex-center layui-gap-8">
                                        <span className="layui-font-sm layui-font-bold layui-font-gray-light">注册后如何修改资料？</span>
                                    </h2>
                                    <div className="layui-colla-content layui-show layui-anim layui-anim-fadein">
                                        <p className="layui-font-sm layui-font-gray-light layui-mb0">
                                            登录后进入个人中心，可以在“我的资料”页面修改个人信息。
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 已有账号 */}
                    <div className="layui-card layui-card-enhanced layui-text-center layui-p25 layui-mt20">
                        <p className="layui-font-sm layui-font-gray-light layui-mb20 layui-text-center">
                            已有账号？
                        </p>
                        <Link href="/login" prefetch={false} className="layui-btn layui-btn-fluid layui-btn-primary layui-btn-enhanced">
                            立即登录
                        </Link>
                    </div>
                </div>
            </div>

            {/* 返回首页 */}
            <div className="layui-text-center layui-mt20 layui-mb20">
                <Link href="/" className="layui-font-sm layui-font-blue layui-mr5">
                    ← 返回首页
                </Link>
            </div>
        </div>
    );
}
