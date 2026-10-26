import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
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

export async function createSessionCookie(role: UserRole): Promise<string> {
  const secret = getJwtSecret();
  const token = await new SignJWT({ role, authTime: Date.now() })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d') // 집에서 매번 다시 칠 필요 없도록 30일 유지
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  return token;
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getServerSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const secret = getJwtSecret();
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}
