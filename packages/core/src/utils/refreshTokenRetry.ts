export const REFRESH_RETRY_KEY = 'faststore_refresh_retry_count'
export const MAX_REFRESH_RETRIES = 3

export function clearRefreshFailureCount(): void {
  try {
    sessionStorage.removeItem(REFRESH_RETRY_KEY)
  } catch {
    // ignore
  }
}

/**
 * @returns the new consecutive failure count (0 if storage is unavailable)
 */
export function incrementRefreshFailureCount(): number {
  try {
    const next = Number(sessionStorage.getItem(REFRESH_RETRY_KEY) || '0') + 1
    sessionStorage.setItem(REFRESH_RETRY_KEY, String(next))
    return next
  } catch {
    return 0
  }
}
