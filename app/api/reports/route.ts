import { NextRequest, NextResponse } from 'next/server';
import { reportService } from '@/lib/services/cloudflare-db';
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
    if (currentUser.role !== 'admin') {
      return NextResponse.json(errorResponse('无权访问举报数据'), { status: 403 });
    }

    const reports = await reportService.getAll();
    return NextResponse.json(successResponse(reports, '获取举报列表成功'));
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(errorResponse('获取举报失败'), { status: 500 });
  }
}
