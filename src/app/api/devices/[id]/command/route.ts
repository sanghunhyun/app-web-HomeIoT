import { NextRequest, NextResponse } from 'next/server';
import { haClient } from '@/lib/homeassistant/client';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action, payload } = body;

    if (!action) {
      return NextResponse.json({ error: '수행할 action이 필요합니다.' }, { status: 400 });
    }

    const result = await haClient.callCommand(id, action, payload);
    if (!result.success) {
      return NextResponse.json(
        { error: '명령 실행에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      updated: result.updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || '기기 제어 처리 실패' },
      { status: 500 }
    );
  }
}
