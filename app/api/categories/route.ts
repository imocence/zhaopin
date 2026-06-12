
import { NextRequest, NextResponse } from 'next/server';
import { categoryService } from '@/lib/services/cloudflare-db';
import { ensureDb } from '@/lib/db/ensure-db';
import { successResponse, errorResponse } from '@/lib/utils/api-response';

// GET /api/categories - 获取分类列表
export async function GET(request: NextRequest) {
  try {
    await ensureDb(request);

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'all'; // all, subcategories
    const slug = searchParams.get('slug') || undefined;

    if (type === 'subcategories') {
      const subcategories = await categoryService.getAllSubcategories();
      return NextResponse.json(successResponse(subcategories, '获取子分类成功'));
    }

    if (slug) {
      const category = await categoryService.getBySlug(slug);
      return NextResponse.json(successResponse(category, '获取分类成功'));
    }

    const categories = await categoryService.getAll();
    return NextResponse.json(successResponse(categories, '获取分类列表成功'));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      errorResponse('Failed to fetch categories'),
      { status: 500 }
    );
  }
}
