import { NextRequest, NextResponse } from 'next/server';
import { haClient } from '@/lib/homeassistant/client';
import { getConfig } from '@/lib/storage/store';
import { getServerSession } from '@/lib/auth/pin';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    const config = getConfig();
    const { searchParams } = new URL(request.url);
    const includeHidden = searchParams.get('all') === 'true' && session?.role === 'admin';

    const allDevices = await haClient.getDevices();

    // 일반 사용자에게는 visible !== false 인 기기만 표시
    const filteredDevices = includeHidden
      ? allDevices
      : allDevices.filter((d) => d.visible !== false);

    // 정렬 (order 오름차순)
    filteredDevices.sort((a, b) => a.order - b.order);

    return NextResponse.json({
      devices: filteredDevices,
      rooms: config.rooms.sort((a, b) => a.order - b.order),
      isMock: config.homeAssistant.useMock,
      role: session?.role || 'user',
      theme: config.theme || 'familywiki',
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || '기기 목록을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
