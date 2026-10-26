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
          ? 'theme-bg-card theme-border'
          : 'bg-rose-500/10 border-rose-500/40 shadow-md shadow-rose-500/5'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3.5">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
              isClosed
                ? 'theme-bg-sub theme-text-sub'
                : 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
            }`}
          >
            {isClosed ? <DoorClosed className="w-6 h-6" /> : <DoorOpen className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="font-semibold theme-text-main text-base leading-tight">
              {device.name}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                  isClosed
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    : 'bg-rose-500/20 text-rose-600 dark:text-rose-400 animate-pulse border border-rose-500/30'
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
              <span className="text-[11px] theme-text-muted capitalize">{device.platform}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1 text-xs theme-text-muted">
          <Battery className="w-4 h-4" />
          <span>{battery}%</span>
        </div>
      </div>

      <div className="mt-4 pt-3.5 border-t theme-border flex items-center justify-between text-xs theme-text-muted">
        <span>최근 상태 변경</span>
        <span className="font-medium theme-text-sub">{lastChanged}</span>
      </div>
    </div>
  );
};
