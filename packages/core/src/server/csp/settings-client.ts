import {
  type CspMode,
  type CspSettings,
  cspSettingsTimeouts,
  cspSettingsUrl,
} from './data-plane-api'

/**
 * Reads per-account CSP settings from `data-plane` through an in-memory cache.
 *
 * - age < ttl              → cached record
 * - age < ttl + stale      → cached record, refreshed in the background
 * - miss / error / timeout → null (fail open: no CSP header)
 *
 * A 404 is a valid answer ("no record") and is cached like a record. A failed
 * call, a non-2xx status, a timeout or a malformed body never replaces the
 * last known good record; it is served until the stale window ends.
 *
 * Uses only Web APIs (fetch, URL, AbortSignal.timeout) so the same module runs
 * on the v3 Edge runtime and the v4 Node runtime.
 */

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

/**
 * After a failed call, no new call starts for the same store for this long,
 * so an outage does not turn every request into an outbound call. Each call
 * is already bounded by the short `timeoutMs`.
 */
export const FAILURE_RETRY_MS = 60_000

const LOG_PREFIX = '[CSP]'
const CSP_MODES: readonly CspMode[] = ['off', 'report-only', 'enforce']

interface CacheEntry {
  /** `null` when data-plane has no record for the store (404). */
  settings: CspSettings | null
  fetchedAt: number
}

interface StoreState {
  entry: CacheEntry | null
  inFlight: Promise<void> | null
  retryAt: number
}

type FetchResult =
  | { ok: true; settings: CspSettings | null }
  | { ok: false; reason: string }

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isMode(value: unknown): value is CspMode {
  return typeof value === 'string' && CSP_MODES.includes(value as CspMode)
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

/**
 * Checks the shape of a settings record and returns a normalized copy, or
 * `null` when the record is malformed. Source values are validated later by
 * the policy builder, which drops invalid entries one by one.
 */
export function parseCspSettings(
  body: unknown,
  storeId: string
): CspSettings | null {
  if (!isPlainObject(body)) {
    return null
  }

  if (
    body.schemaVersion !== 1 ||
    body.storeId !== storeId ||
    !isMode(body.mode)
  ) {
    return null
  }

  const settings: CspSettings = {
    schemaVersion: 1,
    storeId,
    mode: body.mode,
    // Informational fields. A missing value does not invalidate the record.
    updatedAt: typeof body.updatedAt === 'string' ? body.updatedAt : '',
    version: typeof body.version === 'number' ? body.version : 0,
  }

  if (body.frameAncestors != null) {
    const { frameAncestors } = body

    if (!isPlainObject(frameAncestors)) {
      return null
    }

    const { mode, sources } = frameAncestors

    if (mode != null && !isMode(mode)) {
      return null
    }

    if (sources != null && !isStringArray(sources)) {
      return null
    }

    settings.frameAncestors = {
      sources: isStringArray(sources) ? [...sources] : [],
    }

    if (isMode(mode)) {
      settings.frameAncestors.mode = mode
    }
  }

  if (body.extraSources != null) {
    const { extraSources } = body

    if (!isPlainObject(extraSources)) {
      return null
    }

    const copy: Record<string, string[]> = {}

    for (const directive of Object.keys(extraSources)) {
      const sources = extraSources[directive]

      if (!isStringArray(sources)) {
        return null
      }

      copy[directive] = [...sources]
    }

    settings.extraSources = copy as CspSettings['extraSources']
  }

  if (body.reportEndpoint != null) {
    if (typeof body.reportEndpoint !== 'string') {
      return null
    }

    settings.reportEndpoint = body.reportEndpoint
  }

  return settings
}

function describeError(error: unknown): string {
  if (error instanceof Error) {
    return error.name === 'TimeoutError' || error.name === 'AbortError'
      ? 'request timed out'
      : `${error.name}: ${error.message}`
  }

  return String(error)
}

function discardBody(response: Response): void {
  try {
    response.body?.cancel().catch(() => {})
  } catch {
    // Nothing to release.
  }
}

export function createSettingsClient(
  opts: SettingsClientOptions = {}
): SettingsClient {
  const fromEnv = cspSettingsTimeouts()
  const ttlMs = Math.max(0, opts.ttlMs ?? fromEnv.ttlMs)
  const staleMs = Math.max(0, opts.staleMs ?? fromEnv.staleMs)
  const timeoutMs = opts.timeoutMs ?? fromEnv.timeoutMs
  // Resolve the global fetch on each call: keeps tests able to stub it and
  // avoids "Illegal invocation" from a detached fetch reference.
  const fetchImpl: typeof fetch =
    opts.fetchImpl ?? ((input, init) => fetch(input, init))

  const stores = new Map<string, StoreState>()
  let outageLogged = false

  function stateFor(storeId: string): StoreState {
    let state = stores.get(storeId)

    if (!state) {
      state = { entry: null, inFlight: null, retryAt: 0 }
      stores.set(storeId, state)
    }

    return state
  }

  function isUsable(entry: CacheEntry | null, now: number): boolean {
    return entry !== null && now - entry.fetchedAt < ttlMs + staleMs
  }

  async function fetchSettings(storeId: string): Promise<FetchResult> {
    let response: Response

    try {
      response = await fetchImpl(cspSettingsUrl(storeId), {
        headers: { accept: 'application/json' },
        signal: AbortSignal.timeout(timeoutMs),
      })
    } catch (error) {
      return { ok: false, reason: describeError(error) }
    }

    if (response.status === 404) {
      discardBody(response)
      return { ok: true, settings: null }
    }

    if (!response.ok) {
      discardBody(response)
      return { ok: false, reason: `data-plane returned ${response.status}` }
    }

    let body: unknown

    try {
      body = await response.json()
    } catch (error) {
      return { ok: false, reason: `invalid body (${describeError(error)})` }
    }

    const settings = parseCspSettings(body, storeId)

    if (!settings) {
      return { ok: false, reason: 'malformed settings record' }
    }

    return { ok: true, settings }
  }

  function refresh(storeId: string, state: StoreState): Promise<void> {
    if (state.inFlight) {
      return state.inFlight
    }

    if (Date.now() < state.retryAt) {
      return Promise.resolve()
    }

    const inFlight = fetchSettings(storeId)
      .then((result) => {
        // Compare with `false` explicitly: the core tsconfig is not strict,
        // so truthiness does not narrow the union.
        if (result.ok === false) {
          state.retryAt = Date.now() + FAILURE_RETRY_MS

          if (!outageLogged) {
            outageLogged = true
            console.warn(
              `${LOG_PREFIX} could not read settings for ${storeId}: ${result.reason}. Serving cached settings while within the stale window, then no CSP header.`
            )
          }

          return
        }

        state.entry = { settings: result.settings, fetchedAt: Date.now() }
        state.retryAt = 0

        if (outageLogged) {
          outageLogged = false
          console.info(`${LOG_PREFIX} settings for ${storeId} recovered`)
        }
      })
      .catch(() => {
        // fetchSettings never rejects; this only guards the bookkeeping above.
      })
      .then(() => {
        state.inFlight = null
      })

    state.inFlight = inFlight

    return inFlight
  }

  return {
    async get(storeId: string): Promise<CspSettings | null> {
      try {
        const state = stateFor(storeId)
        const { entry } = state
        const now = Date.now()

        if (entry && now - entry.fetchedAt < ttlMs) {
          return entry.settings
        }

        if (isUsable(entry, now)) {
          // Stale: answer now, refresh in the background. refresh() never
          // rejects, so the floating promise is safe.
          void refresh(storeId, state)
          return entry!.settings
        }

        await refresh(storeId, state)

        const latest = state.entry

        // A new entry was stored by this refresh: use it even when both
        // windows are 0 (cache disabled).
        if (latest && (latest !== entry || isUsable(latest, Date.now()))) {
          return latest.settings
        }

        return null
      } catch {
        return null
      }
    },
  }
}
