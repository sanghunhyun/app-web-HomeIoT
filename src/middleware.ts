import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const COOKIE_NAME = 'home_iot_session';

// Edge 환경 호환을 위한 JWT 검증
async function verifyToken(token: string) {
  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'home-iot-secure-salt-2026-family'
    );
    const { payload } = await jwtVerify(token, secret);
    return payload as { role: 'admin' | 'user' };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 인증 제외 경로
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth/pin') ||
    pathname.startsWith('/icons') ||
    pathname === '/manifest.json' ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const session = token ? await verifyToken(token) : null;

  // 로그인 페이지 접근 시
  if (pathname === '/login') {
    if (session) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // 비인증 상태이면 로그인 페이지로 리다이렉트
  if (!session) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 관리자 전용 경로 체크 (/admin)
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    if (session.role !== 'admin') {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: '관리자 권한이 필요합니다.' },
          { status: 403 }
        );
      }
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
