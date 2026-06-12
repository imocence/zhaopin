
import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/services/cloudflare-db';
import { ensureDb } from '@/lib/db/ensure-db';
import { successResponse, errorResponse } from '@/lib/utils/api-response';

// GET /api/users/[id] - 获取单个用户详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureDb(request);

    const { id } = await params;
    const user = await userService.getById(id);

    if (!user) {
      return NextResponse.json(
        errorResponse('User not found'),
        { status: 404 }
      );
    }

    return NextResponse.json(successResponse(user, '获取用户成功'));
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      errorResponse('Failed to fetch user'),
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureDb(request);
    const { id } = await params;
    const body = await request.json();
    const updated = await userService.update(id, body as any);

    if (!updated) {
      return NextResponse.json(
        errorResponse('User not found or update failed'),
        { status: 404 }
      );
    }

    return NextResponse.json(successResponse(updated, '更新用户成功'));
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      errorResponse('Failed to update user'),
      { status: 500 }
    );
  }
}
