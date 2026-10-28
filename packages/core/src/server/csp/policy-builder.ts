/**
 * Builds CSP headers from the framework baseline and per-account settings.
 *
 * Pure and deterministic: the same inputs always give the same header strings.
 * The only side effect is a warning log for data entries it drops.
 * Runs on the Edge runtime (v3 middleware): Web APIs only.
 */

import { ACCOUNT_PLACEHOLDER, CSP_DIRECTIVES } from './baseline'
import type { Baseline, CspDirective } from './baseline'
import type { CspMode, CspSettings } from './settings-client'

export const DEFAULT_REPORT_ENDPOINT = 'https://endpointcsp.vtex.com/api/report'
/** Group name shared by `Reporting-Endpoints` and `report-to`. */
export const REPORT_GROUP = 'csp-endpoint'
/** Upper bound for each CSP header value, in bytes. */
export const MAX_CSP_HEADER_BYTES = 8192

export interface CspHeaders {
  'Reporting-Endpoints': string
  'Content-Security-Policy'?: string
  'Content-Security-Policy-Report-Only'?: string
}

type PolicyHeaderName =
  | 'Content-Security-Policy'
  | 'Content-Security-Policy-Report-Only'

const POLICY_HEADERS: ReadonlyArray<
  [Exclude<CspMode, 'off'>, PolicyHeaderName]
> = [
  ['enforce', 'Content-Security-Policy'],
  ['report-only', 'Content-Security-Policy-Report-Only'],
]

const LOG_PREFIX = '[faststore][csp]'
const NONE = "'none'"

/** Keyword and scheme sources that data may add. */
const DATA_KEYWORD_SOURCES = ["'self'", NONE, 'data:', 'blob:']

/** DNS label: letters, digits and inner hyphens, up to 63 characters. */
const LABEL = '[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?'

/**
 * `https://` origin with an optional single leading wildcard label and an
 * optional port. At least two labels follow the wildcard, so `https://*.com`
 * is rejected.
 */
const HTTPS_ORIGIN = new RegExp(
  `^https://(?:\\*\\.)?${LABEL}(?:\\.${LABEL})+(?::\\d{1,5})?$`
)

/** VTEX account names are a single DNS label. */
const STORE_ID = new RegExp(`^${LABEL}$`, 'i')

/** Characters that would break the header syntax. */
const UNSAFE_HEADER_CHARS = /[\s;,"']/

const encoder = new TextEncoder()

function byteLength(value: string): number {
  return encoder.encode(value).length
}

/** Short, log-safe rendering of a value that came from data. */
function describe(value: unknown): string {
  return typeof value === 'string'
    ? JSON.stringify(value.slice(0, 100))
    : `<${typeof value}>`
}

function substituteAccount(source: string, account: string): string {
  return source.split(ACCOUNT_PLACEHOLDER).join(account)
}

/** Trims, lowercases, fills `{account}` and drops trailing slashes. */
function normalizeDataSource(source: string, account: string): string {
  return substituteAccount(source.trim().toLowerCase(), account).replace(
    /\/+$/,
    ''
  )
}

function isAllowedDataSource(source: string): boolean {
  return (
    DATA_KEYWORD_SOURCES.indexOf(source) !== -1 || HTTPS_ORIGIN.test(source)
  )
}

/**
 * Normalizes and validates sources that come from data. Invalid entries are
 * dropped and recorded in `dropped`.
 */
function validDataSources(
  sources: unknown,
  account: string,
  label: string,
  dropped: string[]
): string[] {
  if (!Array.isArray(sources)) {
    if (sources !== undefined) {
      dropped.push(`${label} ${describe(sources)}`)
    }

    return []
  }

  const valid: string[] = []

  for (const raw of sources) {
    const source =
      typeof raw === 'string' ? normalizeDataSource(raw, account) : ''

    if (isAllowedDataSource(source)) {
      valid.push(source)
    } else {
      dropped.push(`${label} ${describe(raw)}`)
    }
  }

  return valid
}

/**
 * Keeps the first occurrence of each source. `'none'` is dropped when other
 * sources are present, because browsers ignore it in that case.
 */
function dedupe(sources: readonly string[]): string[] {
  const unique: string[] = []

  for (const source of sources) {
    if (unique.indexOf(source) === -1) {
      unique.push(source)
    }
  }

  return unique.length > 1 ? unique.filter((source) => source !== NONE) : unique
}

function resolveReportEndpoint(
  candidate: string | undefined,
  storeId: string,
  dropped: string[]
): string {
  if (candidate !== undefined) {
    try {
      const url = new URL(candidate.trim())
      url.searchParams.set('account', storeId)
      const value = url.toString()

      if (
        url.protocol === 'https:' &&
        url.username === '' &&
        url.password === '' &&
        !UNSAFE_HEADER_CHARS.test(value)
      ) {
        return value
      }
    } catch {
      // Falls through to the default endpoint.
    }

    dropped.push(`reportEndpoint ${describe(candidate)}`)
  }

  const url = new URL(DEFAULT_REPORT_ENDPOINT)
  url.searchParams.set('account', storeId)

  return url.toString()
}

/**
 * Builds the headers for one account.
 *
 * Returns `null` when both `mode` and `frameAncestors.mode` are `off`, when
 * the store id is not a valid account name, or when a header would exceed
 * `MAX_CSP_HEADER_BYTES` (fail open).
 */
export function buildCspHeaders(
  baseline: Baseline,
  settings: CspSettings,
  storeId: string
): CspHeaders | null {
  const mode = settings.mode
  const frameAncestorsMode = settings.frameAncestors?.mode ?? mode

  if (mode === 'off' && frameAncestorsMode === 'off') {
    return null
  }

  if (typeof storeId !== 'string' || !STORE_ID.test(storeId)) {
    console.warn(
      `${LOG_PREFIX} invalid store id ${describe(storeId)}. Sending no CSP headers.`
    )

    return null
  }

  const account = storeId.toLowerCase()
  const dropped: string[] = []
  const extraSources: Partial<Record<string, unknown>> =
    settings.extraSources ?? {}

  for (const key of Object.keys(extraSources)) {
    if (CSP_DIRECTIVES.indexOf(key as CspDirective) === -1) {
      dropped.push(`extraSources.${key} (unknown directive)`)
    }
  }

  const directives = CSP_DIRECTIVES.map((directive) => {
    const base = baseline.directives[directive].map((source) =>
      substituteAccount(source, account)
    )
    const extra = validDataSources(
      extraSources[directive],
      account,
      `extraSources.${directive}`,
      dropped
    )

    return `${directive} ${dedupe(base.concat(extra)).join(' ')}`
  })

  const dataFrameAncestors = validDataSources(
    settings.frameAncestors?.sources,
    account,
    'frameAncestors.sources',
    dropped
  )
  // Data appends to the baseline and never replaces it (add-only rule).
  const frameAncestors = baseline.frameAncestors
    .map((source) => substituteAccount(source, account))
    .concat(dataFrameAncestors)
  const frameAncestorsDirective = `frame-ancestors ${dedupe(frameAncestors).join(' ')}`

  const reportEndpoint = resolveReportEndpoint(
    settings.reportEndpoint,
    storeId,
    dropped
  )

  if (dropped.length > 0) {
    console.warn(
      `${LOG_PREFIX} dropped invalid CSP settings entries for ${storeId}: ${dropped.join(', ')}`
    )
  }

  // `mode` drives the full policy. `frameAncestors.mode` drives
  // `frame-ancestors`. When they differ, each goes in its own header.
  const policies: Partial<Record<CspMode, string[]>> = {}

  if (mode !== 'off') {
    policies[mode] = directives
  }

  if (frameAncestorsMode !== 'off') {
    policies[frameAncestorsMode] = (policies[frameAncestorsMode] ?? []).concat(
      frameAncestorsDirective
    )
  }

  const reporting = [
    `report-uri ${reportEndpoint}`,
    `report-to ${REPORT_GROUP}`,
  ]
  const headers: CspHeaders = {
    'Reporting-Endpoints': `${REPORT_GROUP}="${reportEndpoint}"`,
  }

  for (const [policyMode, headerName] of POLICY_HEADERS) {
    const policy = policies[policyMode]

    if (!policy) {
      continue
    }

    const value = policy.concat(reporting).join('; ')
    const size = byteLength(value)

    if (size > MAX_CSP_HEADER_BYTES) {
      console.warn(
        `${LOG_PREFIX} ${headerName} for ${storeId} is ${size} bytes, over the ${MAX_CSP_HEADER_BYTES}-byte cap. Sending no CSP headers.`
      )

      return null
    }

    headers[headerName] = value
  }

  return headers
}
