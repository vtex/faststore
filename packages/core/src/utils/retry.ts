export interface RetryOptions<T> {
  /**
   * Maximum number of retries after the initial attempt.
   * @default 5
   */
  attempts?: number
  /**
   * Delay between attempts, in milliseconds.
   * @default 500
   */
  delayMs?: number
  /**
   * Doubles the delay after each attempt, capped at `maxDelayMs`.
   * @default false
   */
  backoff?: boolean
  /**
   * Upper bound for the delay when `backoff` is enabled.
   * @default 3000
   */
  maxDelayMs?: number
  /**
   * Stops retrying once this predicate returns `true`. Defaults to "the value
   * is truthy".
   */
  until?: (value: T) => boolean
  /**
   * Aborts the retry loop early (e.g. on component unmount).
   */
  signal?: AbortSignal
}

// Repeatedly calls `fn` until `until` is satisfied or the retry budget is
// exhausted. Useful when a value is produced asynchronously by an external
// script (e.g. a cookie set by a pixel, or an endpoint that is not ready on
// the first call). Returns the last value produced, even when the budget runs
// out, so callers can decide how to handle the give-up case.
export async function retry<T>(
  fn: () => T | Promise<T>,
  {
    attempts = 5,
    delayMs = 500,
    backoff = false,
    maxDelayMs = 3000,
    until = Boolean,
    signal,
  }: RetryOptions<T> = {}
): Promise<T> {
  let value = await fn()
  let delay = delayMs
  let remaining = attempts

  while (!until(value) && remaining > 0 && !signal?.aborted) {
    await new Promise((resolve) => setTimeout(resolve, delay))

    if (signal?.aborted) {
      break
    }

    value = await fn()
    remaining -= 1

    if (backoff) {
      delay = Math.min(delay * 2, maxDelayMs)
    }
  }

  return value
}
