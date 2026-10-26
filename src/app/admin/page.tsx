'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Cpu, Home, Settings, ShieldCheck } from 'lucide-react';
import { Device } from '@/types/device';
import { Room } from '@/types/room';
import { DeviceManager } from '@/components/admin/DeviceManager';
import { RoomManager } from '@/components/admin/RoomManager';
import { SettingsManager } from '@/components/admin/SettingsManager';

type AdminTab = 'devices' | 'rooms' | 'settings';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('devices');
  const [devices, setDevices] = useState<Device[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = useCallback(async () => {
    try {
      const res = await fetch('/api/devices?all=true');
      const data = await res.json();
      setDevices(data.devices || []);
      setRooms(data.rooms || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col">
      {/* 상단 관리자 헤더 */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-white/75 dark:bg-zinc-950/75 border-b border-zinc-200/80 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center space-x-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-xs font-semibold">대시보드로 돌아가기</span>
            </Link>
            <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />
            <div className="flex items-center space-x-2">
              <span className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                IoT 관리자 센터
              </span>
              <span className="text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> ADMIN
              </span>
            </div>
          </div>

          {/* 탭 네비게이션 */}
          <div className="flex items-center space-x-1 bg-zinc-100 dark:bg-zinc-850 p-1 rounded-2xl">
            {[
              { id: 'devices', label: '기기 관리', icon: Cpu },
              { id: 'rooms', label: '공간(방)', icon: Home },
              { id: 'settings', label: 'HA & 보안', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as AdminTab)}
                  className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* 본문 콘텐츠 */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="h-64 rounded-3xl bg-zinc-200/50 dark:bg-zinc-800/50 animate-pulse" />
        ) : (
          <>
            {activeTab === 'devices' && (
              <DeviceManager devices={devices} rooms={rooms} onRefresh={fetchAdminData} />
            )}
            {activeTab === 'rooms' && (
              <RoomManager rooms={rooms} onRefresh={fetchAdminData} />
            )}
            {activeTab === 'settings' && <SettingsManager />}
          </>
        )}
      </main>
    </div>
  );
}
