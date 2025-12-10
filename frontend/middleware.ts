import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
	// Check for dashboard route protection
	// Matches /fr/dashboard, /en/dashboard, etc.
	const pathname = request.nextUrl.pathname;

	// Dashboard protection removed as per user request
	// if (pathname.includes('/dashboard')) { ... }

	// Skip intlMiddleware for admin login, let Next.js handle it
	if (pathname.startsWith('/admin')) {
		return NextResponse.next();
	}

	return intlMiddleware(request);
}

export const config = {
	// Match only internationalized pathnames + admin
	matcher: ['/', '/(fr|en|pt)/:path*', '/admin/:path*']
};
