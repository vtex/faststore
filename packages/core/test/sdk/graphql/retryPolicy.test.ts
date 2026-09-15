import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { onErrorRetry } from '../../../src/sdk/graphql/retryPolicy'

const ERROR_RETRY_INTERVAL = 5000

type RetryConfig = Parameters<typeof onErrorRetry>[2]

const createConfig = (overrides: Partial<RetryConfig> = {}): RetryConfig => ({
  errorRetryCount: 3,
  errorRetryInterval: ERROR_RETRY_INTERVAL,
  ...overrides,
})

// The client throws the object built by `baseRequest` in `request.ts`, which
// carries the HTTP status — not an Error instance.
const clientError = (status?: number) => ({
  status,
  message: 'upstream failure',
})

const runRetry = ({
  error,
  retryCount = 0,
  config = createConfig(),
}: {
  error: unknown
  retryCount?: number
  config?: RetryConfig
}) => {
  const revalidate = vi.fn()

  onErrorRetry(error, 'a-key', config, revalidate, {
    retryCount,
    dedupe: false,
  })

  vi.runAllTimers()

  return revalidate
}

describe('useQuery retry policy', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    // Pins SWR's jitter so the backoff assertions are deterministic.
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
  })

  afterEach(() => {
    // `restoreAllMocks` must run first: the `setTimeout` spy is installed while
    // timers are faked, so restoring it after `useRealTimers` would put the
    // faked timer back onto `globalThis`.
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('never retries an upstream rate limit (429)', () => {
    expect(runRetry({ error: clientError(429) })).not.toHaveBeenCalled()
  })

  it('does not retry a 429 even on the first attempt of a fresh key', () => {
    const revalidate = runRetry({ error: clientError(429), retryCount: 0 })

    expect(revalidate).not.toHaveBeenCalled()
  })

  it.each([400, 401, 403, 404, 409, 422, 500, 502, 503])(
    'still retries status %i',
    (status) => {
      expect(runRetry({ error: clientError(status) })).toHaveBeenCalledTimes(1)
    }
  )

  it('still retries an error carrying no status (e.g. network failure)', () => {
    expect(runRetry({ error: clientError(undefined) })).toHaveBeenCalledTimes(1)
  })

  it('retries while at the errorRetryCount ceiling', () => {
    expect(
      runRetry({ error: clientError(500), retryCount: 3 })
    ).toHaveBeenCalledTimes(1)
  })

  it('stops retrying once errorRetryCount is exceeded', () => {
    expect(
      runRetry({ error: clientError(500), retryCount: 4 })
    ).not.toHaveBeenCalled()
  })

  it.each([
    [0, 1 * ERROR_RETRY_INTERVAL],
    [2, 4 * ERROR_RETRY_INTERVAL],
    [3, 8 * ERROR_RETRY_INTERVAL],
  ])(
    'mirrors SWR exponential backoff for retryCount %i',
    (retryCount, expectedTimeout) => {
      const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout')
      const revalidate = vi.fn()

      onErrorRetry(
        clientError(500),
        'a-key',
        createConfig({ errorRetryCount: 10 }),
        revalidate,
        { retryCount, dedupe: false }
      )

      expect(setTimeoutSpy).toHaveBeenCalledWith(
        revalidate,
        expectedTimeout,
        expect.objectContaining({ retryCount })
      )
    }
  )

  it('caps the backoff exponent at 8, as SWR does', () => {
    const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout')
    const revalidate = vi.fn()

    onErrorRetry(
      clientError(500),
      'a-key',
      createConfig({ errorRetryCount: 100 }),
      revalidate,
      { retryCount: 12, dedupe: false }
    )

    expect(setTimeoutSpy).toHaveBeenCalledWith(
      revalidate,
      256 * ERROR_RETRY_INTERVAL,
      expect.objectContaining({ retryCount: 12 })
    )
  })
})
