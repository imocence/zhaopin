
import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/services/cloudflare-db';
import { ensureDb } from '@/lib/db/ensure-db';

// GET /api/users - 获取用户列表
export async function GET(request: NextRequest) {
  try {
    await ensureDb(request);

    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email') || undefined;

    if (email) {
      const user = await userService.getByEmail(email);
      return NextResponse.json({ data: user });
    }

    const users = await userService.getAll();
    return NextResponse.json({ data: users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDb(request);
    const body = await request.json();
    const { username, email, password, name, userType } = body as {
      username?: string;
      email?: string;
      password?: string;
      name?: string;
      userType?: 'jobseeker' | 'employer';
    };

    if (!username || !email || !password || !name || !userType) {
      return NextResponse.json(
        { error: '缺少必要注册字段' },
        { status: 400 }
      );
    }

    const user = await userService.create({
      username: username.trim(),
      email: email.trim(),
      name: name.trim(),
      password,
      role: userType,
      companyId: userType === 'employer' ? 'company1' : undefined,
    });

    return NextResponse.json({ data: user });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: '注册失败，请稍后重试' },
      { status: 500 }
    );
  }
}
