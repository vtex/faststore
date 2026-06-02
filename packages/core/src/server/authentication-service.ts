import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify, decodeJwt, importSPKI, errors } from 'jose'
import type { CryptoKey } from 'jose'

import storeConfig from 'discovery.config'

import {
  publicKeyUrl,
  renewUrl,
  protectionStatusUrl,
  passwordProtectionTimeouts,
} from './password-protection/webops-api'

export const COOKIE_NAME = '__fs_auth_token'
export const TOKEN_TTL_SECONDS = 10 * 60
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
  const res = await fetch(publicKeyUrl(), {
    signal: AbortSignal.timeout(passwordProtectionTimeouts.publicKeyMs),
  })

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

/** Clears the cached WebOps public key (for unit tests only). */
export function resetPasswordProtectionPublicKeyCacheForTests(): void {
  publicKeyCache = null
}

export class AuthenticationService {
  private readonly storeId: string

  constructor() {
    this.storeId = storeConfig.api.storeId
  }

  private getNormalizedHost(request: NextRequest): string {
    const host = request.headers.get('host') || ''
    return host.split(':')[0].toLowerCase()
  }

  async authenticateRequest(request: NextRequest): Promise<AuthResult> {
    if (!this.shouldCheckProtection(request)) {
      return { response: NextResponse.next() }
    }

    const token = request.cookies.get(COOKIE_NAME)?.value

    if (token) {
      const verification = await this.verifyToken(token)

      if (verification.valid && verification.payload) {
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

    const hostname = this.getNormalizedHost(request)
    const isDefaultDomain = hostname.endsWith('.vtex.app')

    if (isDefaultDomain) {
      return true
    }

    return process.env.CUSTOM_DOMAINS_PROTECTION_ENABLED === 'true'
  }

  private shouldProtectDomain(request: NextRequest, scope?: string): boolean {
    const hostname = this.getNormalizedHost(request)
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

  private isJwtExpiredError(error: unknown): boolean {
    return (
      error instanceof errors.JWTExpired ||
      (error instanceof Error && error.name === 'JWTExpired')
    )
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
      if (this.isJwtExpiredError(error)) {
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
      const res = await fetch(renewUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeId: this.storeId,
          expiredToken,
        }),
        signal: AbortSignal.timeout(passwordProtectionTimeouts.defaultMs),
      })

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
      const res = await fetch(protectionStatusUrl(), {
        signal: AbortSignal.timeout(passwordProtectionTimeouts.defaultMs),
      })

      if (!res.ok) {
        return { response: this.redirectToLogin(request) }
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
      return { response: this.redirectToLogin(request) }
    }
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
    const returnTo = `${request.nextUrl.pathname}${request.nextUrl.search}`
    loginUrl.searchParams.set('returnTo', returnTo)

    const response = NextResponse.redirect(loginUrl)
    response.headers.set('Cache-Control', 'no-store')

    return response
  }
}
