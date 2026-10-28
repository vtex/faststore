/**
 * data-plane endpoints and settings for the runtime CSP mechanism.
 *
 * Mirrors `password-protection/webops-api.ts`. Runs on the Edge runtime (v3
 * middleware): only Web APIs and literal `process.env.X` reads are allowed here.
 */

/** Defaults for the settings client (see specs/csp-runtime-policy.md). */
export const CSP_SETTINGS_DEFAULTS = {
  ttlMs: 60_000,
  staleMs: 600_000,
  timeoutMs: 500,
} as const

export interface CspSettingsTimings {
  /** How long a fetched record is served without a new request. */
  ttlMs: number
  /** How long a record is served after the TTL while refreshes fail. */
  staleMs: number
  /** Upper bound for one data-plane call. */
  timeoutMs: number
}

/** Same default as `WEBOPS_API_URL` (see password-protection/webops-api.ts). */
export const DEFAULT_DATA_PLANE_ORIGIN = 'https://faststore.vtex.com'

/**
 * Origin of the data-plane API: `DATA_PLANE_API_URL` when set and not blank,
 * else `DEFAULT_DATA_PLANE_ORIGIN`. Trims, strips trailing slashes and
 * defaults the scheme to `https://`, like `WEBOPS_API_URL`.
 */
export function dataPlaneOrigin(): string {
  const hostFromEnv = process.env.DATA_PLANE_API_URL?.trim() ?? ''
  const hostWithoutTrailingSlash = hostFromEnv.replace(/\/+$/, '')
  const origin =
    hostWithoutTrailingSlash.length > 0
      ? hostWithoutTrailingSlash
      : DEFAULT_DATA_PLANE_ORIGIN

  return /^https?:\/\//i.test(origin) ? origin : `https://${origin}`
}

/**
 * `GET {DATA_PLANE_API_URL}/api/v1/csp/settings?storeId={storeId}`
 *
 * - 200: `CspSettings` JSON
 * - 404: no record, treated as `mode: off`
 * - other: failure, the caller fails open
 */
export function cspSettingsUrl(storeId: string): URL {
  const url = new URL('/api/v1/csp/settings', dataPlaneOrigin())
  url.searchParams.set('storeId', storeId)

  return url
}

function parseDuration(
  value: string | undefined,
  fallback: number,
  min: number
): number {
  const trimmed = value?.trim() ?? ''

  if (trimmed.length === 0) {
    return fallback
  }

  const parsed = Number(trimmed)

  return Number.isFinite(parsed) && parsed >= min ? parsed : fallback
}

/** Reads the cache and timeout settings from env, with the spec defaults. */
export function cspSettingsTimings(): CspSettingsTimings {
  return {
    ttlMs: parseDuration(
      process.env.CSP_SETTINGS_TTL_MS,
      CSP_SETTINGS_DEFAULTS.ttlMs,
      0
    ),
    staleMs: parseDuration(
      process.env.CSP_SETTINGS_STALE_MS,
      CSP_SETTINGS_DEFAULTS.staleMs,
      0
    ),
    timeoutMs: parseDuration(
      process.env.CSP_SETTINGS_TIMEOUT_MS,
      CSP_SETTINGS_DEFAULTS.timeoutMs,
      1
    ),
  }
}
