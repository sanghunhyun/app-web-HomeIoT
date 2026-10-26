import { SignJWT, jwtVerify } from 'jose';
import { cookies, headers } from 'next/headers';
import { getConfig } from '../storage/store';
import { SessionPayload, UserRole } from '@/types/auth';

export const COOKIE_NAME = 'home_iot_session';

function getJwtSecret(): Uint8Array {
  const config = getConfig();
  return new TextEncoder().encode(config.jwtSecret || 'home-iot-secure-salt-2026-family');
}

export function checkPin(pin: string): UserRole | null {
  const config = getConfig();
  if (pin === config.adminPin) {
    return 'admin';
  }
  if (pin === config.userPin) {
    return 'user';
  }
  return null;
}

export async function createSessionToken(role: UserRole): Promise<string> {
  const secret = getJwtSecret();
  return await new SignJWT({ role, authTime: Date.now() })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(secret);
}

export async function createSessionCookie(role: UserRole): Promise<string> {
  const token = await createSessionToken(role);

  try {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: false, // 로컬 HTTP 환경 및 iframe 호환
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  } catch (e) {
    console.warn('Cookie setting skipped in this context:', e);
  }

  return token;
}

export async function clearSessionCookie(): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
  } catch (e) {
    console.warn('Cookie deletion skipped:', e);
  }
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const secret = getJwtSecret();
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function getServerSession(customToken?: string): Promise<SessionPayload | null> {
  // 1. 직접 전달된 토큰
  if (customToken) {
    const session = await verifySessionToken(customToken);
    if (session) return session;
  }

  // 2. Authorization 헤더 확인 (iframe 등 써드파티 쿠키 차단 환경 대비)
  try {
    const headerList = await headers();
    const authHeader = headerList.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const bearerToken = authHeader.substring(7);
      const session = await verifySessionToken(bearerToken);
      if (session) return session;
    }
  } catch {
    // headers() 접근 불가능 환경 대비
  }

  // 3. 쿠키 확인
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (token) {
      return await verifySessionToken(token);
    }
  } catch {
    // 쿠키 없음
  }

  return null;
}
