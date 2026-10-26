'use client';

import React, { useState } from 'react';
import { Camera, Maximize2, Shield, Eye, X } from 'lucide-react';
import { Device } from '@/types/device';

interface Props {
  device: Device;
}

export const CameraCard: React.FC<Props> = ({ device }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const snapshotUrl =
    device.attributes.snapshot_url ||
    'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80';
  const isRecording = device.attributes.is_recording !== false;

  return (
    <>
      <div className="rounded-3xl p-5 border theme-bg-card theme-border transition-all duration-300">
        <div className="flex items-start justify-between mb-3.5">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl theme-bg-sub text-violet-500 flex items-center justify-center">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold theme-text-main text-base leading-tight">
                {device.name}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-600 dark:text-violet-400 border border-violet-500/20 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  실시간 모니터링
                </span>
                <span className="text-[11px] theme-text-muted capitalize">{device.platform}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="p-2 rounded-xl theme-bg-sub theme-text-sub hover:opacity-80 transition-opacity"
            title="크게 보기"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* 카메라 프리뷰 썸네일 */}
        <div
          onClick={() => setModalOpen(true)}
          className="relative h-40 rounded-2xl overflow-hidden cursor-pointer group bg-zinc-950"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={snapshotUrl}
            alt={device.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

          {/* 상단 오버레이 (REC 배지) */}
          <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] text-white">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="font-semibold">REC HD</span>
          </div>

          {/* 하단 오버레이 안내 */}
          <div className="absolute bottom-2.5 right-2.5 flex items-center space-x-1 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] text-zinc-200">
            <Eye className="w-3.5 h-3.5" />
            <span>라이브 뷰 탭</span>
          </div>
        </div>
      </div>

      {/* 전체화면 라이브 뷰 모달 */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl">
            <div className="flex items-center justify-between p-4 bg-zinc-950 border-b border-zinc-800 text-white">
              <div className="flex items-center space-x-2">
                <Camera className="w-5 h-5 text-rose-500" />
                <h4 className="font-bold text-base">{device.name} - 실시간 영상</h4>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative aspect-video bg-black flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={snapshotUrl} alt={device.name} className="w-full h-full object-contain" />
              <div className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
                <span className="w-2 h-2 bg-white rounded-full animate-ping" /> LIVE
              </div>
            </div>
            <div className="p-4 bg-zinc-950 flex items-center justify-between text-xs text-zinc-400 border-t border-zinc-800">
              <span>{device.platform.toUpperCase()} 스트림 • 1080p 30fps</span>
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-xl transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
