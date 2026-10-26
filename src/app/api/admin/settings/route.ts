import { NextRequest, NextResponse } from 'next/server';
import { getConfig, updateConfig } from '@/lib/storage/store';
import { haClient } from '@/lib/homeassistant/client';
import { AppTheme } from '@/types/config';

export async function GET() {
  const config = getConfig();
  const testRes = await haClient.testConnection();

  return NextResponse.json({
    theme: config.theme || 'familywiki',
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
    const { url, token, useMock, testOnly, theme } = body;

    const currentConfig = getConfig();
    const newHAConfig = {
      url: typeof url === 'string' ? url : currentConfig.homeAssistant.url,
      token: token && !token.includes('•••') ? token : currentConfig.homeAssistant.token,
      useMock: typeof useMock === 'boolean' ? useMock : currentConfig.homeAssistant.useMock,
    };

    if (testOnly) {
      const testResult = await haClient.testConnection();
      return NextResponse.json({ success: true, testResult });
    }

    const updates: any = { homeAssistant: newHAConfig };
    if (theme && ['light', 'dark', 'familywiki'].includes(theme)) {
      updates.theme = theme as AppTheme;
    }

    const updated = updateConfig(updates);
    const testResult = await haClient.testConnection();

    return NextResponse.json({
      success: true,
      theme: updated.theme || 'familywiki',
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
