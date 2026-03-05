import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify, decodeJwt, importSPKI, errors } from 'jose'
import type { CryptoKey } from 'jose'

import storeConfig from '../../discovery.config'

const WEBOPS_API_URL =
  process.env.WEBOPS_API_URL || 'https://faststore.vtex.com'
const COOKIE_NAME = '__fs_auth_token'
const TOKEN_TTL_SECONDS = 10 * 60

// RSA public key for JWT RS256 verification (safe to expose)
// TODO: Replace with actual public key generated for password protection
const PUBLIC_KEY_PEM = `-----BEGIN PUBLIC KEY-----
REPLACE_WITH_ACTUAL_PUBLIC_KEY
-----END PUBLIC KEY-----`

interface TokenPayload {
  storeId: string
  protected: boolean
  passwordVersion?: string
  scope?: string
  exp?: number
}

interface AuthResult {
  response: NextResponse
}

let cachedKey: CryptoKey | null = null

async function getPublicKey(): Promise<CryptoKey> {
  if (!cachedKey) {
    cachedKey = await importSPKI(PUBLIC_KEY_PEM, 'RS256')
  }

  return cachedKey
}

export class AuthenticationService {
  private storeId: string

  constructor() {
    this.storeId = storeConfig.api.storeId
  }

  async authenticateRequest(request: NextRequest): Promise<AuthResult> {
    if (!this.shouldCheckProtection(request)) {
      return { response: NextResponse.next() }
    }

    const token = request.cookies.get(COOKIE_NAME)?.value

    if (token) {
      const verification = await this.verifyToken(token)

      if (verification.valid && verification.payload) {
        if (!verification.payload.protected) {
          return { response: NextResponse.next() }
        }

        if (!this.shouldProtectDomain(request, verification.payload.scope)) {
          return { response: NextResponse.next() }
        }

        return { response: NextResponse.next() }
      }

      if (verification.expired && verification.payload) {
        return this.tryRenewSession(request, token, verification.payload)
      }
    }

    return this.handleNoAuth(request)
  }

  private shouldCheckProtection(request: NextRequest): boolean {
    if (process.env.NODE_ENV === 'development') {
      return false
    }

    const hostname = request.headers.get('host') || ''
    const isDefaultDomain = hostname.endsWith('.vtex.app')

    if (isDefaultDomain) {
      return true
    }

    return process.env.CUSTOM_DOMAINS_PROTECTION_ENABLED === 'true'
  }

  private shouldProtectDomain(
    request: NextRequest,
    scope?: string
  ): boolean {
    const hostname = request.headers.get('host') || ''
    const isDefaultDomain = hostname.endsWith('.vtex.app')

    return (
      scope === 'ALL_DOMAINS' ||
      (scope === 'DEFAULT_DOMAINS' && isDefaultDomain) ||
      (scope === 'CUSTOM_DOMAINS' && !isDefaultDomain)
    )
  }

  private async verifyToken(token: string): Promise<{
    valid: boolean
    expired: boolean
    payload?: TokenPayload
  }> {
    try {
      const key = await getPublicKey()
      const { payload } = await jwtVerify(token, key)

      return {
        valid: true,
        expired: false,
        payload: payload as unknown as TokenPayload,
      }
    } catch (error) {
      if (error instanceof errors.JWTExpired) {
        // Signature was valid but token expired — safe to use payload for renewal
        const payload = decodeJwt(token) as unknown as TokenPayload

        return { valid: false, expired: true, payload }
      }

      return { valid: false, expired: false }
    }
  }

  private async tryRenewSession(
    request: NextRequest,
    expiredToken: string,
    payload: TokenPayload
  ): Promise<AuthResult> {
    try {
      const res = await fetch(
        `${WEBOPS_API_URL}/api/v1/password-protection/renew`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            storeId: this.storeId,
            expiredToken,
          }),
        }
      )

      if (res.ok) {
        const data = await res.json()

        if (data.valid && data.token) {
          const response = NextResponse.next()
          this.setAuthCookie(response, data.token)

          return { response }
        }
      }
    } catch {
      // Renewal failed — fall through to redirect
    }

    if (!this.shouldProtectDomain(request, payload.scope)) {
      return { response: NextResponse.next() }
    }

    return { response: this.redirectToLogin(request) }
  }

  private async handleNoAuth(request: NextRequest): Promise<AuthResult> {
    try {
      const res = await fetch(
        `${WEBOPS_API_URL}/api/v1/password-protection/status?storeId=${this.storeId}`
      )

      if (!res.ok) {
        return this.failClosed(request)
      }

      const status = await res.json()

      if (!status.protected) {
        const response = NextResponse.next()

        if (status.token) {
          this.setAuthCookie(response, status.token)
        }

        return { response }
      }

      if (!this.shouldProtectDomain(request, status.scope)) {
        return { response: NextResponse.next() }
      }

      return { response: this.redirectToLogin(request) }
    } catch {
      return this.failClosed(request)
    }
  }

  private failClosed(request: NextRequest): AuthResult {
    const hostname = request.headers.get('host') || ''

    if (hostname.endsWith('.vtex.app')) {
      return { response: this.redirectToLogin(request) }
    }

    // Custom domains fail-open to protect production reliability
    return { response: NextResponse.next() }
  }

  private setAuthCookie(response: NextResponse, token: string): void {
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: TOKEN_TTL_SECONDS,
    })
  }

  private redirectToLogin(request: NextRequest): NextResponse {
    const loginUrl = new URL('/fs-auth-login', request.url)
    loginUrl.searchParams.set('returnTo', request.nextUrl.pathname)

    return NextResponse.redirect(loginUrl)
  }
}
