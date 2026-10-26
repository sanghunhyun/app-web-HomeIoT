'use client';

import React, { useState, useEffect } from 'react';
import { Server, KeyRound, CheckCircle2, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';
import { authFetch } from '@/lib/api';

export const SettingsManager: React.FC = () => {
  const [haUrl, setHaUrl] = useState('http://localhost:8123');
  const [haToken, setHaToken] = useState('');
  const [useMock, setUseMock] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [testing, setTesting] = useState(false);
  const [savingHa, setSavingHa] = useState(false);

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
        }),
      });
      const data = await res.json();
      setConnectionStatus(data.connectionStatus);
      alert('Home Assistant 연동 설정이 저장되었습니다.');
    } finally {
      setSavingHa(false);
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
      {/* Home Assistant 연동 설정 */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-6 shadow-sm">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Home Assistant (미들웨어) 연동 설정
            </h2>
            <p className="text-xs text-zinc-500">
              Mac Mini에 설치된 HA 주소 및 장기 접근 토큰(Long-Lived Access Token)을 지정합니다.
            </p>
          </div>
        </div>

        {/* 모의 모드 토글 */}
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 mb-6 flex items-center justify-between">
          <div>
            <span className="font-bold text-sm text-amber-900 dark:text-amber-200">
              시뮬레이션 모드 (Demo Mock Mode)
            </span>
            <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
              HA가 아직 설치되지 않았거나 테스트 중일 때 실제 가상 기기들로 모든 화면을 시뮬레이션합니다.
            </p>
          </div>
          <button
            onClick={() => setUseMock(!useMock)}
            className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 flex items-center ${
              useMock ? 'bg-amber-500 justify-end' : 'bg-zinc-300 dark:bg-zinc-700 justify-start'
            }`}
          >
            <div className="w-6 h-6 rounded-full bg-white shadow-md" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Home Assistant 서버 URL
            </label>
            <input
              type="text"
              value={haUrl}
              onChange={(e) => setHaUrl(e.target.value)}
              placeholder="http://localhost:8123 또는 http://192.168.0.10:8123"
              className="w-full text-xs p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Long-Lived Access Token (장기 접근 토큰)
            </label>
            <input
              type="password"
              value={haToken}
              onChange={(e) => setHaToken(e.target.value)}
              placeholder="HA 프로필 페이지 하단에서 생성한 긴 토큰 입력"
              className="w-full text-xs p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 font-mono"
            />
          </div>

          {/* 연결 상태 피드백 */}
          {connectionStatus && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center space-x-2 ${
                connectionStatus.ok
                  ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
              }`}
            >
              {connectionStatus.ok ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-600" />
              )}
              <span>{connectionStatus.message}</span>
            </div>
          )}

          <div className="flex items-center space-x-2 pt-2">
            <button
              onClick={handleTestConnection}
              disabled={testing}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
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

      {/* PIN 인증 관리 */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-6 shadow-sm">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">PIN 보안 비밀번호 변경</h2>
            <p className="text-xs text-zinc-500">
              일반 가족용 PIN과 관리자 설정 접근용 PIN을 개별 설정합니다. (기본: 사용자 1234, 관리자 5678)
            </p>
          </div>
        </div>

        <form onSubmit={handleSavePins} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              새 가족 사용자 PIN (기기 제어 전용)
            </label>
            <input
              type="password"
              maxLength={8}
              value={userPin}
              onChange={(e) => setUserPin(e.target.value)}
              placeholder="변경할 4~8자리 숫자 (비워두면 유지)"
              className="w-full text-xs p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              새 관리자 PIN (기기 매핑/방 설정 전용)
            </label>
            <input
              type="password"
              maxLength={8}
              value={adminPin}
              onChange={(e) => setAdminPin(e.target.value)}
              placeholder="변경할 4~8자리 숫자 (비워두면 유지)"
              className="w-full text-xs p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800"
            />
          </div>

          {pinMessage && (
            <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
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
