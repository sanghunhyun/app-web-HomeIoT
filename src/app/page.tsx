'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Device } from '@/types/device';
import { Room } from '@/types/room';
import { UserRole } from '@/types/auth';
import { Header } from '@/components/dashboard/Header';
import { QuickStatusBanner } from '@/components/dashboard/QuickStatusBanner';
import { RoomTabs } from '@/components/dashboard/RoomTabs';
import { DeviceCardRenderer } from '@/components/dashboard/DeviceCardRenderer';
import { RefreshCw, Inbox, AlertCircle } from 'lucide-react';

export default function DashboardPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>('all');
  const [role, setRole] = useState<UserRole>('user');
  const [isMock, setIsMock] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isEmbedded, setIsEmbedded] = useState(false);

  // iframe (FamilyWiki 등) 내부 여부 감지
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.self !== window.top) {
        setIsEmbedded(true);
      }
    } catch {
      setIsEmbedded(true);
    }
  }, []);

  const fetchDevices = useCallback(async (isBackground = false) => {
    if (!isBackground) setRefreshing(true);
    try {
      const res = await fetch('/api/devices');
      if (!res.ok) {
        throw new Error(`기기 목록 불러오기 실패: HTTP ${res.status}`);
      }
      const data = await res.json();
      setDevices(data.devices || []);
      setRooms(data.rooms || []);
      setRole(data.role || 'user');
      setIsMock(data.isMock ?? true);
      setError(null);
    } catch (err: any) {
      setError(err.message || '네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // 초기 로딩 및 5초 주기 백그라운드 자동 동기화
  useEffect(() => {
    fetchDevices();
    const interval = setInterval(() => {
      fetchDevices(true);
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchDevices]);

  // 기기 제어 명령 핸들러
  const handleCommand = async (id: string, action: string, payload?: any) => {
    // 1. 옵티미스틱 로컬 업데이트
    setDevices((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        let newState = d.state;
        const newAttrs = { ...d.attributes };

        if (action === 'turn_on') newState = 'on';
        if (action === 'turn_off') newState = 'off';
        if (action === 'toggle') newState = d.state === 'on' ? 'off' : 'on';
        if (action === 'set_brightness' && payload?.brightness !== undefined) {
          newAttrs.brightness = payload.brightness;
          newState = payload.brightness > 0 ? 'on' : 'off';
        }
        if (action === 'set_temperature' && payload?.target_temperature !== undefined) {
          newAttrs.target_temperature = payload.target_temperature;
        }

        return { ...d, state: newState, attributes: newAttrs };
      })
    );

    // 2. 서버 API 호출
    try {
      const res = await fetch(`/api/devices/${encodeURIComponent(id)}/command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload }),
      });
      const data = await res.json();
      if (data.updated) {
        setDevices((prev) => prev.map((d) => (d.id === id ? data.updated : d)));
      }
    } catch (err) {
      console.error('Command execution failed, restoring state:', err);
      fetchDevices(true);
    }
  };

  // 방별 기기 개수 집계
  const deviceCountsByRoom = devices.reduce((acc, d) => {
    acc[d.roomId] = (acc[d.roomId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 선택된 방에 따른 기기 필터링
  const displayedDevices =
    selectedRoom === 'all'
      ? devices
      : devices.filter((d) => d.roomId === selectedRoom);

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col">
      {/* 헤더 */}
      <Header
        role={role}
        isMock={isMock}
        onRefresh={() => fetchDevices()}
        isEmbedded={isEmbedded}
      />

      <main className="flex-1 w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 transition-all duration-300">
        {/* 상단 퀵 상태 배너 */}
        <QuickStatusBanner devices={devices} onCommand={handleCommand} />

        {/* 방별 탭 필터 및 새로고침 버튼 */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="min-w-0 flex-1">
            <RoomTabs
              rooms={rooms}
              selectedRoom={selectedRoom}
              onSelectRoom={setSelectedRoom}
              deviceCountsByRoom={deviceCountsByRoom}
            />
          </div>
          <button
            onClick={() => fetchDevices()}
            disabled={refreshing}
            className="p-2 sm:p-2.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors shadow-sm shrink-0 flex items-center justify-center self-start"
            title="상태 새로고침"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* 에러 상태 안내 */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 기기 그리드 - 유연한 반응형 레이아웃 */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-44 rounded-3xl bg-zinc-200/60 dark:bg-zinc-800/60 animate-pulse border border-zinc-200/80 dark:border-zinc-800"
              />
            ))}
          </div>
        ) : displayedDevices.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800">
            <Inbox className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mb-3" />
            <h3 className="text-base font-semibold text-zinc-700 dark:text-zinc-300">
              배치된 기기가 없습니다
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              관리자 페이지에서 이 방에 기기를 배치하거나 일반 표시에 체크해주세요.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 transition-all duration-300">
            {displayedDevices.map((device) => (
              <DeviceCardRenderer
                key={device.id}
                device={device}
                onCommand={handleCommand}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
