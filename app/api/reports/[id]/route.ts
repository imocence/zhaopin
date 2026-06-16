import { NextRequest, NextResponse } from 'next/server';
import { reportService } from '@/lib/services/cloudflare-db';
import { ensureDb } from '@/lib/db/ensure-db';
import { getCurrentUser } from '@/lib/utils/auth-server';
import { successResponse, errorResponse } from '@/lib/utils/api-response';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureDb(request);

    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json(errorResponse('未登录'), { status: 401 });
    }
    if (currentUser.role !== 'admin') {
      return NextResponse.json(errorResponse('无权更新举报状态'), { status: 403 });
    }

    const { id } = await params;
    const body = (await request.json()) as { status?: string } | null;
    const status = body?.status;
    if (!status || !['pending', 'processing', 'resolved'].includes(status)) {
      return NextResponse.json(errorResponse('无效的举报状态'), { status: 400 });
    }

    const updated = await reportService.updateStatus(id, status as 'pending' | 'processing' | 'resolved');
    if (!updated) {
      return NextResponse.json(errorResponse('举报不存在或更新失败'), { status: 404 });
    }

    return NextResponse.json(successResponse(updated, '举报状态更新成功'));
  } catch (error) {
    console.error('Error updating report status:', error);
    return NextResponse.json(errorResponse('更新举报状态失败'), { status: 500 });
  }
}
