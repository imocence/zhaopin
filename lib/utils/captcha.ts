/**
 * 验证码工具函数
 * 统一通过 /api/captcha 接口获取和验证验证码
 */

interface CaptchaResponse {
  captchaId: string;
  captchaCode: string;
}

interface VerifyResponse {
  success: boolean;
  message: string;
}

/**
 * 从接口获取验证码
 * @returns 验证码ID和验证码文本
 */
export async function fetchCaptcha(): Promise<CaptchaResponse> {
  const res = await fetch('/api/captcha');
  if (!res.ok) {
    throw new Error('获取验证码失败');
  }
  return res.json();
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
  const res = await fetch('/api/captcha', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ captchaId, captchaCode }),
  });
  return res.json();
}
