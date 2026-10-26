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
          ? 'bg-gradient-to-br from-purple-500/15 via-purple-500/5 to-transparent border-purple-500/40 shadow-lg shadow-purple-500/5'
          : 'theme-bg-card theme-border'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3.5">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
              isOn
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30'
                : 'theme-bg-sub theme-text-muted'
            }`}
          >
            <Tv className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold theme-text-main text-base leading-tight">
              {device.name}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  isOn
                    ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                    : 'theme-bg-sub theme-text-muted'
                }`}
              >
                {isOn ? `재생 중 • ${currentSource}` : '전원 꺼짐'}
              </span>
              <span className="text-[11px] theme-text-muted capitalize">{device.platform}</span>
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
              : 'theme-bg-sub theme-text-muted hover:opacity-80'
          }`}
        >
          <Power className="w-5 h-5" />
        </button>
      </div>

      {isOn && (
        <div className="mt-5 space-y-4 pt-4 border-t theme-border">
          {/* 볼륨 컨트롤 */}
          <div className="flex items-center justify-between theme-bg-sub p-3 rounded-2xl">
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMute}
                className={`p-1.5 rounded-xl ${
                  isMuted
                    ? 'bg-rose-500/20 text-rose-600'
                    : 'theme-text-sub hover:opacity-80'
                }`}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <span className="text-xs theme-text-muted">
                {isMuted ? '음소거' : `볼륨 ${volume}`}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => changeVolume(-2)}
                className="w-8 h-8 rounded-xl theme-bg-card theme-border border shadow-sm flex items-center justify-center theme-text-main active:scale-95"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={() => changeVolume(2)}
                className="w-8 h-8 rounded-xl theme-bg-card theme-border border shadow-sm flex items-center justify-center theme-text-main active:scale-95"
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
                    ? 'bg-purple-600 text-white shadow-sm font-bold'
                    : 'theme-bg-sub theme-text-sub hover:opacity-80'
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
