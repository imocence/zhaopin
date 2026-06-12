
import { NextRequest, NextResponse } from 'next/server';
import { jobService } from '@/lib/services/cloudflare-db';
import { ensureDb } from '@/lib/db/ensure-db';
import { getCurrentUser } from '@/lib/utils/auth-server';

// GET /api/jobs - 获取职位列表
export async function GET(request: NextRequest) {
  try {
    await ensureDb(request);

    const searchParams = request.nextUrl.searchParams;

    const filters = {
      keyword: searchParams.get('keyword') || undefined,
      category: searchParams.get('category') || undefined,
      state: searchParams.get('state') || undefined,
      city: searchParams.get('city') || undefined,
      salaryMin: searchParams.get('salaryMin') ? Number(searchParams.get('salaryMin')) : undefined,
      salaryMax: searchParams.get('salaryMax') ? Number(searchParams.get('salaryMax')) : undefined,
      experience: searchParams.get('experience') || undefined,
      education: searchParams.get('education') || undefined,
    };

    const page = Number(searchParams.get('page')) || 1;
    const pageSize = Number(searchParams.get('pageSize')) || 20;
    const type = searchParams.get('type') || 'all'; // all, hot, latest
    const companyId = searchParams.get('companyId') || undefined;

    if (type === 'hot') {
      const limit = Number(searchParams.get('limit')) || 10;
      const jobs = await jobService.getHotJobs(limit);
      return NextResponse.json({ data: jobs });
    }

    if (type === 'latest') {
      const limit = Number(searchParams.get('limit')) || 10;
      const jobs = await jobService.getLatestJobs(limit);
      return NextResponse.json({ data: jobs });
    }

    if (companyId) {
      const jobs = await jobService.getByCompanyId(companyId);
      return NextResponse.json({ data: jobs });
    }

    if (Object.values(filters).some(v => v !== undefined)) {
      const result = await jobService.search(filters, page, pageSize);
      return NextResponse.json(result);
    }

    const result = await jobService.search(filters, page, pageSize);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDb(request);
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json({ error: '需要登录后才能发布职位' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      category,
      state,
      city,
      description,
      salaryType,
      salaryMin,
      salaryMax,
      experience,
      education,
      requirements,
      benefits,
    } = body as {
      title?: string;
      category?: string;
      state?: string;
      city?: string;
      description?: string;
      salaryType?: 'hourly' | 'monthly' | 'yearly';
      salaryMin?: number;
      salaryMax?: number;
      experience?: string;
      education?: string;
      requirements?: string[];
      benefits?: string[];
    };

    if (!title || !category || !state || !description || salaryMin === undefined || salaryMax === undefined) {
      return NextResponse.json({ error: '缺少职位发布必填字段' }, { status: 400 });
    }

    const companyId = currentUser.companyId || 'company1';
    const job = await jobService.create({
      title: title.trim(),
      companyId,
      category: category.trim(),
      location: city ? city.trim() : state.trim(),
      state: state.trim(),
      salaryMin: Number(salaryMin),
      salaryMax: Number(salaryMax),
      salaryType: salaryType ?? 'yearly',
      experience: experience ?? '不限',
      education: education ?? '不限',
      description: description.trim(),
      requirements: requirements || [],
      benefits: benefits || [],
      status: 'active',
    });

    return NextResponse.json({ data: job });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { error: '职位发布失败，请稍后重试' },
      { status: 500 }
    );
  }
}
