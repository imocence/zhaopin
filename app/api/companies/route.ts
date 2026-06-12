
import { NextRequest, NextResponse } from 'next/server';
import { companyService } from '@/lib/services/cloudflare-db';
import { ensureDb } from '@/lib/db/ensure-db';

// GET /api/companies - 获取公司列表
export async function GET(request: NextRequest) {
  try {
    await ensureDb(request);

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'all'; // all, verified
    const state = searchParams.get('state') || undefined;

    if (type === 'verified') {
      const companies = await companyService.getVerified();
      return NextResponse.json({ data: companies });
    }

    if (state) {
      const companies = await companyService.getByState(state);
      return NextResponse.json({ data: companies });
    }

    const companies = await companyService.getAll();
    return NextResponse.json({ data: companies });
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    );
  }
}
