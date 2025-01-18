import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// URL mapping for redirects
const redirects = new Map([
  ['/optimize', '/tools/image-optimizer'],
  ['/resize', '/tools/image-resizer'],
  ['/convert', '/tools/image-converter'],
  ['/resize-image', '/resize'],
  ['/convert-to-svg', '/tools/svg-converter'],
  ['/how-to-use', '/faq'],
  ['/pdf-to-image', 'https://pdftoimage.picshifter.com'],
  ['/tools/pdf-to-image', 'https://pdftoimage.picshifter.com']
]);

// Map of canonical URLs
const canonicalUrls = new Map([
  ['/optimize', '/tools/image-optimizer']
]);

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || 'picshifter.com'
  const pathname = request.nextUrl.pathname;
  const protocol = request.headers.get('x-forwarded-proto') || 'https'

  // Handle WWW to non-WWW redirect and ensure HTTPS
  if (hostname.startsWith('www.')) {
    const newUrl = new URL(request.url);
    newUrl.protocol = 'https:';
    newUrl.host = hostname.replace('www.', '');
    return NextResponse.redirect(newUrl, { 
      status: 301,
      headers: {
        'Cache-Control': 'public, max-age=31536000',
        'Link': '<https://picshifter.com>; rel="canonical"'
      }
    });
  }

  // Handle PDF subdomain
  if (hostname === 'pdftoimage.picshifter.com') {
    return NextResponse.next();
  }

  // Handle redirects for old URLs and canonical URLs
  if (redirects.has(pathname) || canonicalUrls.has(pathname)) {
    const targetPath = canonicalUrls.get(pathname) || redirects.get(pathname)!;
    const newUrl = new URL(targetPath, request.url);
    return NextResponse.redirect(newUrl, { 
      status: 301,
      headers: {
        'Cache-Control': 'public, max-age=31536000',
        'Link': `<${newUrl}>; rel="canonical"`
      }
    });
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
    '/resize-image',
    '/convert-to-svg',
    '/how-to-use',
    '/pdf-to-image',
    '/tools/pdf-to-image',
    // Keep API routes for CORS
    '/api/:path*',
    // Match all paths except static files
    '/((?!_next/|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\.png$).*)'
  ],
}
