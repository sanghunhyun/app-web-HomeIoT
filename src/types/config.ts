import { DeviceMappingConfig } from './device';
import { Room } from './room';

export interface AppConfig {
  userPin: string; // 기본값 "1234"
  adminPin: string; // 기본값 "5678"
  jwtSecret: string;
  homeAssistant: {
    url: string; // e.g. "http://localhost:8123"
    token: string;
    useMock: boolean; // HA 연결이 없거나 데모 시 true
  };
  rooms: Room[];
  deviceMappings: Record<string, DeviceMappingConfig>;
}
