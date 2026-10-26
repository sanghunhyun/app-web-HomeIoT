import { NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/auth/pin';

export async function POST() {
  await clearSessionCookie();
  return NextResponse.json({ success: true });
}
