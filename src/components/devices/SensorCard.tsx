'use client';

import React from 'react';
import { Thermometer, Droplets, Wind, Battery } from 'lucide-react';
import { Device } from '@/types/device';

interface Props {
  device: Device;
}

export const SensorCard: React.FC<Props> = ({ device }) => {
  const temp = device.attributes.temperature ?? 24.5;
  const humidity = device.attributes.humidity ?? 50;
  const aqi = device.attributes.air_quality_index;
  const battery = device.attributes.battery ?? 90;

  return (
    <div className="rounded-3xl p-5 border bg-white/80 dark:bg-zinc-900/80 border-zinc-200/80 dark:border-zinc-800 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-500 flex items-center justify-center">
            <Thermometer className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-base leading-tight">
              {device.name}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                쾌적
              </span>
              <span className="text-[11px] text-zinc-400 capitalize">{device.platform}</span>
            </div>
          </div>
        </div>

        {/* 배터리 표시 */}
        <div className="flex items-center space-x-1 text-xs text-zinc-400">
          <Battery className="w-4 h-4 text-zinc-400" />
          <span>{battery}%</span>
        </div>
      </div>

      {/* 수치 매트릭스 그리드 */}
      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
        <div className="bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-2xl flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 flex items-center justify-center">
            <Thermometer className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-zinc-500">실내 온도</span>
            <p className="text-lg font-bold text-zinc-800 dark:text-zinc-100">{temp}°C</p>
          </div>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-2xl flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
            <Droplets className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-zinc-500">실내 습도</span>
            <p className="text-lg font-bold text-zinc-800 dark:text-zinc-100">{humidity}%</p>
          </div>
        </div>

        {aqi !== undefined && (
          <div className="col-span-2 bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                <Wind className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-zinc-500">실내 공기질 (AQI)</span>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {aqi} ㎍/㎥ (좋음)
                </p>
              </div>
            </div>
            <span className="text-xs bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-semibold px-2.5 py-1 rounded-full">
              청정
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
