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
  const path = request.nextUrl.pathname

  try {
    const authService = new AuthenticationService()
    const authResult = await authService.authenticateRequest(request)

    if (authResult.response.status !== 200) {
      return authResult.response
    }

    if (process.env.ENABLE_REDIRECTS_MIDDLEWARE === 'true') {
      const redirect = await redirectsClient.get(path)

      if (redirect) {
        const redirectUrl = new URL(redirect.to, storeConfig.storeUrl)
        const redirectStatusCode = redirect.type === 'permanent' ? 301 : 302
        const response = NextResponse.redirect(redirectUrl, redirectStatusCode)

        for (const cookie of authResult.response.cookies.getAll()) {
          response.cookies.set(cookie)
        }

        response.headers.set(
          'Cache-Control',
          'public, max-age=300, stale-while-revalidate=31536000'
        )

        return response
      }
    }

    return authResult.response
  } catch {
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all paths including `/`
     * Exclude:
     * - api (e.g. api/fs/auth/login)
     * - _next/static, _next/image
     * - favicon.ico
     * - fs-auth-login (login page)
     * - ~partytown (partytown scripts)
     */
    '/',
    '/((?!api|_next/static|_next/image|favicon.ico|fs-auth-login|~partytown).*)',
  ],
}
