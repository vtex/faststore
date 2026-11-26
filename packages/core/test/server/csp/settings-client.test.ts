import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type Mock,
} from 'vitest'

import type { CspSettings } from '../../../src/server/csp/data-plane-api'

const STORE_ID = 'test-store'
const ORIGIN = 'https://data-plane.example.com'
const T0 = new Date('2026-10-27T12:00:00.000Z').getTime()

const ENV_KEYS = [
  'DATA_PLANE_API_URL',
  'CSP_SETTINGS_TTL_MS',
  'CSP_SETTINGS_STALE_MS',
  'CSP_SETTINGS_TIMEOUT_MS',
] as const

const originalEnv = Object.fromEntries(
  ENV_KEYS.map((key) => [key, process.env[key]])
)

function record(overrides: Partial<CspSettings> = {}): CspSettings {
  return {
    schemaVersion: 1,
    storeId: STORE_ID,
    mode: 'report-only',
    updatedAt: '2026-10-26T00:00:00.000Z',
    version: 1,
    ...overrides,
  }
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

/** Loads a fresh module so the once-per-outage log state starts unset. */
async function loadModule() {
  vi.resetModules()
  return import('../../../src/server/csp/settings-client')
}

function at(offsetMs: number): void {
  vi.setSystemTime(T0 + offsetMs)
}

describe('createSettingsClient', () => {
  let fetchMock: Mock<typeof fetch>
  let warnSpy: ReturnType<typeof vi.spyOn>
  let infoSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    for (const key of ENV_KEYS) {
      delete process.env[key]
    }
    process.env.DATA_PLANE_API_URL = ORIGIN
    // Only Date is faked: AbortSignal.timeout and setTimeout stay real.
    vi.useFakeTimers({ toFake: ['Date'] })
    at(0)
    fetchMock = vi.fn<typeof fetch>()
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
    for (const key of ENV_KEYS) {
      if (originalEnv[key] == null) {
        delete process.env[key]
      } else {
        process.env[key] = originalEnv[key]
      }
    }
  })

  async function client(
    opts: Parameters<
      Awaited<ReturnType<typeof loadModule>>['createSettingsClient']
    >[0] = {}
  ) {
    const { createSettingsClient } = await loadModule()
    return createSettingsClient({ fetchImpl: fetchMock, ...opts })
  }

  describe('DATA_PLANE_API_URL', () => {
    it.each([[undefined], ['   ']])(
      'reads from the default WebOps origin when the variable is %j',
      async (value) => {
        if (value === undefined) {
          delete process.env.DATA_PLANE_API_URL
        } else {
          process.env.DATA_PLANE_API_URL = value
        }
        fetchMock.mockResolvedValue(jsonResponse(record()))
        const settings = await client()

        expect(await settings.get(STORE_ID)).toEqual(record())
        expect(String(fetchMock.mock.calls[0][0])).toBe(
          `https://faststore.vtex.com/api/v1/csp/settings?storeId=${STORE_ID}`
        )
      }
    )
  })

  it('requests the settings record with a timeout signal', async () => {
    fetchMock.mockResolvedValue(jsonResponse(record()))
    const settings = await client()

    expect(await settings.get(STORE_ID)).toEqual(record())

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [input, init] = fetchMock.mock.calls[0]
    expect(String(input)).toBe(
      `${ORIGIN}/api/v1/csp/settings?storeId=${STORE_ID}`
    )
    expect(init?.signal).toBeInstanceOf(AbortSignal)
  })

  it('serves the cached record within the TTL (cache hit)', async () => {
    fetchMock.mockResolvedValue(jsonResponse(record()))
    const settings = await client()

    const first = await settings.get(STORE_ID)
    at(59_999)
    const second = await settings.get(STORE_ID)

    expect(second).toBe(first)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('serves the stale record after the TTL and refreshes it in the background', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(record({ version: 1 })))
      .mockResolvedValueOnce(
        jsonResponse(record({ mode: 'enforce', version: 2 }))
      )
    const settings = await client()

    await settings.get(STORE_ID)
    at(60_001)

    expect((await settings.get(STORE_ID))?.version).toBe(1)
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2))
    await vi.waitFor(async () =>
      expect((await settings.get(STORE_ID))?.version).toBe(2)
    )
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('serves the last known good record on error until the stale window ends', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(record()))
      .mockRejectedValue(new TypeError('fetch failed'))
    const settings = await client()

    await settings.get(STORE_ID)

    at(60_001)
    expect(await settings.get(STORE_ID)).toEqual(record())
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2))

    at(60_000 + 599_999)
    expect(await settings.get(STORE_ID)).toEqual(record())

    at(60_000 + 600_000)
    expect(await settings.get(STORE_ID)).toBeNull()
  })

  it('returns null on a non-2xx status', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ message: 'down' }, 503))
    const settings = await client()

    expect(await settings.get(STORE_ID)).toBeNull()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('503'))
  })

  it('treats 404 as "no record" and caches it', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ message: 'not found' }, 404))
    const settings = await client()

    expect(await settings.get(STORE_ID)).toBeNull()
    at(30_000)
    expect(await settings.get(STORE_ID)).toBeNull()

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(warnSpy).not.toHaveBeenCalled()
  })

  it('drops a cached record when data-plane later answers 404 (rollback)', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(record({ mode: 'enforce' })))
      .mockResolvedValueOnce(jsonResponse({}, 404))
    const settings = await client()

    expect((await settings.get(STORE_ID))?.mode).toBe('enforce')
    at(60_001)
    await settings.get(STORE_ID)
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2))

    await vi.waitFor(async () =>
      expect(await settings.get(STORE_ID)).toBeNull()
    )
  })

  it('returns null when the call times out', async () => {
    fetchMock.mockImplementation(
      (_input, init) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () =>
            reject(init.signal?.reason)
          )
        })
    )
    const settings = await client({ timeoutMs: 20 })
    const started = performance.now()

    expect(await settings.get(STORE_ID)).toBeNull()
    expect(performance.now() - started).toBeLessThan(1_000)
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('timed out'))
  })

  describe('malformed records', () => {
    it.each<[string, () => Response]>([
      ['invalid JSON', () => new Response('{not json', { status: 200 })],
      ['an array', () => jsonResponse([])],
      ['null', () => jsonResponse(null)],
      [
        'another schema version',
        () => jsonResponse(record({ schemaVersion: 2 as 1 })),
      ],
      [
        'another store id',
        () => jsonResponse(record({ storeId: 'other-store' })),
      ],
      ['an unknown mode', () => jsonResponse({ ...record(), mode: 'block' })],
      [
        'a non-object frameAncestors',
        () => jsonResponse({ ...record(), frameAncestors: "'self'" }),
      ],
      [
        'an unknown frameAncestors mode',
        () =>
          jsonResponse({
            ...record(),
            frameAncestors: { mode: 'on', sources: [] },
          }),
      ],
      [
        'non-array frameAncestors sources',
        () =>
          jsonResponse({ ...record(), frameAncestors: { sources: "'self'" } }),
      ],
      [
        'non-array extra sources',
        () =>
          jsonResponse({
            ...record(),
            extraSources: { 'connect-src': 'https://a.example.com' },
          }),
      ],
      [
        'non-string extra sources',
        () =>
          jsonResponse({ ...record(), extraSources: { 'connect-src': [1] } }),
      ],
      [
        'a non-string report endpoint',
        () => jsonResponse({ ...record(), reportEndpoint: 42 }),
      ],
    ])('returns null for %s', async (_label, response) => {
      fetchMock.mockImplementation(async () => response())
      const settings = await client()

      expect(await settings.get(STORE_ID)).toBeNull()
    })

    it('keeps the cached record when a refresh returns a malformed body', async () => {
      fetchMock
        .mockResolvedValueOnce(jsonResponse(record()))
        .mockResolvedValueOnce(jsonResponse({ garbage: true }))
      const settings = await client()

      await settings.get(STORE_ID)
      at(60_001)
      await settings.get(STORE_ID)
      await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2))

      expect(await settings.get(STORE_ID)).toEqual(record())
    })

    it('returns a normalized copy without unknown fields', async () => {
      fetchMock.mockResolvedValue(
        jsonResponse({
          schemaVersion: 1,
          storeId: STORE_ID,
          mode: 'enforce',
          frameAncestors: { sources: ["'self'"] },
          extraSources: { 'connect-src': ['https://a.example.com'] },
          unknown: 'field',
        })
      )
      const settings = await client()

      expect(await settings.get(STORE_ID)).toEqual({
        schemaVersion: 1,
        storeId: STORE_ID,
        mode: 'enforce',
        frameAncestors: { sources: ["'self'"] },
        extraSources: { 'connect-src': ['https://a.example.com'] },
        updatedAt: '',
        version: 0,
      })
    })
  })

  it('shares one request between concurrent misses', async () => {
    let resolve: (response: Response) => void = () => {}
    fetchMock.mockReturnValue(
      new Promise<Response>((r) => {
        resolve = r
      })
    )
    const settings = await client()

    const pending = Promise.all([
      settings.get(STORE_ID),
      settings.get(STORE_ID),
      settings.get(STORE_ID),
    ])
    resolve(jsonResponse(record()))
    const results = await pending

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(results).toEqual([record(), record(), record()])
  })

  it('retries only 60 seconds after a failure, whatever the TTL', async () => {
    fetchMock.mockRejectedValue(new TypeError('fetch failed'))
    const settings = await client({ ttlMs: 1_000, staleMs: 0 })

    expect(await settings.get(STORE_ID)).toBeNull()
    at(59_999)
    expect(await settings.get(STORE_ID)).toBeNull()
    expect(fetchMock).toHaveBeenCalledTimes(1)

    at(60_000)
    expect(await settings.get(STORE_ID)).toBeNull()
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('never throws, even when fetch throws synchronously', async () => {
    fetchMock.mockImplementation(() => {
      throw new Error('boom')
    })
    const settings = await client()

    await expect(settings.get(STORE_ID)).resolves.toBeNull()
  })

  it('logs once per outage window', async () => {
    fetchMock
      .mockRejectedValueOnce(new TypeError('fetch failed'))
      .mockResolvedValueOnce(jsonResponse({}, 500))
      .mockResolvedValueOnce(jsonResponse(record()))
      .mockRejectedValueOnce(new TypeError('fetch failed'))
    const settings = await client({ ttlMs: 10_000, staleMs: 0 })

    await settings.get(STORE_ID)
    at(5_000)
    await settings.get(STORE_ID)
    expect(warnSpy).toHaveBeenCalledTimes(1)

    // Retry window (60 s) elapsed: a second failure extends the same outage.
    at(60_000)
    expect(await settings.get(STORE_ID)).toBeNull()
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(warnSpy).toHaveBeenCalledTimes(1)

    // Next retry window: this call succeeds.
    at(120_000)
    expect(await settings.get(STORE_ID)).toEqual(record())
    expect(infoSpy).toHaveBeenCalledTimes(1)

    // TTL elapsed: this call fails and opens a new outage window.
    at(130_000)
    await settings.get(STORE_ID)
    expect(warnSpy).toHaveBeenCalledTimes(2)
  })

  it('returns the fetched record when caching is disabled', async () => {
    fetchMock.mockImplementation(async () => jsonResponse(record()))
    const settings = await client({ ttlMs: 0, staleMs: 0 })

    expect(await settings.get(STORE_ID)).toEqual(record())
    expect(await settings.get(STORE_ID)).toEqual(record())
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('reads the TTL from CSP_SETTINGS_TTL_MS', async () => {
    process.env.CSP_SETTINGS_TTL_MS = '1000'
    fetchMock.mockImplementation(async () => jsonResponse(record()))
    const settings = await client()

    await settings.get(STORE_ID)
    at(999)
    await settings.get(STORE_ID)
    expect(fetchMock).toHaveBeenCalledTimes(1)

    at(1_000)
    await settings.get(STORE_ID)
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2))
  })

  it('reads the timeout from CSP_SETTINGS_TIMEOUT_MS', async () => {
    process.env.CSP_SETTINGS_TIMEOUT_MS = '20'
    fetchMock.mockImplementation(
      (_input, init) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () =>
            reject(init.signal?.reason)
          )
        })
    )
    const settings = await client()
    const started = performance.now()

    expect(await settings.get(STORE_ID)).toBeNull()
    expect(performance.now() - started).toBeLessThan(1_000)
  })
})
