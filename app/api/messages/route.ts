import { NextRequest, NextResponse } from 'next/server';
import { messageService } from '@/lib/services/cloudflare-db';
import { ensureDb } from '@/lib/db/ensure-db';
import { getCurrentUser } from '@/lib/utils/auth-server';
import { successResponse, errorResponse } from '@/lib/utils/api-response';

export async function GET(request: NextRequest) {
  try {
    await ensureDb(request);

    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json(errorResponse('未登录'), { status: 401 });
    }

    const messages = await messageService.getByUserId(currentUser.id);
    return NextResponse.json(successResponse(messages, '获取消息成功'));
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(errorResponse('获取消息失败'), { status: 500 });
  }
}
