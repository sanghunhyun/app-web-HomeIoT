'use client';

import React, { useState } from 'react';
import { Wind, Snowflake, Flame, Droplets, Power, Plus, Minus } from 'lucide-react';
import { Device } from '@/types/device';

interface Props {
  device: Device;
  onCommand: (id: string, action: string, payload?: any) => Promise<void>;
}

export const AirConditionerCard: React.FC<Props> = ({ device, onCommand }) => {
  const [loading, setLoading] = useState(false);

  const isOn = device.state === 'on';
  const targetTemp = device.attributes.target_temperature ?? 24;
  const currentTemp = device.attributes.current_temperature ?? 25;
  const hvacMode = device.attributes.hvac_mode || 'cool';

  const handleToggle = async () => {
    setLoading(true);
    try {
      await onCommand(device.id, 'toggle');
    } finally {
      setLoading(false);
    }
  };

  const changeTemp = async (delta: number) => {
    const next = Math.min(30, Math.max(18, Math.round((targetTemp + delta) * 10) / 10));
    await onCommand(device.id, 'set_temperature', { target_temperature: next });
  };

  const setMode = async (mode: string) => {
    await onCommand(device.id, 'set_hvac_mode', { hvac_mode: mode });
  };

  return (
    <div
      className={`relative rounded-3xl p-5 transition-all duration-300 border ${
        isOn
          ? 'bg-gradient-to-br from-sky-500/10 via-sky-500/5 to-transparent border-sky-500/30 shadow-lg shadow-sky-500/5'
          : 'bg-white/80 dark:bg-zinc-900/80 border-zinc-200/80 dark:border-zinc-800'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3.5">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
              isOn
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
            }`}
          >
            <Wind className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-base leading-tight">
              {device.name}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  isOn
                    ? 'bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                }`}
              >
                {isOn ? `가동 중 • 현재 ${currentTemp}°C` : '꺼짐'}
              </span>
              <span className="text-[11px] text-zinc-400 capitalize">{device.platform}</span>
            </div>
          </div>
        </div>

        {/* 전원 버튼 */}
        <button
          onClick={handleToggle}
          disabled={loading}
          aria-label={isOn ? '에어컨 끄기' : '에어컨 켜기'}
          className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
            isOn
              ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 hover:text-zinc-600'
          }`}
        >
          <Power className="w-5 h-5" />
        </button>
      </div>

      {isOn && (
        <div className="mt-5 space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
          {/* 희망 온도 컨트롤러 */}
          <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-2xl">
            <span className="text-xs text-zinc-500 font-medium">희망 설정 온도</span>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => changeTemp(-0.5)}
                className="w-8 h-8 rounded-xl bg-white dark:bg-zinc-700 shadow-sm flex items-center justify-center text-zinc-700 dark:text-zinc-200 active:scale-95"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-xl font-bold text-sky-600 dark:text-sky-400 min-w-[3.5rem] text-center">
                {targetTemp}°C
              </span>
              <button
                onClick={() => changeTemp(0.5)}
                className="w-8 h-8 rounded-xl bg-white dark:bg-zinc-700 shadow-sm flex items-center justify-center text-zinc-700 dark:text-zinc-200 active:scale-95"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 운전 모드 선택 */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'cool', label: '냉방', icon: Snowflake },
              { id: 'dry', label: '제습', icon: Droplets },
              { id: 'fan_only', label: '송풍', icon: Wind },
            ].map((m) => {
              const Icon = m.icon;
              const active = hvacMode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl text-xs font-medium transition-all ${
                    active
                      ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/20'
                      : 'bg-zinc-100 dark:bg-zinc-800/70 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
