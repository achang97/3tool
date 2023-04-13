import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// We want to always redirect from `/settings` to `/settings/team`. For that, we added a `redirects` entry
// in `next.config.js`. But, that redirect is not applied to client-side routing (Link, router.push), unless
// Middleware is present and matches the path. Hence adding this middleware to prevent the client-side
// navigation to `/settings`.

export function middleware(request: NextRequest) {
  return NextResponse.redirect(new URL('/settings/team', request.url));
}

export const config = {
  matcher: '/settings',
};
