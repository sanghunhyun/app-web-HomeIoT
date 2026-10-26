import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/pin';

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({
    authenticated: true,
    role: session.role,
    authTime: session.authTime,
  });
}
