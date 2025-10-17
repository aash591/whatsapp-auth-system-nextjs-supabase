import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAccessTokenMiddleware } from '@/lib/jwt-middleware-secure';
import { applySecurityHeaders } from '@/lib/security-headers';

// This runs on the edge (faster, cheaper than serverless)
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define protected routes that require authentication
  const protectedRoutes = [
    '/protected',
    '/set-password',
    '/verification-status'
  ];

  // Check if current path requires authentication
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      // No token, redirect to home
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }

    // CRITICAL: Validate JWT token with Edge-compatible verification
    try {
      const payload = await verifyAccessTokenMiddleware(token);
      
      if (!payload) {
        // Invalid token, redirect to home
        const url = request.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect(url);
      }

      // Token is valid, allow the request to proceed with security headers
      const response = NextResponse.next();
      return applySecurityHeaders(response);
    } catch (error) {
      // Token verification failed, redirect to home
      console.error('JWT verification failed in middleware:', error);
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  // Allow all other requests with security headers
  const response = NextResponse.next();
  return applySecurityHeaders(response);
}

// Configure which paths trigger the middleware
export const config = {
  matcher: [
    '/protected/:path*',
    '/set-password',
    '/verification-status',
  ],
};



