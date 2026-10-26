import fs from 'fs';
import path from 'path';
import { AppConfig } from '@/types/config';
import { Device, DeviceMappingConfig } from '@/types/device';
import { Room } from '@/types/room';

const DATA_DIR = path.join(process.cwd(), 'data');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');
const MOCK_STATE_FILE = path.join(DATA_DIR, 'mock-devices.json');

const DEFAULT_ROOMS: Room[] = [
  { id: 'living_room', name: '거실', icon: 'Sofa', order: 1 },
  { id: 'master_bedroom', name: '안방', icon: 'Bed', order: 2 },
  { id: 'kitchen', name: '주방', icon: 'Utensils', order: 3 },
  { id: 'balcony', name: '베란다', icon: 'Flower2', order: 4 },
  { id: 'study', name: '서재', icon: 'Briefcase', order: 5 },
];

const DEFAULT_CONFIG: AppConfig = {
  userPin: process.env.USER_PIN || '1234',
  adminPin: process.env.ADMIN_PIN || '5678',
  jwtSecret: process.env.JWT_SECRET || 'home-iot-secure-salt-2026-family',
  theme: 'familywiki', // 기본 테마: familywiki (화이트, 다크로 변경 가능)
  homeAssistant: {
    url: process.env.HA_URL || 'http://localhost:8123',
    token: process.env.HA_TOKEN || '',
    useMock: true, // 초기에는 Mock 모드로 바로 동작하도록 안전 세팅
  },
  rooms: DEFAULT_ROOMS,
  deviceMappings: {},
};

export const INITIAL_MOCK_DEVICES: Device[] = [
  // 1. 거실
  {
    id: 'st_living_ac',
    name: '거실 비스포크 갤러리 에어컨',
    type: 'air_conditioner',
    roomId: 'living_room',
    state: 'on',
    platform: 'smartthings',
    isOnline: true,
    order: 1,
    visible: true,
    attributes: {
      current_temperature: 25.5,
      target_temperature: 24.0,
      hvac_mode: 'cool',
      fan_mode: 'auto',
    },
  },
  {
    id: 'st_living_tv',
    name: '거실 네오 QLED TV',
    type: 'tv',
    roomId: 'living_room',
    state: 'off',
    platform: 'smartthings',
    isOnline: true,
    order: 2,
    visible: true,
    attributes: {
      volume_level: 22,
      is_volume_muted: false,
      source: 'Netflix',
      source_list: ['TV', 'Netflix', 'YouTube', 'PlayStation', 'Apple TV'],
    },
  },
  {
    id: 'tuya_living_light',
    name: '거실 메인 실링라이트',
    type: 'light',
    roomId: 'living_room',
    state: 'on',
    platform: 'tuya',
    isOnline: true,
    order: 3,
    visible: true,
    attributes: {
      brightness: 80,
      color_temp: 4000,
    },
  },
  {
    id: 'tuya_living_sensor',
    name: '거실 온습도/공기질 센서',
    type: 'sensor',
    roomId: 'living_room',
    state: 'normal',
    platform: 'tuya',
    isOnline: true,
    order: 4,
    visible: true,
    attributes: {
      temperature: 25.2,
      humidity: 52,
      air_quality_index: 35, // 미세먼지 수치(좋음)
      battery: 92,
    },
  },
  {
    id: 'st_robot_vacuum',
    name: '비스포크 AI 스팀 로봇청소기',
    type: 'robot_vacuum',
    roomId: 'living_room',
    state: 'docked',
    platform: 'smartthings',
    isOnline: true,
    order: 5,
    visible: true,
    attributes: {
      vacuum_status: 'docked',
      battery_level: 98,
    },
  },

  // 2. 안방
  {
    id: 'st_bedroom_ac',
    name: '안방 벽걸이 에어컨',
    type: 'air_conditioner',
    roomId: 'master_bedroom',
    state: 'off',
    platform: 'smartthings',
    isOnline: true,
    order: 1,
    visible: true,
    attributes: {
      current_temperature: 24.8,
      target_temperature: 25.0,
      hvac_mode: 'cool',
      fan_mode: 'low',
    },
  },
  {
    id: 'tuya_bedroom_light',
    name: '안방 무드등',
    type: 'light',
    roomId: 'master_bedroom',
    state: 'on',
    platform: 'tuya',
    isOnline: true,
    order: 2,
    visible: true,
    attributes: {
      brightness: 45,
      color_temp: 2700,
    },
  },
  {
    id: 'tuya_bedroom_sensor',
    name: '안방 온습도 센서',
    type: 'sensor',
    roomId: 'master_bedroom',
    state: 'normal',
    platform: 'tuya',
    isOnline: true,
    order: 3,
    visible: true,
    attributes: {
      temperature: 24.6,
      humidity: 55,
      battery: 88,
    },
  },
  {
    id: 'xiaomi_bedroom_window',
    name: '안방 창문 개폐 센서',
    type: 'door_sensor',
    roomId: 'master_bedroom',
    state: 'closed',
    platform: 'xiaomi',
    isOnline: true,
    order: 4,
    visible: true,
    attributes: {
      contact: true, // 닫힘
      last_changed: '오후 6:30',
      battery: 95,
    },
  },

  // 3. 주방
  {
    id: 'ewelink_kitchen_switch',
    name: '주방 아일랜드 조명 스위치',
    type: 'light',
    roomId: 'kitchen',
    state: 'off',
    platform: 'ewelink',
    isOnline: true,
    order: 1,
    visible: true,
    attributes: {
      brightness: 100,
    },
  },
  {
    id: 'tuya_kitchen_plug',
    name: '주방 정수기 스마트 플러그',
    type: 'smart_plug',
    roomId: 'kitchen',
    state: 'on',
    platform: 'tuya',
    isOnline: true,
    order: 2,
    visible: true,
    attributes: {
      current_power_w: 45.2,
      today_energy_kwh: 0.85,
    },
  },

  // 4. 베란다
  {
    id: 'tuya_balcony_plug',
    name: '베란다 세탁기 플러그',
    type: 'smart_plug',
    roomId: 'balcony',
    state: 'on',
    platform: 'tuya',
    isOnline: true,
    order: 1,
    visible: true,
    attributes: {
      current_power_w: 12.8,
      today_energy_kwh: 1.42,
    },
  },
  {
    id: 'xiaomi_balcony_window',
    name: '베란다 외창 센서',
    type: 'door_sensor',
    roomId: 'balcony',
    state: 'closed',
    platform: 'xiaomi',
    isOnline: true,
    order: 2,
    visible: true,
    attributes: {
      contact: true,
      last_changed: '오전 8:10',
      battery: 84,
    },
  },

  // 5. 현관 / CCTV
  {
    id: 'xiaomi_front_door',
    name: '현관문 도어 센서',
    type: 'door_sensor',
    roomId: 'living_room',
    state: 'closed',
    platform: 'xiaomi',
    isOnline: true,
    order: 6,
    visible: true,
    attributes: {
      contact: true,
      last_changed: '오후 7:15',
      battery: 91,
    },
  },
  {
    id: 'tuya_cctv_entrance',
    name: '현관 홈캠 (CCTV)',
    type: 'camera',
    roomId: 'living_room',
    state: 'idle',
    platform: 'tuya',
    isOnline: true,
    order: 7,
    visible: true,
    attributes: {
      is_recording: true,
      snapshot_url: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80',
    },
  },
];

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function getConfig(): AppConfig {
  ensureDataDir();
  if (!fs.existsSync(CONFIG_FILE)) {
    saveConfig(DEFAULT_CONFIG);
    return DEFAULT_CONFIG;
  }
  try {
    const raw = fs.readFileSync(CONFIG_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_CONFIG, ...parsed };
  } catch (err) {
    console.error('Failed to read config file, returning default:', err);
    return DEFAULT_CONFIG;
  }
}

export function saveConfig(config: AppConfig): void {
  ensureDataDir();
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
}

export function updateConfig(partial: Partial<AppConfig>): AppConfig {
  const current = getConfig();
  const updated = {
    ...current,
    ...partial,
    homeAssistant: {
      ...current.homeAssistant,
      ...(partial.homeAssistant || {}),
    },
  };
  saveConfig(updated);
  return updated;
}

export function getMockDevices(): Device[] {
  ensureDataDir();
  if (!fs.existsSync(MOCK_STATE_FILE)) {
    saveMockDevices(INITIAL_MOCK_DEVICES);
    return INITIAL_MOCK_DEVICES;
  }
  try {
    const raw = fs.readFileSync(MOCK_STATE_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read mock devices file, returning default:', err);
    return INITIAL_MOCK_DEVICES;
  }
}

export function saveMockDevices(devices: Device[]): void {
  ensureDataDir();
  fs.writeFileSync(MOCK_STATE_FILE, JSON.stringify(devices, null, 2), 'utf-8');
}

export function updateMockDevice(id: string, updates: Partial<Device>): Device | null {
  const devices = getMockDevices();
  const index = devices.findIndex((d) => d.id === id);
  if (index === -1) return null;

  const current = devices[index];
  const updated: Device = {
    ...current,
    ...updates,
    attributes: {
      ...current.attributes,
      ...(updates.attributes || {}),
    },
  };
  devices[index] = updated;
  saveMockDevices(devices);
  return updated;
}
