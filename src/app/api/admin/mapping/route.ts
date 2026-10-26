import { NextRequest, NextResponse } from 'next/server';
import { getConfig, updateConfig } from '@/lib/storage/store';
import { DeviceMappingConfig } from '@/types/device';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { deviceId, mapping }: { deviceId: string; mapping: Partial<DeviceMappingConfig> } = body;

    if (!deviceId) {
      return NextResponse.json({ error: 'deviceId가 필요합니다.' }, { status: 400 });
    }

    const config = getConfig();
    const currentMappings = { ...config.deviceMappings };
    const existing = currentMappings[deviceId] || {
      id: deviceId,
      roomId: 'living_room',
      visible: true,
      order: 99,
    };

    currentMappings[deviceId] = {
      ...existing,
      ...mapping,
    };

    const updated = updateConfig({ deviceMappings: currentMappings });

    return NextResponse.json({
      success: true,
      mapping: updated.deviceMappings[deviceId],
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || '매핑 저장 실패' }, { status: 500 });
  }
}
