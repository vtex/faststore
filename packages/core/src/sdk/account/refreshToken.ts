import fetch from 'isomorphic-unfetch'
import { getStoreURL } from 'src/sdk/localization/useLocalizationConfig'
import { sanitizeHost } from 'src/utils/utilities'
import {
  AUTHENTICATOR_REFRESH_TOKEN_PATH,
  LEGACY_REFRESH_TOKEN_PATH,
} from './refreshTokenPaths'

/**
 * Covers both refresh routes:
 * - Authenticator: `{ authStatus: 'Success', refreshAfter: 1792717383 }`
 *   (epoch seconds).
 * - Legacy VTEX ID: `{ status: 'Success', refreshAfter: '2026-03-26T02:53:39+00:00' }`.
 */
export interface RefreshTokenResponse {
  status?: string
  authStatus?: string
  refreshAfter?: string | number
}

async function fetchWithRetry(
  url: RequestInfo | URL,
  init?: RequestInit,
  maxRetries = 3
): Promise<RefreshTokenResponse | undefined> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await fetch(url, init)
      if (res.status !== 200) continue

      const data = await res.json()
      return data
    } catch {}
  }

  return undefined
}

function getRefreshTokenUrl(path: string): string {
  if (globalThis.window !== undefined) {
    return path
  }

  return `${new URL(getStoreURL()).origin}${path}`
}

function getRefreshTokenHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'content-type': 'application/json',
  }

  if (globalThis.window === undefined) {
    headers.Host = `${sanitizeHost(new URL(getStoreURL()).origin)}`
  }

  return headers
}

export const isRefreshTokenSuccessful = (
  result: RefreshTokenResponse | undefined
): boolean => {
  return (result?.authStatus ?? result?.status)?.toLowerCase?.() === 'success'
}

/**
 * Whether the session belongs to a B2B buyer: one with an organizational unit
 * (`unitId`) and a contract (`customerId`). `session.b2b` alone is not enough:
 * it is set for every `isRepresentative` token, and that flag can also be true
 * outside B2B.
 */
export const isB2BSession = (
  session:
    | {
        b2b?: {
          unitId?: string | null
          customerId?: string | null
        } | null
      }
    | null
    | undefined
): boolean => Boolean(session?.b2b?.unitId && session?.b2b?.customerId)

/**
 * Refresh route for the session. B2B sessions use the Authenticator route,
 * which keeps the selected contract (`customerId`, `unitId`,
 * `isRepresentative`). Every other session keeps the legacy VTEX ID route, as
 * VTEX ID recommends. There is no fallback between them: like before, a failed
 * refresh logs the shopper out.
 */
export const getRefreshTokenPath = (isB2B: boolean): string =>
  isB2B ? AUTHENTICATOR_REFRESH_TOKEN_PATH : LEGACY_REFRESH_TOKEN_PATH

export const refreshTokenRequest = async ({
  isB2B = false,
}: { isB2B?: boolean } = {}): Promise<RefreshTokenResponse | undefined> => {
  return fetchWithRetry(getRefreshTokenUrl(getRefreshTokenPath(isB2B)), {
    credentials: 'include',
    headers: getRefreshTokenHeaders(),
    body: JSON.stringify({}),
    method: 'POST',
  })
}

/**
 * Normalizes `refreshAfter` to epoch seconds as a string, the format stored in
 * the session. Accepts epoch seconds (number or numeric string) and ISO dates.
 * Returns `null` when the value is missing or unparseable.
 */
export const getRefreshAfterSeconds = (
  result: RefreshTokenResponse | undefined
): string | null => {
  const value = result?.refreshAfter

  if (value === undefined || value === null || value === '') {
    return null
  }

  const seconds =
    typeof value === 'number' || /^\d+$/.test(value)
      ? Number(value)
      : new Date(value).getTime() / 1000

  return Number.isFinite(seconds) ? String(Math.floor(seconds)) : null
}

/**
 * How long to wait before refreshing again when a successful refresh carries
 * no usable `refreshAfter`. Keeping the old, already-expired value would make
 * every following session validation call the refresh route again.
 */
export const REFRESH_AFTER_FALLBACK_SECONDS = 60 * 60

/**
 * `refreshAfter` to store after a successful refresh: the value from the
 * response, or a short fallback from now when the response has none.
 */
export const getNextRefreshAfter = (
  result: RefreshTokenResponse | undefined,
  nowSeconds = Math.floor(Date.now() / 1000)
): string =>
  getRefreshAfterSeconds(result) ??
  String(nowSeconds + REFRESH_AFTER_FALLBACK_SECONDS)
