import { getCookie } from 'src/utils/getCookie'

const MAX_MOBILE_WIDTH = 768

// Name of the cookie that holds the anonymous user id used by the
// recommendation/personalization pixel.
const USER_ID_COOKIE = 'vtex-rec-user-id'

export function checkIsMobile(): boolean {
  if (globalThis.window === undefined) {
    return false
  }

  return globalThis.window.innerWidth <= MAX_MOBILE_WIDTH
}

export function getUserIdFromCookie(): string {
  return getCookie(USER_ID_COOKIE) ?? ''
}

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
