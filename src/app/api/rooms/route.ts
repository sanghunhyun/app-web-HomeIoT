import { NextRequest, NextResponse } from 'next/server';
import { getConfig, updateConfig } from '@/lib/storage/store';
import { getServerSession } from '@/lib/auth/pin';
import { Room } from '@/types/room';

export async function GET() {
  const config = getConfig();
  return NextResponse.json({ rooms: config.rooms });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession();
  if (session?.role !== 'admin') {
    return NextResponse.json({ error: '관리자 권한이 필요합니다.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { rooms } = body;

    if (!Array.isArray(rooms)) {
      return NextResponse.json({ error: '유효한 방 목록 배열이 필요합니다.' }, { status: 400 });
    }

    const updated = updateConfig({ rooms: rooms as Room[] });
    return NextResponse.json({ success: true, rooms: updated.rooms });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || '방 정보 저장 실패' }, { status: 500 });
  }
}
