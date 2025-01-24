import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Get the pathname of the request (e.g. /, /protected)
    const path = request.nextUrl.pathname
    console.log('Middleware processing path:', path);

    // Public paths that don't require authentication
    const isPublicPath = path === '/login' || path === '/register' || path === '/' || path === '/home_bg.jpg'

    // Get the token from cookies
    const token = request.cookies.get('accessToken')?.value
    console.log('Token found:', !!token);

    // If the path is public and user is logged in, redirect to /flights
    if (isPublicPath && token && path !== '/home_bg.jpg') {
        console.log('Redirecting to /flights');
        return NextResponse.redirect(new URL('/flights', request.url))
    }

    // If the path is protected and user is not logged in, redirect to /login
    if (!isPublicPath && !token) {
        console.log('Redirecting to /login');
        return NextResponse.redirect(new URL('/login', request.url))
    }
}

// Configure which paths the middleware should run on
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
} 