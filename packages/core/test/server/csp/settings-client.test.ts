/// <reference types="next" />

import { createSettingsClient } from '../../../src/server/csp/settings-client'
import type { SettingsClientOptions } from '../../../src/server/csp/settings-client'

const ORIGIN = 'https://data-plane.example.com'
const STORE_ID = 'mystore'
const TTL_MS = 60_000
const STALE_MS = 600_000

type FetchMock = jest.Mock<ReturnType<typeof fetch>, Parameters<typeof fetch>>

function record(overrides: Record<string, unknown> = {}) {
  return {
    schemaVersion: 1,
    storeId: STORE_ID,
    mode: 'report-only',
    extraSources: { 'connect-src': ['https://cdn.example.com'] },
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

/** Flushes the background refresh started by `get()`. */
function flush(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0))
}

describe('createSettingsClient', () => {
  const originalOrigin = process.env.DATA_PLANE_API_URL
  let now: number
  let fetchImpl: FetchMock
  let warnSpy: jest.SpyInstance

  function client(opts: SettingsClientOptions = {}) {
    return createSettingsClient({
      ttlMs: TTL_MS,
      staleMs: STALE_MS,
      timeoutMs: 500,
      fetchImpl,
      ...opts,
    })
  }

  beforeEach(() => {
    process.env.DATA_PLANE_API_URL = ORIGIN
    now = 1_000_000
    jest.spyOn(Date, 'now').mockImplementation(() => now)
    fetchImpl = jest.fn()
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined)
    jest.spyOn(console, 'info').mockImplementation(() => undefined)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  afterAll(() => {
    if (originalOrigin === undefined) {
      delete process.env.DATA_PLANE_API_URL
    } else {
      process.env.DATA_PLANE_API_URL = originalOrigin
    }
  })

  it('reads the record from data-plane for the store', async () => {
    fetchImpl.mockResolvedValue(jsonResponse(record()))

    const settings = await client().get(STORE_ID)

    expect(settings).toEqual(record())
    expect(fetchImpl).toHaveBeenCalledTimes(1)

    const [url, init] = fetchImpl.mock.calls[0]
    expect(String(url)).toBe(
      `${ORIGIN}/api/v1/csp/settings?storeId=${STORE_ID}`
    )
    expect(init?.signal).toBeInstanceOf(AbortSignal)
  })

  it('serves a cache hit within the TTL without a request', async () => {
    fetchImpl.mockResolvedValue(jsonResponse(record()))
    const settingsClient = client()

    const first = await settingsClient.get(STORE_ID)
    now += TTL_MS - 1
    const second = await settingsClient.get(STORE_ID)

    expect(second).toBe(first)
    expect(fetchImpl).toHaveBeenCalledTimes(1)
  })

  it('serves a stale record at once and refreshes it in the background', async () => {
    fetchImpl.mockResolvedValueOnce(jsonResponse(record({ version: 1 })))
    const settingsClient = client()
    await settingsClient.get(STORE_ID)

    let resolveRefresh: (response: Response) => void = () => undefined
    fetchImpl.mockReturnValueOnce(
      new Promise<Response>((resolve) => {
        resolveRefresh = resolve
      })
    )
    now += TTL_MS + 1

    const stale = await settingsClient.get(STORE_ID)

    expect(stale?.version).toBe(1)
    expect(fetchImpl).toHaveBeenCalledTimes(2)

    resolveRefresh(jsonResponse(record({ version: 2 })))
    await flush()

    const refreshed = await settingsClient.get(STORE_ID)

    expect(refreshed?.version).toBe(2)
    expect(fetchImpl).toHaveBeenCalledTimes(2)
  })

  it('keeps serving the last good record on errors until the stale window ends', async () => {
    fetchImpl.mockResolvedValueOnce(jsonResponse(record()))
    const settingsClient = client()
    const good = await settingsClient.get(STORE_ID)

    fetchImpl.mockResolvedValue(jsonResponse({ message: 'down' }, 503))

    now += TTL_MS + 1
    expect(await settingsClient.get(STORE_ID)).toBe(good)
    await flush()

    now += TTL_MS + 1
    expect(await settingsClient.get(STORE_ID)).toBe(good)
    await flush()

    now = 1_000_000 + TTL_MS + STALE_MS + 1
    expect(await settingsClient.get(STORE_ID)).toBeNull()
    expect(warnSpy).toHaveBeenCalledTimes(1)
    expect(warnSpy.mock.calls[0][0]).toContain('data-plane returned 503')
  })

  it('returns null when the call times out', async () => {
    jest.spyOn(Date, 'now').mockRestore()
    fetchImpl.mockImplementation(
      (_url, init) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () =>
            reject(init.signal?.reason)
          )
        })
    )

    const startedAt = performance.now()
    const settings = await client({ timeoutMs: 20 }).get(STORE_ID)
    const elapsed = performance.now() - startedAt

    expect(settings).toBeNull()
    expect(elapsed).toBeLessThan(1_000)
    expect(warnSpy.mock.calls[0][0]).toContain('timed out after 20 ms')
  })

  it('returns null on a non-2xx response and retries only after 60 seconds, whatever the TTL', async () => {
    fetchImpl.mockResolvedValue(jsonResponse({}, 500))
    const settingsClient = client({ ttlMs: 1_000, staleMs: 0 })

    expect(await settingsClient.get(STORE_ID)).toBeNull()
    now += 60_000 - 1
    expect(await settingsClient.get(STORE_ID)).toBeNull()
    expect(fetchImpl).toHaveBeenCalledTimes(1)

    now += 2
    fetchImpl.mockResolvedValue(jsonResponse(record()))
    expect(await settingsClient.get(STORE_ID)).toEqual(record())
    expect(fetchImpl).toHaveBeenCalledTimes(2)
  })

  it('treats 404 as "no record" and caches it for the TTL without logging', async () => {
    fetchImpl.mockResolvedValue(new Response('not found', { status: 404 }))
    const settingsClient = client()

    expect(await settingsClient.get(STORE_ID)).toBeNull()
    now += TTL_MS - 1
    expect(await settingsClient.get(STORE_ID)).toBeNull()
    expect(fetchImpl).toHaveBeenCalledTimes(1)
    expect(warnSpy).not.toHaveBeenCalled()
  })

  it('lets a 404 replace a stale record (record deleted)', async () => {
    fetchImpl.mockResolvedValueOnce(jsonResponse(record()))
    const settingsClient = client()
    await settingsClient.get(STORE_ID)

    fetchImpl.mockResolvedValueOnce(new Response('', { status: 404 }))
    now += TTL_MS + 1
    await settingsClient.get(STORE_ID)
    await flush()

    expect(await settingsClient.get(STORE_ID)).toBeNull()
  })

  it.each([
    ['invalid JSON', () => new Response('{not json', { status: 200 })],
    ['a JSON array', () => jsonResponse([record()])],
    [
      'an unknown schemaVersion',
      () => jsonResponse(record({ schemaVersion: 2 })),
    ],
    ['another storeId', () => jsonResponse(record({ storeId: 'other' }))],
    ['an unknown mode', () => jsonResponse(record({ mode: 'block' }))],
    [
      'extraSources with a non-list value',
      () =>
        jsonResponse(
          record({ extraSources: { 'script-src': 'https://x.example.com' } })
        ),
    ],
    [
      'frameAncestors without sources',
      () => jsonResponse(record({ frameAncestors: { mode: 'enforce' } })),
    ],
    [
      'an invalid frameAncestors.mode',
      () =>
        jsonResponse(record({ frameAncestors: { mode: 'on', sources: [] } })),
    ],
    [
      'a non-string reportEndpoint',
      () => jsonResponse(record({ reportEndpoint: 42 })),
    ],
  ])('returns null for a malformed body: %s', async (_label, response) => {
    fetchImpl.mockResolvedValue(response())

    expect(await client().get(STORE_ID)).toBeNull()
    expect(warnSpy.mock.calls[0][0]).toContain('could not read CSP settings')
  })

  it('returns null when fetch throws', async () => {
    fetchImpl.mockRejectedValue(new TypeError('fetch failed'))

    expect(await client().get(STORE_ID)).toBeNull()
    expect(warnSpy.mock.calls[0][0]).toContain('fetch failed')
  })

  it('shares one in-flight request between concurrent calls', async () => {
    fetchImpl.mockResolvedValue(jsonResponse(record()))
    const settingsClient = client()

    const results = await Promise.all([
      settingsClient.get(STORE_ID),
      settingsClient.get(STORE_ID),
      settingsClient.get(STORE_ID),
    ])

    expect(fetchImpl).toHaveBeenCalledTimes(1)
    expect(results[1]).toBe(results[0])
    expect(results[2]).toBe(results[0])
  })

  it('logs once per outage and again after a recovery', async () => {
    fetchImpl.mockResolvedValue(jsonResponse({}, 502))
    const settingsClient = client({ ttlMs: 0, staleMs: 0 })

    await settingsClient.get(STORE_ID)
    now += 1
    await settingsClient.get(STORE_ID)
    expect(warnSpy).toHaveBeenCalledTimes(1)

    // Retry window (60 s) elapsed: this call succeeds, the next one fails again.
    fetchImpl.mockResolvedValueOnce(jsonResponse(record()))
    now += 60_000
    expect(await settingsClient.get(STORE_ID)).toEqual(record())
    now += 1
    await settingsClient.get(STORE_ID)
    expect(warnSpy).toHaveBeenCalledTimes(2)
  })

  describe('without DATA_PLANE_API_URL', () => {
    it.each([[undefined], [''], ['   ']])(
      'reads from the default WebOps origin (%p)',
      async (value) => {
        if (value === undefined) {
          delete process.env.DATA_PLANE_API_URL
        } else {
          process.env.DATA_PLANE_API_URL = value
        }
        fetchImpl.mockResolvedValue(jsonResponse(record()))

        expect(await client().get(STORE_ID)).toEqual(record())
        expect(String(fetchImpl.mock.calls[0][0])).toBe(
          `https://faststore.vtex.com/api/v1/csp/settings?storeId=${STORE_ID}`
        )
      }
    )
  })
})
