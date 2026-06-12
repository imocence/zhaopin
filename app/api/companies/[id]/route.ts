
import { NextRequest, NextResponse } from 'next/server';
import { companyService } from '@/lib/services/cloudflare-db';
import { ensureDb } from '@/lib/db/ensure-db';
import { successResponse, errorResponse } from '@/lib/utils/api-response';

// GET /api/companies/[id] - 获取单个公司详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureDb(request);

    const { id } = await params;
    const company = await companyService.getById(id);

    if (!company) {
      return NextResponse.json(
        errorResponse('Company not found'),
        { status: 404 }
      );
    }

    return NextResponse.json(successResponse(company, '获取公司详情成功'));
  } catch (error) {
    console.error('Error fetching company:', error);
    return NextResponse.json(
      errorResponse('Failed to fetch company'),
      { status: 500 }
    );
  }
}
