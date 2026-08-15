const MAX_BACKOFF_EXPONENT = 8
const TOO_MANY_REQUESTS = 429

/** Mirrors SWR's `RevalidatorOptions`. */
type RetryOptions = { retryCount: number; dedupe?: boolean }

/** Mirrors the subset of SWR's resolved config that the retry policy reads. */
type RetryConfig = { errorRetryCount?: number; errorRetryInterval: number }

/**
 * SWR retry policy: never retry an upstream rate limit, retry everything else
 * exactly as SWR would.
 *
 * A 429 means an upstream is already shedding load, so retrying multiplies the
 * traffic it is trying to reject. Providing `onErrorRetry` replaces SWR's
 * default implementation entirely, so the fall-through branch mirrors
 * swr@2.4.0's default (ceiling check plus jittered exponential backoff) to keep
 * every other status behaving as it did before. Revisit on an SWR upgrade.
 */
export const onErrorRetry = (
  error: unknown,
  _key: string,
  config: RetryConfig,
  revalidate: (opts: RetryOptions) => void,
  opts: RetryOptions
) => {
  if (
    (error as { status?: number } | undefined)?.status === TOO_MANY_REQUESTS
  ) {
    return
  }

  const maxRetryCount = config.errorRetryCount
  const { retryCount } = opts

  const timeout =
    ~~(
      (Math.random() + 0.5) *
      (1 << Math.min(retryCount, MAX_BACKOFF_EXPONENT))
    ) * config.errorRetryInterval

  if (maxRetryCount !== undefined && retryCount > maxRetryCount) {
    return
  }

  setTimeout(revalidate, timeout, opts)
}
