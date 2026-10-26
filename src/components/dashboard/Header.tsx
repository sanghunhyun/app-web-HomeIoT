'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, Settings, LogOut, ExternalLink, Sun, Moon, Trees } from 'lucide-react';
import { UserRole } from '@/types/auth';
import { AppTheme } from '@/types/config';

interface Props {
  role: UserRole;
  isMock: boolean;
  onRefresh?: () => void;
  isEmbedded?: boolean;
  theme?: AppTheme;
  onThemeChange?: (theme: AppTheme) => void;
}

export const Header: React.FC<Props> = ({
  role,
  isMock,
  isEmbedded = false,
  theme = 'familywiki',
  onThemeChange,
}) => {
  const router = useRouter();
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const handleLogout = async () => {
    localStorage.removeItem('home_iot_token');
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  const themeOptions: { id: AppTheme; label: string; icon: any; desc: string }[] = [
    { id: 'familywiki', label: 'FamilyWiki', icon: Trees, desc: '지브리 포레스트 다크' },
    { id: 'dark', label: '다크', icon: Moon, desc: '모던 징크 다크' },
    { id: 'light', label: '화이트', icon: Sun, desc: '깨끗한 라이트' },
  ];

  const currentThemeInfo = themeOptions.find((t) => t.id === theme) || themeOptions[0];
  const CurrentIcon = currentThemeInfo.icon;

  return (
    <header className="sticky top-0 z-30 backdrop-blur-md theme-bg-header theme-border border-b transition-all">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
        {/* 로고 및 서비스 타이틀 */}
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center shadow-md transition-transform group-hover:scale-105 ${
              theme === 'familywiki'
                ? 'bg-gradient-to-tr from-[#7caa6e] to-[#6dafd6] text-[#1a1e1c]'
                : 'bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-sky-500/20'
            }`}>
              <Home className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm sm:text-base theme-text-main tracking-tight">
                  우리집 IoT 대시보드
                </span>
                {isMock && (
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    theme === 'familywiki'
                      ? 'bg-[#2d3830] text-[#daa84c] border border-[#3d4a3f]'
                      : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                  }`}>
                    DEMO 모의모드
                  </span>
                )}
              </div>
              <p className="text-[11px] theme-text-muted hidden sm:block">SmartThings • Tuya • Sonoff • Aqara</p>
            </div>
          </Link>
        </div>

        {/* 액션 버튼들 */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* 테마 변경 드롭다운/버튼 */}
          <div className="relative">
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold theme-bg-sub theme-border border theme-text-main hover:opacity-80 transition-all shadow-sm"
              title="테마 스타일 변경"
            >
              <CurrentIcon className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
              <span className="hidden sm:inline">{currentThemeInfo.label}</span>
            </button>

            {showThemeMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowThemeMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-44 rounded-2xl theme-bg-card theme-border border shadow-xl z-50 p-1.5 space-y-1">
                  <div className="px-2.5 py-1 text-[10px] font-bold theme-text-muted uppercase">
                    테마 스타일 선택
                  </div>
                  {themeOptions.map((opt) => {
                    const Icon = opt.icon;
                    const active = theme === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => {
                          onThemeChange?.(opt.id);
                          setShowThemeMenu(false);
                        }}
                        className={`w-full flex items-center space-x-2.5 px-2.5 py-2 rounded-xl text-xs font-medium transition-colors text-left ${
                          active
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold'
                            : 'theme-text-sub hover:bg-zinc-100 dark:hover:bg-zinc-800'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <div>
                          <div>{opt.label}</div>
                          <div className="text-[10px] opacity-70">{opt.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* FamilyWiki 바로가기 (외부에서 접속했을 때만 표시) */}
          {!isEmbedded && (
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noopener noreferrer"
              title="FamilyWiki로 이동"
              className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium theme-text-sub theme-bg-sub theme-border border hover:opacity-80 transition-colors"
            >
              <span>FamilyWiki</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          {/* 관리자 설정 버튼 */}
          {role === 'admin' && (
            <Link
              href="/admin"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors border border-indigo-200/50 dark:border-indigo-800/50"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>관리자 설정</span>
            </Link>
          )}

          {role === 'user' && (
            <span className="text-xs font-medium theme-text-muted theme-bg-sub px-2.5 py-1 rounded-xl">
              가족 모드
            </span>
          )}

          {/* 로그아웃 버튼 */}
          <button
            onClick={handleLogout}
            title="PIN 잠금 (로그아웃)"
            className="p-2 rounded-xl theme-text-muted hover:theme-text-main theme-bg-sub hover:opacity-80 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
