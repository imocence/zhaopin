
import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/services/cloudflare-db';
import { ensureDb } from '@/lib/db/ensure-db';

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
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
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
        { error: 'User not found or update failed' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}
