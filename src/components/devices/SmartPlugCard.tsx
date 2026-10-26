'use client';

import React, { useState } from 'react';
import { Zap, Power } from 'lucide-react';
import { Device } from '@/types/device';

interface Props {
  device: Device;
  onCommand: (id: string, action: string, payload?: any) => Promise<void>;
}

export const SmartPlugCard: React.FC<Props> = ({ device, onCommand }) => {
  const [loading, setLoading] = useState(false);

  const isOn = device.state === 'on';
  const powerW = device.attributes.current_power_w ?? (isOn ? 45.2 : 0);
  const energyKwh = device.attributes.today_energy_kwh ?? 0.85;

  const handleToggle = async () => {
    setLoading(true);
    try {
      await onCommand(device.id, 'toggle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`relative rounded-3xl p-5 transition-all duration-300 border ${
        isOn
          ? 'bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-500/30 shadow-lg shadow-emerald-500/5'
          : 'bg-white/80 dark:bg-zinc-900/80 border-zinc-200/80 dark:border-zinc-800'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3.5">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
              isOn
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
            }`}
          >
            <Zap className={`w-6 h-6 ${isOn ? 'fill-white' : ''}`} />
          </div>
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-base leading-tight">
              {device.name}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  isOn
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                }`}
              >
                {isOn ? '전원 공급 중' : '대기 중'}
              </span>
              <span className="text-[11px] text-zinc-400 capitalize">{device.platform}</span>
            </div>
          </div>
        </div>

        {/* 토글 스위치 */}
        <button
          onClick={handleToggle}
          disabled={loading}
          aria-label={isOn ? '플러그 끄기' : '플러그 켜기'}
          className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 flex items-center ${
            isOn ? 'bg-emerald-500 justify-end' : 'bg-zinc-200 dark:bg-zinc-700 justify-start'
          } ${loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <div className="w-6 h-6 rounded-full bg-white shadow-md" />
        </button>
      </div>

      {/* 전력 소비량 정보 */}
      <div className="mt-4 pt-3.5 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
        <div>
          <span className="text-xs text-zinc-500">실시간 소비전력</span>
          <p className="text-base font-bold text-zinc-800 dark:text-zinc-200">
            {isOn ? `${powerW} W` : '0 W'}
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs text-zinc-500">오늘 누적량</span>
          <p className="text-base font-semibold text-zinc-700 dark:text-zinc-300">
            {energyKwh} kWh
          </p>
        </div>
      </div>
    </div>
  );
};
