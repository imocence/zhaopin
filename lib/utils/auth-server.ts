import { NextRequest } from 'next/server';
import { userService } from '@/lib/services/cloudflare-db';
import { User } from '@/types';

interface TokenPayload {
  userId: string;
  exp: number;
}

const SESSION_DURATION_MS = Number(process.env.AUTH_SESSION_DURATION_MS) || 24 * 60 * 60 * 1000;

export function createAuthToken(userId: string): string {
  const payload: TokenPayload = {
    userId,
    exp: Date.now() + SESSION_DURATION_MS,
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64url');
}

export function parseAuthToken(token: string): TokenPayload | null {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64url').toString('utf-8')) as TokenPayload;
    if (!payload.userId || !payload.exp || payload.exp < Date.now()) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }
  return request.cookies.get('auth_token')?.value ?? null;
}

export async function getCurrentUser(request: NextRequest): Promise<User | null> {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  const payload = parseAuthToken(token);
  if (!payload) return null;
  const user = await userService.getById(payload.userId);
  if (!user || user.status === 'inactive') return null;
  return user;
}

export function authResponse(user: User, token: string) {
  const { passwordHash: _, ...safeUser } = user as User & { passwordHash?: string };
  const payload = parseAuthToken(token);
  return { user: safeUser, token, expiresAt: payload?.exp ?? null };
}
