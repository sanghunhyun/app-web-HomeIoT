import { NextRequest, NextResponse } from 'next/server';
import { getConfig, updateConfig } from '@/lib/storage/store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userPin, adminPin } = body;

    const updates: Record<string, string> = {};

    if (userPin && typeof userPin === 'string') {
      if (userPin.length < 4) {
        return NextResponse.json({ error: '사용자 PIN은 최소 4자리여야 합니다.' }, { status: 400 });
      }
      updates.userPin = userPin;
    }

    if (adminPin && typeof adminPin === 'string') {
      if (adminPin.length < 4) {
        return NextResponse.json({ error: '관리자 PIN은 최소 4자리여야 합니다.' }, { status: 400 });
      }
      updates.adminPin = adminPin;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: '변경할 PIN이 없습니다.' }, { status: 400 });
    }

    updateConfig(updates);

    return NextResponse.json({
      success: true,
      message: 'PIN 번호가 성공적으로 변경되었습니다.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'PIN 변경 실패' }, { status: 500 });
  }
}
