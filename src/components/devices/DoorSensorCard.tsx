'use client';

import React from 'react';
import { DoorClosed, DoorOpen, ShieldCheck, AlertCircle, Battery } from 'lucide-react';
import { Device } from '@/types/device';

interface Props {
  device: Device;
}

export const DoorSensorCard: React.FC<Props> = ({ device }) => {
  // state가 closed 또는 contact가 true이면 닫힘
  const isClosed = device.state === 'closed' || device.attributes.contact !== false;
  const lastChanged = device.attributes.last_changed || '오늘 오후';
  const battery = device.attributes.battery ?? 95;

  return (
    <div
      className={`rounded-3xl p-5 border transition-all duration-300 ${
        isClosed
          ? 'bg-white/80 dark:bg-zinc-900/80 border-zinc-200/80 dark:border-zinc-800'
          : 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-300/80 dark:border-rose-800 shadow-md shadow-rose-500/5'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3.5">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
              isClosed
                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
                : 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
            }`}
          >
            {isClosed ? <DoorClosed className="w-6 h-6" /> : <DoorOpen className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-base leading-tight">
              {device.name}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                  isClosed
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                    : 'bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 animate-pulse'
                }`}
              >
                {isClosed ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5" /> 닫힘 (안전)
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3.5 h-3.5" /> 열림 상태!
                  </>
                )}
              </span>
              <span className="text-[11px] text-zinc-400 capitalize">{device.platform}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1 text-xs text-zinc-400">
          <Battery className="w-4 h-4 text-zinc-400" />
          <span>{battery}%</span>
        </div>
      </div>

      <div className="mt-4 pt-3.5 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500">
        <span>최근 상태 변경</span>
        <span className="font-medium text-zinc-700 dark:text-zinc-300">{lastChanged}</span>
      </div>
    </div>
  );
};
