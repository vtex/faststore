import {
  ACCOUNT_PLACEHOLDER,
  type Baseline,
  CSP_DIRECTIVES,
  type CspDirective,
  DEFAULT_FRAME_ANCESTORS,
} from './baseline'
import type { CspMode, CspSettings } from './data-plane-api'

/**
 * Builds the CSP headers for one store from the framework baseline and the
 * per-account settings record.
 *
 * Pure and deterministic: the same inputs always give the same header strings.
 * The only side effect is the optional `warn` callback, called when data is
 * dropped or the policy is too large.
 */

export interface CspHeaders {
  'Reporting-Endpoints': string
  'Content-Security-Policy'?: string
  'Content-Security-Policy-Report-Only'?: string
}

export interface BuildCspHeadersOptions {
  /** Receives one message per build when entries are dropped. Defaults to `console.warn`. */
  warn?: (message: string) => void
}

export const DEFAULT_REPORT_ENDPOINT = 'https://endpointcsp.vtex.com/api/report'
export const REPORT_TO_GROUP = 'csp-endpoint'
/** Upper bound for each built CSP header value. */
export const MAX_CSP_HEADER_BYTES = 8192

const LOG_PREFIX = '[CSP]'

/** Keyword and scheme sources data may add. Everything else must be an https origin. */
const ALLOWED_KEYWORD_SOURCES: readonly string[] = [
  "'self'",
  "'none'",
  'data:',
  'blob:',
]

const HOST_LABEL = '[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?'
/**
 * `https://` origin with an optional single leading wildcard label and an
 * optional port. At least two labels after the wildcard, so `https://*.com`
 * is rejected. No path, query or fragment.
 */
const HTTPS_ORIGIN_RE = new RegExp(
  `^https://(?:\\*\\.)?${HOST_LABEL}(?:\\.${HOST_LABEL})+(?::(\\d{1,5}))?$`
)
/** VTEX account names are a single host label. */
const STORE_ID_RE = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i
/** Printable ASCII without characters that would break a CSP directive or a quoted string. */
const SAFE_REPORT_URL_RE = /^https:\/\/[\x21-\x7e]+$/
const UNSAFE_REPORT_URL_CHARS_RE = /[;,'"\\]/
const PRINTABLE_ASCII_RE = /^[\x20-\x7e]*$/

type HeaderName =
  | 'Content-Security-Policy'
  | 'Content-Security-Policy-Report-Only'

const HEADER_MODES: ReadonlyArray<[HeaderName, CspMode]> = [
  ['Content-Security-Policy', 'enforce'],
  ['Content-Security-Policy-Report-Only', 'report-only'],
]

function substituteAccount(source: string, storeId: string): string {
  return source.split(ACCOUNT_PLACEHOLDER).join(storeId)
}

/**
 * Returns the normalized source, or `null` when data is not allowed to add it.
 * Rejects `'unsafe-*'`, nonces, hashes, `http:` origins, scheme-only sources
 * and bare `*` by allowing only the shapes listed in the spec.
 */
export function normalizeDataSource(
  raw: string,
  storeId: string
): string | null {
  if (typeof raw !== 'string') {
    return null
  }

  const source = substituteAccount(raw.trim(), storeId).toLowerCase()

  if (ALLOWED_KEYWORD_SOURCES.includes(source)) {
    return source
  }

  const match = HTTPS_ORIGIN_RE.exec(source)

  if (!match) {
    return null
  }

  if (match[1] !== undefined && Number(match[1]) > 65535) {
    return null
  }

  return source
}

function appendUnique(target: string[], seen: Set<string>, source: string) {
  if (!seen.has(source)) {
    seen.add(source)
    target.push(source)
  }
}

/**
 * `'none'` means "no sources". Browsers ignore it next to other sources, so
 * it is dropped once data adds a source to a `'none'` directive.
 */
function withoutRedundantNone(sources: string[]): string[] {
  return sources.length > 1
    ? sources.filter((source) => source !== "'none'")
    : sources
}

function normalizeDataSources(
  label: string,
  sources: readonly string[] | undefined,
  storeId: string,
  rejected: string[]
): string[] {
  const accepted: string[] = []

  if (!Array.isArray(sources)) {
    return accepted
  }

  for (const raw of sources) {
    const source = normalizeDataSource(raw, storeId)

    if (source === null) {
      rejected.push(`${label}: ${JSON.stringify(raw)}`)
    } else {
      accepted.push(source)
    }
  }

  return accepted
}

function buildPolicyDirectives(
  baseline: Baseline,
  extraSources: CspSettings['extraSources'],
  storeId: string,
  rejected: string[]
): string[] {
  const extras: Partial<Record<CspDirective, string[]>> = {}

  if (extraSources) {
    for (const key of Object.keys(extraSources)) {
      if (!CSP_DIRECTIVES.includes(key as CspDirective)) {
        rejected.push(`${key}: unknown directive`)
        continue
      }

      const directive = key as CspDirective

      extras[directive] = normalizeDataSources(
        directive,
        extraSources[directive],
        storeId,
        rejected
      )
    }
  }

  return CSP_DIRECTIVES.map((directive) => {
    const sources: string[] = []
    const seen = new Set<string>()

    for (const source of baseline[directive]) {
      appendUnique(sources, seen, substituteAccount(source, storeId))
    }

    for (const source of extras[directive] ?? []) {
      appendUnique(sources, seen, source)
    }

    return `${directive} ${withoutRedundantNone(sources).join(' ')}`
  })
}

function buildFrameAncestorsDirective(
  frameAncestors: CspSettings['frameAncestors'],
  storeId: string,
  rejected: string[]
): string {
  const accepted = normalizeDataSources(
    'frame-ancestors',
    frameAncestors?.sources,
    storeId,
    rejected
  )
  const sources: string[] = []
  const seen = new Set<string>()

  // Data appends to the default and never replaces it (add-only rule).
  for (const source of DEFAULT_FRAME_ANCESTORS) {
    appendUnique(sources, seen, substituteAccount(source, storeId))
  }

  for (const source of accepted) {
    appendUnique(sources, seen, source)
  }

  return `frame-ancestors ${withoutRedundantNone(sources).join(' ')}`
}

function toReportUrl(endpoint: string, storeId: string): string | null {
  let url: URL

  try {
    url = new URL(endpoint)
  } catch {
    return null
  }

  if (
    url.protocol !== 'https:' ||
    url.username !== '' ||
    url.password !== '' ||
    url.hash !== ''
  ) {
    return null
  }

  url.searchParams.set('account', storeId)

  const href = url.href

  if (!SAFE_REPORT_URL_RE.test(href) || UNSAFE_REPORT_URL_CHARS_RE.test(href)) {
    return null
  }

  return href
}

function resolveReportUrl(
  reportEndpoint: string | undefined,
  storeId: string,
  rejected: string[]
): string {
  const custom = reportEndpoint?.trim()

  if (custom) {
    const url = toReportUrl(custom, storeId)

    if (url) {
      return url
    }

    rejected.push(`reportEndpoint: ${JSON.stringify(reportEndpoint)}`)
  }

  return toReportUrl(DEFAULT_REPORT_ENDPOINT, storeId) as string
}

export function buildCspHeaders(
  baseline: Baseline,
  settings: CspSettings,
  storeId: string,
  options: BuildCspHeadersOptions = {}
): CspHeaders | null {
  const warn = options.warn ?? ((message: string) => console.warn(message))
  const mode = settings.mode
  const frameAncestorsMode = settings.frameAncestors?.mode ?? mode

  if (mode === 'off' && frameAncestorsMode === 'off') {
    return null
  }

  if (typeof storeId !== 'string' || !STORE_ID_RE.test(storeId)) {
    warn(
      `${LOG_PREFIX} invalid store id ${JSON.stringify(storeId)}. No CSP header is sent.`
    )
    return null
  }

  const rejected: string[] = []
  const policyDirectives =
    mode === 'off'
      ? []
      : buildPolicyDirectives(
          baseline,
          settings.extraSources,
          storeId,
          rejected
        )
  const frameAncestorsDirective =
    frameAncestorsMode === 'off'
      ? null
      : buildFrameAncestorsDirective(settings.frameAncestors, storeId, rejected)
  const reportUrl = resolveReportUrl(settings.reportEndpoint, storeId, rejected)

  if (rejected.length > 0) {
    warn(
      `${LOG_PREFIX} dropped invalid entries from the settings of ${storeId}: ${rejected.join(', ')}`
    )
  }

  const reportingDirectives = [
    `report-uri ${reportUrl}`,
    `report-to ${REPORT_TO_GROUP}`,
  ]
  const headers: CspHeaders = {
    'Reporting-Endpoints': `${REPORT_TO_GROUP}="${reportUrl}"`,
  }
  let hasPolicy = false

  for (const [headerName, headerMode] of HEADER_MODES) {
    const directives: string[] = []

    if (mode === headerMode) {
      directives.push(...policyDirectives)
    }

    if (frameAncestorsMode === headerMode && frameAncestorsDirective) {
      directives.push(frameAncestorsDirective)
    }

    if (directives.length === 0) {
      continue
    }

    const value = directives.concat(reportingDirectives).join('; ')

    // Header values must be printable ASCII. The baseline is code and every
    // data part is validated, so this only guards future changes.
    if (!PRINTABLE_ASCII_RE.test(value)) {
      warn(
        `${LOG_PREFIX} ${headerName} for ${storeId} has non-ASCII characters. No CSP header is sent.`
      )
      return null
    }

    // ASCII only, so the string length is the byte length.
    if (value.length > MAX_CSP_HEADER_BYTES) {
      warn(
        `${LOG_PREFIX} ${headerName} for ${storeId} is ${value.length} bytes, above the ${MAX_CSP_HEADER_BYTES}-byte cap. No CSP header is sent.`
      )
      return null
    }

    headers[headerName] = value
    hasPolicy = true
  }

  return hasPolicy ? headers : null
}
