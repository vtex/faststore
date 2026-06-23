interface RetryOptions {
  retries?: number
  delayMs?: number
}

// Repeatedly calls `fn` until it returns a truthy value or the retry budget
// is exhausted. Useful when a value (e.g. a cookie) is set asynchronously by
// an external script.
export async function getWithRetry<T>(
  fn: () => T,
  { retries = 5, delayMs = 500 }: RetryOptions = {}
): Promise<T> {
  let value = fn()
  let attempts = 0

  while (!value && attempts < retries) {
    await new Promise((resolve) => setTimeout(resolve, delayMs))
    value = fn()
    attempts += 1
  }

  return value
}
