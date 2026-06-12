
import { NextRequest, NextResponse } from 'next/server';
import { jobService } from '@/lib/services/cloudflare-db';
import { ensureDb } from '@/lib/db/ensure-db';
import { successResponse, errorResponse } from '@/lib/utils/api-response';

// GET /api/jobs/[id] - 获取单个职位详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureDb(request);

    const { id } = await params;
    const job = await jobService.getById(id);

    if (!job) {
      return NextResponse.json(
        errorResponse('Job not found'),
        { status: 404 }
      );
    }

    return NextResponse.json(successResponse(job, '获取职位详情成功'));
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json(
      errorResponse('Failed to fetch job'),
      { status: 500 }
    );
  }
}
