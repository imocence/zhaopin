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
    if (parts.length < 2) return null;
    const payloadPart = parts[1];
    const decoded = base64UrlDecode(payloadPart);
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

export function saveAuth(token: string, user: User): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  dispatchAuthChange();
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  dispatchAuthChange();
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem(TOKEN_KEY);
  if (!isAuthTokenValid(token)) {
    clearAuth();
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
    clearAuth();
    return null;
  }
}

export function authHeaders(): HeadersInit {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
