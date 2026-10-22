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

const isClientError = (status: number) => status >= 400 && status < 500

async function fetchWithRetry(
  url: RequestInfo | URL,
  init?: RequestInit,
  maxRetries = 3
): Promise<RefreshTokenResponse | undefined> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await fetch(url, init)

      // A 4xx will not change on retry (e.g. no `vid_rt` for this route).
      if (isClientError(res.status)) return undefined
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
 * Refresh routes to try, in order. B2B sessions use the Authenticator route,
 * which keeps the selected contract, and fall back to the legacy one for
 * sessions whose `vid_rt` only exists on the legacy path (e.g. OAuth logins).
 * Every other session keeps using the legacy route, as VTEX ID recommends.
 */
export const getRefreshTokenPaths = (isB2B: boolean): string[] =>
  isB2B
    ? [AUTHENTICATOR_REFRESH_TOKEN_PATH, LEGACY_REFRESH_TOKEN_PATH]
    : [LEGACY_REFRESH_TOKEN_PATH]

export const refreshTokenRequest = async ({
  isB2B = false,
}: { isB2B?: boolean } = {}): Promise<RefreshTokenResponse | undefined> => {
  let result: RefreshTokenResponse | undefined

  for (const path of getRefreshTokenPaths(isB2B)) {
    result = await fetchWithRetry(getRefreshTokenUrl(path), {
      credentials: 'include',
      headers: getRefreshTokenHeaders(),
      body: JSON.stringify({}),
      method: 'POST',
    })

    if (isRefreshTokenSuccessful(result)) break
  }

  return result
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
