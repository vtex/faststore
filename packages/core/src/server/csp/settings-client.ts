/**
 * Reads per-account CSP settings from data-plane, with an in-memory cache.
 *
 * - Fresh for `ttlMs`: served from memory, no request.
 * - Stale for `staleMs` after that: served from memory while a background
 *   refresh runs. A failed refresh keeps the stale record.
 * - Past the stale window, or with nothing cached: the request waits for the
 *   fetch, bounded by `timeoutMs`, and gets `null` on any failure (fail open).
 * - After a failure, no new request starts for `FAILURE_RETRY_MS` (60 s).
 *   With the short `timeoutMs`, this bounds the latency a data-plane outage
 *   adds to page requests.
 *
 * Runs on the Edge runtime (v3 middleware): Web APIs only. The cache is module
 * state, so it lives per isolate.
 */

import type { CspDirective } from './baseline'
import { cspSettingsTimings, cspSettingsUrl } from './data-plane-api'

export type CspMode = 'off' | 'report-only' | 'enforce'

/** Record served by data-plane for one account. Absent record == `{ mode: 'off' }`. */
export interface CspSettings {
  schemaVersion: 1
  storeId: string
  mode: CspMode
  frameAncestors?: {
    /** Defaults to `mode`. */
    mode?: CspMode
    /** e.g. `["'self'", "https://{account}.myvtex.com"]` */
    sources: string[]
  }
  /** Appended to the baseline, per directive. */
  extraSources?: Partial<Record<CspDirective, string[]>>
  /** Default: https://endpointcsp.vtex.com/api/report */
  reportEndpoint?: string
  /** ISO 8601, informational. */
  updatedAt?: string
  /** Monotonic, informational. */
  version?: number
}

export interface SettingsClient {
  /** Never throws. `null` means "send no CSP header". */
  get(storeId: string): Promise<CspSettings | null>
}

export interface SettingsClientOptions {
  ttlMs?: number
  staleMs?: number
  timeoutMs?: number
  fetchImpl?: typeof fetch
}

const LOG_PREFIX = '[faststore][csp]'
const MODES: readonly CspMode[] = ['off', 'report-only', 'enforce']

/** After a failed call, no new call starts for the same store for this long. */
export const FAILURE_RETRY_MS = 60_000

interface CacheEntry {
  /** Last successful result. `null` means data-plane has no record (404). */
  value: CspSettings | null
  /** When `value` was fetched. `undefined` until a fetch succeeds. */
  fetchedAt?: number
  /** No new request starts before this time. */
  nextFetchAt: number
}

/** `value: null` means data-plane has no record. `reason` means failure. */
type FetchOutcome = { value: CspSettings | null } | { reason: string }

type ParseResult = { settings: CspSettings } | { error: string }

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isMode(value: unknown): value is CspMode {
  return typeof value === 'string' && MODES.indexOf(value as CspMode) !== -1
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

/**
 * Checks the shape of a data-plane record. Source values are not checked here:
 * the policy builder drops invalid sources one by one.
 */
function parseCspSettings(body: unknown, storeId: string): ParseResult {
  if (!isPlainObject(body)) {
    return { error: 'body is not an object' }
  }

  if (body.schemaVersion !== 1) {
    return { error: 'unsupported schemaVersion' }
  }

  if (body.storeId !== storeId) {
    return { error: 'storeId does not match the requested store' }
  }

  if (!isMode(body.mode)) {
    return { error: 'invalid mode' }
  }

  const settings: CspSettings = {
    schemaVersion: 1,
    storeId,
    mode: body.mode,
  }

  if (body.frameAncestors !== undefined) {
    const frameAncestors = body.frameAncestors

    if (!isPlainObject(frameAncestors)) {
      return { error: 'frameAncestors is not an object' }
    }

    const { mode, sources } = frameAncestors

    if (!isStringArray(sources)) {
      return { error: 'frameAncestors.sources is not a list of strings' }
    }

    settings.frameAncestors = { sources: sources.slice() }

    if (mode !== undefined) {
      if (!isMode(mode)) {
        return { error: 'invalid frameAncestors.mode' }
      }

      settings.frameAncestors.mode = mode
    }
  }

  if (body.extraSources !== undefined) {
    if (!isPlainObject(body.extraSources)) {
      return { error: 'extraSources is not an object' }
    }

    const extraSources: Record<string, string[]> = {}

    for (const directive of Object.keys(body.extraSources)) {
      const sources = body.extraSources[directive]

      if (!isStringArray(sources)) {
        return { error: `extraSources.${directive} is not a list of strings` }
      }

      extraSources[directive] = sources.slice()
    }

    settings.extraSources = extraSources
  }

  if (body.reportEndpoint !== undefined) {
    if (typeof body.reportEndpoint !== 'string') {
      return { error: 'reportEndpoint is not a string' }
    }

    settings.reportEndpoint = body.reportEndpoint
  }

  if (typeof body.updatedAt === 'string') {
    settings.updatedAt = body.updatedAt
  }

  if (typeof body.version === 'number') {
    settings.version = body.version
  }

  return { settings }
}

function describeError(error: unknown, timeoutMs: number): string {
  const { name, message } = (error ?? {}) as {
    name?: unknown
    message?: unknown
  }

  if (name === 'TimeoutError' || name === 'AbortError') {
    return `timed out after ${timeoutMs} ms`
  }

  return typeof message === 'string' && message.length > 0
    ? message
    : 'unknown error'
}

export function createSettingsClient(
  opts: SettingsClientOptions = {}
): SettingsClient {
  const timings = cspSettingsTimings()
  const ttlMs = opts.ttlMs ?? timings.ttlMs
  const staleMs = opts.staleMs ?? timings.staleMs
  const timeoutMs = opts.timeoutMs ?? timings.timeoutMs

  const cache = new Map<string, CacheEntry>()
  const inflight = new Map<string, Promise<CspSettings | null>>()
  let failing = false

  function isUsable(
    entry: CacheEntry | undefined,
    now: number
  ): entry is CacheEntry & { fetchedAt: number } {
    return (
      entry !== undefined &&
      entry.fetchedAt !== undefined &&
      now - entry.fetchedAt < ttlMs + staleMs
    )
  }

  async function fetchSettings(storeId: string): Promise<FetchOutcome> {
    try {
      // Resolve `fetch` per call so the global can be replaced (tests, runtimes).
      const fetchFn = opts.fetchImpl ?? fetch
      const res = await fetchFn(cspSettingsUrl(storeId), {
        headers: { accept: 'application/json' },
        signal: AbortSignal.timeout(timeoutMs),
      })

      if (res.status === 404) {
        return { value: null }
      }

      if (!res.ok) {
        return { reason: `data-plane returned ${res.status}` }
      }

      const parsed = parseCspSettings(await res.json(), storeId)

      if ('error' in parsed) {
        return { reason: `malformed record: ${parsed.error}` }
      }

      return { value: parsed.settings }
    } catch (error) {
      return { reason: describeError(error, timeoutMs) }
    }
  }

  function settle(storeId: string, outcome: FetchOutcome): CspSettings | null {
    const now = Date.now()

    if ('value' in outcome) {
      cache.set(storeId, {
        value: outcome.value,
        fetchedAt: now,
        nextFetchAt: now + ttlMs,
      })

      if (failing) {
        failing = false
        console.info(`${LOG_PREFIX} CSP settings for ${storeId} recovered`)
      }

      return outcome.value
    }

    const previous = cache.get(storeId)
    const usable = isUsable(previous, now)

    if (!failing) {
      failing = true
      console.warn(
        `${LOG_PREFIX} could not read CSP settings for ${storeId} (${outcome.reason}). ` +
          (usable
            ? 'Serving the last known settings until the stale window ends.'
            : 'Sending no CSP headers.')
      )
    }

    cache.set(storeId, {
      value: previous?.value ?? null,
      fetchedAt: previous?.fetchedAt,
      nextFetchAt: now + FAILURE_RETRY_MS,
    })

    return usable ? previous.value : null
  }

  function refresh(storeId: string): Promise<CspSettings | null> {
    const pending = inflight.get(storeId)

    if (pending) {
      return pending
    }

    const promise = fetchSettings(storeId)
      .then((outcome) => settle(storeId, outcome))
      .catch(() => null)
      .finally(() => {
        inflight.delete(storeId)
      })

    inflight.set(storeId, promise)

    return promise
  }

  return {
    async get(storeId: string): Promise<CspSettings | null> {
      try {
        if (!storeId) {
          return null
        }

        const now = Date.now()
        const entry = cache.get(storeId)
        const usable = isUsable(entry, now)
        const cached = usable ? entry.value : null

        // Fresh, or backing off after a failure.
        if (entry !== undefined && now < entry.nextFetchAt) {
          return cached
        }

        // Stale but usable: answer now, refresh in the background.
        if (usable) {
          refresh(storeId)

          return cached
        }

        return await refresh(storeId)
      } catch {
        return null
      }
    },
  }
}
