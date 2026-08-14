import { onErrorRetry } from '../../../src/sdk/graphql/retryPolicy'

const ERROR_RETRY_INTERVAL = 5000

const createConfig = (overrides: Record<string, unknown> = {}) =>
  ({
    errorRetryCount: 3,
    errorRetryInterval: ERROR_RETRY_INTERVAL,
    ...overrides,
  }) as never

// The client throws the object built by `baseRequest` in `request.ts`, which
// carries the HTTP status — not an Error instance.
const clientError = (status?: number) =>
  ({ status, message: 'upstream failure' }) as never

const runRetry = ({
  error,
  retryCount = 0,
  config = createConfig(),
}: {
  error: unknown
  retryCount?: number
  config?: never
}) => {
  const revalidate = jest.fn()

  onErrorRetry(error as never, 'a-key', config, revalidate, {
    retryCount,
    dedupe: false,
  })

  jest.runAllTimers()

  return revalidate
}

describe('useQuery retry policy', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    // Pins SWR's jitter so the backoff assertions are deterministic.
    jest.spyOn(Math, 'random').mockReturnValue(0.5)
  })

  afterEach(() => {
    jest.useRealTimers()
    jest.restoreAllMocks()
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
      const setTimeoutSpy = jest.spyOn(globalThis, 'setTimeout')
      const revalidate = jest.fn()

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
    const setTimeoutSpy = jest.spyOn(globalThis, 'setTimeout')
    const revalidate = jest.fn()

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
