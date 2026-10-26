import { Device, DeviceType, PlatformSource } from '@/types/device';

export interface HAState {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
  last_changed: string;
  last_updated: string;
}

export function detectDomainType(entityId: string): DeviceType {
  const domain = entityId.split('.')[0];
  switch (domain) {
    case 'light':
      return 'light';
    case 'climate':
      return 'air_conditioner';
    case 'switch':
      return 'smart_plug';
    case 'sensor':
      return 'sensor';
    case 'binary_sensor':
      return 'door_sensor';
    case 'camera':
      return 'camera';
    case 'media_player':
      return 'tv';
    case 'vacuum':
      return 'robot_vacuum';
    default:
      return 'sensor';
  }
}

export function detectPlatform(entity: HAState): PlatformSource {
  const id = entity.entity_id.toLowerCase();
  const name = (entity.attributes.friendly_name || '').toLowerCase();

  if (id.includes('smartthings') || name.includes('samsung') || name.includes('비스포크')) {
    return 'smartthings';
  }
  if (id.includes('tuya') || id.includes('smartlife') || name.includes('tuya')) {
    return 'tuya';
  }
  if (id.includes('sonoff') || id.includes('ewelink')) {
    return 'ewelink';
  }
  if (id.includes('xiaomi') || id.includes('aqara') || id.includes('miot')) {
    return 'xiaomi';
  }
  return 'homeassistant';
}

export function mapHAEntityToDevice(
  entity: HAState,
  mappingConfig?: {
    customName?: string;
    roomId?: string;
    overrideType?: DeviceType;
    visible?: boolean;
    order?: number;
  }
): Device {
  const defaultType = detectDomainType(entity.entity_id);
  const type = mappingConfig?.overrideType || defaultType;

  return {
    id: entity.entity_id,
    name: mappingConfig?.customName || entity.attributes.friendly_name || entity.entity_id,
    type,
    roomId: mappingConfig?.roomId || 'living_room',
    state: entity.state,
    platform: detectPlatform(entity),
    isOnline: entity.state !== 'unavailable',
    order: mappingConfig?.order ?? 99,
    visible: mappingConfig?.visible ?? true,
    attributes: {
      ...entity.attributes,
      // 규격 정규화
      current_temperature: entity.attributes.current_temperature ?? entity.attributes.temperature,
      target_temperature: entity.attributes.temperature,
      humidity: entity.attributes.humidity,
      brightness: entity.attributes.brightness
        ? Math.round((entity.attributes.brightness / 255) * 100)
        : undefined,
      current_power_w: entity.attributes.current_power_w ?? entity.attributes.power,
      contact: entity.state === 'off', // binary_sensor에서 off가 대개 닫힘
      last_changed: new Date(entity.last_changed).toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      vacuum_status:
        entity.state === 'cleaning'
          ? 'cleaning'
          : entity.state === 'docked'
          ? 'docked'
          : entity.state === 'paused'
          ? 'paused'
          : 'returning',
    },
  };
}
