import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/services/cloudflare-db';
import { createAuthToken, authResponse } from '@/lib/utils/auth-server';
import { ensureDb } from '@/lib/db/ensure-db';

export async function POST(request: NextRequest) {
  try {
    await ensureDb(request);
    const body = await request.json();
    const { username, password } = body as { username?: string; password?: string };

    if (!username || !password) {
      return NextResponse.json(
        { error: '用户名和密码为必填项' },
        { status: 400 }
      );
    }

    const user = await userService.authenticate(username.trim(), password);
    if (!user) {
      return NextResponse.json(
        { error: '用户名或密码错误' },
        { status: 401 }
      );
    }

    const token = createAuthToken(user.id);
    return NextResponse.json(authResponse(user, token));
  } catch (error) {
    console.error('Error authenticating user:', error);
    return NextResponse.json(
      { error: '登录失败，请稍后重试' },
      { status: 500 }
    );
  }
}
