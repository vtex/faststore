import discoveryConfig from 'discovery.config'

export const STORAGE_KEY_AUTH_COOKIE_VALUE = 'faststore_auth_cookie_value'
export const STORAGE_KEY_CACHE_BUST_LAST_VALUE =
  'faststore_cache_bust_last_value'

/**
 * Gets the VtexIdclientAutCookie value from browser
 * Note: vtex_segment is httpOnly and cannot be accessed via JavaScript,
 * so we only monitor VtexIdclientAutCookie_<account>
 */
const getAuthCookieValue = (): string | null => {
  if (typeof document === 'undefined') {
    return null
  }

  const account = discoveryConfig.api.storeId
  const authCookieName = `VtexIdclientAutCookie_${account}`
  const cookies = document.cookie.split(';').map((cookie) => cookie.trim())
  const authCookie = cookies.find((c) => c.startsWith(`${authCookieName}=`))

  if (!authCookie) {
    return null
  }

  return authCookie.split('=').slice(1).join('=')
}

/**
 * Gets the stored auth cookie value from sessionStorage (client-side only)
 */
const getStoredAuthCookieValue = (): string | null => {
  if (typeof sessionStorage === 'undefined') {
    return null
  }

  try {
    return sessionStorage.getItem(STORAGE_KEY_AUTH_COOKIE_VALUE)
  } catch {
    return null
  }
}

/**
 * Stores the auth cookie value in sessionStorage (client-side only)
 */
const storeAuthCookieValue = (value: string | null): void => {
  if (typeof sessionStorage === 'undefined') {
    return
  }

  try {
    if (value === null) {
      sessionStorage.removeItem(STORAGE_KEY_AUTH_COOKIE_VALUE)
    } else {
      sessionStorage.setItem(STORAGE_KEY_AUTH_COOKIE_VALUE, value)
    }
  } catch {
    // Ignore storage errors
  }
}

/**
 * Gets the last cache busting value from sessionStorage (client-side only)
 */
const getLastValue = (): string | null => {
  if (typeof sessionStorage === 'undefined') {
    return null
  }

  try {
    return sessionStorage.getItem(STORAGE_KEY_CACHE_BUST_LAST_VALUE)
  } catch {
    return null
  }
}

/**
 * Stores the last cache busting value in sessionStorage (client-side only)
 */
const storeLastValue = (value: string): void => {
  if (typeof sessionStorage === 'undefined') {
    return
  }

  try {
    sessionStorage.setItem(STORAGE_KEY_CACHE_BUST_LAST_VALUE, value)
  } catch {
    // Ignore storage errors
  }
}

/**
 * Clears all cache busting related data from sessionStorage (client-side only)
 */
const clearStorage = (): void => {
  if (typeof sessionStorage === 'undefined') {
    return
  }

  try {
    sessionStorage.removeItem(STORAGE_KEY_AUTH_COOKIE_VALUE)
    sessionStorage.removeItem(STORAGE_KEY_CACHE_BUST_LAST_VALUE)
  } catch {
    // Ignore storage errors
  }
}

/**
 * Gets cache busting value for client-side based on auth cookie changes
 */
export const getClientCacheBustingValue = (): string | null => {
  const currentAuthCookieValue = getAuthCookieValue()

  // Guard clause: if auth cookie doesn't exist, clear storage and don't proceed with cache busting logic
  if (currentAuthCookieValue === null) {
    clearStorage()
    return null
  }

  const storedAuthCookieValue = getStoredAuthCookieValue()

  // If auth cookie changed, update stored value and return new timestamp
  if (currentAuthCookieValue !== storedAuthCookieValue) {
    storeAuthCookieValue(currentAuthCookieValue)
    const timestamp = Date.now().toString()
    storeLastValue(timestamp)
    return timestamp
  }

  // Auth cookie hasn't changed, return last value or create one if it doesn't exist
  const lastValue = getLastValue()
  if (lastValue) {
    return lastValue
  }

  // Fallback: if no last value, create one
  const timestamp = Date.now().toString()
  storeLastValue(timestamp)
  return timestamp
}
