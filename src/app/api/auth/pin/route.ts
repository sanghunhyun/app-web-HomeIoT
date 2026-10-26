import { NextRequest, NextResponse } from 'next/server';
import { checkPin, createSessionCookie } from '@/lib/auth/pin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pin } = body;

    if (!pin || typeof pin !== 'string') {
      return NextResponse.json({ error: 'PIN 번호를 입력해주세요.' }, { status: 400 });
    }

    const role = checkPin(pin);
    if (!role) {
      return NextResponse.json(
        { error: '잘못된 PIN 번호입니다. 다시 확인해주세요.' },
        { status: 401 }
      );
    }

    const token = await createSessionCookie(role);

    return NextResponse.json({
      success: true,
      role,
      token,
      message: role === 'admin' ? '관리자로 로그인되었습니다.' : '로그인되었습니다.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || '인증 처리 실패' }, { status: 500 });
  }
}
