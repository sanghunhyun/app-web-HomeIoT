export type DeviceType =
  | 'light'
  | 'air_conditioner'
  | 'smart_plug'
  | 'sensor'
  | 'door_sensor'
  | 'camera'
  | 'tv'
  | 'robot_vacuum';

export type PlatformSource =
  | 'smartthings'
  | 'tuya'
  | 'ewelink'
  | 'xiaomi'
  | 'homeassistant'
  | 'custom';

export interface DeviceAttributes {
  // 조명
  brightness?: number; // 0-100 or 0-255
  color_temp?: number;
  rgb_color?: [number, number, number];

  // 에어컨 / 난방
  current_temperature?: number;
  target_temperature?: number;
  hvac_mode?: 'cool' | 'heat' | 'fan_only' | 'dry' | 'off';
  fan_mode?: 'auto' | 'low' | 'medium' | 'high';

  // 스마트 플러그
  current_power_w?: number;
  today_energy_kwh?: number;

  // 센서 (온습도, 공기질)
  temperature?: number;
  humidity?: number;
  air_quality_index?: number;
  battery?: number;

  // 도어/창문 센서
  contact?: boolean; // true = 닫힘, false = 열림
  last_changed?: string;

  // 카메라
  stream_url?: string;
  snapshot_url?: string;
  is_recording?: boolean;

  // TV
  volume_level?: number; // 0-100
  is_volume_muted?: boolean;
  source?: string;
  source_list?: string[];

  // 로봇청소기
  vacuum_status?: 'cleaning' | 'docked' | 'paused' | 'returning' | 'error';
  battery_level?: number;

  friendly_name?: string;
  [key: string]: unknown;
}

export interface Device {
  id: string; // e.g. "light.living_room_ceiling" or "smartthings_ac_01"
  name: string; // 표시 이름: "거실 메인 조명"
  type: DeviceType;
  roomId: string; // "living_room", "master_bedroom", etc.
  state: 'on' | 'off' | 'open' | 'closed' | 'unavailable' | string;
  platform: PlatformSource;
  isOnline: boolean;
  order: number;
  visible: boolean; // 일반 사용자 화면에 표시할지 여부
  attributes: DeviceAttributes;
}

export interface DeviceMappingConfig {
  id: string;
  customName?: string;
  roomId: string;
  overrideType?: DeviceType;
  visible: boolean;
  order: number;
}
