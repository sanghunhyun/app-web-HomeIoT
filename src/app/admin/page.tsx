'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Cpu, Home, Settings, ShieldCheck } from 'lucide-react';
import { Device } from '@/types/device';
import { Room } from '@/types/room';
import { DeviceManager } from '@/components/admin/DeviceManager';
import { RoomManager } from '@/components/admin/RoomManager';
import { SettingsManager } from '@/components/admin/SettingsManager';
import { authFetch } from '@/lib/api';

type AdminTab = 'devices' | 'rooms' | 'settings';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('devices');
  const [devices, setDevices] = useState<Device[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = useCallback(async () => {
    try {
      const res = await authFetch('/api/devices?all=true');
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
    <div className="min-h-screen theme-bg-app theme-text-main flex flex-col">
      {/* 상단 관리자 헤더 */}
      <header className="sticky top-0 z-30 backdrop-blur-md theme-bg-header theme-border border-b">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="p-2 rounded-xl theme-text-muted hover:theme-text-main theme-bg-sub transition-colors flex items-center space-x-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-xs font-semibold">대시보드로 돌아가기</span>
            </Link>
            <div className="h-4 w-px theme-border bg-current opacity-20" />
            <div className="flex items-center space-x-2">
              <span className="font-bold text-base theme-text-main">
                IoT 관리자 센터
              </span>
              <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-500/30">
                <ShieldCheck className="w-3 h-3" /> ADMIN
              </span>
            </div>
          </div>

          {/* 탭 네비게이션 */}
          <div className="flex items-center space-x-1 theme-bg-sub p-1 rounded-2xl theme-border border">
            {[
              { id: 'devices', label: '기기 관리', icon: Cpu },
              { id: 'rooms', label: '공간(방)', icon: Home },
              { id: 'settings', label: '설정 & 테마', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as AdminTab)}
                  className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'theme-bg-card theme-text-main shadow-sm font-bold'
                      : 'theme-text-muted hover:theme-text-main'
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
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
