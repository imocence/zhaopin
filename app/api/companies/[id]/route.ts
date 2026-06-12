
import { NextRequest, NextResponse } from 'next/server';
import { companyService } from '@/lib/services/cloudflare-db';
import { ensureDb } from '@/lib/db/ensure-db';

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
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: company });
  } catch (error) {
    console.error('Error fetching company:', error);
    return NextResponse.json(
      { error: 'Failed to fetch company' },
      { status: 500 }
    );
  }
}
