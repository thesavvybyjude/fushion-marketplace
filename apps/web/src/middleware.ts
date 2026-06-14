import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('fushion_token')?.value;
  const role = request.cookies.get('fushion_role')?.value;
  const { pathname } = request.nextUrl;

  // Helper to redirect to login
  const redirectToLogin = () => {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  };

  // Helper to redirect to home
  const redirectToHome = () => {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  };

  // 1. Unauthenticated users accessing protected routes
  const isProtectedRoute = 
    pathname.startsWith('/account') || 
    pathname.startsWith('/checkout') ||
    pathname.startsWith('/vendor') ||
    pathname.startsWith('/admin');

  if (isProtectedRoute && !token) {
    return redirectToLogin();
  }

  // 2. Admin routes protection
  if (pathname.startsWith('/admin') && role !== 'ADMIN') {
    return redirectToHome();
  }

  // 3. Vendor routes protection
  if (pathname.startsWith('/vendor') && role !== 'VENDOR' && role !== 'ADMIN') {
    return redirectToHome();
  }

  // 4. Authenticated users shouldn't access auth pages
  if ((pathname.startsWith('/login') || pathname.startsWith('/register')) && token) {
    if (role === 'ADMIN') return NextResponse.redirect(new URL('/admin', request.url));
    if (role === 'VENDOR') return NextResponse.redirect(new URL('/vendor/dashboard', request.url));
    return NextResponse.redirect(new URL('/account', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
