'use client';

import React from 'react';
import { Device } from '@/types/device';
import { LightCard } from '../devices/LightCard';
import { AirConditionerCard } from '../devices/AirConditionerCard';
import { SmartPlugCard } from '../devices/SmartPlugCard';
import { SensorCard } from '../devices/SensorCard';
import { DoorSensorCard } from '../devices/DoorSensorCard';
import { CameraCard } from '../devices/CameraCard';
import { SmartTVCard } from '../devices/SmartTVCard';
import { RobotVacuumCard } from '../devices/RobotVacuumCard';

interface Props {
  device: Device;
  onCommand: (id: string, action: string, payload?: any) => Promise<void>;
}

export const DeviceCardRenderer: React.FC<Props> = ({ device, onCommand }) => {
  switch (device.type) {
    case 'light':
      return <LightCard device={device} onCommand={onCommand} />;
    case 'air_conditioner':
      return <AirConditionerCard device={device} onCommand={onCommand} />;
    case 'smart_plug':
      return <SmartPlugCard device={device} onCommand={onCommand} />;
    case 'sensor':
      return <SensorCard device={device} />;
    case 'door_sensor':
      return <DoorSensorCard device={device} />;
    case 'camera':
      return <CameraCard device={device} />;
    case 'tv':
      return <SmartTVCard device={device} onCommand={onCommand} />;
    case 'robot_vacuum':
      return <RobotVacuumCard device={device} onCommand={onCommand} />;
    default:
      return <SensorCard device={device} />;
  }
};
