'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Home, Delete, Lock, ShieldAlert, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDigit = (digit: string) => {
    if (pin.length < 8) {
      setPin((prev) => prev + digit);
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPin('');
    setError('');
  };

  // 키보드 숫자 입력 지원
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) {
        handleDigit(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Escape') {
        handleClear();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin]);

  // PIN이 4자리 이상 입력되면 자동 인증 시도
  useEffect(() => {
    if (pin.length >= 4) {
      submitPin(pin);
    }
  }, [pin]);

  const submitPin = async (inputPin: string) => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: inputPin }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || '잘못된 PIN 번호입니다.');
        setPin('');
      } else {
        if (data.token) {
          localStorage.setItem('home_iot_token', data.token);
        }
        router.push('/');
        router.refresh();
      }
    } catch {
      setError('서버와 통신할 수 없습니다.');
      setPin('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-50 via-slate-100 to-sky-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 text-zinc-900 dark:text-zinc-100">
      <div className="w-full max-w-sm flex flex-col items-center">
        {/* 앱 아이콘 & 환영 메시지 */}
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center shadow-xl shadow-sky-500/25 mb-4 animate-in zoom-in-75 duration-300">
          <Home className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          우리집 IoT 대시보드
        </h1>
        <p className="text-xs text-zinc-500 mt-1 mb-8">안전한 제어를 위해 PIN 번호를 입력하세요</p>

        {/* PIN 표시 인디케이터 (점 4개) */}
        <div className="flex items-center space-x-4 mb-8">
          {[0, 1, 2, 3].map((idx) => {
            const filled = pin.length > idx;
            return (
              <div
                key={idx}
                className={`w-4 h-4 rounded-full transition-all duration-200 ${
                  filled
                    ? 'bg-sky-500 scale-125 shadow-md shadow-sky-500/50'
                    : 'bg-zinc-200 dark:bg-zinc-700'
                }`}
              />
            );
          })}
        </div>

        {/* 오류 메시지 */}
        {error && (
          <div className="mb-6 px-4 py-2 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs flex items-center space-x-1.5 animate-shake">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 키패드 그리드 */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-xs mb-8">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              onClick={() => handleDigit(digit)}
              disabled={loading}
              className="h-16 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200/60 dark:border-zinc-800 text-2xl font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 active:scale-95 transition-all text-zinc-800 dark:text-zinc-100 flex items-center justify-center"
            >
              {digit}
            </button>
          ))}

          {/* 하단 줄: 초기화, 0, 삭제 */}
          <button
            onClick={handleClear}
            disabled={loading || pin.length === 0}
            className="h-16 rounded-2xl text-xs font-semibold text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 active:scale-95 transition-all flex items-center justify-center"
          >
            초기화
          </button>

          <button
            onClick={() => handleDigit('0')}
            disabled={loading}
            className="h-16 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200/60 dark:border-zinc-800 text-2xl font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 active:scale-95 transition-all text-zinc-800 dark:text-zinc-100 flex items-center justify-center"
          >
            0
          </button>

          <button
            onClick={handleDelete}
            disabled={loading || pin.length === 0}
            aria-label="한 글자 지우기"
            className="h-16 rounded-2xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-95 transition-all flex items-center justify-center"
          >
            <Delete className="w-6 h-6" />
          </button>
        </div>

        {/* 하단 힌트 카드 */}
        <div className="w-full max-w-xs p-3.5 rounded-2xl bg-zinc-100/80 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800/80 text-[11px] text-zinc-500 text-center space-y-1">
          <p className="flex items-center justify-center gap-1 font-medium text-zinc-600 dark:text-zinc-400">
            <Lock className="w-3 h-3 text-sky-500" /> 기본 PIN 안내
          </p>
          <p>가족 사용자 PIN: <strong className="font-mono text-zinc-700 dark:text-zinc-300">1234</strong></p>
          <p>관리자 세팅 PIN: <strong className="font-mono text-zinc-700 dark:text-zinc-300">5678</strong></p>
        </div>
      </div>
    </div>
  );
}
