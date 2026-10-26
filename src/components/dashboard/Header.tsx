'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, Settings, LogOut, ExternalLink, Shield } from 'lucide-react';
import { UserRole } from '@/types/auth';

interface Props {
  role: UserRole;
  isMock: boolean;
  onRefresh?: () => void;
}

export const Header: React.FC<Props> = ({ role, isMock }) => {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-white/75 dark:bg-zinc-950/75 border-b border-zinc-200/80 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* 로고 및 서비스 타이틀 */}
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base sm:text-lg text-zinc-900 dark:text-zinc-50 tracking-tight">
                  우리집 IoT 대시보드
                </span>
                {isMock && (
                  <span className="text-[10px] font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full">
                    DEMO 모의모드
                  </span>
                )}
              </div>
              <p className="text-[11px] text-zinc-500 hidden sm:block">SmartThings • Tuya • Sonoff • Aqara</p>
            </div>
          </Link>
        </div>

        {/* 액션 버튼들 */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* FamilyWiki 바로가기 */}
          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noopener noreferrer"
            title="FamilyWiki로 이동"
            className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <span>FamilyWiki</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {/* 관리자 뱃지 및 설정 버튼 */}
          {role === 'admin' && (
            <Link
              href="/admin"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>관리자 설정</span>
            </Link>
          )}

          {role === 'user' && (
            <span className="text-xs font-medium text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-xl">
              가족 모드
            </span>
          )}

          {/* 로그아웃 버튼 */}
          <button
            onClick={handleLogout}
            title="PIN 잠금 (로그아웃)"
            className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
