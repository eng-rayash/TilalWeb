import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login page and auth API endpoint
  if (
    pathname === '/admin/login' ||
    pathname.startsWith('/api/admin/auth') ||
    pathname.startsWith('/api/track')
  ) {
    return NextResponse.next();
  }

  // Protect all /admin routes
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin_token')?.value;
    const expectedToken = process.env.ADMIN_TOKEN_SECRET;

    if (!token || token !== expectedToken) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
