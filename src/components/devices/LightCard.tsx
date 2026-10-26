'use client';

import React, { useState } from 'react';
import { Lightbulb, Sun, Sliders } from 'lucide-react';
import { Device } from '@/types/device';

interface Props {
  device: Device;
  onCommand: (id: string, action: string, payload?: any) => Promise<void>;
}

export const LightCard: React.FC<Props> = ({ device, onCommand }) => {
  const [loading, setLoading] = useState(false);
  const [showSlider, setShowSlider] = useState(false);

  const isOn = device.state === 'on';
  const brightness = device.attributes.brightness ?? 100;

  const handleToggle = async () => {
    setLoading(true);
    try {
      await onCommand(device.id, 'toggle');
    } finally {
      setLoading(false);
    }
  };

  const handleBrightnessChange = async (val: number) => {
    await onCommand(device.id, 'set_brightness', { brightness: val });
  };

  return (
    <div
      className={`relative rounded-3xl p-5 transition-all duration-300 border ${
        isOn
          ? 'bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border-amber-500/30 shadow-lg shadow-amber-500/5'
          : 'bg-white/80 dark:bg-zinc-900/80 border-zinc-200/80 dark:border-zinc-800'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3.5">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
              isOn
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
            }`}
          >
            <Lightbulb className={`w-6 h-6 ${isOn ? 'fill-white' : ''}`} />
          </div>
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-base leading-tight">
              {device.name}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  isOn
                    ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                }`}
              >
                {isOn ? `켜짐 • ${brightness}%` : '꺼짐'}
              </span>
              <span className="text-[11px] text-zinc-400 capitalize">{device.platform}</span>
            </div>
          </div>
        </div>

        {/* 토글 스위치 */}
        <button
          onClick={handleToggle}
          disabled={loading}
          aria-label={isOn ? '조명 끄기' : '조명 켜기'}
          className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 flex items-center ${
            isOn ? 'bg-amber-500 justify-end' : 'bg-zinc-200 dark:bg-zinc-700 justify-start'
          } ${loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <div className="w-6 h-6 rounded-full bg-white shadow-md" />
        </button>
      </div>

      {/* 밝기 조절 영역 */}
      {isOn && (
        <div className="mt-4 pt-3.5 border-t border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-center justify-between text-xs text-zinc-500 mb-1.5">
            <span className="flex items-center gap-1">
              <Sun className="w-3.5 h-3.5 text-amber-500" /> 밝기
            </span>
            <span className="font-medium text-zinc-700 dark:text-zinc-300">{brightness}%</span>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            value={brightness}
            onChange={(e) => handleBrightnessChange(Number(e.target.value))}
            className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
        </div>
      )}
    </div>
  );
};
