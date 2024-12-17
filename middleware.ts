import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// URL mapping for redirects
const redirects = new Map([
  ['/optimize', '/tools/image-optimizer'],
  ['/resize', '/tools/image-resizer'],
  ['/convert', '/tools/image-converter'],
  ['/pdf-to-image', '/tools/pdf-to-image']
]);

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Handle redirects for old URLs
  if (redirects.has(pathname)) {
    const newUrl = new URL(redirects.get(pathname)!, request.url);
    return NextResponse.redirect(newUrl);
  }

  // For API routes, enable CORS
  if (pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Add paths that need redirects
    '/optimize',
    '/resize',
    '/convert',
    '/pdf-to-image',
    // Keep API routes for CORS
    '/api/:path*'
  ],
}
