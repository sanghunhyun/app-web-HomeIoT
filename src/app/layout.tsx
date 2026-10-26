import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '우리집 IoT 대시보드 | Home Dashboard',
  description: 'SmartThings, Tuya, eWeLink, Xiaomi 통합 스마트홈 대시보드',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '우리집 IoT',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 antialiased selection:bg-sky-500/20">
        {children}
      </body>
    </html>
  );
}
