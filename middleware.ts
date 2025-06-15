import { NextResponse } from 'next/server';

// Production-ready middleware with security headers
export function middleware() {
  // Get response
  const response = NextResponse.next();

  // Security headers for production
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Add CORS headers to all responses
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');

  return response;
}

// Configure which paths should be processed by this middleware
export const config = {
  matcher: [
    // Match all paths
    '/(.*)',
  ],
};
