import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify, decodeJwt, importSPKI, errors } from 'jose'
import type { CryptoKey } from 'jose'

import storeConfig from '../../discovery.config'

const WEBOPS_API_URL =
  process.env.WEBOPS_API_URL || 'https://faststore.vtex.com'
const COOKIE_NAME = '__fs_auth_token'
const TOKEN_TTL_SECONDS = 10 * 60
/** How long to reuse the RSA public key fetched from WebOps */
const PUBLIC_KEY_CACHE_MS = 60 * 60 * 1000

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

let publicKeyCache: {
  pem: string
  key: CryptoKey
  fetchedAt: number
} | null = null

async function fetchPublicKeyPemFromWebOps(): Promise<string> {
  const res = await fetch(
    `${WEBOPS_API_URL}/api/v1/password-protection/public-key`,
    { signal: AbortSignal.timeout(5000) }
  )

  if (!res.ok) {
    throw new Error(`WebOps public-key returned ${res.status}`)
  }

  const body = (await res.json()) as { publicKey?: string }
  const pem = body.publicKey?.trim()

  if (!pem) {
    throw new Error('WebOps public-key response missing publicKey')
  }

  return pem
}

async function getPublicVerificationKey(): Promise<CryptoKey> {
  const now = Date.now()

  if (publicKeyCache && now - publicKeyCache.fetchedAt < PUBLIC_KEY_CACHE_MS) {
    return publicKeyCache.key
  }

  const pem = await fetchPublicKeyPemFromWebOps()
  const key = await importSPKI(pem, 'RS256')
  publicKeyCache = { pem, key, fetchedAt: now }

  return key
}

export class AuthenticationService {
  private readonly storeId: string

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
        return await this.tryRenewSession(request, token, verification.payload)
      }
    }

    return await this.handleNoAuth(request)
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

  private shouldProtectDomain(request: NextRequest, scope?: string): boolean {
    const hostname = request.headers.get('host') || ''
    const isDefaultDomain = hostname.endsWith('.vtex.app')

    return (
      scope === 'ALL_DOMAINS' ||
      (scope === 'DEFAULT_DOMAINS' && isDefaultDomain) ||
      (scope === 'CUSTOM_DOMAINS' && !isDefaultDomain)
    )
  }

  private payloadMatchesStore(payload: TokenPayload): boolean {
    return payload.storeId === this.storeId
  }

  private async verifyToken(token: string): Promise<{
    valid: boolean
    expired: boolean
    payload?: TokenPayload
  }> {
    try {
      const key = await getPublicVerificationKey()
      const { payload } = await jwtVerify(token, key)
      const p = payload as unknown as TokenPayload

      if (!this.payloadMatchesStore(p)) {
        return { valid: false, expired: false }
      }

      return {
        valid: true,
        expired: false,
        payload: p,
      }
    } catch (error) {
      if (error instanceof errors.JWTExpired) {
        const payload = decodeJwt(token) as unknown as TokenPayload

        if (!this.payloadMatchesStore(payload)) {
          return { valid: false, expired: false }
        }

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
          signal: AbortSignal.timeout(10000),
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
      // Fall through to redirect or fail-open below
    }

    if (!this.shouldProtectDomain(request, payload.scope)) {
      return { response: NextResponse.next() }
    }

    return { response: this.redirectToLogin(request) }
  }

  private async handleNoAuth(request: NextRequest): Promise<AuthResult> {
    try {
      const res = await fetch(
        `${WEBOPS_API_URL}/api/v1/password-protection/status?storeId=${this.storeId}`,
        { signal: AbortSignal.timeout(10000) }
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
