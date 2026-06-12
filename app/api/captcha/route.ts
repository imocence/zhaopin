import { NextRequest, NextResponse } from 'next/server';
import { successResponse, errorResponse } from '@/lib/utils/api-response';

// 简单的内存缓存（生产环境应使用 Redis 等）
const captchaStore = new Map<string, { code: string; expires: number }>();

// 定期清理过期验证码
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of captchaStore) {
    if (value.expires < now) {
      captchaStore.delete(key);
    }
  }
}, 60 * 1000);

// 生成验证码字符
function generateCode(length: number = 4): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// 生成唯一ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

/**
 * GET /api/captcha - 获取验证码
 * 返回验证码ID和验证码文本（用于展示）
 */
export async function GET(request: NextRequest) {
  const captchaId = generateId();
  const code = generateCode(4);

  // 缓存5分钟
  captchaStore.set(captchaId, {
    code,
    expires: Date.now() + 5 * 60 * 1000,
  });

  return NextResponse.json(successResponse({
    captchaId,
    captchaCode: code,
  }, '获取验证码成功'));
}

/**
 * POST /api/captcha - 验证验证码
 * Body: { captchaId: string, captchaCode: string }
 */
type CaptchaVerifyBody = {
  captchaId?: unknown;
  captchaCode?: unknown;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CaptchaVerifyBody;
    const captchaId = typeof body.captchaId === 'string' ? body.captchaId : undefined;
    const captchaCode = typeof body.captchaCode === 'string' ? body.captchaCode : undefined;

    if (!captchaId || !captchaCode) {
      return NextResponse.json(
        errorResponse('缺少验证码参数'),
        { status: 400 }
      );
    }

    const stored = captchaStore.get(captchaId);

    if (!stored) {
      return NextResponse.json(
        errorResponse('验证码已过期，请重新获取'),
        { status: 400 }
      );
    }

    if (stored.expires < Date.now()) {
      captchaStore.delete(captchaId);
      return NextResponse.json(
        errorResponse('验证码已过期，请重新获取'),
        { status: 400 }
      );
    }

    // 验证成功后删除，防止重复使用
    captchaStore.delete(captchaId);

    if (stored.code !== captchaCode.toUpperCase()) {
      return NextResponse.json(
        errorResponse('验证码不正确'),
        { status: 400 }
      );
    }

    return NextResponse.json(successResponse({ success: true }, '验证码正确'));
  } catch {
    return NextResponse.json(
      errorResponse('请求参数错误'),
      { status: 400 }
    );
  }
}
