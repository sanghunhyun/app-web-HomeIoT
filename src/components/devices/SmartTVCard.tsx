'use client';

import React, { useState } from 'react';
import { Tv, Power, Volume2, VolumeX, Plus, Minus } from 'lucide-react';
import { Device } from '@/types/device';

interface Props {
  device: Device;
  onCommand: (id: string, action: string, payload?: any) => Promise<void>;
}

export const SmartTVCard: React.FC<Props> = ({ device, onCommand }) => {
  const [loading, setLoading] = useState(false);

  const isOn = device.state === 'on';
  const volume = device.attributes.volume_level ?? 20;
  const isMuted = device.attributes.is_volume_muted ?? false;
  const currentSource = device.attributes.source || 'Netflix';
  const sources = device.attributes.source_list || ['TV', 'Netflix', 'YouTube', 'PlayStation'];

  const handleToggle = async () => {
    setLoading(true);
    try {
      await onCommand(device.id, 'toggle');
    } finally {
      setLoading(false);
    }
  };

  const changeVolume = async (delta: number) => {
    const next = Math.max(0, Math.min(100, volume + delta));
    await onCommand(device.id, 'set_volume', { volume_level: next });
  };

  const toggleMute = async () => {
    await onCommand(device.id, 'toggle_mute');
  };

  const setSource = async (source: string) => {
    await onCommand(device.id, 'set_source', { source });
  };

  return (
    <div
      className={`relative rounded-3xl p-5 transition-all duration-300 border ${
        isOn
          ? 'bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent border-purple-500/30 shadow-lg shadow-purple-500/5'
          : 'bg-white/80 dark:bg-zinc-900/80 border-zinc-200/80 dark:border-zinc-800'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3.5">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
              isOn
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
            }`}
          >
            <Tv className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-base leading-tight">
              {device.name}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  isOn
                    ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                }`}
              >
                {isOn ? `재생 중 • ${currentSource}` : '전원 꺼짐'}
              </span>
              <span className="text-[11px] text-zinc-400 capitalize">{device.platform}</span>
            </div>
          </div>
        </div>

        {/* 전원 버튼 */}
        <button
          onClick={handleToggle}
          disabled={loading}
          aria-label={isOn ? 'TV 끄기' : 'TV 켜기'}
          className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
            isOn
              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 hover:text-zinc-600'
          }`}
        >
          <Power className="w-5 h-5" />
        </button>
      </div>

      {isOn && (
        <div className="mt-5 space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
          {/* 볼륨 컨트롤 */}
          <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-2xl">
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMute}
                className={`p-1.5 rounded-xl ${
                  isMuted
                    ? 'bg-rose-100 text-rose-600'
                    : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200'
                }`}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <span className="text-xs text-zinc-500">
                {isMuted ? '음소거' : `볼륨 ${volume}`}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => changeVolume(-2)}
                className="w-8 h-8 rounded-xl bg-white dark:bg-zinc-700 shadow-sm flex items-center justify-center text-zinc-700 dark:text-zinc-200 active:scale-95"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={() => changeVolume(2)}
                className="w-8 h-8 rounded-xl bg-white dark:bg-zinc-700 shadow-sm flex items-center justify-center text-zinc-700 dark:text-zinc-200 active:scale-95"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 소스 / 앱 바로가기 */}
          <div className="flex flex-wrap gap-1.5">
            {sources.map((src) => (
              <button
                key={src}
                onClick={() => setSource(src)}
                className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
                  currentSource === src
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
                }`}
              >
                {src}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
