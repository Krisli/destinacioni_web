import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decodeJwt } from '@/lib/auth';

export function middleware(req: NextRequest) {
  const p = req.nextUrl.pathname;
  if (p.startsWith('/vendor') || p.startsWith('/admin')) {
    const token = req.cookies.get('access_token')?.value;
    if (!token) return NextResponse.redirect(new URL('/login', req.url));
    const roles = decodeJwt(token)?.roles ?? [];
    if (p.startsWith('/vendor') && !roles.includes('vendor')) return NextResponse.redirect(new URL('/', req.url));
    if (p.startsWith('/admin') && !roles.includes('admin')) return NextResponse.redirect(new URL('/', req.url));
  }
  return NextResponse.next();
}
export const config = { matcher: ['/vendor/:path*', '/admin/:path*'] };
