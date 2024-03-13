import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = new URL(request.url)
  return NextResponse.json({
    message: `Intercepted for ${pathname}!`,
  })
}

export const config = {
  matcher: '/.well-known/acme-challenge/:path*',
}
