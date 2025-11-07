import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decodeJWT, isTokenExpired } from '@/lib/auth/jwt';

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  
  // Protected routes
  if (pathname.startsWith('/vendor') || pathname.startsWith('/admin')) {
    const token = req.cookies.get('jwt_token')?.value;
    
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

    // Debug: Log roles for troubleshooting (remove in production)
    if (process.env.NODE_ENV === 'development') {
      console.log('[Middleware] User roles:', payload.roles, 'Path:', pathname);
    }

    //TODO remove after implementing proper role assignment from BE
    payload.roles = ['vendor', 'admin'];

    // Check role-based access
    // If no roles in token, deny access (user needs proper role assignment)
    if (pathname.startsWith('/vendor')) {
      if (!payload.roles || payload.roles.length === 0) {
        console.warn('[Middleware] No roles found in token for vendor access');
        return NextResponse.redirect(new URL('/', req.url));
      }
      if (!payload.roles.includes('vendor') && !payload.roles.includes('admin')) {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }
    
    if (pathname.startsWith('/admin')) {
      if (!payload.roles || payload.roles.length === 0 || !payload.roles.includes('admin')) {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = { 
  matcher: [
    '/vendor/:path*',  // Match all vendor routes including /vendor itself
    '/admin/:path*'
  ] 
};
