import { getConfig, getMockDevices, updateMockDevice } from '../storage/store';
import { Device } from '@/types/device';
import { HAState, mapHAEntityToDevice } from './mapper';

export class HomeAssistantClient {
  private get baseUrl() {
    return getConfig().homeAssistant.url.replace(/\/$/, '');
  }

  private get token() {
    return getConfig().homeAssistant.token;
  }

  private get useMock() {
    return getConfig().homeAssistant.useMock;
  }

  // HA 연결 상태 테스트
  async testConnection(): Promise<{ ok: boolean; message: string }> {
    if (this.useMock) {
      return { ok: true, message: '모의(Mock) 모드로 활성화되어 있습니다.' };
    }

    if (!this.baseUrl || !this.token) {
      return { ok: false, message: 'HA URL 또는 접근 토큰이 설정되지 않았습니다.' };
    }

    try {
      const res = await fetch(`${this.baseUrl}/api/`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000),
      });

      if (!res.ok) {
        return { ok: false, message: `HA 응답 실패: HTTP ${res.status}` };
      }

      const data = await res.json();
      return { ok: true, message: `연결 성공 (${data.message || 'API Running'})` };
    } catch (err: any) {
      return { ok: false, message: `HA 연결 오류: ${err.message || '호스트에 연결할 수 없음'}` };
    }
  }

  // 전체 기기 목록 조회
  async getDevices(): Promise<Device[]> {
    const config = getConfig();

    // Mock 모드이거나 토큰이 없으면 Mock 기기 반환
    if (this.useMock || !this.token) {
      const mockDevices = getMockDevices();
      // 저장된 매핑 적용
      return mockDevices.map((d) => {
        const mapping = config.deviceMappings[d.id];
        return {
          ...d,
          name: mapping?.customName || d.name,
          roomId: mapping?.roomId || d.roomId,
          type: mapping?.overrideType || d.type,
          visible: mapping?.visible ?? d.visible,
          order: mapping?.order ?? d.order,
        };
      });
    }

    try {
      const res = await fetch(`${this.baseUrl}/api/states`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        next: { revalidate: 0 },
      });

      if (!res.ok) {
        console.warn(`HA API error: ${res.status}. Falling back to mock devices.`);
        return getMockDevices();
      }

      const states: HAState[] = await res.json();
      const relevantDomains = [
        'light',
        'climate',
        'switch',
        'sensor',
        'binary_sensor',
        'camera',
        'media_player',
        'vacuum',
      ];

      return states
        .filter((entity) => {
          const domain = entity.entity_id.split('.')[0];
          return relevantDomains.includes(domain);
        })
        .map((entity) => {
          const mapping = config.deviceMappings[entity.entity_id];
          return mapHAEntityToDevice(entity, mapping);
        });
    } catch (err) {
      console.error('Failed to fetch from HA API, using mock fallback:', err);
      return getMockDevices();
    }
  }

  // 기기 제어 명령 수행
  async callCommand(
    deviceId: string,
    action: string,
    payload: Record<string, any> = {}
  ): Promise<{ success: boolean; updated?: Device }> {
    const config = getConfig();

    if (this.useMock || !this.token) {
      return this.handleMockCommand(deviceId, action, payload);
    }

    try {
      let domain = deviceId.split('.')[0];
      let service = action;

      // 표준 변환
      if (action === 'turn_on' || action === 'turn_off' || action === 'toggle') {
        service = action;
      } else if (action === 'set_temperature') {
        domain = 'climate';
        service = 'set_temperature';
      } else if (action === 'set_brightness') {
        domain = 'light';
        service = 'turn_on';
        payload = { brightness: Math.round((payload.brightness / 100) * 255) };
      }

      const res = await fetch(`${this.baseUrl}/api/services/${domain}/${service}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entity_id: deviceId,
          ...payload,
        }),
      });

      if (!res.ok) {
        throw new Error(`HA service call failed: ${res.status}`);
      }

      // 갱신된 상태 다시 조회
      const stateRes = await fetch(`${this.baseUrl}/api/states/${deviceId}`, {
        headers: { Authorization: `Bearer ${this.token}` },
      });
      const newState: HAState = await stateRes.json();
      const mapping = config.deviceMappings[deviceId];
      return { success: true, updated: mapHAEntityToDevice(newState, mapping) };
    } catch (err) {
      console.warn('Real HA call failed, attempting Mock update for simulation:', err);
      return this.handleMockCommand(deviceId, action, payload);
    }
  }

  private handleMockCommand(
    deviceId: string,
    action: string,
    payload: Record<string, any>
  ): { success: boolean; updated?: Device } {
    const devices = getMockDevices();
    const target = devices.find((d) => d.id === deviceId);
    if (!target) return { success: false };

    let newState = target.state;
    const newAttrs = { ...target.attributes };

    switch (action) {
      case 'turn_on':
        newState = 'on';
        break;
      case 'turn_off':
        newState = 'off';
        break;
      case 'toggle':
        newState = target.state === 'on' ? 'off' : 'on';
        break;
      case 'set_temperature':
        if (typeof payload.target_temperature === 'number') {
          newAttrs.target_temperature = payload.target_temperature;
          newState = 'on';
        }
        break;
      case 'set_hvac_mode':
        if (payload.hvac_mode) {
          newAttrs.hvac_mode = payload.hvac_mode;
          newState = payload.hvac_mode === 'off' ? 'off' : 'on';
        }
        break;
      case 'set_brightness':
        if (typeof payload.brightness === 'number') {
          newAttrs.brightness = payload.brightness;
          newState = payload.brightness > 0 ? 'on' : 'off';
        }
        break;
      case 'vacuum_clean':
        newState = 'cleaning';
        newAttrs.vacuum_status = 'cleaning';
        break;
      case 'vacuum_pause':
        newState = 'paused';
        newAttrs.vacuum_status = 'paused';
        break;
      case 'vacuum_dock':
        newState = 'docked';
        newAttrs.vacuum_status = 'docked';
        break;
      case 'set_volume':
        if (typeof payload.volume_level === 'number') {
          newAttrs.volume_level = payload.volume_level;
        }
        break;
      case 'toggle_mute':
        newAttrs.is_volume_muted = !newAttrs.is_volume_muted;
        break;
      case 'set_source':
        if (payload.source) {
          newAttrs.source = payload.source;
        }
        break;
    }

    const updated = updateMockDevice(deviceId, {
      state: newState,
      attributes: newAttrs,
    });

    return { success: true, updated: updated || undefined };
  }
}

export const haClient = new HomeAssistantClient();
