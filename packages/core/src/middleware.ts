/*
 * Middleware is always active. It runs:
 * 1. Password protection (PasswordProtectionService) — when applicable (default/custom domains per env).
 * 2. Redirects — only when ENABLE_REDIRECTS_MIDDLEWARE is set at runtime.
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import storeConfig from 'discovery.config'

import { PasswordProtectionService } from './server/password-protection-service'

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

  let storeProtectionResult: Awaited<
    ReturnType<PasswordProtectionService['checkStoreProtection']>
  >

  try {
    const protectionService = new PasswordProtectionService()
    storeProtectionResult =
      await protectionService.checkStoreProtection(request)
  } catch {
    return NextResponse.error()
  }

  if (storeProtectionResult.response.status !== 200) {
    return storeProtectionResult.response
  }

  if (process.env.ENABLE_REDIRECTS_MIDDLEWARE === 'true') {
    const redirect = await redirectsClient.get(path)

    if (redirect) {
      const redirectUrl = new URL(redirect.to, storeConfig.storeUrl)
      const redirectStatusCode = redirect.type === 'permanent' ? 301 : 302
      const response = NextResponse.redirect(redirectUrl, redirectStatusCode)

      for (const cookie of storeProtectionResult.response.cookies.getAll()) {
        response.cookies.set(cookie)
      }

      response.headers.set(
        'Cache-Control',
        'public, max-age=300, stale-while-revalidate=31536000'
      )

      return response
    }
  }

  return storeProtectionResult.response
}

export const config = {
  matcher: [
    /*
     * Match all paths including `/`
     * Exclude:
     * - api (e.g. api/fs/password-protection/unlock)
     * - _next/static, _next/image
     * - favicon.ico
     * - password-protection (unlock page)
     * - ~partytown (partytown scripts)
     */
    '/',
    '/((?!api|_next/static|_next/image|favicon.ico|password-protection|~partytown).*)',
  ],
}
