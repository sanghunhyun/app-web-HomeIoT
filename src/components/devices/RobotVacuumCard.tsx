'use client';

import React, { useState } from 'react';
import { Bot, Play, Pause, Home, BatteryCharging } from 'lucide-react';
import { Device } from '@/types/device';

interface Props {
  device: Device;
  onCommand: (id: string, action: string, payload?: any) => Promise<void>;
}

export const RobotVacuumCard: React.FC<Props> = ({ device, onCommand }) => {
  const [loading, setLoading] = useState(false);

  const status = device.attributes.vacuum_status || 'docked';
  const battery = device.attributes.battery_level ?? 95;
  const isCleaning = status === 'cleaning';
  const isPaused = status === 'paused';

  const sendVacuumCommand = async (action: string) => {
    setLoading(true);
    try {
      await onCommand(device.id, action);
    } finally {
      setLoading(false);
    }
  };

  const statusLabels: Record<string, { label: string; color: string }> = {
    cleaning: { label: '청소 중', color: 'bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300' },
    docked: { label: '충전 스테이션 대기', color: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400' },
    paused: { label: '일시정지됨', color: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300' },
    returning: { label: '충전기로 복귀 중', color: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300' },
  };

  const currentStatusInfo = statusLabels[status] || statusLabels.docked;

  return (
    <div
      className={`relative rounded-3xl p-5 transition-all duration-300 border ${
        isCleaning
          ? 'bg-gradient-to-br from-teal-500/10 via-teal-500/5 to-transparent border-teal-500/30 shadow-lg shadow-teal-500/5'
          : 'bg-white/80 dark:bg-zinc-900/80 border-zinc-200/80 dark:border-zinc-800'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3.5">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
              isCleaning
                ? 'bg-teal-500 text-white shadow-md shadow-teal-500/30 animate-pulse'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
            }`}
          >
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-base leading-tight">
              {device.name}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${currentStatusInfo.color}`}>
                {currentStatusInfo.label}
              </span>
              <span className="text-[11px] text-zinc-400 capitalize">{device.platform}</span>
            </div>
          </div>
        </div>

        {/* 배터리 잔량 */}
        <div className="flex items-center space-x-1.5 bg-zinc-50 dark:bg-zinc-800 px-2.5 py-1 rounded-xl text-xs font-medium text-zinc-600 dark:text-zinc-300">
          <BatteryCharging className="w-4 h-4 text-emerald-500" />
          <span>{battery}%</span>
        </div>
      </div>

      {/* 청소기 조작 컨트롤 버튼 바 */}
      <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 grid grid-cols-2 gap-2">
        {isCleaning ? (
          <button
            onClick={() => sendVacuumCommand('vacuum_pause')}
            disabled={loading}
            className="flex items-center justify-center space-x-2 py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-semibold text-xs shadow-sm transition-all active:scale-95"
          >
            <Pause className="w-4 h-4" />
            <span>일시정지</span>
          </button>
        ) : (
          <button
            onClick={() => sendVacuumCommand('vacuum_clean')}
            disabled={loading}
            className="flex items-center justify-center space-x-2 py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-semibold text-xs shadow-sm transition-all active:scale-95"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{isPaused ? '청소 재개' : '청소 시작'}</span>
          </button>
        )}

        <button
          onClick={() => sendVacuumCommand('vacuum_dock')}
          disabled={loading || status === 'docked'}
          className={`flex items-center justify-center space-x-2 py-2.5 px-4 rounded-2xl font-semibold text-xs transition-all ${
            status === 'docked'
              ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
              : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-300 active:scale-95'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>충전기 복귀</span>
        </button>
      </div>
    </div>
  );
};
