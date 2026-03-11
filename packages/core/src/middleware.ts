/*
 * Middleware is always active. It runs:
 * 1. Password protection (AuthenticationService) — when applicable (default/custom domains per env).
 * 2. Redirects — only when ENABLE_REDIRECTS_MIDDLEWARE is set at runtime.
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import storeConfig from 'discovery.config'

import { AuthenticationService } from './server/authentication-service'

type Redirect = {
  from: string
  to: string
  type: 'permanent' | 'temporary'
}
interface RedirectsClient {
get(from: string): Promise<Redirect | null>
}

class DynamoRedirectsClient implements RedirectsClient {
  async get(_from: string): Promise<Redirect | null> {
    // TODO: Implement DynamoDB client. Ensure that the cluster has access to DynamoDB first.
    return null
  }
}

const redirectsClient = new DynamoRedirectsClient()

export async function middleware(request: NextRequest) {
  const authService = new AuthenticationService()
  const authResult = await authService.authenticateRequest(request)

  if (authResult.response.status !== 200) {
    return authResult.response
  }

  if (process.env.ENABLE_REDIRECTS_MIDDLEWARE === 'true') {
    const { pathname } = request.nextUrl
    const redirect = await redirectsClient.get(pathname)

    if (redirect) {
      const redirectUrl = new URL(redirect.to, storeConfig.storeUrl)
      const redirectStatusCode = redirect.type === 'permanent' ? 301 : 302
      const response = NextResponse.redirect(redirectUrl, redirectStatusCode)

      response.headers.set(
        'Cache-Control',
        'public, max-age=300, stale-while-revalidate=31536000'
      )

      return response
    }
  }

  return authResult.response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes, including api/fs/auth/login)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - fs-auth-login (password protection login page)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|fs-auth-login).*)',
  ],
}
