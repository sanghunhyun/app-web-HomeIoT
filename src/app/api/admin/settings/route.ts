import { NextRequest, NextResponse } from 'next/server';
import { getConfig, updateConfig } from '@/lib/storage/store';
import { haClient } from '@/lib/homeassistant/client';

export async function GET() {
  const config = getConfig();
  const testRes = await haClient.testConnection();

  return NextResponse.json({
    homeAssistant: {
      url: config.homeAssistant.url,
      token: config.homeAssistant.token ? '••••••••' + config.homeAssistant.token.slice(-4) : '',
      useMock: config.homeAssistant.useMock,
    },
    connectionStatus: testRes,
    totalRooms: config.rooms.length,
    totalMappings: Object.keys(config.deviceMappings).length,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, token, useMock, testOnly } = body;

    const currentConfig = getConfig();
    const newHAConfig = {
      url: typeof url === 'string' ? url : currentConfig.homeAssistant.url,
      token: token && !token.includes('•••') ? token : currentConfig.homeAssistant.token,
      useMock: typeof useMock === 'boolean' ? useMock : currentConfig.homeAssistant.useMock,
    };

    if (testOnly) {
      // 임시 연결 테스트
      const tempUpdated = updateConfig({ homeAssistant: newHAConfig });
      const testResult = await haClient.testConnection();
      return NextResponse.json({ success: true, testResult });
    }

    const updated = updateConfig({ homeAssistant: newHAConfig });
    const testResult = await haClient.testConnection();

    return NextResponse.json({
      success: true,
      homeAssistant: {
        url: updated.homeAssistant.url,
        token: updated.homeAssistant.token ? '••••••••' + updated.homeAssistant.token.slice(-4) : '',
        useMock: updated.homeAssistant.useMock,
      },
      connectionStatus: testResult,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || '설정 저장 실패' }, { status: 500 });
  }
}
