
import { NextRequest, NextResponse } from 'next/server';
import { companyService } from '@/lib/services/cloudflare-db';
import { ensureDb } from '@/lib/db/ensure-db';
import { successResponse, errorResponse } from '@/lib/utils/api-response';

// GET /api/companies - 获取公司列表
export async function GET(request: NextRequest) {
  try {
    await ensureDb(request);

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'all'; // all, verified
    const state = searchParams.get('state') || undefined;

    if (type === 'verified') {
      const companies = await companyService.getVerified();
      return NextResponse.json(successResponse(companies, '获取认证公司成功'));
    }

    if (state) {
      const companies = await companyService.getByState(state);
      return NextResponse.json(successResponse(companies, '获取公司列表成功'));
    }

    const companies = await companyService.getAll();
    return NextResponse.json(successResponse(companies, '获取公司列表成功'));
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      errorResponse('Failed to fetch companies'),
      { status: 500 }
    );
  }
}
