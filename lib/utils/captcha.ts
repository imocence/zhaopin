/**
 * 验证码工具函数
 * 统一通过 /api/captcha 接口获取和验证验证码
 */

import type { ApiResponse } from '@/lib/utils/api-response';

function isLocalDevelopment(): boolean {
  return typeof process !== 'undefined' && process.env.NODE_ENV === 'development';
}

export function isCaptchaEnabled(): boolean {
  // 客户端优先读取 adminSettings（由后台设置页面写入 localStorage）
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('adminSettings');
      if (raw) {
        const settings = JSON.parse(raw) as { enableCaptcha?: boolean };
        if (typeof settings.enableCaptcha === 'boolean') {
          return Boolean(settings.enableCaptcha);
        }
      }
    } catch {
      // ignore
    }
  }

  return !isLocalDevelopment();
}

interface CaptchaResponse {
  captchaId: string;
  captchaCode: string;
}

interface VerifyResponse {
  success: boolean;
  message: string;
}

// use shared `ApiResponse<T>` from `lib/utils/api-response`

/**
 * 从接口获取验证码
 * @returns 验证码ID和验证码文本
 */
export async function fetchCaptcha(): Promise<CaptchaResponse> {
  if (!isCaptchaEnabled()) {
    return {
      captchaId: 'LOCAL_DEBUG',
      captchaCode: '0000',
    };
  }

  const res = await fetch('/api/captcha');
  if (!res.ok) {
    throw new Error('获取验证码失败');
  }

  const json = (await res.json()) as ApiResponse<CaptchaResponse>;
  if (json.status === 'error') {
    throw new Error(json.message);
  }

  return json.data as CaptchaResponse;
}

/**
 * 验证验证码
 * @param captchaId 验证码ID
 * @param captchaCode 用户输入的验证码
 * @returns 验证结果
 */
export async function verifyCaptcha(
  captchaId: string,
  captchaCode: string
): Promise<VerifyResponse> {
  if (!isCaptchaEnabled()) {
    return { success: true, message: '本地开发模式跳过验证码' };
  }

  const res = await fetch('/api/captcha', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ captchaId, captchaCode }),
  });

  const json = (await res.json()) as ApiResponse<VerifyResponse>;
  if (json.status === 'error') {
    return { success: false, message: json.message };
  }

  return json.data as VerifyResponse;
}
