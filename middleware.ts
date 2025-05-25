import { NextResponse } from 'next/server';

// This middleware will handle all requests
export function middleware() {
  // Get response
  const response = NextResponse.next();

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
