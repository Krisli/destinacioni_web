import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decodeJWT, isTokenExpired } from '@/lib/auth/jwt';

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  
  // Protected routes
  if (pathname.startsWith('/vendor') || pathname.startsWith('/admin')) {
    const token = req.cookies.get('access_token')?.value;
    
    // No token - redirect to login
    if (!token) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('redirect', pathname);
      if (pathname.startsWith('/vendor')) {
        loginUrl.searchParams.set('role', 'vendor');
      } else if (pathname.startsWith('/admin')) {
        loginUrl.searchParams.set('role', 'admin');
      }
      return NextResponse.redirect(loginUrl);
    }

    // Check if token is expired
    if (isTokenExpired(token)) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Decode token to check roles
    const payload = decodeJWT(token);
    if (!payload) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check role-based access
    if (pathname.startsWith('/vendor') && !payload.roles.includes('vendor') && !payload.roles.includes('admin')) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    
    if (pathname.startsWith('/admin') && !payload.roles.includes('admin')) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
}

export const config = { 
  matcher: [
    '/vendor/dashboard/:path*',
    '/vendor/cars/:path*',
    '/vendor/apartments/:path*',
    '/vendor/bookings/:path*',
    '/vendor/calendar/:path*',
    '/vendor/analytics/:path*',
    '/vendor/settings/:path*',
    '/admin/:path*'
  ] 
};
