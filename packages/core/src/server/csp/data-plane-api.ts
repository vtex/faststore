import type { CspDirective } from './baseline'

/**
 * Read contract for the per-account CSP settings served by `data-plane`.
 *
 * GET {DATA_PLANE_API_URL}/api/v1/csp/settings?storeId={storeId}
 *   200 → CspSettings JSON
 *   404 → no record (treated as `mode: off`)
 *   other → failure (fail open)
 *
 * The default origin is the WebOps origin, the same default `WEBOPS_API_URL`
 * has. `DATA_PLANE_API_URL` overrides it. The path is still open with the
 * `data-plane` team.
 *
 * Env vars are read with static `process.env.NAME` accesses on purpose. The
 * v3 Edge runtime only exposes env vars that are referenced statically.
 */

export type CspMode = 'off' | 'report-only' | 'enforce'

/** Record served by data-plane for one account. Absent record == `{ mode: 'off' }`. */
export interface CspSettings {
  schemaVersion: 1
  storeId: string
  mode: CspMode
  frameAncestors?: {
    /** Defaults to `mode`. */
    mode?: CspMode
    /** e.g. ["'self'", "https://{account}.myvtex.com"] */
    sources: string[]
  }
  /** Appended to the baseline, per directive. */
  extraSources?: Partial<Record<CspDirective, string[]>>
  /** Default: https://endpointcsp.vtex.com/api/report */
  reportEndpoint?: string
  /** ISO 8601, informational. */
  updatedAt: string
  /** Monotonic, informational. */
  version: number
}

export const CSP_SETTINGS_PATH = '/api/v1/csp/settings'

/** Same default as `WEBOPS_API_URL` (see password-protection/webops-api.ts). */
export const DEFAULT_DATA_PLANE_ORIGIN = 'https://faststore.vtex.com'

/** Defaults for the settings client. Overridable through env vars. */
export const cspSettingsDefaults = {
  /** Fresh window (`CSP_SETTINGS_TTL_MS`). */
  ttlMs: 60_000,
  /** Stale-on-error window, counted after the fresh window ends (`CSP_SETTINGS_STALE_MS`). */
  staleMs: 600_000,
  /** Per-call timeout (`CSP_SETTINGS_TIMEOUT_MS`). */
  timeoutMs: 500,
} as const

/**
 * Origin of the data-plane settings API: `DATA_PLANE_API_URL` when set and
 * not blank, else `DEFAULT_DATA_PLANE_ORIGIN`. Mirrors the `WEBOPS_API_URL`
 * handling: trims, strips trailing slashes and defaults the scheme to
 * `https://`.
 */
export function getDataPlaneOrigin(): string {
  const hostFromEnv = process.env.DATA_PLANE_API_URL?.trim() ?? ''
  const hostWithoutTrailingSlash = hostFromEnv.replace(/\/+$/, '')
  const origin =
    hostWithoutTrailingSlash.length > 0
      ? hostWithoutTrailingSlash
      : DEFAULT_DATA_PLANE_ORIGIN

  return /^https?:\/\//i.test(origin) ? origin : `https://${origin}`
}

/** URL of the settings record for one store. */
export function cspSettingsUrl(storeId: string): URL {
  const url = new URL(CSP_SETTINGS_PATH, getDataPlaneOrigin())
  url.searchParams.set('storeId', storeId)

  return url
}

function parseDuration(raw: string | undefined, fallback: number): number {
  const value = raw?.trim() ?? ''

  if (!/^\d+$/.test(value)) {
    return fallback
  }

  return Number(value)
}

/** Resolves TTL, stale window and timeout from env, with the spec defaults. */
export function cspSettingsTimeouts(): {
  ttlMs: number
  staleMs: number
  timeoutMs: number
} {
  const timeoutMs = parseDuration(
    process.env.CSP_SETTINGS_TIMEOUT_MS,
    cspSettingsDefaults.timeoutMs
  )

  return {
    ttlMs: parseDuration(
      process.env.CSP_SETTINGS_TTL_MS,
      cspSettingsDefaults.ttlMs
    ),
    staleMs: parseDuration(
      process.env.CSP_SETTINGS_STALE_MS,
      cspSettingsDefaults.staleMs
    ),
    // A zero timeout would abort every call. Fall back to the default.
    timeoutMs: timeoutMs > 0 ? timeoutMs : cspSettingsDefaults.timeoutMs,
  }
}
