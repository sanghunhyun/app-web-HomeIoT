'use client';

import { useState, useEffect, useCallback } from 'react';
import { AppTheme } from '@/types/config';

const THEME_STORAGE_KEY = 'home_iot_theme';

export function applyTheme(theme: AppTheme) {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', theme);
  // Tailwind의 dark 모드 호환 (familywiki도 다크 기반)
  if (theme === 'dark' || theme === 'familywiki') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

export function useTheme(serverDefaultTheme?: AppTheme) {
  const [theme, setThemeState] = useState<AppTheme>(serverDefaultTheme || 'familywiki');

  useEffect(() => {
    // 1. localStorage 저장값 확인
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as AppTheme | null;
    if (saved && ['light', 'dark', 'familywiki'].includes(saved)) {
      setThemeState(saved);
      applyTheme(saved);
      return;
    }

    // 2. 서버 기본값 적용
    const initialTheme = serverDefaultTheme || 'familywiki';
    setThemeState(initialTheme);
    applyTheme(initialTheme);
  }, [serverDefaultTheme]);

  const setTheme = useCallback(async (newTheme: AppTheme, saveToServer = false) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    applyTheme(newTheme);

    if (saveToServer) {
      try {
        const { authFetch } = await import('./api');
        await authFetch('/api/admin/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ theme: newTheme }),
        });
      } catch (e) {
        console.error('Failed to save theme to server:', e);
      }
    }
  }, []);

  return { theme, setTheme };
}
