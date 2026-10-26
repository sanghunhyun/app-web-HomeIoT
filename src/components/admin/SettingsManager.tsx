'use client';

import React, { useState, useEffect } from 'react';
import { Server, KeyRound, CheckCircle2, AlertTriangle, ShieldCheck, RefreshCw, Palette, Sun, Moon, Trees } from 'lucide-react';
import { authFetch } from '@/lib/api';
import { AppTheme } from '@/types/config';
import { applyTheme } from '@/lib/theme';

export const SettingsManager: React.FC = () => {
  const [haUrl, setHaUrl] = useState('http://localhost:8123');
  const [haToken, setHaToken] = useState('');
  const [useMock, setUseMock] = useState(true);
  const [theme, setTheme] = useState<AppTheme>('familywiki');
  const [connectionStatus, setConnectionStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [testing, setTesting] = useState(false);
  const [savingHa, setSavingHa] = useState(false);
  const [savingTheme, setSavingTheme] = useState(false);
  const [themeSaved, setThemeSaved] = useState(false);

  // PIN 변경 state
  const [userPin, setUserPin] = useState('');
  const [adminPin, setAdminPin] = useState('');
  const [pinMessage, setPinMessage] = useState<string | null>(null);

  useEffect(() => {
    authFetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.homeAssistant) {
          setHaUrl(data.homeAssistant.url || 'http://localhost:8123');
          setHaToken(data.homeAssistant.token || '');
          setUseMock(data.homeAssistant.useMock ?? true);
        }
        if (data.theme) {
          setTheme(data.theme);
          applyTheme(data.theme);
        }
        if (data.connectionStatus) {
          setConnectionStatus(data.connectionStatus);
        }
      });
  }, []);

  const handleTestConnection = async () => {
    setTesting(true);
    try {
      const res = await authFetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: haUrl,
          token: haToken,
          useMock,
          testOnly: true,
        }),
      });
      const data = await res.json();
      setConnectionStatus(data.testResult);
    } finally {
      setTesting(false);
    }
  };

  const handleSaveHa = async () => {
    setSavingHa(true);
    try {
      const res = await authFetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: haUrl,
          token: haToken,
          useMock,
          theme,
        }),
      });
      const data = await res.json();
      setConnectionStatus(data.connectionStatus);
      alert('Home Assistant 연동 설정이 저장되었습니다.');
    } finally {
      setSavingHa(false);
    }
  };

  const handleThemeSelect = (newTheme: AppTheme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('home_iot_theme', newTheme);
  };

  const handleSaveTheme = async () => {
    setSavingTheme(true);
    try {
      const res = await authFetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme }),
      });
      if (res.ok) {
        setThemeSaved(true);
        setTimeout(() => setThemeSaved(false), 2500);
      }
    } finally {
      setSavingTheme(false);
    }
  };

  const handleSavePins = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userPin && !adminPin) return;

    const res = await authFetch('/api/admin/pins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userPin, adminPin }),
    });
    const data = await res.json();
    if (res.ok) {
      setPinMessage('PIN 번호가 성공적으로 변경되었습니다.');
      setUserPin('');
      setAdminPin('');
      setTimeout(() => setPinMessage(null), 3000);
    } else {
      alert(data.error || 'PIN 변경 실패');
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. 디자인 테마 스타일 설정 */}
      <div className="theme-bg-card rounded-3xl theme-border border p-6 shadow-sm">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold theme-text-main">
              대시보드 디자인 테마 설정
            </h2>
            <p className="text-xs theme-text-muted">
              FamilyWiki 다크 테마와의 통일감을 위해 지브리 포레스트 스타일 또는 모던 화이트/다크를 선택합니다.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          {/* FamilyWiki 지브리 포레스트 테마 */}
          <button
            onClick={() => handleThemeSelect('familywiki')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              theme === 'familywiki'
                ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-[#1a1e1c] text-[#e8e0d4]'
                : 'theme-border theme-bg-sub theme-text-sub hover:opacity-80'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="w-8 h-8 rounded-xl bg-[#2d3830] text-[#7caa6e] flex items-center justify-center">
                <Trees className="w-4 h-4" />
              </span>
              {theme === 'familywiki' && (
                <CheckCircle2 className="w-4 h-4 text-[#7caa6e]" />
              )}
            </div>
            <div className="font-bold text-sm">FamilyWiki 스타일</div>
            <p className="text-[11px] opacity-75 mt-0.5">지브리 숲속 다크 모드 (완벽한 일체감)</p>
          </button>

          {/* 모던 다크 테마 */}
          <button
            onClick={() => handleThemeSelect('dark')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              theme === 'dark'
                ? 'border-sky-500 ring-2 ring-sky-500/20 bg-zinc-950 text-zinc-100'
                : 'theme-border theme-bg-sub theme-text-sub hover:opacity-80'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="w-8 h-8 rounded-xl bg-zinc-800 text-sky-400 flex items-center justify-center">
                <Moon className="w-4 h-4" />
              </span>
              {theme === 'dark' && (
                <CheckCircle2 className="w-4 h-4 text-sky-400" />
              )}
            </div>
            <div className="font-bold text-sm">모던 다크</div>
            <p className="text-[11px] opacity-75 mt-0.5">딥 징크/블랙 심플 테마</p>
          </button>

          {/* 모던 화이트 테마 */}
          <button
            onClick={() => handleThemeSelect('light')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              theme === 'light'
                ? 'border-sky-500 ring-2 ring-sky-500/20 bg-white text-zinc-900 shadow-md'
                : 'theme-border theme-bg-sub theme-text-sub hover:opacity-80'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <Sun className="w-4 h-4" />
              </span>
              {theme === 'light' && (
                <CheckCircle2 className="w-4 h-4 text-sky-500" />
              )}
            </div>
            <div className="font-bold text-sm">화이트 (라이트)</div>
            <p className="text-[11px] opacity-75 mt-0.5">밝고 깨끗한 모던 스타일</p>
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleSaveTheme}
            disabled={savingTheme}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
          >
            {savingTheme ? '저장 중...' : '선택한 테마를 기본값으로 저장'}
          </button>
          {themeSaved && (
            <span className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> 테마가 기본값으로 저장되었습니다.
            </span>
          )}
        </div>
      </div>

      {/* 2. Home Assistant 연동 설정 */}
      <div className="theme-bg-card rounded-3xl theme-border border p-6 shadow-sm">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold theme-text-main">
              Home Assistant (미들웨어) 연동 설정
            </h2>
            <p className="text-xs theme-text-muted">
              Mac Mini에 설치된 HA 주소 및 장기 접근 토큰(Long-Lived Access Token)을 지정합니다.
            </p>
          </div>
        </div>

        {/* 모의 모드 토글 */}
        <div className="p-4 rounded-2xl theme-bg-sub theme-border border mb-6 flex items-center justify-between">
          <div>
            <span className="font-bold text-sm theme-text-main">
              시뮬레이션 모드 (Demo Mock Mode)
            </span>
            <p className="text-xs theme-text-muted mt-0.5">
              HA가 아직 설치되지 않았거나 테스트 중일 때 실제 가상 기기들로 모든 화면을 시뮬레이션합니다.
            </p>
          </div>
          <button
            onClick={() => setUseMock(!useMock)}
            className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 flex items-center ${
              useMock ? 'bg-amber-500 justify-end' : 'theme-bg-app justify-start'
            }`}
          >
            <div className="w-6 h-6 rounded-full bg-white shadow-md" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold theme-text-sub mb-1.5">
              Home Assistant 서버 URL
            </label>
            <input
              type="text"
              value={haUrl}
              onChange={(e) => setHaUrl(e.target.value)}
              placeholder="http://localhost:8123 또는 http://192.168.0.10:8123"
              className="w-full text-xs p-3 rounded-xl theme-border border theme-bg-sub theme-text-main"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold theme-text-sub mb-1.5">
              Long-Lived Access Token (장기 접근 토큰)
            </label>
            <input
              type="password"
              value={haToken}
              onChange={(e) => setHaToken(e.target.value)}
              placeholder="HA 프로필 페이지 하단에서 생성한 긴 토큰 입력"
              className="w-full text-xs p-3 rounded-xl theme-border border theme-bg-sub theme-text-main font-mono"
            />
          </div>

          {/* 연결 상태 피드백 */}
          {connectionStatus && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center space-x-2 ${
                connectionStatus.ok
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
              }`}
            >
              {connectionStatus.ok ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-500" />
              )}
              <span>{connectionStatus.message}</span>
            </div>
          )}

          <div className="flex items-center space-x-2 pt-2">
            <button
              onClick={handleTestConnection}
              disabled={testing}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl theme-border border text-xs font-semibold hover:opacity-80 transition-opacity"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
              <span>연결 테스트</span>
            </button>
            <button
              onClick={handleSaveHa}
              disabled={savingHa}
              className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <span>설정 저장</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. PIN 인증 관리 */}
      <div className="theme-bg-card rounded-3xl theme-border border p-6 shadow-sm">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold theme-text-main">PIN 보안 비밀번호 변경</h2>
            <p className="text-xs theme-text-muted">
              일반 가족용 PIN과 관리자 설정 접근용 PIN을 개별 설정합니다. (기본: 사용자 1234, 관리자 5678)
            </p>
          </div>
        </div>

        <form onSubmit={handleSavePins} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-semibold theme-text-sub mb-1.5">
              새 가족 사용자 PIN (기기 제어 전용)
            </label>
            <input
              type="password"
              maxLength={8}
              value={userPin}
              onChange={(e) => setUserPin(e.target.value)}
              placeholder="변경할 4~8자리 숫자 (비워두면 유지)"
              className="w-full text-xs p-3 rounded-xl theme-border border theme-bg-sub theme-text-main"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold theme-text-sub mb-1.5">
              새 관리자 PIN (기기 매핑/방 설정 전용)
            </label>
            <input
              type="password"
              maxLength={8}
              value={adminPin}
              onChange={(e) => setAdminPin(e.target.value)}
              placeholder="변경할 4~8자리 숫자 (비워두면 유지)"
              className="w-full text-xs p-3 rounded-xl theme-border border theme-bg-sub theme-text-main"
            />
          </div>

          {pinMessage && (
            <p className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> {pinMessage}
            </p>
          )}

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            PIN 번호 변경 저장
          </button>
        </form>
      </div>
    </div>
  );
};
