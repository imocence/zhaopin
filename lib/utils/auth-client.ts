import { User } from '@/types';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

type AuthTokenPayload = {
  userId: string;
  exp: number;
};

function base64UrlDecode(input: string): string {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const padding = 4 - (base64.length % 4);
  const normalized = base64 + (padding < 4 ? '='.repeat(padding) : '');
  try {
    return decodeURIComponent(
      Array.from(atob(normalized), (c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join('')
    );
  } catch {
    return '';
  }
}

function parseAuthTokenPayload(token: string): AuthTokenPayload | null {
  try {
    // Expect a JWT like header.payload.signature - we need the payload part
    const parts = token.split('.');
    // Support either full JWT (header.payload.signature) or a payload-only token
    let decoded = '';
    if (parts.length >= 2) {
      const payloadPart = parts[1];
      decoded = base64UrlDecode(payloadPart);
    } else {
      // token may already be a base64-url encoded JSON payload
      decoded = base64UrlDecode(token);
    }
    const payload = JSON.parse(decoded) as AuthTokenPayload;
    if (!payload.userId || typeof payload.exp !== 'number') {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export function isAuthTokenValid(token: string | null): boolean {
  if (!token) return false;
  const payload = parseAuthTokenPayload(token);
  if (!payload) return false;
  // exp may be seconds or milliseconds; normalize to milliseconds
  const expMs = payload.exp < 1e12 ? payload.exp * 1000 : payload.exp;
  return expMs > Date.now();
}

function dispatchAuthChange(): void {
  window.dispatchEvent(new Event('authChange'));
}

export function saveAuth(token: string, user: User, expiresAt?: number): void {
  if (typeof window !== 'undefined') {
    try {
      // 设置 cookie，供服务端读取（名称与 auth-server.getTokenFromRequest 相对应）
      if (token) {
        const cookieOptions: string[] = ['Path=/', 'SameSite=Lax'];
        if (location.protocol === 'https:') cookieOptions.push('Secure');
        if (expiresAt) {
          const expMs = expiresAt < 1e12 ? expiresAt * 1000 : expiresAt;
          cookieOptions.push(`Expires=${new Date(expMs).toUTCString()}`);
        }
        document.cookie = `auth_token=${token}; ${cookieOptions.join('; ')}`;
      }
    } catch {}
  }

  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  dispatchAuthChange();
}

export function clearAuth(): void {
  if (typeof window !== 'undefined') {
    try {
      document.cookie = 'auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;';
    } catch {}
  }
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  dispatchAuthChange();
}

// 静默清除，不触发 `authChange` 事件（用于内部检测避免循环触发）
function clearAuthSilent(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem(TOKEN_KEY);
  if (!isAuthTokenValid(token)) {
    // 使用静默清除以避免触发事件监听器中的循环调用
    clearAuthSilent();
    return null;
  }
  return token;
}

export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  if (!getAuthToken()) return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    // 解析异常时静默清除，避免导致事件循环
    clearAuthSilent();
    return null;
  }
}

export function authHeaders(): HeadersInit {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
