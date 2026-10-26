'use client';

import React from 'react';
import { Lightbulb, Wind, ShieldCheck, AlertCircle, Thermometer, Droplets, Power } from 'lucide-react';
import { Device } from '@/types/device';

interface Props {
  devices: Device[];
  onCommand: (id: string, action: string, payload?: any) => Promise<void>;
}

export const QuickStatusBanner: React.FC<Props> = ({ devices, onCommand }) => {
  // 조명 카운트
  const lights = devices.filter((d) => d.type === 'light');
  const activeLights = lights.filter((d) => d.state === 'on');

  // 에어컨 카운트
  const acs = devices.filter((d) => d.type === 'air_conditioner');
  const activeAcs = acs.filter((d) => d.state === 'on');

  // 도어/창문 센서
  const doorSensors = devices.filter((d) => d.type === 'door_sensor');
  const openDoors = doorSensors.filter((d) => d.state === 'open' || d.attributes.contact === false);

  // 센서 온습도 평균
  const sensors = devices.filter((d) => d.type === 'sensor' && d.attributes.temperature !== undefined);
  const avgTemp =
    sensors.length > 0
      ? (
          sensors.reduce((acc, curr) => acc + (curr.attributes.temperature || 0), 0) /
          sensors.length
        ).toFixed(1)
      : '25.0';

  const avgHumidity =
    sensors.length > 0
      ? Math.round(
          sensors.reduce((acc, curr) => acc + (curr.attributes.humidity || 0), 0) / sensors.length
        )
      : 53;

  // 모든 조명 끄기 액션
  const handleTurnOffAllLights = async () => {
    if (activeLights.length === 0) return;
    for (const light of activeLights) {
      await onCommand(light.id, 'turn_off');
    }
  };

  return (
    <div className="bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-purple-500/10 border border-sky-500/20 rounded-3xl p-4 sm:p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* 날씨 & 온습도 요약 */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center text-sky-600">
            <Thermometer className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                실내 평균 {avgTemp}°C
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 flex items-center gap-1">
                <Droplets className="w-3 h-3" /> {avgHumidity}%
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">우리집 기기 상태가 모두 정상 작동 중입니다.</p>
          </div>
        </div>

        {/* 기기 상태 칩들 */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 조명 상태 */}
          <div className="flex items-center space-x-2 bg-white/80 dark:bg-zinc-800/80 px-3 py-1.5 rounded-2xl border border-zinc-200/60 dark:border-zinc-700 text-xs">
            <Lightbulb
              className={`w-4 h-4 ${
                activeLights.length > 0 ? 'text-amber-500 fill-amber-500' : 'text-zinc-400'
              }`}
            />
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              조명 켜짐 <strong className="text-amber-600">{activeLights.length}</strong>/{lights.length}
            </span>
            {activeLights.length > 0 && (
              <button
                onClick={handleTurnOffAllLights}
                className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 underline pl-1"
              >
                전체 소등
              </button>
            )}
          </div>

          {/* 에어컨 상태 */}
          <div className="flex items-center space-x-2 bg-white/80 dark:bg-zinc-800/80 px-3 py-1.5 rounded-2xl border border-zinc-200/60 dark:border-zinc-700 text-xs">
            <Wind
              className={`w-4 h-4 ${activeAcs.length > 0 ? 'text-sky-500' : 'text-zinc-400'}`}
            />
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              에어컨 {activeAcs.length > 0 ? `${activeAcs.length}대 가동` : '꺼짐'}
            </span>
          </div>

          {/* 도어/창문 보안 상태 */}
          <div
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-2xl border text-xs font-medium ${
              openDoors.length === 0
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300'
            }`}
          >
            {openDoors.length === 0 ? (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>문/창문 모두 닫힘</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>{openDoors.length}개 창문/문 열림!</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
