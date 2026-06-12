import { NextRequest, NextResponse } from 'next/server';
import { applicationService } from '@/lib/services/cloudflare-db';
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

    const companyId = request.nextUrl.searchParams.get('companyId');
    if (companyId) {
      if (currentUser.role !== 'employer' || currentUser.companyId !== companyId) {
        return NextResponse.json(errorResponse('无权访问该企业申请记录'), { status: 403 });
      }
      const applications = await applicationService.getByCompanyId(companyId);
      return NextResponse.json(successResponse(applications, '获取企业申请成功'));
    }

    const applications = await applicationService.getByUserId(currentUser.id);
    return NextResponse.json(successResponse(applications, '获取我的申请成功'));
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(errorResponse('获取申请失败'), { status: 500 });
  }
}
